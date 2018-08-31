Sequelize = require("sequelize");
const User = require("./user.js");
const Order = require("./order.js");
const PreOrder = require("./preorder.js");
const Product = require("./products.js");
const OrderProduct = require("./order_product.js");
const PreorderProduct = require('./preorder_product.js');
const ShoppingCart = require("./shopping_cart.js");
//const ShoppingCartProduct = require("./shopping_car_product.js");


/*
  1:1 ORDER and USER
*/
Order.belongsTo(User);

/*
  1:1 PREORDERS and USERS
*/
PreOrder.belongsTo(User);

/*
  n:m ORDERS and PRODUCTS
*/
Order.belongsToMany(Product, {through : OrderProduct});

/*
  n:m PREORDERS and PRODUCTS
*/
PreOrder.belongsToMany(Product, {through : PreorderProduct});

/*
  1:n USERS and SHOPPINGCARTS
*/
ShoppingCart.belongsTo(User);
ShoppingCart.belongsTo(Product);

// init db:
function init(){
  console.log("Beginning init of DB...");
  r = execInit({force : true});
  if(r == true){
    console.log("Finished init of DB");
    return;
  }
  else{
    console.log("Error while initalizing the DB");
    return
  }
}

function softInit(){
  console.log("Beginning Soft-Init of DB...");
  r = execInit({});
  if(r == true){
    console.log("Finished init of DB");
    return;
  }
  else{
    console.log("Error while initalizing the DB");
    return
  }
}

function execInit(initObj){
  User.sync(initObj).then(() =>{
    Product.sync(initObj).then(() =>{
      Order.sync(initObj).then(() =>{
        PreOrder.sync(initObj).then(() =>{
          OrderProduct.sync(initObj).then(() => {
            PreorderProduct.sync(initObj).then(() => {
              ShoppingCart.sync(initObj);
            });
          });
        });
      });
    });
  });
  return true;
}

module.exports = {
  init : init,
  softInit : softInit,
  User : User,
  Product : Product,
  Order : Order,
  PreOrder : PreOrder,
  OrderProduct : OrderProduct,
  PreorderProduct : PreorderProduct,
  ShoppingCart : ShoppingCart
}
