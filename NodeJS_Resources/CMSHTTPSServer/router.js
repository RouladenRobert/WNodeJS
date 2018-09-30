const ctrl = require("./requestController");

module.exports = function(app){

  app.route("/login")
      .post(ctrl.login);

  app.route("/orderList")
      .post(ctrl.getOrderList);

  app.route("/preOrderList")
      .post(ctrl.getPreOrderList);

  app.route("/orderDetails")
      .post(ctrl.getOrderDetails);

  app.route("/preOrderDetails")
      .post(ctrl.getPreOrderDetails);

  app.route("/setPw")
      .post(ctrl.setPassword);

  app.route("/register")
      .post(ctrl.register);

  app.route("/finishOrder")
      .post(ctrl.finishOrder);

  app.route("/deleteOrder")
      .post(ctrl.deleteOrder);

  app.route("/userList")
      .post(ctrl.getAdminUsers);

  app.route("/deleteProduct")
      .post(ctrl.deleteProduct);

  app.route("/addProduct")
      .post(ctrl.addProduct);

  app.route("/updateProduct")
      .post(ctrl.updateProduct);

  app.route("/prodList")
      .post(ctrl.getProductList);

  app.route("/logout")
      .post(ctrl.logout);

  app.route("/searchOrder")
      .post(ctrl.searchOrder);

  app.route("/confirm")
      .post(ctrl.confirmAdmin);

  app.route("/prodPool")
      .post(ctrl.getProductPool);

  app.route("/pushPool")
      .post(ctrl.pushToProductPool);

  app.route("/pushProd")
      .post(ctrl.pushToProducts);
}
