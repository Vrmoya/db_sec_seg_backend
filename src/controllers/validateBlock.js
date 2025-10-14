const { Card } = require("../db");

const validateBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ message: "Bloque no encontrado" });
    }

    card.validated = true;
    await card.save();

    return res.status(200).json({
      message: "Bloque validado correctamente",
      blockId: card.id,
      validated: true,
    });
  } catch (error) {
    console.error("Error en validateBlock:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = validateBlock;