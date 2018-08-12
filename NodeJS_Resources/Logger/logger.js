const MessageHandler = require('./MessageHandler.js');

var msgHanlder = new MessageHandler.MessageHandler();

module.exports = {

  log : function(msg){
    msgHanlder.addMessage(msg);
  },

  deleteLog : function(msg){
    msgHanlder.removeMessage(msg);
  }

}
