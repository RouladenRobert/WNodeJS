const db = require("../Database/database.js");

module.exports = {

/*
* TODO: Zwischentabelle für PreOrders und Products anlegen
*/

      insertPreOrder : function(req, res, productArr){
        userID = req.session.userID;
        console.log("insert Preorder");

        date = new Date();
        for(let entry of productArr){
          db.PreOrder.create({preorderDate : date, createdAt : date, updatedAt : date, UserUid : userID}).then(order => {
            var diff = entry.currAmount - entry.amount;
              db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : entry.pid}}).then(() => {
                  return;
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
        res.status(200);
        res.end();
        return 1;
      }

}
