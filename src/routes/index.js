const { Router } = require("express");
const router = Router();

const fs = require("fs");
const path = require("path");

const {
  signIn,
  signUp,
  signUpAdmin,
  firstSignUpAdmin,
  forgotPassword,
  resetPassword,
} = require("../controllers/AuthController");

const toggleUser = require("../controllers/toggleUser");
const addUserData = require("../controllers/addUserData");
const getUserData = require("../controllers/getUserData");
const findAllUsers = require("../controllers/findAllUsers");

const getCardsFiltered = require("../controllers/getCardsFiltered");
const getCardById = require("../controllers/getCardsById");
const createCard = require("../controllers/createCard");
const updateCard = require("../controllers/updateCard");
const deleteCard = require("../controllers/deleteCard");
const findAllCards = require("../controllers/findAllCards");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/uploadMiddleware");

const { Card, CardImage } = require("../db");
const validateBlock = require("../controllers/validateBlock");
const getCardsStats = require("../controllers/getCardsStats");

const authMiddleware = require("../middlewares/authMiddleware");
const updateUserRole = require("../controllers/updateUserRole");

// 🔐 Autenticación
router.post("/api/signin", signIn);
router.post("/api/signup", signUp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// 🧑‍💼 Registro de administradores
router.post("/api/admin/firstregister", firstSignUpAdmin);
router.post("/api/admin/register", isAdmin, signUpAdmin);

// 👤 Usuarios
router.get("/users", auth, isAdmin, findAllUsers);
router.post("/user", auth, isAdmin, toggleUser);
router.post("/add-user-data", auth, addUserData);
router.get("/get-user-data", auth, getUserData);

router.put("/users/:id/role", authMiddleware, role(["admin"]), updateUserRole);

// 📦 Cards
router.get("/cards/all", auth, findAllCards);
router.get(
  "/cards",
  auth,
  role(["viewer", "editor", "admin"]),
  getCardsFiltered
);

// ✅ Esta ruta debe ir antes que /cards/:id
router.get("/cards/stats", authMiddleware, isAdmin, getCardsStats);

router.get("/cards/:id", auth, getCardById);

router.post(
  "/cards",
  auth,
  role(["editor", "admin"]),
  upload.array("images"),
  createCard
);

router.put("/cards/:id", auth, role(["editor", "admin"]), updateCard);
router.delete("/cards/:id", auth, role(["admin"]), deleteCard);

// 📤 Subida de imágenes asociadas a cards
router.post(
  "/cards/:id/images",
  auth,
  role(["editor", "admin"]),
  upload.array("images"),
  async (req, res) => {
    try {
      console.log("🧑 Rol del usuario:", req.user.role);
      const cardId = req.params.id;
      const files = req.files;

      console.log("📤 Archivos recibidos:", files);

      const saved = await Promise.all(
        files.map((file) =>
          CardImage.create({
            cardId,
            url: `/uploads/${file.filename}`,
          })
        )
      );

      console.log("✅ Imágenes guardadas en DB:", saved);

      const response = { message: "Imágenes guardadas", images: saved };
      console.log("📨 Respuesta enviada al frontend:", response);
      res.status(200).json(response);
    } catch (err) {
      console.error("❌ Error al guardar imágenes:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete(
  "/cards/:cardId/images/:imageId",
  authMiddleware,
  role(["admin", "editor"]),
  async (req, res) => {
    const cardId = parseInt(req.params.cardId);
    const imageId = parseInt(req.params.imageId);

    console.log("🧼 Intentando eliminar imagen:", imageId, "de card:", cardId);
    console.log("🔍 Tipos:", typeof cardId, typeof imageId);

    try {
      const image = await CardImage.findOne({
        where: { id: imageId, cardId },
      });

      if (!image) {
        console.warn(
          "⚠️ No se encontró imagen con ID:",
          imageId,
          "para card:",
          cardId
        );
        return res.status(404).json({ error: "Imagen no encontrada" });
      }

      const imagePath = path.join(__dirname, "..", "public", image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Archivo eliminado del sistema:", imagePath);
      } else {
        console.warn("📁 Archivo físico no encontrado:", imagePath);
      }

      await image.destroy();
      console.log("✅ Imagen eliminada de la base de datos:", imageId);

      res.json({ success: true });
    } catch (err) {
      console.error("❌ Error al eliminar imagen:", err);
      res.status(500).json({ error: "Error interno al eliminar imagen" });
    }
  }
);

router.get("/cards/historial/:dominio", authMiddleware, async (req, res) => {
  try {
    const { dominio } = req.params;
    const cards = await Card.findAll({ where: { dominio } });

    if (!cards || cards.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron registros para ese dominio" });
    }

    res.json(cards);
  } catch (err) {
    console.error("Error al obtener historial por dominio:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Validación
router.post(
  "/cards/validate/:id",
  auth,
  role(["editor", "admin"]),
  validateBlock
);
module.exports = router;
