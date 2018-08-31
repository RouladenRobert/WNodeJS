Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const ShoppingCart = seq.define('Shopping_Cart', {
  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  description : {
    type : Sequelize.STRING
  }
}, {
  timestamps : false
});

module.exports = ShoppingCart;
