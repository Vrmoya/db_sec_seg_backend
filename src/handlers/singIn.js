require("dotenv").config();
const authConfig = require("../config/auth.js");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    const user = await User.findOne({ where: { email, isActive: true } });

    if (!user || !user.password) {
      return res.status(404).json({ error: "Usuario no encontrado o sin contraseña." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    const payload = {
      id: user.id,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: authConfig.expires,
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error en signIn:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = signIn;