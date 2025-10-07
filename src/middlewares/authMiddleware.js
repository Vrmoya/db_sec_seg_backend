const jwt = require("jsonwebtoken");
const { User } = require("../db");
const authConfig = require("../config/auth");

const authMiddleware = async (req, res, next) => {
  // Token esperado en el header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, authConfig.secret);

    // Buscamos el usuario por ID
    const user = await User.findByPk(decoded.user.id);

    if (!user || !user.isActive) {
      return res.status(403).json({ message: "Usuario no válido o inactivo" });
    }

    // Guardamos el usuario en la request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;