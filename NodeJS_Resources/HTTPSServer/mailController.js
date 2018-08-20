const hashmap = require('hashmap');
const mailer = require('nodemailer');
const db = require("../Database/database.js");
const consts = require('./constants.js');
const crypto = require('crypto');

var orderTable = new hashmap.HashMap();
var msg = undefined;
var orderedProds = {names : [], amounts : []};
const trans = mailer.createTransport(consts.MAIL_TRANSPORT);

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
        from : consts.MAIL_ADDR,
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

function sendRegConfirmation(userID){

  db.User.findOne({attributes : ["email", "sname"], where : {uid : userID}}).then(user => {
    msg = "Hallo "+user.dataValues.sname+"!\nBitte bestätige mit dem angefügten Link, dass du dich registriert hast.\nVielen Dank!\n\n";
    var url = consts.REG_MAIL_URL+userID;
    msg += url;

    var mailOpt = {
      from : consts.MAIL_ADDR,
      to : user.email,
      subject : consts.REG_MAIL_SUBJECT,
      text : msg
    };

    trans.sendMail(mailOpt, function(error, info){
      if(error){
        console.log(error);
      }
      else{
        msg = undefined;
        console.log("Mail sent"+info.response);
      }
    });

  }).catch(err => {
    console.log(err);
    return -1;
  });
}

function sendGeneratedPassword(pw, email){
  db.User.findOne({attributes : ["sname"], where : {email : email}}).then(user => {
    msg = "Hallo "+user.dataValues.sname+"!\nWir haben dein Passwort geändert!\nDas Passwort lautet"+pw+".\n\nBitte ändere das Passwort umgehend!";

    var mailOpt = {
      from : consts.MAIL_ADDR,
      to : email,
      subject : consts.REG_MAIL_SUBJECT,
      text : msg
    };

    trans.sendMail(mailOpt, function(error, info){
      if(error){
        console.log(error);
      }
      else{
        msg = undefined;
        console.log("Mail sent"+info.response);
      }
    });

  }).catch(err => {
    console.log(err);
    return -1;
  });

  function sendChangedPasswordConfirm(userID){
    db.User.findOne({attributes : ["email", "sname"], where : {uid : userID}}).then(user => {
      msg = "Hallo "+user.dataValues.sname+"!\nDu hast dein Passwort geändert.\nFalls du das nicht selbst warst, kontaktiere uns bitte!\n\n";

      var mailOpt = {
        from : consts.MAIL_ADDR,
        to : user.email,
        subject : consts.REG_MAIL_SUBJECT,
        text : msg
      };

      trans.sendMail(mailOpt, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          msg = undefined;
          console.log("Mail sent"+info.response);
        }
      });

    }).catch(err => {
      console.log(err);
      return -1;
    });
  }

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
  },

  sendRegConfirmation : function(userID){
    return sendRegConfirmation(userID);
  },

  sendGeneratedPassword : function(pw, email){
    return sendGeneratedPassword(pw, email);
  },

  sendChangedPasswordConfirm : function(userID){
    return sendChangedPasswordConfirm(userID);
  }
}
