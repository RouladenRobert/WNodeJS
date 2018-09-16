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
}
