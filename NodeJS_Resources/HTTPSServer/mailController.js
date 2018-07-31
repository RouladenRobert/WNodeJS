const hashmap = require('hashmap');
const mailer = require('nodemailer');
const db = require("../Database/database.js");
const consts = require('./orderConstants.js');

var orderTable = new hashmap.HashMap();
var msg = undefined;
var orderedProds = {names : [], amounts : []};
const trans = mailer.createTransport(consts.ORDER_MAIL_TRANSPORT);

function sendOrderConfirmation(userID, prods, orderID){
    // find entry in user-table with id userID and get the email.
    // then send mail to this user.
    console.log(orderID);
    db.User.findOne({attributes : ["email", "sname"], where : {uid : userID}}).then((user) => {
      if(!msg){
        msg = "Hallo "+user.sname+"! \n\nHier ist deine Bestellbestätigung.\nDie Bestellungs-ID lautet: "+orderID+"\n";
      }
      for(i=0; i<prods.names.length; i++){
        //console.log(ent.name);
        //console.log(ent.amount);
        msg += "\n"+prods.names[i]+"  "+prods.amounts[i]+"x";
      }

      console.log("[MAILER] Nachricht: "+msg);
      //send message
      var mailOpt = {
        from : consts.ORDER_MAIL_ADDR,
        to : user.email,
        subject : consts.ORDER_MAIL_SUBJECT,
        text : msg
      };

      trans.sendMail(mailOpt, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          msg = undefined;
          console.log('Mail sent '+info.response);
        }
      });


    }).catch(err => {
      console.log(err);
      return -1;
    })
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
  registerProductForMail : function(userID, productName, amount, orderID){
    // get current number of remaining orders in list.
    curr = orderTable.get(userID);
    curr -= 1;

    // process the product
    orderedProds.names.push(productName);
    orderedProds.amounts.push(amount);
    orderTable.set(userID, curr);

    // if there are no products in the array anymore delete the entry in the hash-table
    if(curr === 0){
      orderTable.delete(userID);
      // send mail
      sendOrderConfirmation(userID, orderedProds, orderID);
      orderedProds = {names : [], amounts : []};
      return;
    }
  }
}
