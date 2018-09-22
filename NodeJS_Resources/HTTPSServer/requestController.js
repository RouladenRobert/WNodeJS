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

    showHome : function(req, res){
      res.status(200);
      res.send("OK");
    },

    /*
      *send all products found to client.
    */
    showProducts : function(req, res){
      db.Product.findAll({attributes : ["pid", "name", "price", "weight", "amount", "pic"]}).then(result =>{
        res.send(result);
        res.end();
      }).catch(err => {
        var msg = constants.LOGGER_GET_PROD_ERR+" Error while getting products";
        logger.log(msg);
        res.send({error : "products could not be loaded"});
        res.end();
        console.log("[PRODUCTS] Error in Products "+err);
      });
    },

    // send information for one specific product
    showDescription : function(req, res){
      var prID = req.body.prodID;

      db.Product.findOne({atrribute : ["pid", "name", "description", "price", "weight", "pic"], where : {pid : prID}}).then(result => {
        //result.dataValues.pic = fs.readFileSync(result.dataValues.pic).toString('base64');
        res.send(result);
        res.end();
      }).catch(err =>{
        var msg = constants.LOGGER_DESCR_ERR+" Error while requesting the description";
        logger.log(msg);
        res.send({error : err});
        res.end();
        console.log("[DESCRIPTION] Error in Description "+err);
      });
    },

    // insert new order to the order-table
    addOrder : function(req, res){
      var productArr = req.session.productArr;
      var errorMsg = "";

      /*
       * find user that sended the order-request. If the user is has confirmed the registration -> do nothing and continue.
       * If the user hasn't confirmed the mail -> open alert and do not allow the order
      */
      db.User.findOne({attributes : ['authorized'], where : {uid : req.session.userId}}).then(async function(user) {
        if(user.dataValues.authorized === false){
          var msg = constants.LOGGER_ORDER_SUCC + " Operation denied, user "+req.session.userId+ " not activated";
          logger.log(msg);
          res.status(403);
          res.end();
          return;
        }
        else if(user.dataValues.authorized === true){
          /*
          * check for every entry in productArr if it could be inserted into the order-table, the preorder-table or if it has to be divieded into two objects and
          * has to be inserted into both tables
          */
          var price = 0;

          var orderID = crypto.randomBytes(orderConsts.ORDER_ID_LENGTH).toString('base64');
          orderID = '#'+orderID;

          for(let prod of productArr){
            await db.Product.findOne({attributes : ['amount'], where : {pid : prod.pid}}).then(product => {
                var currAmount = product.dataValues.amount;
                prod.currAmount = currAmount;
                price += prod.amount * prod.price;
                // all in preoder?
                if(currAmount === 0){
                  preOrderController.insertPreOrder(req, res, prod, orderID);
                }
                // all in order?
                else if(currAmount >= prod.amount){
                  orderController.insertOrder(req, res, prod, orderID);
                }
                // divide product
                else if(currAmount !== 0 && currAmount < prod.amount){
                  tempOrderObj = prod;
                  tempOrderObj.amount = currAmount;
                  tempPreOrderObj = prod;
                  tempPreOrderObj.amount = prod.amount - currAmount;

                  orderController.insertOrder(req, res, tempOrderObj, orderID);
                  preOrderController.insertPreOrder(req, res, tempPreOrderObj, orderID);
                }
                else{
                  errorMsg = constants.LOGGER_ORDER_ERR+" Cannot classify product.";
                  logger.log(errorMsg);
                  res.status(501);
                  res.end();
                }

            }).catch(err =>{
              console.log("[PRODUCT] Failed to get amount");
              console.log(err);
              errorMsg = constants.LOGGER_ORDER_ERR+" Cannot get amount from databse";
              logger.log(errorMsg);
              res.status(500);
              res.end();
            });
          }
          console.log(price);
          mc.sendMail(req.session.userId, productArr.length, price);
        }
      }).catch(err => {
        var errorMsg = constants.LOGGER_ORDER_ERR +" Failed to look up the user-rights";
        logger.log(errorMsg);
        res.status(500);
        console.log("[ORDER] Failed to check if user is authenticated.");
        console.log(err);
      });

    },


    login : function(req, res){
      var mail = req.body.email;
      var pass = req.body.pass;
      /*
      * DB-request. Fetches uid, createdAt (as salt for sha256)= and password-hash
      * Hashen funktioniert nicht
      */
      db.User.findOne({attributes: ['createdAt', 'pword', 'uid'], where : {email : mail}}).then( async function(result){
        if(result === null){
          res.status(401);
          res.send({msg : 'User not found!'});
          return;
        }
        //console.log(result);
        // check if password is correct
        if(bcrypt.compareSync(pass, result.dataValues.pword)){
            console.log("[LOGIN] Authorized");
            //create session-ID
            var session = sessionHandler.generateSessionObject(result.dataValues.uid);
            //create array which is used to store product-object if the user has created an shopping-cart before logout

            var idObj = {};
            var prodArr = [];
            // try to find the products that were in users shopping-cart
            // await is needed because the results of this db-requests when the login is successful, the asynchronous execution would not guarantee the result is correct.
            await db.ShoppingCart.findAll({attributes : ['amount', 'description', 'UserUid', 'ProductPid'], where : {UserUid : result.dataValues.uid}}).then(async function(sc){
              if(sc !== null){
                for(let p of sc){
                  var prodObj = {};
                  // database request is neccessary because the price and the name of the product could have be changed since the user's last login.
                  // await is needed because the results of this db-requests when the login is successful, the asynchronous execution would not guarantee the result is correct.
                    await db.Product.findOne({attributes : ['name', 'price'], where : {pid : p.dataValues.ProductPid}}).then(product => {
                      //console.log(product);
                      if(product !== null){
                        prodObj.name = product.dataValues.name;
                        prodObj.price = product.dataValues.price;
                        prodObj.pid = p.dataValues.ProductPid;
                        prodObj.desc = p.dataValues.description;
                        prodObj.amount = p.dataValues.amount;
                        prodArr.push(prodObj);
                        idObj[prodObj.pid] = prodObj.amount;
                      }
                    }).catch(err => {
                      res.status(501);
                    });
                }
              }
              else{
                res.status(200);
                res.send(session);
              }

            }).catch(err => {
              res.status(500);
            });

            // set session.productArr to the objects found
            session.productArr = prodArr;
            session.idObj = idObj;
            res.status(200);
            res.send(session);
          }else{
            res.status(401);
            res.send({msg : 'Wrong Password'});
          }
      }).catch(err =>{
        res.status(500);
        console.log(err);
        console.log("[LOGIN] Error in Login");
        var msg = constants.LOGGER_LOGIN_ERR + " Error while searching user";
        logger.log(msg);
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
        db.User.findOne({attributes : ['email', 'uid'], where : {email : userInfo.email}}).then(user => {
          if(user === null){
            db.User.create({sname : userInfo.surname, name : userInfo.name, email: userInfo.email, pword : hash,
                            timestamp : timestamp, createdAt : timestamp, updatedAt : timestamp, authorized : false
                            }).then(result => {
                        var session = sessionHandler.generateSessionObject(result.dataValues.uid);
                        res.status(200);
                        res.send(session);
                        res.end();
                        mc.sendRegConfirmation(result.dataValues.uid);
                }).catch(err => {
                  var msg = constants.LOGGER_REG_ERR + " Failed inserting user in databse";
                  logger.log(msg);
                  res.status(500);
                  console.log("[REGISTER] Error in register");
                  console.log(err);
                  res.send(err);
                  res.end();
                });
          }
          else{
            var msg = constants.LOGGER_REG_SUCC + " User already exists";
            logger.log(msg);
            res.status(403);
            res.send({reason : 'User already exists'});
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

    logout : function(req, res){
      session.invalidateSession(req.body.session.sessionID);

      /*
        *create a new entry in the shopping-cart-table as far there is an productArr in the session-object.
      */
      if(req.body.session.productArr){
          db.ShoppingCart.destroy({where : {UserUid : req.body.session.userID}}).then(() => {
            for(p of req.body.session.productArr){
              db.ShoppingCart.create({UserUid : req.body.session.userID, ProductPid : p.pid, amount : p.amount, description : p.description}).then(() => {
                res.status(200);
              }).catch(err =>{
                  res.status(501);
              });
            }
            res.status(200);
            res.send("logged out");
            res.end();
          }).catch(err => {
            res.status(501);
          });
      }
      else{
        res.status(200)
        res.send("logged out");
        res.end();
      }
    },

    confirm : function(req, res){
      /*
        *Update status of the registered user to authorized -> is now able to buy products
      */
      db.User.update({authorized : true}, {where : {uid : req.query.id}}).then(user => {
        console.log("[CONFIRMATION] Updated user");
        res.status(200);
      }).catch(err => {
        var msg = constants.LOGGER_CONFIRM_ERR + " Failed updating user";
        logger.log(msg);
        console.log("[CONFIRMATION] Failed updating the user");
        console.log(err);
        res.status(500);
      });
    },

    deleteUser : function(req, res){
      db.User.destroy({where : {uid : req.session.userId}}).then(user => {
        if(user === null){
          var msg = constants.LOGGER_DEL_USER_SUCC + " User does not exist";
          logger.log(msg);
          console.log("[DELETE] Couldn't find user");
          res.status(501);
          res.send({reason : "User doesn't exist"});
        }
        else{
          console.log("[DELETE] User deleted");
          session.invalidateSession(req.session.sessionId);
          res.status(200);
        }
      }).catch(err => {
        var msg = constants.LOGGER_DEL_USER_ERR + " Failed deleting user "+req.session.userId;
        logger.log(msg);
        console.log("[DELETE] Failure while deleting user");
        res.status(500);
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
          db.User.update({pword : hash}, {where : {email : email}}).then(user => {
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
       db.User.findOne({attributes : ['pword'], where : {uid : userID}}).then(user =>{
          bcrypt.compare(req.session.old_password, user.dataValues.pword).then(cp => {
            if(cp){
              bcrypt.hash(req.session.password, salt).then(hash => {
                db.User.update({pword : hash}, {where : {uid : userID}}).then(user =>{
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

  registerOrder : function(req, res){
    res.status(200);
    res.send('');
  }

}
