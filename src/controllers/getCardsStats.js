const { Card } = require("../db");
const { Op } = require("sequelize");

const getCardsStats = async (req, res) => {
  try {
    const total = await Card.count();
    const validados = await Card.count({ where: { validated: true } });
    const noValidados = await Card.count({ where: { validated: false } });

    const porLugar = await Card.findAll({
      attributes: ['lugar', [Card.sequelize.fn('COUNT', 'id'), 'count']],
      group: ['lugar'],
    });

    const porMarca = await Card.findAll({
      attributes: ['marca', [Card.sequelize.fn('COUNT', 'id'), 'count']],
      group: ['marca'],
    });

    return res.status(200).json({
      total,
      validados,
      noValidados,
      porLugar,
      porMarca,
    });
  } catch (error) {
    console.error("❌ Error en getCardsStats:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getCardsStats;