const { Card } = require("../db");
const { Op, fn, col } = require("sequelize");

const getCardsStats = async (req, res) => {
  console.log("🚀 Entrando a getCardsStats");

  try {
    const total = await Card.count();
    const validados = await Card.count({ where: { validated: true } });
    const noValidados = await Card.count({ where: { validated: false } });

    let porLugar = [];
    let porMarca = [];

    try {
      porLugar = await Card.findAll({
        attributes: ['lugar', [fn('COUNT', col('lugar')), 'cantidad']],
        where: { lugar: { [Op.ne]: null } },
        group: ['lugar'],
        raw: true,
      });
    } catch (err) {
      console.warn("⚠️ Error en conteo por lugar:");
      console.warn("Nombre:", err.name);
      console.warn("Mensaje:", err.message);
      console.warn("Stack:", err.stack);
    }

    try {
      porMarca = await Card.findAll({
        attributes: ['marca', [fn('COUNT', col('marca')), 'cantidad']],
        where: { marca: { [Op.ne]: null } },
        group: ['marca'],
        raw: true,
      });
    } catch (err) {
      console.warn("⚠️ Error en conteo por marca:");
      console.warn("Nombre:", err.name);
      console.warn("Mensaje:", err.message);
      console.warn("Stack:", err.stack);
    }

    console.log("📦 Respuesta enviada:", {
      total,
      validados,
      noValidados,
      porLugar,
      porMarca,
    });

    return res.status(200).json({
      total,
      validados,
      noValidados,
      porLugar,
      porMarca,
    });
  } catch (error) {
    console.error("❌ Error en getCardsStats:");
    console.error("Nombre:", error.name);
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    console.dir(error, { depth: null });
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getCardsStats;