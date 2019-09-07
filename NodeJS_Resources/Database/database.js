Sequelize = require("sequelize");
const User = require("./user.js");
const Order = require("./order.js");
const PreOrder = require("./preorder.js");
const Product = require("./products.js");
const OrderProduct = require("./order_product.js");
const PreorderProduct = require('./preorder_product.js');
const ShoppingCart = require("./shopping_cart.js");
const AdminUser = require('./adminUsers.js');
const FinishedOrders = require('./finishedOrders.js');
const FinishedOrderProducts = require('./finishedOrderProducts');
const ProductPool = require('./product_pool.js');
const KindOfProcessing = require('./kind_of_processing.js');
const Offer = require('./offer.js');
//const ShoppingCartProduct = require("./shopping_car_product.js");


/*
  1:n ORDER and USER
*/
Order.belongsTo(User);

/*
  1:n PREORDERS and USERS
*/
PreOrder.belongsTo(User);

/*
  n:m PRODUCT and KIND_OF_PROCESSING
*/
Product.belongsToMany(KindOfProcessing, {through : Offer, foreignKey : 'OfferProdcutPid'});
KindOfProcessing.belongsToMany(Product, {through : Offer, foreignKey : 'KindOfProcessingVid'});
Order.belongsToMany(Product, {through : Offer, foreignKey : 'OrderOid'});
Order.belongsToMany(KindOfProcessing, {through : Offer, foreignKey : 'OrderOid'});

/*
  n:m ORDERS and PRODUCTS and KIND_OF_PROCESSING
*/
Order.belongsToMany(Offer, {through : OrderProduct});
OrderProduct.belongsTo(KindOfProcessing, {foreignKey : 'KindOfProcessingVid'});

/*
  n:m PREORDERS and PRODUCTS and KIND_OF_PROCESSING
*/
PreOrder.belongsToMany(Offer, {through : PreorderProduct});

/*
  1:n USERS and SHOPPINGCARTS
*/
ShoppingCart.belongsTo(User);
ShoppingCart.belongsTo(Offer);


/*
  n:m FINISHED ORDERS and PRODUCTS
*/
FinishedOrders.belongsTo(User);
FinishedOrders.belongsToMany(Offer, {through : FinishedOrderProducts});

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
      KindOfProcessing.sync(initObj).then(() => {
        Offer.sync(initObj).then(() =>{
          Order.sync(initObj).then(() =>{
            PreOrder.sync(initObj).then(() =>{
              OrderProduct.sync(initObj).then(() => {
                PreorderProduct.sync(initObj).then(() => {
                  ShoppingCart.sync(initObj).then(() => {
                    AdminUser.sync(initObj).then(() => {
                      FinishedOrders.sync(initObj).then(() => {
                        FinishedOrderProducts.sync(initObj).then(() => {
                          ProductPool.sync(initObj).then(() => {
                            return true;
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
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
  ShoppingCart : ShoppingCart,
  AdminUser : AdminUser,
  FinishedOrders : FinishedOrders,
  FinishedOrderProducts :  FinishedOrderProducts,
  ProductPool : ProductPool,
  KindOfProcessing : KindOfProcessing,
  Offer : Offer
}
