const db = require("../Database/database.js");
const mc = require("./mailController.js");

function processPreOrder(req, res, product, orderID){
  db.PreorderProduct.create({amount : product.amount, createdAt : date, updatedAt : new Date(), PreOrderPoid : orderID, ProductPid : product.pid}).then(()=>{
    res.status(200);
    res.end();
    console.log("[PREORDER] Register prouduct now");
    mc.registerProductForMail(req.session.userId, name, amount);
    return 1;
  }).catch(err =>{
    res.status(500);
    console.log("[PREORDER] Failed inserting PreorderProduct: \n"+err);
  });
}

module.exports = {

/*
* TODO: Zwischentabelle für PreOrders und Products anlegen
*/
/*
* insert new entry in preorder-table and in preorder_product-table
* update product-table (amount)
*/
      insertPreOrder : function(req, res, product, orderID){
        userID = req.session.userID;
        console.log("[INSERT]");
        console.log(product);
        var amount = product.amount;
        var name = product.name;
        date = new Date();
          db.PreOrder.findOne({attributes : ['poid'], where : {poid : orderID}}).then(order => {
            if(order === null){
              db.PreOrder.create({poid : orderID, createdAt : date, updatedAt : date, UserUid : userID}).then(order => {
                processPreOrder(req, res, product, orderID);
              }).catch(error => {
                res.status(500);
                res.end();
                console.log("[PREORDER] ERROR while creating new Preorder");
              });
            }
            processPreOrder(req, res, product, orderID);
          }).catch(err => {
            res.status(500);
            res.end();
            console.log("[PREORDER] Error while updating Preorder");
            console.log(err);
          });
      }

}
