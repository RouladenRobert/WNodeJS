const MessageHandler = require('./MessageHandler.js');

var logFile = 'log.txt';
var msgHanlder;

module.exports = {

  createInstance : function(file){
    logFile = file;
    msgHanlder = new MessageHandler.MessageHandler(logFile);
  },

  log : function(msg){
    msgHanlder.addMessage(msg);
  },

  deleteLog : function(msg){
    msgHanlder.removeMessage(msg);
  }

}
