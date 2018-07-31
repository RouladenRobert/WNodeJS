const db = require("../Database/database.js");
const mc = require("./mailController.js");

function processOrder(req, res, product, orderID){
  // This is necessary because currAmount holds the number of products aviable at the moment and amount is the ordered number of products.
  // So the difference is the number of products that will remain.
  var diff = product.currAmount - product.amount;
  db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : product.pid}}).then((prod) => {
    db.OrderProduct.create({amount : product.amount, createdAt : date, updatedAt : new Date(), OrderOid : orderID, ProductPid : product.pid}).then(() =>{
      res.status(200);
      res.end();
      console.log("[ORDER] Register product now");
      mc.registerProductForMail(req.session.userId, name, amount);
      return 1;
    }).catch(err => {
        res.status(500);
        res.end();
        console.log("[ORDER_PRODUCT] Failure while inserting product");
        console.log(err);
    });

  }).catch(err => {
      res.status(500);
      console.log("[PRODUCT] Failed to update amount");
      console.log(err);
  });
}

module.exports = {

    /*
    * insert new entry in order-table and in order_product-table
    * update product-table (amount)
    */
      insertOrder : function(req, res, product, orderID){
        userID = req.session.userID;
        console.log("[INSERT]");
        console.log(product);
        var amount = product.amount;
        var name = product.name;
        date = new Date();
          db.Order.findOne({attributes : ['oid'], where : {oid : orderID}}).then(order => {
            console.log(order);
            console.log("[ORDER] Updating....");
            if(order === null){
              db.Order.create({oid : orderID, createdAt : date, updatedAt : date, delivery_time : date.setDate(date.getDate() + 1), UserUid : userID}).then(order => {
              console.log("[ORDER] Creating new entry in order");
                processOrder(req, res, product, orderID);
              }).catch(error => {
                res.status(500);
                res.end();
                console.log("[ORDER] ERROR while creating new entry in order-table");
              });
            }
            else{
              processOrder(req, res, product, orderID);
            }
          }).catch(err => {
            res.status(500);
            res.end();
            console.log("[ORDER] ERROR while updating order");
            console.log(err);
          });
      }

}
