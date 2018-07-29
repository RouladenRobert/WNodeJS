const hashmap = require('hashmap');
const db = require("../Database/database.js");

var orderTable = new hashmap.HashMap();

function sendConfirmationMail(userID, prodName, amount){
    // find entry in user-table with id userID and get the email.
    // then send mail to this user.
}

module.exports= {

  // this function is called when the requestContoller starts inserting the orders into the DB.
  // sendMail registeres the number of orders that have to be inserted into the DB.
  sendMail : function(userID, numberOfOrders){
    orderTable.set(userID, numberOfOrders);
  },

  // registerProductForMail is called if the orderController/preOrderController insertes an order into the DB.
  // a call of this function causes a decrementing of the value found at the key userID if the value is higher than 0
  // if the value is 0 all orders got inserted successfully -> mail will be sent
  registerProductForMail : function(userID, productName, amount){
    curr = orderTable.get(userID);
    if(curr === 0){
      orderTable.delete(userID);
      // send mail
      sendConfirmationMail(userID, productName, amount);
      return;
    }
    curr -= 1;
    orderTable.set(userID, curr);
  }
}
