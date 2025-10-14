// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const authConfig = require("../config/auth");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("🔒 Token no proporcionado en el header");
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    console.log("🔑 Token decodificado:", decoded);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.warn("🚫 Usuario no encontrado:", decoded.id);
      return res.status(403).json({ message: "Usuario no válido" });
    }

    if (!user.isActive) {
      console.warn("🚫 Usuario inactivo:", decoded.id);
      return res.status(403).json({ message: "Usuario inactivo" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;