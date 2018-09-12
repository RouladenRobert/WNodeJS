const ctrl = require("./requestController");

module.exports = function(app){

  app.route("/login")
      .post(ctrl.login);

  app.route("/home")
      .post(ctrl.loadHome);

  app.route("/oderList")
      .post(ctrl.getOrderList);

  app.route("/preOrderList")
      .post(ctrl.getPreOrderList);

  app.route("/orderDetails")
      .post(ctrl.getOrderDetails);

  app.route("/preOrderDetails")
      .post(ctrl.getPreOrderDetails);
}
