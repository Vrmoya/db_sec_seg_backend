require("dotenv").config();
const { REDIRECT_HOST, PORT } = process.env;
//const baseURL = `http://${REDIRECT_HOST}:${PORT}`
const passport = require('passport');
const { User } = require("../db.js");


// Personalización de la serialización de usuario
passport.serializeUser((user, done) => {
  // Aquí defines qué información del usuario se almacenará en la sesión
  // Por ejemplo, podrías almacenar solo el ID del usuario
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Aquí recuperas el usuario de la base de datos utilizando el ID almacenado en la sesión
  User.findByPk(id)
    .then(user => {
      done(null, user); // Pasar el usuario recuperado a través de done
    })
    .catch(err => {
      done(err); // Pasar cualquier error encontrado a través de done
    });
});

module.exports = {
  secret: process.env.AUTH_SECRET || "veremos",
  expires: process.env.AUTH_EXPIRES || "24h",
  rounds: process.env.AUTH_ROUNDS || 10,
  passport: passport
}
