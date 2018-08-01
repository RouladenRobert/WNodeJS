const hashTable = require('hashmap');
const fs = require('fs');

class MessageHandler {
  constructor(){
    this.msgCoutner = 0;
    this.msgTable = new hashTable.HashMap();
    try{
      this.logFile = fs.openSync('../HTTPSServer/log.txt', 'r+');
    }
    catch(e){
      console.log("[LOGGER] file can't be found or opened");
      console.log(e);
      return null;
    }
  }

  addMessage(msg){
    this.msgTable.set(msg, this.msgCoutner);
    var date = new Date().toString();
    var message = '['+this.msgCoutner+']'+' '+date+' '+msg+'\n';
    this.msgCoutner += 1;
    try{
      fs.writeSync(this.logFile, msg);
    }
    catch(e){
      console.log("[LOGGER] Couldn't write to file "+this.logFile);
      console.log(e);
      return;
    }
  }

  removeMessage(msg){
    var index = this.msgTable.get(msg);
    //delete message in log-file

    this.msgTable.delete(msg);
  }
}


module.exports = {
  MessageHandler : MessageHandler
}
