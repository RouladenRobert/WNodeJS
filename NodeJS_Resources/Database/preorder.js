Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const PreOrder = seq.define('PreOrders', {
  poid : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    autoIncrement : true,
    unique : true
  },
  comment : {
    type : Sequelize.STRING
  }
});

module.exports = PreOrder;
