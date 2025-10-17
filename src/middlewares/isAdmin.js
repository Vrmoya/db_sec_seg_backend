const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin === true) {
    console.log("🔐 Acceso permitido por isAdmin");
    return next();
  }

  console.warn("🚫 Acceso denegado: usuario no es administrador");
  return res.status(403).json({ message: "Requiere privilegios de administrador." });
};

module.exports = isAdmin;