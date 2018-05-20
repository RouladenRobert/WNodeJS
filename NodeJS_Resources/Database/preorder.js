Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const PreOrder = seq.define('PreOrder', {
  poid : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    autoIncrement : true,
    unique : true
  },
  preorderDate : {
    type : Sequelize.DATE,
    allowNull : false
  }
});

module.exports = PreOrder;
