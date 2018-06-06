const db = require("../Database/database.js");
const sessionHandler = require("./sessionHandler.js");
const bcrypt = require("bcrypt");
const session = require("./sessionHandler.js");
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
      var userID = req.session.userID;
      console.log(productArr);

      //update amount in product-table
      //insert new entry into order_product
      var date = new Date();
      db.Order.create({orderDate : new Date(), delivery_time : date.setDate(date.getDate() + 1), createdAt : new Date(), updatedAt : new Date(), UserUid : userID}).then(order => {
        for(let entry of productArr){
          db.OrderProduct.create({amount : entry.amount, createdAt : new Date(), updatedAt : new Date(), OrderOid : order.dataValues.oid, ProductPid : entry.pid}).then(order_product => {

          }).catch(err =>{
            console.log(err);
            res.status(500);
          })
        }
        res.status(200);
        res.end();
      }).catch(err => {
        console.log(err);
        res.status(500);
      });
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
        res.send({session : session});
        res.end();
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
      bcrypt.hash(userInfo.pass, salt).then(function(hash){
        console.log(userInfo, timestamp, hash);
        /*
        * INSERT new user into user-table
        *sessionhandler muss auskommentiert werden, wenn die Funktion funktioniert
        */
        db.User.create({sname : userInfo.surname, name : userInfo.name, email: userInfo.email, pword : hash,
                        timestamp : timestamp, createdAt : timestamp, updatedAt : timestamp
                        }).then(result => {
                    //session = sessionHandler.generateSessionObject(result.dataValues.uid);
                    res.status(200);
                    res.send(session);
                    res.end();
            }).catch(err => {
              res.status(500);
              console.log("[REGISTER] Error in register");
              console.log(err)
              res.send(err);
              res.end();
            });
      });


    },

    logout : function(req, res){
      session.invalidateSession(req.body.session.sessionID);

      res.status(200)
      res.send("logged out");
      res.end();
    }

}
