const MessageHandler = require('./MessageHandler.js');

var logFile = 'log.txt';
var msgHanlder;

class Logger{
  constructor(file){
    this.path = '../'+file;
    this.msgHanlder = new MessageHandler.MessageHandler(this.path);
  }

  log(msg){
    this.msgHanlder.addMessage(msg);
  }

  deleteLog(msg){
    this.msgHanlder.removeMessage(msg);
  }

}

module.exports = {

  /*createInstance : function(file){
    logFile = file;
    msgHanlder = new MessageHandler.MessageHandler(logFile);
  },

  log : function(msg){
    msgHanlder.addMessage(msg);
  },

  deleteLog : function(msg){
    msgHanlder.removeMessage(msg);
  }*/

  Logger : Logger

}
