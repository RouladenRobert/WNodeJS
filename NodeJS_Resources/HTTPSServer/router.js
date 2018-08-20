const ctrl = require("./requestController");


module.exports = function(app){

  /* Routes all requests*/

  app.route("/home")
      .get(ctrl.showHome);

  app.route("/shop")
      .post(ctrl.showProducts);

  app.route("/product")
      .post(ctrl.showDescription);

  app.route("/order")
      .post(ctrl.addOrder);

  app.route("/login")
      .post(ctrl.login);

  app.route("/register")
      .post(ctrl.register);

  app.route("/logout")
      .post(ctrl.logout);

  app.route("/auth")
      .get(ctrl.confirm);

  app.route("/setPw")
      .post(ctrl.setPassword);
}
