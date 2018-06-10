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


      /*
      * TODO: Funktion folgendermaßen umschreiben, sollte am besten aufgespalten werden mit ein paar Hilfsfunktionen:
          Idee 1:
              1. Tabelle PreOrder_Product benötigt (muss angelegt werden)
              2. bei Bestellung INSERT auf Order-Tabelle
              3. dann in for-Schleife für jedes Produkt prüfen, ob genug vorhanden sind
                3.1 falls ja, einfach alle in OrderProduct und amount entsprechen in Products abziehen
                3.2 falls nein:
                  3.2.1 falls amount des Produkts == 0 -> gesamte bestellte Menge in PreOrder_Product + Eintrag in PreOrder erstellen
                  3.2.2 falls amount des Produkts != 0 -> Differenz berechnen und Porduct-amount auf 0 setzen, Eintrag in OrderProduct mit Differenz als amount,
                                                          Eintrag in PreOrder_Prodduct und PreOrder mit entsprechendem amount
                  3.2.3 für jeden Eintrag in PreOrder (Äquivalent von Order, hält nur eben PreOrder-Einträge) die ID in ein Array schreiben
            4. alle Einträge in PreOrder, deren ID in Array aus 3.2.3 steht, zu einem Eintrag aggregieren und die restlichen löschen

        Idee 2 (besser, weniger verzweigt und schneller):
            1. für alle Produkte in productArr Abfrage machen, ob genug auf Lager ist.
            2. Produkte sortieren in: alle in Order (genug auf Lager) | alle in PreOrder (0 auf Lager)
              2.1 falls mehr bestellt als auf Lager und amountLager > 0:
                2.1.1 Product aufspalten -> eines mit amount = amountLager und eines für PreOrder (Rest des amounts)
                2.2.2 das Produkt zum jewiligen Array hinzufügen
            3. 2 Funktionen definieren: Eine, die nur in Order inserted und eine, die nur in PreOrder inserted, Argument: Array mit Produkten

      */

      //update amount in product-table
      //insert new entry into order_product
      var date = new Date();
      // create new entry in Order-table
      db.Order.create({orderDate : new Date(), delivery_time : date.setDate(date.getDate() + 1), createdAt : new Date(), updatedAt : new Date(), UserUid : userID}).then(order => {

        //for every entry in the ordered products find the product and get the amount
        for(let entry of productArr){
          db.Product.findOne({attributes : ['amount'], where : {pid : entry.pid}}).then(product => {
            var rest = product.amount - entry.amount;
            // check if rest is bigger than 0 -> everythin can be inserted into OrderProduct-table
            if(rest >= 0){
              db.OrderProduct.create({amount : entry.amount, createdAt : new Date(), updatedAt : new Date(), OrderOid : order.dataValues.oid, ProductPid : entry.pid}).then(order_product => {

              }).catch(err =>{
                console.log(err);
                res.status(500);
              });
/*end if*/            }
              // if rest is lower than 0 -> check if product amount is 0 -> everythin can be inserted into PreOrder-table
              else if(rest < 0){
                if(product.amount === 0){
                  db.PreOrder.create({preorderDate : new Date(), updatedAt : new Date(), createdAt : new Date(), UserUid : userID}).then(result => {
                    res.status(200);
                    res.end();
                  }).catch(err => {
                    console.log(err);
                    res.status(500);
                  });
/*end if*/                 }
              // if product amount is bigger than 0 -> calculate the difference and insert x in OderProduct and amount - x in PreOrder-table
                else{
                  var preOrderAmount = entry.amount - product.amount;
                  db.OrderProduct.create({amount : product.amount, createdAt : new Date(), updatedAt : new Date(), OrderOid : order.dataValues.oid, ProductPid : entry.pid}).then(order_product => {
                    db.PreOrder.create({/*amount : preOrderAmount*/preorderDate : new Date(), updatedAt : new Date(), createdAt : new Date(), UserUid : userID}).then(preOrder => {
                        res.status(200);
                        res.end();
                      }).catch(err => {
                        res.status(500);
                        res.end();
                      });
                    res.status(200);
                    res.end();
                  }).catch(err =>{
                    console.log(err);
                    res.status(500);
                  });
                }
              }

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
              console.log(err);
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
