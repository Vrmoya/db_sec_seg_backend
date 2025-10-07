const { Card } = require("../db");

const createCard = async (req, res) => {
  const {
    type,
    marca,
    modelo,
    dominio,
    color,
    lugar,
    fecha,
    sintesis,
  } = req.body;

  try {
    // Validación básica
    if (
      !type || !marca || !modelo || !dominio ||
      !color || !lugar || !fecha || !sintesis
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // Crear la card
    const newCard = await Card.create({
      type,
      marca,
      modelo,
      dominio,
      color,
      lugar,
      fecha,
      sintesis,
    });

    return res.status(201).json({
      ...newCard.toJSON(),
      api: false,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = createCard;