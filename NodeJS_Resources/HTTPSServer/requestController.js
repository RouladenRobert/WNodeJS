const db = require("../Database/database.js");

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
        console.log(err);
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
        console.log(err);
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
    }

}
