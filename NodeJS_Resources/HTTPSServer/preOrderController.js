const db = require("../Database/database.js");

module.exports = {

/*
* TODO: Zwischentabelle für PreOrders und Products anlegen
*/

      insertPreOrder : function(req, res, productArr){
        userID = req.session.userID;
        console.log("insert Preorder");

        for(let entry of productArr){
          db.PreOrder.create({preorderDate : new Date(), createdAt : new Date(), updatedAt : new Date(), UserUid : userID}).then(order => {
              db.Product.update({amount : entry.currAmount - entry.amount}, {fields : ['amount']}).then(() => {

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
