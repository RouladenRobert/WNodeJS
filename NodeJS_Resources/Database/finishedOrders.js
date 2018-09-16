Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const FinishedOrders = seq.define('FinishedOrders', {
  oid : {
    type : Sequelize.STRING,
    allowNull : false,
    primaryKey : true
  },
  delivery_time : {
    type : Sequelize.DATE
  },
  comment : {
    type : Sequelize.STRING
  }
});


module.exports = FinishedOrders;
