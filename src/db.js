require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false,
    native: false,
  }
);

const basename = path.basename(__filename);

// Cargar todos los modelos desde /models
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Inyectar sequelize en cada modelo
modelDefiners.forEach((model) => model(sequelize));

// Capitalizar nombres de modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [
  name[0].toUpperCase() + name.slice(1),
  model,
]);
sequelize.models = Object.fromEntries(capsEntries);

// Destructuring de modelos
const { User, Register, Card, CardImage } = sequelize.models;

// Relaciones
User.hasOne(Register, { as: 'register', foreignKey: 'userId' });
Register.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Card.hasMany(CardImage, { foreignKey: 'cardId', as: 'cardImages' });
CardImage.belongsTo(Card, { foreignKey: 'cardId' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};