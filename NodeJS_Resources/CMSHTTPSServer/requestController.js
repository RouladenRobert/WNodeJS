const fs = require('fs');
const db = require("../Database/database.js");
const sessionHandler = require("./sessionHandler.js");
const constants = require('./constants.js');
const bcrypt = require("bcrypt");
const session = require("./sessionHandler.js");
const orderController = require("./orderController.js");
const preOrderController = require("./preOrderController.js");
const mc = require("./mailController.js");
const orderConsts = require("./orderConstants.js");
const crypto = require("crypto");
const logger = require('../Logger/logger.js');
const salt = 10;

module.exports = {

  login : function(req, res){

  },

  getOrderList : function(req, res){


  },

  getOrderDetails : function(req, res){


  },

  getPreOrderList : function(req, res){


  },

  getPreOrderDetails : function(req, res){


  },

  deleteUser : function(req, res){


  },

  deleteOrder : function(req, res){


  },

  deletePreOrder : function(req, res){


  },

  loadHome : function(req, res){

    
  }

}
