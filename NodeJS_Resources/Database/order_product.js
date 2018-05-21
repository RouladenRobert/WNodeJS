Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const OrderProduct = seq.define('Oder_Product', {
  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  comment : {
    type : Sequelize.STRING
  }
});

module.exports = OrderProduct;
