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
    var mail = req.body.email;
    var pass = req.body.pass;

    db.AdminUser.findOne({attributes : ['email', 'uid', 'pword'], where : {email : mail}}).then(user => {
      if(user === null){
        res.status(200);
        res.send("User not found");
        return;
      }

      if(bcrypt.compareSync(pass, user.dataValues.pword)){
        //create session
        var session = sessionHandler.generateSessionObject(user.dataValues.uid);

        res.status(200);
        res.send(session);
      }
      else{
        res.status(401);
        res.status("Wrong password");
      }
    });


  },

  register : function(req, res){
    var userInfo = req.body.user;
    var timestamp = new Date();

    bcrypt.hash(userInfo.pass, salt).then(function(hash){
      /*
      * INSERT new user into user-table
      *sessionhandler muss auskommentiert werden, wenn die Funktion funktioniert
      */
      db.AdminUser.findOne({attributes : ['email', 'uid'], where : {email : userInfo.email}}).then(user => {
        if(user === null){
          db.AdminUser.create({sname : userInfo.surname, name : userInfo.name, email: userInfo.email, pword : hash,
                          timestamp : timestamp, createdAt : timestamp, updatedAt : timestamp, authorized : false
                          }).then(result => {
                      var session = sessionHandler.generateSessionObject(result.dataValues.uid);
                      res.status(200);
                      res.send(session);
                      res.end();
                      mc.sendRegConfirmation(result.dataValues.uid);
              }).catch(err => {
                var msg = constants.LOGGER_REG_ERR + " Failed inserting admin-user in databse";
                logger.log(msg);
                res.status(500);
                console.log("[REGISTER] Error in register admin");
                console.log(err);
                res.send(err);
                res.end();
              });
        }
        else{
          var msg = constants.LOGGER_REG_SUCC + " Admin-user already exists";
          logger.log(msg);
          res.status(403);
          res.send({reason : 'Admin-User already exists'});
          res.end();
        }
      }).catch(err => {
        var msg = constants.LOGGER_REG_ERR + " " +err;
        logger.log(msg);
        console.log(err);
        res.status(500);
      });
    });


  },

    setPassword : function(req, res){
      console.log(req.body.session);
      /*
        *if there is no session-object -> generate a random password and send it to the user.
      */
      if(req.session === null ||req.session === undefined){
        email = req.mail;
        var newPassword = crypto.randomBytes(15).toString('base64');
        bcrypt.hash(newPassword, salt).then(hash => {
          db.AdminUser.update({pword : hash}, {where : {email : email}}).then(user => {
            if(user === null){
              res.status(401);
              res.send({status : "ERR"});
            }
          }).catch(err => {
            res.status(500);
          });
          mc.sendGeneratedPassword(newPassword, email);
          res.status(200);
          res.send({status : "OK"});
        }).catch(err => {
          res.status(501);
          console.log(err);
        });
      }

      /*
        *else if there is a valid session -> change the old password of the user to the new one given in the session
        *send Infomail that the password was changed -> security reasons...could be that the user hasn't done this change
      */
      else{

        var userID = req.session.userId;
       db.AdminUser.findOne({attributes : ['pword'], where : {uid : userID}}).then(user =>{
          bcrypt.compare(req.session.old_password, user.dataValues.pword).then(cp => {
            if(cp){
              bcrypt.hash(req.session.password, salt).then(hash => {
                db.AdminUser.update({pword : hash}, {where : {uid : userID}}).then(user =>{
                  mc.sendChangedPasswordConfirm(userID);
                  res.status(200);
                  res.send({status : "OK"});
                }).catch(err => {
                  res.status(500);
                });
              });
            }
            else{
              res.status(401);
            }
          });
        }).catch(err => {
          res.status(500);
        });
    }
  },

  //get the list of products, max 100 default
  // sends User-name, User-surname, orderID, creatdedAt and comment objects as a list of that objects
  getOrderList : function(req, res){
      var limit = req.body.limit;

      //load <limit> items of order-table and send the list back

      if(limit === null || limit === undefined){
        limit = 100;
      }

      db.Order.findAll({attributes : ['oid', 'UserUid', 'comment', 'createdAt'], limit : limit, include : [db.User]}).then(orders => {
        orderList = [];
          if(orders === null){
            res.status(200);
            res.send("No orders aviable");
          }

          for(o of orders){
            orderObj = {};
            orderObj.oid = o.dataValues.oid;
            orderObj.createdAt = o.dataValues.createdAt;
            orderObj.surname = o.dataValues.User.sname;
            orderObj.name = o.dataValues.User.name;
            orderObj.comment = o.dataValues.comment;
            orderList.push(orderObj);
          }

          console.log(orderList);
          res.status(200);
          res.send(orderList);

      }).catch(err => {
        res.status(501);
        console.log(err);
      });
  },

  getOrderDetails : function(req, res){

    var orderID = req.body.orderID;

    if(orderID === null || orderID === undefined){
      res.status(501);
      res.send("No orderID given");
      return;
    }

    db.Order.findOne({attributes : ['comment', 'createdAt'], include : [db.User], where : {oid : orderID}}).then(order => {
      if(order === null){
        res.status(501);
        res.send("No order found for this ID");
        return;
      }
      var userName = order.dataValues.User.name;
      var userSurname = order.dataValues.User.sname;
      db.OrderProduct.findAll({attributes : ['amount', 'ProductPid'], where : {OrderOid : orderID}}).then(async function(orderProd) {
        toSend = {userName : userName, userSurname : userSurname, orderID : orderID, date : order.dataValues.createdAt, comment : order.dataValues.comment};
        prodNames = [];
        prodAmounts = [];
        for(op of orderProd){
          await db.Product.findOne({attributes : ['name'], where : {pid : op.dataValues.ProductPid}}).then(prod => {
              prodNames.push(prod.name);
          }).catch(err => {
            console.log(err);
          });
          prodAmounts.push(op.dataValues.amount);
        }
        toSend.prodNames = prodNames;
        toSend.prodAmounts = prodAmounts;

        console.log(toSend);
        res.status(200);
        res.send(toSend);

      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });


  },

  getPreOrderList : function(req, res){
    var limit = req.body.limit;

    //load <limit> items of order-table and send the list back

    if(limit === null || limit === undefined){
      limit = 100;
    }

    db.PreOrder.findAll({attributes : ['oid', 'UserUid', 'comment', 'createdAt'], limit : limit, include : [db.User]}).then(orders => {
      orderList = [];
        if(orders === null){
          res.status(200);
          res.send("No orders aviable");
        }

        for(o of orders){
          orderObj = {};
          orderObj.oid = o.dataValues.oid;
          orderObj.createdAt = o.dataValues.createdAt;
          orderObj.surname = o.dataValues.User.sname;
          orderObj.name = o.dataValues.User.name;
          orderObj.comment = o.dataValues.comment;
          orderList.push(orderObj);
        }

        console.log(orderList);
        res.status(200);
        res.send(orderList);

    }).catch(err => {
      res.status(501);
      console.log(err);
    });

  },

  getPreOrderDetails : function(req, res){


  },

  deleteUser : function(req, res){


  },

  deleteOrder : function(req, res){


  },

  deletePreOrder : function(req, res){


  },

  getAdminUsers : function(req, res){

    limit = req.body.limit;

    if(limit === null || limit === undefined){
      limit = 10;
    }

    db.AdminUser.findAll({attributes : ['sname', 'name', 'email'], limit : limit}).then(users => {
        var userList =[];
        for(u of users){
          var userObj = {};
          userObj.name = u.dataValues.name;
          userObj.surname = u.dataValues.sname;
          userObj.email = u.dataValues.email;
          userList.push(userObj);
        }

        res.status(200);
        res.send(userList);

    }).catch(err => {
      console.log(err);
      res.status(500);
      res.end();
    });

  },

  finishOrder : function(req, res){
    var orderID = req.body.orderID;
    db.Order.findOne({attributes : ['UserUid', 'comment', 'delivery_time'], where : {oid : orderID}}).then(order => {
        var userID = order.dataValues.UserUid;
        db.FinishedOrders.create({UserUid : userID, oid : orderID, comment : order.dataValues.comment, delivery_time : order.dataValues.delivery_time}).then(fo => {
            db.OrderProduct.findOne({where : {OrderOid : orderID}}).then(op => {
                db.FinishedOrderProducts.create({amount : op.dataValues.amount, FinishedOrderOid : op.dataValues.OrderOid, ProductPid : op.dataValues.ProductPid}).then(fop => {
                  db.OrderProduct.destroy({where : {OrderOid : orderID}}).then(op => {
                    db.Order.destroy({where : {oid : orderID}}).then(destroyed => {
                      res.status(200);
                      res.send('OK');
                    }).catch(err => {
                      console.log(err);
                    });
                  }).catch(err => {
                    console.log(err);
                  });
                }).catch(err => {
                  console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
          }).catch(err => {
              console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });

  },

  deleteOrder : function(req, res){
    var orderID = req.body.orderID;
    db.OrderProduct.destroy({where : {OrderOid : orderID}}).then(op => {
        db.Order.destroy({where : {oid : orderID}}).then(destroyed => {
            res.status(200);
            res.send("OK");
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });

  }

}
