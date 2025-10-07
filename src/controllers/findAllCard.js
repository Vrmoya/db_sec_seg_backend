const { Card } = require("../db");

const findAllCards = async (req, res) => {
  try {
    const cardsFromDB = await Card.findAll();

    // Si querés formatear los datos antes de enviarlos:
    const formattedCards = cardsFromDB.map((card) => ({
      ...card.toJSON(),
      api: false, // Por si querés mantener consistencia con el modelo de Card
    }));

    return res.status(200).json(formattedCards);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = findAllCards;