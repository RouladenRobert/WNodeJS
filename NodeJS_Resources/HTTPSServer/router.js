const ctrl = require("./requestController");

module.exports = function(app){

  /* Routes all requests*/

  app.route("/home")
      .get(ctrl.showHome);

  app.route("/shop")
      .get(ctrl.showProducts);

  app.route("/product")
      .post(ctrl.showDescription);

  app.route("/login")
      .post(ctrl.login);
}
