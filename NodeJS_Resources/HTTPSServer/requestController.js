const db = require("../Database/database.js");
const sessionHandler = require("./sessionHandler.js");
const crypto = require('crypto');

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
      var orderInfo = req.body.order;

      //update amount in product-table
      //insert new entry into order_product
      var date = new Date();
      db.Orders.create({orderDate : new Date(), delivery_time : date.setDate(date.getDate() + 1), createdAt : new Date(), updatedAt : new Date(), UserUid : orderInfo.userID}).then(order => {
        db.OrderProduct.create({amount : orderInfo.amount, comment : orderInfo.comment, createdAt : new Date(), updatedAt : new Date(),
                                }).then(order_product => {

          })
      });
    },

    login : function(req, res){
      var userInfo = req.body.user;
      var passwordHash = '';
      var session = {};

      /*
      * DB-request. Fetches uid, createdAt (as salt for sha256)= and password-hash
      */
      db.User.findOne({attributes: ['createdAt', 'pword', 'uid'], where : {email : userInfo.email}}).then(result => {
            passwordHash = crypto.createHmac('sha256', result.);
            if(result.pword === passwordHash){
                session =  sessionHandler.generateSession(result.uid);
                res.status(200);
            }
            else{
              res.status(401);
            }
            res.send(session);
            res.end();
            return session;
      }).catch(err =>{
        res.status(500);
        console.log("[LOGIN] Error in Login");
        res.send(err);
        res.end();
      });

    },

    register : function(req, res){
      var userInfo = req.body.user;
      var timestamp = new Date();
      var passwordHash = crypto.createHmac('sha256', userInfo.password);
      var session = {};
      /*
      * INSERT new user into user-table
      */
      db.User.create({sname : userInfo.sname, name : userInfo.name, userInfo.email, pword : passwordHash,
                      timestamp : timestamp, createdAt : timestamp, updatedAt : timestamp
                      }).then(result => {
                  session = sessionHandler.generateSession(result.uid);
                  res.status(200);
                  res.send(session);
                  res.end();
          }).catch(err => {
            res.status(500);
            console.log("[REGISTER] Error in register");
            res.send(err);
            res.end();
          });

    },

    login : function(req, res){
      consol.log("Login-Request");
      var email = req.body.email;
      var password = req.body.pass;
      db.User.findAll({
        where: {email: email}
      }).then( result =>{
        console.log(result);
      }).catch(err =>{
        res.status(500);
        sendInfoResponse(res, 500, "Getting Userdata from database failed.")
      });


    }



}
