module.exports = function(app){
  const ctrl = require("./requestController");

  /* Routes all requests*/

  app.route("/home")
      .get(ctrl.showHome);

  app.route("/shop")
      .get(ctrl.showProducts);

  app.route("/product")
      .post(ctrl.showDescription);
}
