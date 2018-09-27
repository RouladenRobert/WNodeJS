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

    const messages = require("strings.json");

    msg = messages["h"]+" "+user.dataValues.sname+"!\n"+messages["registration"];
    var url = consts.REG_MAIL_URL+userID;
    verMsg = messages["newAdmin"];
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

    const messages = require("strings.json");

    msg = messages["h"]+" "+user.dataValues.sname+"!"+messages["changedPassword"];

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
      const messages = require('strings.json');

      msg = messages["h"]+" "+user.dataValues.sname+"!\n"+messages["changedPassword"];

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
        const messages = require('strings.json');
        msg = messages["h"]+" "+user.dataValues.sname+"!\n"+messages["adminFree"];

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

  function sendOrderInfo(userIDs){
    for(user of userIDs){
      db.User.findOne({attributes : ['email', 'sname'], where : {uid : user}}).then(u => {
        const messages = require('strings.json');
        var toSend = messages["h"]+" "+u.dataValues.sname+"! \n"+messages["stateChanged"];

        var sendObj = {
                  from : consts.MAIL_ADDR,
                  to : user.email,
                  subject : consts.PW_MAIL_SUBJECT,
                  text : toSend};

        trans.sendMail(mailOpt, function(error, info){
            if(error){
              console.log(error);
            }
            else{
              toSend = undefined;
              console.log("mail sent!");
            }
        });

      }).catch(err => {
        console.log(err);
      });
    }
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

  sendOrderInfo : function(userIDs){
    return sendOrderInfo(userIDs);
  }
}
