const db = require("../Database/database.js");

module.exports = {

    /*
    * insert new entry in order-table and in order_product-table
    * update product-table (amount)
    */
      insertOrder : function(req, res, product){
        console.log("Insert order");
        userID = req.session.userID;
        date = new Date();
          db.Order.create({orderDate : date, createdAt : date, updatedAt : date, delivery_time : date.setDate(date.getDate() + 1), UserUid : userID}).then(order => {
            var diff = product.currAmount - product.amount;
              db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : product.pid}}).then((prod) => {
                console.log("[ORDER]: order is "+order);
                db.OrderProduct.create({amount : product.amount, createdAt : date, updatedAt : new Date(), OrderOid : order.dataValues.oid, ProductPid : product.pid}).then(() =>{
                  res.status(200);
                  res.end();
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
          }).catch(err => {
            res.status(500);
            console.log("[ORDER] Error while inserting item");
            console.log(err);
          });
      }

}
