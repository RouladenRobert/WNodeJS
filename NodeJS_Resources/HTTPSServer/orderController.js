  class OrderController{
    constructor(connector) {
      this.connector = connector;
    }

    insertOrder(orderDocument){
      pordIDs = [];
      for(let orderObject of orderDocument.order){
        prodIDs.push(orderObject.fPID);
      }

      products = this.connector.getProductCollection().find({PID : { $in : prodIDs}});

      for(i = 0; i < prodIDs.length; i++){
        if(!(products[i].avaiable_amount - orderDocument.order[i].amount < 0)){
          // insert order
          try{
              this.connector.getOrderCollection().insertOne(orderDocument);
          }
          catch(err){
            throw err;
          }
        }
        else {
          throw "amount of " + product[i] + " too less";
        }
      }
    }

    insertOrder(orderDocument){
      pordIDs = [];
      for(let orderObject of orderDocument.order){
        prodIDs.push(orderObject.fPID);
      }

      products = this.connector.getProductCollection().find({PID : { $in : prodIDs}});

      for(i = 0; i < prodIDs.length; i++){
        if(!(products[i].avaiable_amount - orderDocument.order[i].amount < 0)){
          // insert order
          try{
              this.connector.getOrderCollection().insertOne(orderDocument);
          }
          catch(err){
            throw err;
          }
        }
        else {
          throw "amount of " + product[i] + " too less";
        }
      }
    }

    async findShoppingCart(userID){
      try{
      var sc = await this.connector.getShoppingCartCollection().findOne({uid : userID});
      return sc;
      }
      catch(err){
        throw err;
      }
    }

    async findProducts(prodIDs){
      products = [];

      try{
      for(prodID of prodIDs){
        var prodObj = await this.connector.getProductCollection().findOne({id : prodID},
                                            {projection : {pid : 1, name : 1, price : 1, weight : 1, fanimal :1, fkind : 1}});
        products.push(prodObj);
      }

      return products;
      }
      catch(err){
        throw err;
      }
    }
  }

module.exports = {OrderController : OrderController}
