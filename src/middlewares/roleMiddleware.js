const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // 🔐 Verificar autenticación
    if (!req.user) {
      console.warn("🚫 Usuario no autenticado");
      return res.status(401).json({ message: "No autenticado. Token requerido." });
    }

    const { role, isAdmin } = req.user;

    // 🧠 Validar rol
    if (!role || typeof role !== "string") {
      console.warn("🚫 Rol inválido o no definido:", role);
      return res.status(403).json({ message: "Rol no definido o inválido." });
    }

    // ✅ Permitir si el rol está autorizado o si es admin explícito
    if (allowedRoles.includes(role) || isAdmin === true) {
      console.log(`🔓 Acceso permitido a ruta protegida. Rol: ${role}, isAdmin: ${isAdmin}`);
      return next();
    }

    // 🚫 Denegar si no tiene permisos
    console.warn(`🚫 Acceso denegado. Rol: ${role}, isAdmin: ${isAdmin}`);
    return res.status(403).json({ message: "No tenés permiso para acceder a esta ruta." });
  };
};

module.exports = roleMiddleware;