// controllers/createCard.js
const { Card, CardImage } = require('../db');

const createCard = async (req, res) => {
  try {
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

    const userId = req.user.id;

    const newCard = await Card.create({
      type,
      marca,
      modelo,
      dominio,
      color,
      lugar,
      fecha,
      sintesis,
      userId,
    });

    const files = req.files || [];

    if (files.length > 0) {
      await Promise.all(
        files.map((file) =>
          CardImage.create({
            cardId: newCard.id,
            url: `/uploads/${file.filename}`,
          })
        )
      );
    }

    res.status(201).json({ message: 'Card creado correctamente', id: newCard.id });
  } catch (err) {
    console.error('Error al crear card:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = createCard;