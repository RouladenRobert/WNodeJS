const mongo = require("./mongodb.js");

var dbClient = mongo.connect();

function getUserCollection(){
  return dbClient.getCollection("User");
}

function getOrderCollection(){
  return dbClient.getCollection("Order");
}
