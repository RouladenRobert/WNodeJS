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
  description : Sequelize.STRING,
  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  price : {
    type : Sequelize.FLOAT,
    allowNull : false
  },
  weight : Sequelize.INTEGER,
  preOrderable: Sequelize.ENUM('true', 'false'),
  pic : {
    type : Sequelize.STRING,
    allowNull : false
  }
});

module.exports = Products;
