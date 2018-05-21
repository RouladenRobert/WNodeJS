const constants = require("./constants.js")

exports.connectToDB = function(){
    var connection = constants.db.createConnection({
      host: "rdbms.strato.de",
      user: "U3371702",
      password: "JonasDB1998",
      database: "DB3371702"
    });

    connection.connect(function(err){
      if(err) throw err;
      console.log("Connected!");
    })

    return connection;
}
