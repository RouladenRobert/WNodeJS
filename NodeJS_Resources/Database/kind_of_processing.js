Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const KindOfProcessing = seq.define('Kind_Of_Processing', {

  vid : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    unique : true,
    autoIncrement : true
  },

  name : {
    type : Sequelize.STRING,
    allowNull : false
  }

});

module.exports = KindOfProcessing;
