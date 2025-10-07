const { Router } = require("express");
const router = Router();

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
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const findAllCards = require("../controllers/findAllCard");

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

// 📦 Cards
router.get("/cards/all", auth, findAllCards)
router.get("/cards", auth, getCardsFiltered); // protegida con token
router.get("/cards/:id", auth, getCardById);
router.post("/cards", auth, role(["editor", "admin"]), createCard);
router.put("/cards/:id", auth, role(["editor", "admin"]), updateCard);
router.delete("/cards/:id", auth, isAdmin, deleteCard);

module.exports = router;