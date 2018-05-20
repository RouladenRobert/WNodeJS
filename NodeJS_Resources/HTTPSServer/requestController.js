const db = require("../Database/database.js");

module.exports = {

    //show home
    showHome : function(req, res){

        res.send("Funktioniert");
        res.end();
    },

    //sends all products back to the client
    showProducts : function(req, res){
      var productList = [{name : "Wildschwein", price : 10.99, stock : 3, weight : 200, prID: 0},
                          {name : "Hirsch", price : 15.99, stock : 7, weight : 250, prID: 1}];
      console.log("Bis hier her");
      //var productList =[];
      /*db.Product.findAll({attributes : ["name", "description", "amount", "price", "weight", "preOrderable"]}).then(res =>{
        console.log(res);
        res.send(res);
        res.end();
      });*/

      res.send(productList);
      res.end();
    },

    showDescription : function(req, res){
      var prID = req.body.prodID;

      var productList = [{name : "Wildschwein", price : 10.99, stock : 3, weight : 200, prID: 0, description: "Tolles Wild"},
                          {name : "Hirsch", price : 15.99, stock : 7, weight : 250, prID: 1, description: "Toller Hirsch!"}];

      console.log(productList[0]);

      res.send(productList[0]);
      res.end();
    }

}
