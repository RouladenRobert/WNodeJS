const hashTable = require('hashmap');
const fs = require('fs');

class MessageHandler {
  constructor(){
    this.msgCoutner = 0;
    this.msgTable = new hashTable.HashMap();
    this.logFile = fs.open('../HTTPSServer/log.txt');
  }

  addMessage(msg){
    this.msgTable.set(msg, this.msgCoutner);
    var date = new Date().toString();
    var message = '['+this.msgCoutner+']'+' '+date+' '+msg+'\n';
    this.msgCoutner += 1;
    
  }

  removeMessage(msg){
    var index = this.msgTable.get(msg);
    //delete message in log-file
    this.msgTable.delete(msg);
  }
}


module.exports = {

}
