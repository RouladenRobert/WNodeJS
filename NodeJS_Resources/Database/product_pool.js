Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const ProductPool = seq.define('ProductPool', {
  pid : {
    type : Sequelize.INTEGER,
    unique : true,
    primaryKey : true,
    allowNull : false
  },
  vid : {
    type : Sequelize.INTEGER,
    unique : true,
    primaryKey : true,
    allowNull : false
  },
  name : {
    type : Sequelize.STRING,
    allowNull : false
  },
  description : Sequelize.STRING,
  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  price_per_kg : {
    type : Sequelize.DECIMAL(10,2),
    allowNull : true
  },
  price_per_piece : {
    type : Sequelize.DECIMAL(10,2),
    allowNull : true
  },
  weight : Sequelize.INTEGER,
  preOrderable: Sequelize.ENUM('true', 'false'),
  pic : {
    type : Sequelize.STRING,
    allowNull : false
  },
  isMessuredInKg : Sequelize.ENUM('true, false')
});

module.exports = ProductPool;
