module.exports = {

  insertOrder : function(connector, orderDocument){
    pordIDs = [];
    for(let orderObject of orderDocument.order){
      prodIDs.push(orderObject.fPID);
    }

    products = connector.getProductCollection().find({PID : { $in : prodIDs}});

    for(i = 0; i < prodIDs.length; i++){
      if(!(products[i].avaiable_amount - orderDocument.order[i].amount < 0)){
        // insert order
        try{
            connector.getOrderCollection().insertOne(orderDocument);
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

}
