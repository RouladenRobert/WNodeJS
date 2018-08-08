const db = require("../Database/database.js");
const sessionHandler = require("./sessionHandler.js");
const bcrypt = require("bcrypt");
const session = require("./sessionHandler.js");
const orderController = require("./orderController.js");
const preOrderController = require("./preOrderController.js");
const mc = require("./mailController.js");
const orderConsts = require("./orderConstants.js");
const crypto = require("crypto");
const salt = 10;

module.exports = {

    //show home
    showHome : function(req, res){

        res.send("Funktioniert");
        res.end();
    },

    //sends all products back to the client
    showProducts : function(req, res){
      db.Product.findAll({attributes : ["pid", "name", "price", "weight"]}).then(result =>{
        res.send(result);
        res.end();
      }).catch(err => {
        res.send({error : "products could not be loaded"});
        res.end();
        console.log("[PRODUCTS] Error in Products "+err);
      });
    },

    // send information for one specific product
    showDescription : function(req, res){
      var prID = req.body.prodID;

      db.Product.findAll({atrribute : ["pid", "name", "description", "price", "weight"], where : {pid : prID}}).then(result => {
        console.log(result);
        res.send(result);
        res.end();
      }).catch(err =>{
        res.send({error : err});
        res.end();
        console.log("[DESCRIPTION] Error in Description "+err);
      });
    },

    // insert new order to the order-table
    addOrder : function(req, res){
      var productArr = req.session.productArr;
      console.log(productArr);

      /*
       * find user that sended the order-request. If the user is has confirmed the registration -> do nothing and continue.
       * If the user hasn't confirmed the mail -> open alert and do not allow the order
      */
      db.User.findOne({attributes : ['authorized'], where : {uid : req.session.userId}}).then(user => {
        if(user.dataValues.authorized === false){
          res.status(403);
          res.end();
          return;
        }
        else if(user.dataValues.authorized === true){
          /*
          * check for every entry in productArr if it could be inserted into the order-table, the preorder-table or if it has to be divieded into two objects and
          * has to be inserted into both tables
          */
          for(let prod of productArr){
            db.Product.findOne({attributes : ['amount'], where : {pid : prod.pid}}).then(product => {
                var currAmount = product.dataValues.amount;
                prod.currAmount = currAmount;

                console.log("[THEN]");

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

            }).catch(err =>{
              console.log("[PRODUCT] Failed to get amount");
              console.log(err);
              res.status(500);
              res.end();
            });
          }
        }
      }).catch(err => {
        res.status(500);
        console.log("[ORDER] Failed to check if user is authenticated.");
        console.log(err);
      });

      var orderID = crypto.randomBytes(orderConsts.ORDER_ID_LENGTH).toString('base64');
      orderID = '#'+orderID;
      mc.sendMail(req.session.userId, productArr.length);

    },


    login : function(req, res){
      var mail = req.body.email;
      var pass = req.body.pass
      /*
      * DB-request. Fetches uid, createdAt (as salt for sha256)= and password-hash
      * Hashen funktioniert nicht
      */
      db.User.findOne({attributes: ['createdAt', 'pword', 'uid'], where : {email : mail}}).then( result => {
        //console.log(result);
        if(bcrypt.compareSync(pass, result.dataValues.pword)){
            console.log("[LOGIN] Authorized");
            var session = sessionHandler.generateSessionObject(result.dataValues.uid);
            res.status(200);
          }else{
            res.status(401);
          }
        res.send(session);
        res.end();
      }).catch(err =>{
        res.status(500);
        console.log("[LOGIN] Error in Login");
        var errorObj = {HTTPCode : 500, ErrorCode : 1, msg : "Wrong Login data"};
        res.send(errorObj);
        res.end();
      });

    },

    register : function(req, res){
      var userInfo = req.body.user;
      var timestamp = new Date();
      bcrypt.hash(userInfo.pass, salt).then(function(hash){
        console.log(userInfo, timestamp, hash);
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
                  res.status(500);
                  console.log("[REGISTER] Error in register");
                  console.log(err);
                  res.send(err);
                  res.end();
                });
          }
          else{
            res.status(403);
            res.send({reason : 'User already exists'});
            res.end();
          }
        }).catch(err => {
          console.log(err);
          res.status(500);
        });
      });


    },

    logout : function(req, res){
      session.invalidateSession(req.body.session.sessionID);

      res.status(200)
      res.send("logged out");
      res.end();
    },

    confirm : function(req, res){
      db.User.update({authorized : true}, {where : {uid : req.query.id}}).then(user => {
        console.log("[CONFIRMATION] Updated user");
        res.status(200);
      }).catch(err => {
        console.log("[CONFIRMATION] Failed updating the user");
        console.log(err);
        res.status(500);
      });
    },

    deleteUser : function(req, res){
      db.User.destroy({where : {uid : req.session.userId}}).then(user => {
        if(user === null){
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
        console.log("[DELETE] Failure while deleting user");
        res.status(500);
      });
    }

}
