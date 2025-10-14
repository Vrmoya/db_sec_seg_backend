const { Card } = require("../db");

const updateCard = async (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;

  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ error: "Card no encontrada." });
    }

    await card.update(updates);

    return res.status(200).json({
      ...card.toJSON(),
      api: false,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = updateCard;