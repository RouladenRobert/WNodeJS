Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const Orders = seq.define('Orders', {
  oid : {
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    unique : true,
    primaryKey : true
  },
  delivery_time : {
    type : Sequelize.DATE
  },
  comment : {
    type : Sequelize.STRING
  }
});

module.exports = Orders;
