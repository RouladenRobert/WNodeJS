Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const PreorderProduct = seq.define('Preorder_Product', {
  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  }
});

module.exports = PreorderProduct;
