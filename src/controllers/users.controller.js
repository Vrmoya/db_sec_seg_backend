// controllers/users.controller.js
const { User } = require('../models');

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalUsers = await User.count();
    const users = await User.findAll({
      offset,
      limit,
      order: [['id', 'ASC']], // opcional
      attributes: ['id', 'name', 'email', 'role', 'isActive'] // ajustá según lo que necesite el frontend
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};