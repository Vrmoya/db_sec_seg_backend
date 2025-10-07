const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado. Token requerido." });
    }

    // Verificar que el usuario tenga un rol válido
    const userRole = req.user.role;
    if (!userRole || typeof userRole !== "string") {
      return res.status(403).json({ message: "Rol no definido o inválido." });
    }

    // Permitir acceso si el usuario es admin o tiene un rol permitido
    if (req.user.isAdmin || allowedRoles.includes(userRole)) {
      return next();
    }

    // Si no tiene permisos, denegar acceso
    return res.status(403).json({ message: "No tenés permiso para acceder a esta ruta." });
  };
};

module.exports = roleMiddleware;