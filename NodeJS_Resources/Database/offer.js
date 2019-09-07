Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const Offer = seq.define('Offer', {

    amount: {
      type : Sequelize.INTEGER,
      allowNull : false
    },

    description : {
      type : Sequelize.STRING,
      allowNull : true
    },

    pic : {
      type : Sequelize.STRING,
      allowNull : true
    },

    price_per_kg : {
      type : Sequelize.DECIMAL(10,2),
      allowNull : true
    },

    price_per_piece : {
      type : Sequelize.DECIMAL(10, 2),
      allowNull : true
    },

    weight : {
      type : Sequelize.DECIMAL(10,2),
      allowNull : true
    },
});

module.exports = Offer;
