Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const User = seq.define('User', {
  uid : {
    type : Sequelize.INTEGER,
    unique : true,
    primaryKey : true,
    autoIncrement : true,
    allowNull : false
  },
  sname : {
    type : Sequelize.STRING,
    allowNull : false
  },
  name : {
    type : Sequelize.STRING,
    allowNull : false
  },
  email : {
    type : Sequelize.STRING,
    allowNull : false
  },
  pword : {
    type : Sequelize.STRING,
    allowNull : false
  },
  timestamp : Sequelize.DATE,
});

module.exports = User;
