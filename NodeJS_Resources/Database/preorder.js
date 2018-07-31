Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const PreOrder = seq.define('PreOrders', {
  poid : {
    type : Sequelize.STRING,
    allowNull : false,
    primaryKey : true,
  },
  comment : {
    type : Sequelize.STRING
  }
});

module.exports = PreOrder;
