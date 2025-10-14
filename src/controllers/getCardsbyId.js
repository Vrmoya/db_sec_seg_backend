// src/controllers/getCardById.js
const { Card, CardImage } = require("../db");

const getCardById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const card = await Card.findByPk(id, {
      include: [{ model: CardImage, as: 'cardImages' }],
    });

    if (!card) {
      return res.status(404).json({ error: "Card no encontrada." });
    }

    const formattedCard = {
      ...card.toJSON(),
      api: false,
    };

    return res.status(200).json(formattedCard);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getCardById;