const hashmap = require('hashmap');
const mailer = require('nodemailer');
const db = require("../Database/database.js");
const consts = require('./constants.js');
const crypto = require('crypto');

var orderTable = new hashmap.HashMap();
var priceTable = new hashmap.HashMap();
var msg = undefined;
var verMsg = undefined;
var orderedProds = {names : [], amounts : []};
const trans = mailer.createTransport(consts.MAIL_TRANSPORT);


function sendRegConfirmation(userID){

  db.AdminUser.findOne({attributes : ["email", "sname"], where : {uid : userID}}).then(user => {
    msg = "Hallo "+user.dataValues.sname+"!\nDie Registrierung wurde entgegengenommen. Es erfolgt eine Verifikation durch einen anderen Administrator.\n"+
    "\nBei Abschluss der Verifikation wird Ihnen eine Mail geschickt und Sie können sich mit den von Ihnen angegeben Login-Daten einloggen.\n\nVielen Dank!\n\n";
    var url = consts.REG_MAIL_URL+userID;
    verMsg = "Ein neuer Administrator möchte sich registrieren! Um den Account freizugeben, klicken Sie bitte auf den angefügten Link. \nSoll er nicht aktiviert werden, kann diese Mail ignoriert werden.\n\n"
    verMsg += url;

    var mailOptReg = {
      from : consts.MAIL_ADDR,
      to : user.email,
      subject : consts.REG_MAIL_SUBJECT,
      text : msg
    };

    var mailObjConf = {
      from : consts.MAIL_ADDR,
      to : user.email,                    //!!!!!!!!!!!! MUSS NOCH GETAUSCHT WERDEN DURCH DIE BEIDEN ADRESSEN DER ADMINOSTRATOREN!!!!!!!!!!!!!!!!!!!!!!!!
      subject : consts.REG_MAIL_SUBJECT,
      text : verMsg
    };

    var mails = [mailOptReg, mailObjConf];

    for(m of mails){
      trans.sendMail(m, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          msg = undefined;
          verMsg = undefined;
          console.log("Mail sent"+info.response);
        }
      });

    }


  }).catch(err => {
    console.log(err);
    return -1;
  });
}

function sendGeneratedPassword(pw, email){
  db.AdminUser.findOne({attributes : ["sname"], where : {email : email}}).then(user => {
    if(user === null){
      return;
    }

    msg = "Hallo "+user.dataValues.sname+"!\nWir haben dein Passwort geändert!\nDas Passwort lautet "+pw+".\n\nBitte ändere das Passwort umgehend!";

    var mailOpt = {
      from : consts.MAIL_ADDR,
      to : email,
      subject : consts.PW_MAIL_SUBJECT,
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

function sendChangedPasswordConfirm(userID){
    db.AdminUser.findOne({attributes : ["email", "sname"], where : {uid : userID}}).then(user => {
      msg = "Hallo "+user.dataValues.sname+"!\nDu hast dein Passwort geändert.\nFalls du das nicht selbst warst, kontaktiere uns bitte!\n\n";

      var mailOpt = {
        from : consts.MAIL_ADDR,
        to : user.email,
        subject : consts.PW_MAIL_SUBJECT,
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

  function sendConfirmationToNewAdmin(userID){
      db.AdminUser,findOne({attributes : ['email', 'sname'], where : {uid : userID}}).then(user => {
        msg = "Hallo "+user.dataValues.sname+"! Ihr Administrator-Account wurde nun freigegeben! Sie können sich ab sofort einloggen! \n\nVielen Dank!";

        var mailOpt = {
          from : consts.MAIL_ADDR,
          to : user.email,
          subject : consts.PW_MAIL_SUBJECT,
          text : msg
        };

        trans.sendMail(mailOpt, function(error, info){
          if(error){
            console.log(error);
          }
          else{
            msg = undefined;
            console.log("mail sent!");
          }
        });
      }).catch(err => {
        console.log(err);
      });
  }


module.exports= {

  // send confirmation-mail after registration.
  sendRegConfirmation : function(userID){
    return sendRegConfirmation(userID);
  },

  // send a new generated password
  sendGeneratedPassword : function(pw, email){
    return sendGeneratedPassword(pw, email);
  },

  // send an info-mail if the passwort was changed manually.
  sendChangedPasswordConfirm : function(userID){
    return sendChangedPasswordConfirm(userID);
  },

  sendConfirmationToNewAdmin : function(userID){
    return sendConfirmationToNewAdmin(userID);
  }
}
