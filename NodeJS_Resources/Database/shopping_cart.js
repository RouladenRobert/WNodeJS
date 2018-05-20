Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const ShoppingCart = seq.define('Shopping_Cart', {
  scid : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    autoIncrement : true
  },
  open : {
    type : Sequelize.ENUM('true', 'false'),
    allowNull : false
  }
});

module.exports = ShoppingCart;
