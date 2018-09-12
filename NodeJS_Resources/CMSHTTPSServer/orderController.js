const db = require("../Database/database.js");
const mc = require("./mailController.js");

function processOrder(req, res, product, orderID){
  // This is necessary because currAmount holds the number of products aviable at the moment and amount is the ordered number of products.
  // So the difference is the number of products that will remain.
  var diff = product.currAmount - product.amount;
  var amount = product.amount;
  var name = product.name;
  db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : product.pid}}).then((prod) => {
    db.OrderProduct.create({amount : product.amount, createdAt : date, updatedAt : new Date(), OrderOid : orderID, ProductPid : product.pid}).then(() =>{
      res.status(200);
      res.end();
      console.log("[ORDER] Register product now");
      mc.registerProductForMail(req.session.userId, name, amount, orderID);
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
        date = new Date();
        console.log("[ORDER]");
        console.log(orderID);
          db.Order.findOne({attributes : ['oid'], where : {oid : orderID}}).then(order => {
            // if order is not found the order-object is null. -> create an entry and call processOrder
            console.log(order);
            if(order === null){
              db.Order.create({oid : orderID, createdAt : date, updatedAt : date, delivery_time : date.setDate(date.getDate() + 1), UserUid : userID}).then(order => {
              console.log("[ORDER] Creating new entry in order");
                processOrder(req, res, product, orderID);
              }).catch(error => {
                // it could be that sequelize executes the find-query a second time before the order is inserted in the table.
                // in this case it will throw an error, so processOrder will be called here.
                // if the error was caused by another reason it is delegated to the next function working with the database
                processOrder(req, res, product, orderID);
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
