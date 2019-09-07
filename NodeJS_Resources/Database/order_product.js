Sequelize = require("sequelize");
const seq = require("./dbconnection.js");

const OrderProduct = seq.define('Order_Product', {

  KindOfProcessingVid : {
    type : Sequelize.INTEGER,
    primaryKey : true
  },

  OrderOid : {
    type : Sequelize.INTEGER,
    primaryKey : true
  },

  OfferProdcutPid : {
    type : Sequelize.INTEGER,
    primaryKey : true
  },

  amount : {
    type : Sequelize.INTEGER,
    allowNull : false
  }
});

module.exports = OrderProduct;
