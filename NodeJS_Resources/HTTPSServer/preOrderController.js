const db = require("../Database/database.js");
const mc = require("./mailController.js");

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
        console.log("[INSERT]");
        console.log(product);
        var amount = product.amount;
        var name = product.name;
        date = new Date();
          db.PreOrder.create({createdAt : date, updatedAt : date, UserUid : userID}).then(order => {
                db.PreorderProduct.create({amount : product.amount, createdAt : date, updatedAt : new Date(), PreOrderPoid : order.dataValues.poid, ProductPid : product.pid}).then(()=>{
                  res.status(200);
                  res.end();
                  console.log("[PREORDER] Register prouduct now");
                  mc.registerProductForMail(req.session.userId, name, amount);
                  return 1;
                }).catch(err =>{
                  res.status(500);
                  console.log("[PREORDER] Failed inserting PreorderProduct: \n"+err);
                })
          }).catch(err => {
            res.status(500);
            console.log("[PREORDER] Error while inserting item");
            console.log(err);
          });
      }

}
