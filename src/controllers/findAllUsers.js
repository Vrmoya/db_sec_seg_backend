const { Op } = require('sequelize');
const { User } = require('../db');

const findAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Filtro por nombre o email si hay búsqueda
    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const totalUsers = await User.count({ where: whereClause });

    const users = await User.findAll({
      where: whereClause,
      offset,
      limit,
      order: [['id', 'ASC']],
      attributes: ['id', 'name', 'email', 'role', 'isActive']
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = findAllUsers;
