const constants = require("./constants.js")

exports.connectToDB = function(){
    var connection = constants.db.createConnection({
      host: "localhost",
      user: "root",
      password: "rootuser",
      database: "meating"
    });

    connection.connect(function(err){
      if(err) throw err;
      console.log("Connected!");
    })

    return connection;
}
