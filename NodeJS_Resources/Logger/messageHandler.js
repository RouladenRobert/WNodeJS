const hashTable = require('hashmap');
const fs = require('fs');
const constants = require('../HTTPSServer/constants.js');

class MessageHandler {
  constructor(){
    this.msgCounter = 0;
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
    var date = new Date().toString();
    var message = msg + " - "+date+'\n';
    try{
      fs.appendFileSync(constants.LOGFILE_PATH, message);
      this.msgTable.set(msg, this.msgCounter);
      this.msgCounter += 1;
    }
    catch(e){
      try{
        var message_log_err = 'Error while logging message: '+message+' - '+date+'\n';
        fs.appendFileSync(constants.LOGFILE_PATH, message_log_err);
      }
      catch(ex){
        console.log("[LOGGER] Couldn't write to file "+this.logFile);
        console.log(e);
        return;
      }
    }
  }

  removeMessage(msg){
    //delete message in log-file
    var messages = fs.readFileSync(this.logFile, 'utf-8').split('\n');
    var index = this.msgTable.get(msg);
    var regex = /[.*]$/;
    var toDelete = [];
    for(let i=0; i<messages.lenght; i++){
      if(messages[i].match(regex) !== null){
        this.msgTable.delete(messages[i]);
        delete messages[i];
      }
    }

    var toWrite = messages.join(" ")+'\n';
    try{
      fs.writeSync(this.logFile, toWrite);
    }
    catch(e){
      try{
        var msg = constants.LOGGER_LOG_ERR + " Error while logging... - "+date+'\n';
        fs.appendFileSync(constants.LOGFILE_PATH, msg);
      }
      catch(e){
        console.log(constants.LOGGER_LOG_ERR+" at messageHandler line 61");
        return;
      }
    }
  }
}


module.exports = {
  MessageHandler : MessageHandler
}
