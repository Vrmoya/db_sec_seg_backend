const { Card } = require("../db");

const deleteCard = async (req, res) => {
  const id = Number(req.params.id);

  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ error: "Card no encontrada." });
    }

    await card.destroy();

    return res.status(200).json({ message: "Card eliminada correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = deleteCard;