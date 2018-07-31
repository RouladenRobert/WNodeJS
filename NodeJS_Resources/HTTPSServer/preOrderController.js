const db = require("../Database/database.js");
const mc = require("./mailController.js");

function processPreOrder(req, res, product, orderID){
  var amount = product.amount;
  var name = product.name;
  db.PreorderProduct.create({amount : product.amount, createdAt : date, updatedAt : new Date(), PreOrderPoid : orderID, ProductPid : product.pid}).then(()=>{
    res.status(200);
    res.end();
    console.log("[PREORDER] Register prouduct now");
    mc.registerProductForMail(req.session.userId, name, amount, orderID);
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
        date = new Date();
          db.PreOrder.findOne({attributes : ['poid'], where : {poid : orderID}}).then(order => {
            // if preorder can't be found the order-object is null.
            if(order === null){
              db.PreOrder.create({poid : orderID, createdAt : date, updatedAt : date, UserUid : userID}).then(order => {
                processPreOrder(req, res, product, orderID);
              }).catch(error => {
                // it could be that sequelize executes the find-query a second time before the preorder is inserted in the table.
                // in this case it will throw an error, so processPreOrder will be called here.
                // if the error was caused by another reason it is delegated to the next function working with the database
                processPreOrder(req, res, product, orderID);
              });
            }
            else{
                processPreOrder(req, res, product, orderID);
            }
          }).catch(err => {
            res.status(500);
            res.end();
            console.log("[PREORDER] Error while updating Preorder");
            console.log(err);
          });
      }

}
