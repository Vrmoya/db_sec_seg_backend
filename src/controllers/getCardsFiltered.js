const { Op } = require("sequelize");
const { Card } = require("../db");

const isValidDate = (dateStr) => !isNaN(Date.parse(dateStr));

const getCardsFiltered = async (req, res) => {
  const {
    search,
    marca,
    modelo,
    color,
    lugar,
    fecha,
    fechaInicio,
    fechaFin,
    dominio,
    validated, // ✅ nuevo parámetro
    limit = 20,
    offset = 0,
    ordenarPor = "fecha",
    orden = "DESC",
  } = req.query;

  try {
    const allowedRoles = ["viewer", "editor", "admin"];
    const userRole = req.user?.role;

    console.log(`🔍 Acceso a /cards por rol: ${userRole}`);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "No tienes permiso para ver las tarjetas" });
    }

    const filters = [];

    if (search) {
      const likeSearch = { [Op.iLike]: `%${search}%` };
      filters.push({
        [Op.or]: [
          { marca: likeSearch },
          { modelo: likeSearch },
          { color: likeSearch },
          { lugar: likeSearch },
          { dominio: likeSearch },
          { sintesis: likeSearch },
        ],
      });
    }

    if (marca) filters.push({ marca: { [Op.iLike]: `%${marca}%` } });
    if (modelo) filters.push({ modelo: { [Op.iLike]: `%${modelo}%` } });
    if (color) filters.push({ color: { [Op.iLike]: `%${color}%` } });
    if (lugar) filters.push({ lugar: { [Op.iLike]: `%${lugar}%` } });
    if (dominio) filters.push({ dominio: { [Op.iLike]: `%${dominio}%` } });

    if (validated === 'true') filters.push({ validated: true });
    if (validated === 'false') filters.push({ validated: false });

    if (fecha) {
      if (!isValidDate(fecha)) {
        return res.status(400).json({ error: "Formato de fecha inválido. Usa YYYY-MM-DD." });
      }
      filters.push({ fecha });
    }

    if (fechaInicio || fechaFin) {
      const fechaRange = {};
      if (fechaInicio) {
        if (!isValidDate(fechaInicio)) {
          return res.status(400).json({ error: "fechaInicio tiene formato inválido. Usa YYYY-MM-DD." });
        }
        fechaRange[Op.gte] = fechaInicio;
      }
      if (fechaFin) {
        if (!isValidDate(fechaFin)) {
          return res.status(400).json({ error: "fechaFin tiene formato inválido. Usa YYYY-MM-DD." });
        }
        fechaRange[Op.lte] = fechaFin;
      }
      filters.push({ fecha: fechaRange });
    }

    const whereClause = filters.length > 0 ? { [Op.and]: filters } : {};

    const validFields = ["id", "marca", "modelo", "color", "lugar", "fecha"];
    const orderField = validFields.includes(ordenarPor) ? ordenarPor : "fecha";
    const orderDirection = orden.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const totalCount = await Card.count({ where: whereClause });

    const cards = await Card.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderField, orderDirection]],
    });

    return res.status(200).json({
      total: totalCount,
      results: cards.map((card) => ({
        ...card.toJSON(),
        api: false,
      })),
    });
  } catch (error) {
    console.error("❌ Error en getCardsFiltered:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getCardsFiltered;