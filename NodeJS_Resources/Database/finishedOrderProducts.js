Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const FinishedOrderProducts = seq.define('FinishedOrderProducts', {
  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  }
});

module.exports = FinishedOrderProducts;
