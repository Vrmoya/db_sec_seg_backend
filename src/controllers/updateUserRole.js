const { User } = require('../db');

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['viewer', 'editor', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.role = role;
    await user.save();

    return res.json({ message: 'Rol actualizado', user });
  } catch (err) {
    console.error('❌ Error al actualizar rol:', err);
    return res.status(500).json({ message: 'Error interno' });
  }
};

module.exports = updateUserRole;