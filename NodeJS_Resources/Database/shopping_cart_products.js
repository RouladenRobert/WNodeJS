Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const ShoppingCartProduct = seq.define('Shopping_Cart_Products', {
  amount = {
    type : Sequelize.INTEGER,
    allowNull : false
  }
});

module.exports = ShoppingCartProduct;
