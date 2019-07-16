Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const Products = seq.define('Products', {
  pid : {
    type : Sequelize.INTEGER,
    unique : true,
    primaryKey : true,
    autoIncrement : true,
    allowNull : false
  },
  name : {
    type : Sequelize.STRING,
    allowNull : false
  },
  description : Sequelize.STRING
});

module.exports = Products;
