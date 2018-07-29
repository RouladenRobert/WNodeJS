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
        console.log("insert Preorder");

        date = new Date();
          db.PreOrder.create({createdAt : date, updatedAt : date, UserUid : userID}).then(order => {
            var diff = product.currAmount - product.amount;
              db.Product.update({amount : diff}, {fields : ['amount'], where : {pid : product.pid}}).then((product) => {
                db.PreorderProduct.insert({amount : product.amount, createdAt : date, updatedAt : new Date(), PreOrderPoid : order.dataValues.poid, ProductPid : product.pid}).then(()=>{
                  res.status(200);
                  res.end();
                  //mc.registerProductForMail(req.session.userId, product.name, product.amount);
                  return 1;
                }).catch(err =>{
                  res.status(500);
                  console.log("[PREORDER] Failed inserting PreorderProduct: \n"+err);
                })
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
