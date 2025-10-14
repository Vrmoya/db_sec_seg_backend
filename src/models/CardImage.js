// src/models/CardImage.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  sequelize.define('cardImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cards',
        key: 'id',
      },
    },
  });
};