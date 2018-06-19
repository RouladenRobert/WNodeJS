const db = require("../Database/database.js");

module.exports = {

/*
* TODO: Zwischentabelle für PreOrders und Products anlegen
*/
/*
* insert new entry in preorder-table and in preorder_product-table
* update product-table (amount)
*/
      insertPreOrder : function(req, res, product){
        userID = req.session.userID;
        console.log("insert Preorder");

        date = new Date();
          db.PreOrder.create({preorderDate : date, createdAt : date, updatedAt : date, UserUid : userID}).then(order => {
            var diff = product.currAmount - product.amount;
              db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : product.pid}}).then(() => {
                res.status(200);
                res.end();
                return 1;
              }).catch(err => {
                  res.status(500);
                  console.log("[PRODUCT] Failed to update amount");
                  console.log(err);
              });
          }).catch(err => {
            res.status(500);
            console.log("[PREORDER] Error while inserting item");
            console.log(err);
          });
      }

}
