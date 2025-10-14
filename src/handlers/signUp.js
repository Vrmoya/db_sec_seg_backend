require('dotenv').config();
const { FRONT_HOST, FRONT_PORT } = process.env;
const baseFrontURL = `http://${FRONT_HOST}:${FRONT_PORT}`;
const authConfig = require("../config/auth.js");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  console.log("Datos de la solicitud:", req.body);
  console.log("Número de rondas:", Number.parseInt(authConfig.rounds));

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, Number.parseInt(authConfig.rounds));

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "viewer", // ✅ rol por defecto
      isAdmin: false,
    });

    const payload = {
      id: user.id,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, authConfig.secret, {
      expiresIn: authConfig.expires,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (err) {
    console.error('Error en signUp:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = signUp;