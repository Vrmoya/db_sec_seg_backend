const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/index.js");
const path = require('path');


require("./db.js");

const server = express();
server.name = "API";

// 🌐 Middlewares globales
server.use(cors());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// 🔐 Headers CORS personalizados
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*"); // Podés restringir esto si querés
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// 📦 Rutas principales
server.use("/", routes);

// 🛑 Middleware de manejo de errores
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  console.error("Error:", err);
  res.status(status).json({ error: message });
});
//Imagenes
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("🛣️ Servidor estático configurado en:", path.join(__dirname, 'uploads'));



module.exports = server;