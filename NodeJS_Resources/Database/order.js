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
  orderDate : {
    type : Sequelize.DATE,
    allowNull : null
  },
  delivery_time : {
    type : Sequelize.DATE
  }
});

module.exports = Orders;
