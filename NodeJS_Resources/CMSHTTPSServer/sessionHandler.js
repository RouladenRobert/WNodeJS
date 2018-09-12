const crypto = require("crypto");
const db = require("../Database/database.js");
const sconsts = require("./sessionConstants.js");
const hashmap = require('hashmap');

var sessionObj = new hashmap.HashMap();

function saveShoppingCart(session){
      db.ShoppingCart.destroy({where : {UserUid : session.userID}}).then(() => {
        for(p of session.productArr){
          db.ShoppingCart.create({UserUid : session.userID, ProductPid : p.pid, amount : p.amount, description : p.description}).then(() => {
          }).catch(err =>{
            console.log("[SESSION_HANDLER] Error while creating new Shopping cart");
          });
        }
      }).catch(err => {
        console.log("[SESSION_HANDLER] Error while deleting current Shopping cart");
      });
}

module.exports = {

    //sessionObj : sessionObj;

  generateSessionObject : function(userID){
    console.log("[SESSION] Creating Session object....")
    var sessionID = crypto.randomBytes(sconsts.SESSION_ID_LENGTH).toString('base64');
    sessionID = sessionID.split("+").join("-");
    var session = {};
    session.userID = userID;
    session.begin = new Date();
    session.updatedAt = new Date();
    session.sessionID = sessionID;
    sessionObj.set(sessionID, session);
    return session;
  },

  getSession : function(sessionID, newSession){
    var currSession = sessionObj.get(sessionID);
    if(!currSession) return undefined;
    newSession.updatedAt = new Date();
    sessionObj.set(sessionID, newSession);
    return currSession;
  },

  invalidateSession : function(sessionID){
    console.log("[SESSION] Session will be invalidated");
    sessionObj.delete(sessionID);
  },

  cleanSessions : function(){
    console.log("[SESSION] Cleaining Sessions");

    var sessionsDel = [];
    sessionObj.forEach(function(value, key){
        if((new Date() - value.updatedAt > sconsts.SESSION_RESET_TIME)){
          console.log("Cleaning...")
          if(value.productArr !== null || value.prodArr !== undefined){
              saveShoppingCart(value);
          }
              sessionsDel.push(key);
        }
    });

    sessionsDel.forEach(function(value){
      console.log("[SESSION] Invalidating "+ value);
      sessionObj.delete(value);
    });
  }

};
