const db = require("../Database/database.js");

module.exports = {

      insertOrder : function(req, res, productArr){
        console.log("Insert order");
        userID = req.session.userID;
        date = new Date();
        for(let entry of productArr){
          db.Order.create({orderDate : date, createdAt : date, updatedAt : date, delivery_time : date.setDate(date.getDate() + 1), UserUid : userID}).then(order => {
            var diff = entry.currAmount - entry.amount;
              db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : entry.pid}}).then((order) => {
                db.OrderProduct.create({amount : entry.amount, createdAt : date, updatedAt : new Date(), OrderOid : order.dataValues.oid, ProductPid : entry.pid}).then(() =>{
                    return;
                }).catch(err => {
                    res.status(500);
                    res.end();
                    console.log("[ORDER_PRODUCT] Failure while inserting entry");
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
        res.status(200);
        res.end();
        return 1;
      }

}
