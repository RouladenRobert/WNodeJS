const crypto = require("crypto");
const db = require("../Database/database.js");
const sconsts = require("./sessionConstants.js");
const hashmap = require('hashmap');

var sessionObj = new hashmap.HashMap()

module.exports = {

    //sessionObj : sessionObj;

  generateSessionObject : function(userID){
    console.log("[SESSION] Creating Session object....")
    var sessionID = crypto.randomBytes(sconsts.SESSION_ID_LENGTH).toString('base64');
    sessionID = sessionID.split("+").join("-");
    var session = {}
    session.userID = userID;
    session.begin = new Date();
    session.updatedAt = new Date();
    sessionObj.set(sessionID, session);
    return sessionID;
  },

  getSession : function(sessionID){
    var currSession = sessionObj.get(sessionID);
    if(!currSession) return undefined;
    currSession.updatedAt = new Date();
    sessionObj.set(sessionID, currSession);
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
          sessionsDel.push(key);
        }
    });

    sessionsDel.forEach(function(value){
      console.log("[SESSION] Invalidating "+ value);
      sessionObj.delete(value);
    });
  }

};
