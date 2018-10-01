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
const loggerModule = require('../Logger/logger.js');
const salt = 10;

const logger = new loggerModule.Logger(constants.LOGFILE_PATH);

module.exports = {

  login : function(req, res){
    var mail = req.body.email;
    var pass = req.body.pass;
    var logMsg = '';

    db.AdminUser.findOne({attributes : ['email', 'uid', 'pword'], where : {email : mail, authorized : true}}).then(user => {
      if(user === null){
        res.status(200);
        res.send("User not found");
        logMsg = constants.LOGGER_LOGIN_SUCC+" User "+user.dataValues.email+" not found";
        logger.log(logMsg);
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
        res.end();
        logMsg = constants.LOGGER_LOGIN_SUCC + " User "+user.dataValues.uid+" typed in wrong password";
        logger.log(logMsg);
      }
    }).catch(err => {
      res.status(500);
      res.end();
      logMsg = constants.LOGGER_LOGIN_ERR + " Error while accessing the database";
      logger.log(logMsg);
    });

    logMsg = constants.LOGGER_LOGIN_TRY+" IP "+req.connection.remoteAddress+" tried to login";
    logger.log(logMsg);
  },

  logout : function(req, res){
    var sessionID = req.session.sessionID;

    sessionHandler.invalidateSession(sessionID);

    res.status(200);
    res.end();

  },

  register : function(req, res){
    var userInfo = req.body.user;
    var timestamp = new Date();
    var logMsg = '';

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
                      res.status(200);
                      res.end();
                      mc.sendRegConfirmation(result.dataValues.uid);
              }).catch(err => {
                res.status(500);
                res.send(err);
                logMsg = constants.LOGGER_REG_ERR + " Failed inserting admin-user in databse";
                logger.log(msg);
              });
        }
        else{
          res.status(403);
          res.send({reason : 'Admin-User already exists'});
          logMsg = constants.LOGGER_REG_SUCC + " Admin-user already exists";
          logger.log(msg);
        }
      }).catch(err => {
        res.status(500);
        var msg = constants.LOGGER_REG_ERR + " " +err;
        logger.log(msg);
      });
    });

    logMsg = constants.LOGGER_REGISTER_TRY+" IP "+req.connection.remoteAddress+" tries to register";
    logger.log(logMsg);
  },

  confirmAdmin : function(req, res){
      var userID = req.query.id;
      var logMsg = '';

      db.AdminUser.update({authorized : true}, {where : {uid : userID}}).then(user => {
        res.status(200);
        res.end();
        mc.sendConfirmationToNewAdmin(userID);
      }).catch(err => {
        logMsg = constants.LOGGER_ADMIN_CONFIRM_ERR+" Error while activating admin-user";
        logger.log(logMsg);
        res.status(500);
        res.end();
      });

      logMsg = constants.LOGGER_ADMIN_CONFIRM_TRY + " IP "+req.connection.remoteAddress+" tries to activate admin";
      logger.log(logMsg);
  },

    setPassword : function(req, res){
      var logMsg = '';
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
            logMsg = constants.LOGGER_NEW_PASS_ERR+" Error while accessing databse";
            logger.log(logMsg);
          });
          mc.sendGeneratedPassword(newPassword, email);
          res.status(200);
          res.send({status : "OK"});
        }).catch(err => {
          res.status(501);
          logMsg = constants.LOGGER_NEW_PASS_ERR+" Error while hashing new password";
          logger.log(logMsg);
        });

        logMsg = constants.LOGGER_NEW_PASS_TRY+ " IP "+req.connection.remoteAddress+" tries to change password without being logged in";
        logger.log(logMsg);
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
                  logMsg = constants.LOGGER_NEW_PASS_ERR+" Error while accessing databse";
                  logger.log(logMsg);
                  res.status(500);
                });
              });
            }
            else{
              logMsg = constants.LOGGER_NEW_PASS_OK+" User "+user.dataValues.uid+" not found";
              logger.log(logMsg);
              res.status(401);
            }
          });
        }).catch(err => {
          logMsg = constants.LOGGER_NEW_PASS_ERR+" Error while hashing password";
          logger.log(logMsg);
          res.status(500);
        });

        logMsg = constants.LOGGER_NEW_PASS_TRY+ " IP "+req.connection.remoteAddress+" tries to change password while logged in";
        logger.log(logMsg);
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

          res.status(200);
          res.send(orderList);

      }).catch(err => {
        res.status(501);
        var logMsg = constants.LOGGER_GET_ORDER_ERR+" Failed to load orders";
        logger.log(logMsg);
      });
  },

  getOrderDetails : function(req, res){

    var orderID = req.body.orderID;
    var logMsg = '';

    if(orderID === null || orderID === undefined){
      res.status(501);
      res.send("No orderID given");
      logMsg = constants.LOGGER_GET_ORDER_DETAILS_SUCC+" No orderID given";
      logger.log(logMsg);
      return;
    }

    db.Order.findOne({attributes : ['comment', 'createdAt'], include : [db.User], where : {oid : orderID}}).then(order => {
      if(order === null){
        res.status(501);
        res.send("No order found for this ID");
        logMsg = constants.LOGGER_GET_ORDER_DETAILS_SUCC+" No orderID found";
        logger.log(logMsg);
        return;
      }
      var userName = order.dataValues.User.name;
      var userSurname = order.dataValues.User.sname;
      db.OrderProduct.findAll({attributes : ['amount', 'ProductPid'], where : {OrderOid : orderID}}).then(async function(orderProd) {
        toSend = {userName : userName, userSurname : userSurname, orderID : orderID, date : order.dataValues.createdAt, comment : order.dataValues.comment};
        prodNames = [];
        prodAmounts = [];
        for(op of orderProd){
          await db.Product.findOne({attributes : ['name'], where : {pid : op.dataValues.ProductPid}}).then(async function(prod){
            if(prod !== null){
                prodNames.push(prod.name);
            }
            else{
              await db.ProductPool.findOne({attributes : ['name'], where : {pid : op.dataValues.ProductPid}}).then(prodpool => {
                  prodNames.push(prodpool.name);
              }).catch(err => {
                logMsg = constants.LOGGER_GET_ORDER_DETAILS_ERR+" Error while getting product form ProductPool";
                logger.log(logMsg);
              });
            }
          }).catch(err => {
            logMsg = constants.LOGGER_GET_ORDER_DETAILS_ERR+" Error while getting product form Products";
            logger.log(logMsg);
          });
          prodAmounts.push(op.dataValues.amount);
        }
        toSend.prodNames = prodNames;
        toSend.prodAmounts = prodAmounts;

        res.status(200);
        res.send(toSend);

      }).catch(err => {
        logMsg = constants.LOGGER_GET_ORDER_DETAILS_ERR+" Error while getting order-product-assignment";
        logger.log(logMsg);
      });
    }).catch(err => {
      logMsg = constants.LOGGER_GET_ORDER_DETAILS_ERR+" Error while getting order";
      logger.log(logMsg);
    });

    logMsg = constants.LOGGER_GET_ORDER_DETAILS_TRY+" IP "+req.connection.remoteAddress+" tries to get order-details";
  },

  getPreOrderList : function(req, res){
    var limit = req.body.limit;

    //load <limit> items of order-table and send the list back

    if(limit === null || limit === undefined){
      limit = 100;
    }

    db.PreOrder.findAll({attributes : ['poid', 'UserUid', 'comment', 'createdAt'], limit : limit, include : [db.User]}).then(orders => {
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

        res.status(200);
        res.send(orderList);

    }).catch(err => {
      res.status(501);
      var logMsg = constants.LOGGER_GET_PREORDER_ERR+" Error while accessing databse";
    });

  },

  getPreOrderDetails : function(req, res){
      var preOrderID = req.body.preOrderID;
      var logMsg = '';

      if(preOrderID === null || preOrderID === undefined){
        res.status(501);
        res.send("No orderID given");
        logMsg = constants.LOGGER_GET_PREORDER_DETAILS_ERR+" No preOrderID given";
        logger.log(logMsg);
        return;
      }

      db.PreOrder.findOne({attributes : ['comment', 'createdAt'], include : [db.User], where : {poid : preOrderID}}).then(order => {
        if(order === null){
          res.status(501);
          res.send("No order found for this ID");
          logMsg = constants.LOGGER_GET_PREORDER_DETAILS_SUCC+" No preOrderID found";
          logger.log(logMsg);

          return;
        }
        var userName = order.dataValues.User.name;
        var userSurname = order.dataValues.User.sname;
        db.PreOrderProduct.findAll({attributes : ['amount', 'ProductPid'], where : {PreOrderPoid : preOrderID}}).then(async function(orderProd) {
          toSend = {userName : userName, userSurname : userSurname, preOrderID : preOrderID, date : order.dataValues.createdAt, comment : order.dataValues.comment};
          prodNames = [];
          prodAmounts = [];
          for(op of orderProd){
            await db.Product.findOne({attributes : ['name'], where : {pid : op.dataValues.ProductPid}}).then(async function(prod){
              if(prod !== null){
                  prodNames.push(prod.name);
              }
              else{
                await db.ProductPool.findOne({attributes : ['name'], where : {pid : op.dataValues.ProductPid}}).then(prodpool => {
                    prodNames.push(prodpool.name);
                }).catch(err => {
                  logMsg = constants.LOGGER_GET_PREORDER_DETAILS_ERR+" Error while getting products from ProductPool";
                  logger.log(logMsg);
                });
              }
            }).catch(err => {
              logMsg = constants.LOGGER_GET_PREORDER_DETAILS_ERR+" Error while getting products from Products";
              logger.log(logMsg);
            });
            prodAmounts.push(op.dataValues.amount);
          }
          toSend.prodNames = prodNames;
          toSend.prodAmounts = prodAmounts;

          res.status(200);
          res.send(toSend);

        }).catch(err => {
          logMsg = constants.LOGGER_GET_PREORDER_DETAILS_ERR+" Error while getting preorder-product-assignment";
          logger.log(logMsg);
        });
      }).catch(err => {
        logMsg = constants.LOGGER_GET_PREORDER_DETAILS_ERR+" Error while getting preorders";
        logger.log(logMsg);
      });

      logMsg = constants.LOGGER_GET_PREORDER_DETAILS_TRY+" IP "+req.connection.remoteAddress+" tries to get preorder-details";
      logger.log(logMsg);

  },

  deleteUser : function(req, res){


  },

  deletePreOrder : function(req, res){
      var preOrderID = req.body.preOrderID;
      var logMsg = '';

      db.PreOrderProduct.destroy({where : {PreOrderPoid : preOrderID }}).then(pre => {
        db.PreOrder.destroy({wehre : {poid : preOrderID}}).then(destroyed => {
          res.status(200);
          res.end();
        }).catch(err => {
          res.status(500);
          res.end();
          logMsg = constants.LOGGER_DEL_PREORDER_ERR+" Error while deleting PreOrder";
          logger.log(logMsg);
        });
      }).catch(err => {
        res.status(500);
        res.end();
        logMsg = constants.LOGGER_DEL_PREORDER_ERR+" Error while deleting PreOrderProduct";
        logger.log(logMsg);
      });

      logMsg = constants.LOGGER_DEL_PREORDER_TRY+" IP "+req.connection.remoteAddress+" tries to delete preorder";
      logger.log(logMsg);
  },

  deleteProduct : function(req, res){
    var prodID = req.body.prodID;
    var logMsg = '';

    db.Product.findOne({where : {pid : prodID}}).then(prod => {
      if(prod === null){
        res.status(404);
        res.end();
        logMsg = constants.LOGGER_DEL_PRODUCT_SUCC+" Product not found";
        logger.log(logMsg);
        return;
      }

      db.ProductPool.create({pid : prodID, name : prod.dataValues.name, description : prod.dataValues.description, amount : prod.dataValues.amount, price : prod.dataValues.price,
                              weight : prod.dataValues.weight, preOrderable : prod.dataValues.preOrderable, pic : prod.dataValues.pic, createdAt : prod.dataValues.createdAt,
                              updatedAt : new Date()}).then(prodpool => {

            db.Product.destroy({where : {pid : prodID}}).then(destroyed => {
                res.status(200);
                res.end();
            }).catch(err => {
              logMsg = constants.LOGGER_DEL_PRODUCT_ERR+" Failed to delete product";
              logger.log(logMsg);
            })
        }).catch(err => {
          logMsg = constants.LOGGER_DEL_PRODUCT_ERR+" Failed to move to product-pool";
          logger.log(logMsg);
        });
    }).catch(err => {
      logMsg = constants.LOGGER_DEL_PRODUCT_ERR+" Failed to find product";
      logger.log(logMsg);
    });

    logMsg = constants.LOGGER_DEL_PRODUCT_TRY+" IP "+req.connection.remoteAddress+" tries to delete product";
    logger.log(logMsg);

  },

  addProduct : function(req, res){
    var logMsg = '';
    var prodObj = req.body.product;
    var preOrderMapping = {true : 'true', false : 'false'};
    prodObj.preOrderable = preOrderMapping[prodObj.preOrderable];
    if(prodObj === null || prodObj === undefined){
      res.status(500);
      res.end();
      logMsg = constants.LOGGER_ADD_PRODUCT_ERR+" No product-object given";
      logger.log(logMsg);
      return;
    }
    else if(prodObj.pic === undefined || prodObj.pic === null){
      prodObj.pic = "../";
    }

    db.ProductPool.findOne({where : {name : req.body.product.name}}).then(p => {
      if(p){
        res.status(202);
        res.send({pid : p.dataValues.pid});
        return;
      }
      db.Product.create({name : prodObj.name, description : prodObj.desc, amount : prodObj.amount, price : prodObj.price, weight : prodObj.weight,
                        preOrderable : prodObj.preOrderable, pic : prodObj.pic, createdAt : new Date(), updatedAt : new Date()}).then(prod => {
                          res.status(200);
                          res.end();
          }).catch(err => {
            logMsg = constants.LOGGER_ADD_PRODUCT_ERR+" Failed to create product";
            logger.log(logMsg);
          });

    }).catch(err => {
      res.status(500);
      res.end();
      //logger.log();
    });

    logMsg = constants.LOGGER_ADD_PRODUCT_TRY+" IP "+req.connection.remoteAddress+" tries to add a product";
    logger.log(logMsg);
  },

  updateProduct : function(req, res){
    var prodObj = req.body.product;
    var preOrderMapping = {true : 'true', false : 'false'};
    var logMsg = '';
    prodObj.preOrderable = preOrderMapping[prodObj.preOrderable];
    if(prodObj === null || prodObj === undefined){
      res.status(500);
      res.end();
      logMsg = constants.LOGGER_UPDATE_PRODUCT_ERR+" No given object";
      logger.log(logMsg);
      return;
    }
    else if(prodObj.pic === undefined || prodObj.pic === null){
      prodObj.pic = "../";
    }

    db.Product.findOne({attributes : ['amount']}).then(p => {
      if(p.dataValues.amount === 0){
          var users = updateProductHelper(req, res, prodObj);
          moveOrders(prodObj.pid, prodObj.amount);
          mc.sendOrderInfo(users);
          return;
      }

      updateProductHelper(req, res, prodObj);

    }).catch(err => {
      res.status(500);
      res.end();
      logMsg = constants.LOGGER_UPDATE_PRODUCT_ERR+" Failed to find product";
      logger.log(logMsg);
    });

    logMsg = constants.LOGGER_UPDATE_PRODUCT_TRY+" IP "+req.connection.remoteAddress+" tries to update product";
    logger.log(logMsg);

  },

  getProductList : function(req, res){
    var limit = req.body.limit;
    var logMsg = '';
    if(!limit){
      limit = 100;
    }

    db.Product.findAll({attributes : ['pid', 'name', 'amount', 'weight', 'price', 'preOrderable', 'description'], limit : limit}).then(prods => {
      var prodList = [];
      for(p of prods){
        var prodObj = {};
        prodObj.name = p.dataValues.name;
        prodObj.amount = p.dataValues.amount;
        prodObj.price = p.dataValues.price;
        prodObj.weight = p.dataValues.weight;
        prodObj.pid = p.dataValues.pid;
        prodObj.desc = p.dataValues.description;
        if(p.dataValues.preOrderable == 'true'){
          prodObj.preOrderable = 'ja';
        }
        else{
          prodObj.preOrderable = 'nein';
        }
        prodList.push(prodObj);
      }
      res.status(200);
      res.send(prodList);

    }).catch(err => {
      logMsg = constants.LOGGER_GET_PROD_ERR+" Failed to load products";
      logger.log(logMsg);
    });

  },

  getProductPool : function(req, res){
    db.ProductPool.findAll({attributes : ['pid', 'name', 'amount', 'weight', 'price', 'preOrderable', 'description']}).then(prods => {
      var prodList = [];
      for(p of prods){
        var prodObj = {};
        prodObj.name = p.dataValues.name;
        prodObj.amount = p.dataValues.amount;
        prodObj.price = p.dataValues.price;
        prodObj.weight = p.dataValues.weight;
        prodObj.pid = p.dataValues.pid;
        prodObj.desc = p.dataValues.description;
        if(p.dataValues.preOrderable == 'true'){
          prodObj.preOrderable = 'ja';
        }
        else{
          prodObj.preOrderable = 'nein';
        }
        prodList.push(prodObj);
      }

      res.status(200);
      res.send(prodList);

    }).catch(err => {
      res.status(500);
      res.end();
      //logger.log();
    });

  },

  pushToProducts : function(req, res){
    var pid = req.body.pid;
    var prodObj = req.body.prodObj;

    if(!prodObj && !pid){
      res.status(500);
      res.end();
      //logger.log();
      return;
    }

    if(prodObj){
      if(!prodObj.pic){
        prodObj.pic = '../';
      }
      db.ProductPool.findOne({where : {name : prodObj.name}}).then(pp => {
        db.Product.create({pid : pp.dataValues.pid, name : prodObj.name, description : prodObj.desc, amount : prodObj.amount, price : prodObj.price,
                                weight : prodObj.weight, preOrderable : prodObj.preOrderable, pic : prodObj.pic, createdAt : new Date(),
                                updatedAt : new Date()}).then(prod => {
                                  db.ProductPool.destroy({where : {pid : pp.dataValues.pid}}).then(destroyed => {
                                    res.status(200);
                                    res.end();
                                  }).catch(err => {
                                    console.log(err);
                                    res.status(500);
                                    res.end();
                                  });
                                  res.status(200);
                                  res.end();
                                }).catch(err => {
                                  console.log(err);
                                  res.status(500);
                                  res.end();
                                });
      }).catch(err => {
        console.log(err);
        res.status(500);
        res.end();
      });

    }
    else{
      db.ProductPool.findOne({where : {pid : pid}}).then(pp => {
        if(pp === null){
          res.status(404);
          res.end();
          //logger.log()
        }
        db.Product.create({pid : pid, name : pp.dataValues.name, description : pp.dataValues.description, amount : pp.dataValues.amount, price : pp.dataValues.price,
                                weight : pp.dataValues.weight, preOrderable : pp.dataValues.preOrderable, pic : pp.dataValues.pic, createdAt : pp.dataValues.createdAt,
                                updatedAt : new Date()}).then(prod => {
                                  db.ProductPool.destroy({where : {pid : pid}}).then(destroyed => {
                                    res.status(200);
                                    res.end();
                                  }).catch(err => {
                                    //console.log(err);
                                    res.status(500);
                                    res.end();
                                    //logger.log()
                                  });
                                }).catch(err => {
                                  //console.log(err);
                                  res.status(500);
                                  res.end();
                                  //logger.log()
                                })
      }).catch(err => {
        console.log(err);
        res.status(500);
        res.end();
        //logger.log()
      });
    }
  },

  pushToProductPool : function(req, res){
    var pid = req.body.pid;

    db.Product.findOne({where : {pid : pid}}).then(prod => {
      if(prod === null){
        res.status(404);
        res.end();
        //logger.log();
      }

      db.ProductPool.create({pid : prodID, name : prod.dataValues.name, description : prod.dataValues.description, amaount : prod.dataValues.amount, price : prod.dataValues.price,
                              weight : prod.dataValues.weight, preOrderable : prod.dataValues.preOrderable, pic : prod.dataValues.pic, createdAt : prod.dataValues.createdAt,
                              updatedAt : new Date()}).then(pp => {
                                db.Product.destroy({where : {pid : pid}}).then(destroyed => {
                                  res.status(200);
                                  res.end();
                                }).catch(err => {
                                  res.status(500);
                                  res.end();
                                  //logger.log();
                                });
                              }).catch(err => {
                                res.status(500);
                                res.end();
                                //logger.log();
                              });
    }).catch(err => {
      res.status(500);
      res.end();
      //logger.log()
    })
  },

  getAdminUsers : function(req, res){

    var limit = req.body.limit;
    var logMsg = '';

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
      res.status(500);
      res.end();
      logMsg = constants.LOGGER_GET_USER_ERR+" Failed to load users";
      logger.log(logMsg);
    });

  },

  finishOrder : function(req, res){
    var orderID = req.body.orderID;
    var logMsg = '';
    db.Order.findOne({attributes : ['UserUid', 'comment', 'delivery_time'], where : {oid : orderID}}).then(order => {
        var userID = order.dataValues.UserUid;
        db.FinishedOrders.create({UserUid : userID, oid : orderID, comment : order.dataValues.comment, delivery_time : order.dataValues.delivery_time}).then(fo => {
            db.OrderProduct.findOne({where : {OrderOid : orderID}}).then(op => {
                db.FinishedOrderProducts.create({amount : op.dataValues.amount, FinishedOrderOid : op.dataValues.OrderOid, ProductPid : op.dataValues.ProductPid}).then(fop => {
                  db.OrderProduct.destroy({where : {OrderOid : orderID}}).then(op => {
                    db.Order.destroy({where : {oid : orderID}}).then(destroyed => {
                      res.status(200);
                      res.end();
                    }).catch(err => {
                      logMsg = constants.LOGGER_FINISH_ERR+" Failed to delete order";
                      logger.log(logMsg);
                    });
                  }).catch(err => {
                    logMsg = constants.LOGGER_FINISH_ERR+" Failed to delete order-product-assignment";
                    logger.log(logMsg);
                  });
                }).catch(err => {
                  logMsg = constants.LOGGER_FINISH_ERR+" Failed to create finished order-product-assignment";
                  logger.log(logMsg);
                });
            }).catch(err => {
              logMsg = constants.LOGGER_FINISH_ERR+" Failed to find order-product-assignment";
              logger.log(logMsg);
            });
          }).catch(err => {
            logMsg = constants.LOGGER_FINISH_ERR+" Failed to delete finished order";
            logger.log(logMsg);
          });
        }).catch(err => {
          logMsg = constants.LOGGER_FINISH_ERR+" Failed to find order";
          logger.log(logMsg);
        });

        logMsg = constants.LOGGER_FINISH_TRY+" IP "+req.connection.remoteAddress+"tries to finish order";
        logger.log(logMsg);

  },

  deleteOrder : function(req, res){
    var orderID = req.body.orderID;
    var logMsg = '';
    db.OrderProduct.destroy({where : {OrderOid : orderID}}).then(op => {
        db.Order.destroy({where : {oid : orderID}}).then(destroyed => {
            res.status(200);
            res.end();
        }).catch(err => {
            logMsg = constants.LOGGER_DEL_ORDER_ERR+" Failed to delete order-product-assignment";
            logger.log(logMsg);
        });
    }).catch(err => {
      logMsg = constants.LOGGER_DEL_ORDER_ERR+" Failed to delete order";
      logger.log(logMsg);
    });

    logMsg = constants.LOGGER_DEL_ORDER_TRY+" IP "+req.connection.remoteAddress+" tries to delete order";
    logger.log(logMsg);
  },

  searchOrder : function(req, res){
    var string = req.body.searchString;

    db.Order.findAll({attributes : ['oid', 'name', 'surname', 'createdAt', 'comment'], where : {$or : [{oid : string}, {name : string}, {surname : string}]} }).then(orders => {
        if(orders === null){
          res.status(404);
          res.end();
          return;
        }

        res.status(200);
        res.send(orders);

    }).catch(err => {
      res.status(500);
      res.end();
      var logMsg = constants.LOGGER_SEARCH_ERR+" Failed to find string";
      logger.log(logMsg);
    });
  }

}

function moveOrders(pid, limit){
  var users = [];
  db.PreOrderProduct.findAll({where : {ProductPid : pid}}).then(async function(preOrder) {
    var remaining = limit;
    var toSubs = 0;
      for(po of preOrder){
        remaining = remaining - po.dataValues.amount;
        if(remaining < 0){
          toSubs = -1*(remaining);
          await db.OrderProduct.create({amount : po.dataValues.amount - toSubs, createdAt : po.dataValues.createdAt, updatedAt : new Date(), OrderOid : po.dataValues.PreOrderPoid,
              ProductPid : po.dataValues.ProductPid}).then(async function(orderProd){
                updatePreOrderProduct(po.dataValues.ProductPid, po.dataValues.PreOrderPoid, toSubs);
                await db.PreOrder.findOne({where : {poid : po.dataValues.PreOrderPoid}}).then(preOrder => {
                  users.push({user : preOrder.dataValues.UserUid, date : preOrder.dataValues.createdAt});
                  createOrder(preOrder);
                }).catch(err => {
                  console.log(err);
                });
              }).catch(err => {
                console.log(err);
              });
        }
        else{
            await db.OrderProduct.create({amount : po.dataValues.amount, createdAt : po.dataValues.createdAt, updatedAt : new Date(), OrderOid : po.dataValues.PreOrderPoid,
              ProductPid : po.dataValues.ProductPid}).then(async function(orderProd) {
                removePreOrderProduct(po.dataValues.ProductPid, po.dataValues.PreOrderPoid);
                await db.PreOrder.findOne({where : {poid : po.dataValues.PreOrderPoid}}).then(preOrder => {
                    users.push({user : preOrder.dataValues.UserUid, date : preOrder.dataValues.createdAt});
                    createOrder(preOrder);
                    removePreOrder(preOrder.dataValues.poid);
                }).catch(err => {
                  console.log(err);
                });
            }).catch(err =>{
              console.log(err);
            });
        }
      }

  }).catch(err => {
    console.log(err);
  });
  return users;
}

function removePreOrderProduct(prodID, poid){
  db.PreOrderProduct.destroy({where : {$and : [{ProductPid : prodID}, {PreOrderPoid : poid}]}}).then(destroyed => {
    return;
  }).catch(err => {
    console.log(err);
  });

}

function removePreOrder(id){
  db.PreOrder.destroy({where : {poid : id}}).then(destroyed => {
    return;
  }).catch(err => {
    console.log(err);
  });
}

function updatePreOrderProduct(prodID, poid, amount){
  db.PreOrderProduct.update({amount : amount}, {where : {$and : [{ProductPid : prodID}, {PreOrderPoid : poid}]}}).then(updated => {
    return;
  }).catch(err => {
    console.log(err);
  });
}

function createOrder(data){
  const del = new Date();
  del = del.setDate(del.getDate() +1);
  db.Order.create({oid : data.dataValues.poid, comment : data.dataValues.comment, createdAt : data.dataValues.createdAt, updatedAt : new Date(), UserUid : data.dataValues.UserUid, delivery_time : del}).then(order => {
    return;
  }).catch(err =>{
    console.log(err);
  });
}

function updateProductHelper(req, res, prodObj){
  db.Product.update({name : prodObj.name, description : prodObj.desc, amount : prodObj.amount, preOrderable : prodObj.preOrderable, price : prodObj.price, weight : prodObj.weight},
                    {where : {pid : prodObj.pid}}).then(prod => {
                      if(prod === null){
                        res.status(404);
                        res.end();
                      }
                      res.status(200);
                      res.end();

  }).catch(err => {
    res.status(500);
    res.end();
  });
}
