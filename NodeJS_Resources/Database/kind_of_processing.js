Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const KindOfProcessing = seq.define('Kind_Of_Processing', {

  vid : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    unique : true,
    autoIncrement : true
  },

  amount: {
    type : Sequelize.INTEGER,
    allowNull : false
  },

  description : {
    type : Sequelize.STRING,
    allowNull : true
  },

  pic : {
    type : Sequelize.STRING,
    allowNull : true
  },

  price_per_kg : {
    type : Sequelize.DECIMAL(10,2),
    allowNull : true
  },

  price_per_piece : {
    type : Sequelize.DECIMAL(10, 2),
    allowNull : true
  },

  weight : {
    type : Sequelize.DECIMAL(10,2),
    allowNull : true
  },

  name : {
    type : Sequelize.STRING,
    allowNull : false
  },

  preOrderable : {
    type : Sequelize.ENUM('true', 'false'),
    allowNull : false
  },

  isMessuredInKg : {
    type : Sequelize.ENUM('true', 'false'),
    allowNull : false
  }

});

module.exports = KindOfProcessing;
