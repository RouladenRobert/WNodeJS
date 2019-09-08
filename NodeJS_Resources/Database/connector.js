var mongo = require('./mongodb.js');

class Connector {

  constructor() {
    this.mongoClient = mongo.connect();
  }

  getClient() {
    return this.mongoClient;
  }

  getUserCollection(){
    return this.mongoClient.getCollection("User");
  }

  getOrderCollection(){
    return this.mongoClient.getCollection("Order");
  }

  getShoppingCartCollection(){
    return this.mongoClient.getCollection("ShoppingCart");
  }

  getProductCollection(){
    return this.mongoClient.getCollection("Product");
  }

  getAnimalsCollection(){
    return this.mongoClient.getCollection("Animals");
  }

  getKindsCollection(){
    return this.mongoClient.getCollection("Kinds");
  }
}


module.exports = {
  getUserCollection : getUserCollection,
  getOrderCollection : getOrderCollection,
  getShoppingCartCollection : getShoppingCartCollection,
  getProductCollection : getProductCollection,
  getAnimalsCollection : getAnimalsCollection,
  getKindsCollection : getKindsCollection
}
