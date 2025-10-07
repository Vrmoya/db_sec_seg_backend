const { Op } = require("sequelize");
const { Card } = require("../db");

const isValidDate = (dateStr) => {
  return !isNaN(Date.parse(dateStr));
};

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
    limit = 20,
    offset = 0,
    ordenarPor = "fecha",
    orden = "DESC",
  } = req.query;

  try {
    const whereClause = {};

    // 🔍 Búsqueda por texto libre
    if (search) {
      whereClause[Op.or] = [
        { marca: { [Op.iLike]: `%${search}%` } },
        { modelo: { [Op.iLike]: `%${search}%` } },
        { color: { [Op.iLike]: `%${search}%` } },
        { lugar: { [Op.iLike]: `%${search}%` } },
        { dominio: { [Op.iLike]: `%${search}%` } },
        { sintesis: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // 🎯 Filtros específicos
    if (marca) whereClause.marca = { [Op.iLike]: `%${marca}%` };
    if (modelo) whereClause.modelo = { [Op.iLike]: `%${modelo}%` };
    if (color) whereClause.color = { [Op.iLike]: `%${color}%` };
    if (lugar) whereClause.lugar = { [Op.iLike]: `%${lugar}%` };

    // 📅 Validación y filtro por fecha exacta
    if (fecha) {
      if (!isValidDate(fecha)) {
        return res.status(400).json({ error: "Formato de fecha inválido. Usa YYYY-MM-DD." });
      }
      whereClause.fecha = fecha;
    }

    // 📅 Validación y filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      if (fechaInicio && !isValidDate(fechaInicio)) {
        return res.status(400).json({ error: "fechaInicio tiene formato inválido. Usa YYYY-MM-DD." });
      }
      if (fechaFin && !isValidDate(fechaFin)) {
        return res.status(400).json({ error: "fechaFin tiene formato inválido. Usa YYYY-MM-DD." });
      }

      whereClause.fecha = {};
      if (fechaInicio) whereClause.fecha[Op.gte] = fechaInicio;
      if (fechaFin) whereClause.fecha[Op.lte] = fechaFin;
    }

    // 🧭 Validación de ordenamiento
    const validFields = ["id", "marca", "modelo", "color", "lugar", "fecha"];
    const orderField = validFields.includes(ordenarPor) ? ordenarPor : "fecha";
    const orderDirection = orden.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // 📊 Contador total sin paginación
    const totalCount = await Card.count({ where: whereClause });

    // 📦 Resultados paginados y ordenados
    const cards = await Card.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderField, orderDirection]],
    });

    const formattedCards = cards.map((card) => ({
      ...card.toJSON(),
      api: false,
    }));

    return res.status(200).json({
      total: totalCount,
      results: formattedCards,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getCardsFiltered;