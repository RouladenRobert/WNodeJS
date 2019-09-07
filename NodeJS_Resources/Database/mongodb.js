const mongoClient = require('mongodb').MongoClient;
const config = require("./collectionsConfig.json"); //load config-file, being paresd to an object automatically

const url = 'mongodb://localhost:27017';
var database;


async function connect(){
  //connect to database
  function setDatabase(db){
    database = db;
  }

  var db = await mongoClient.connect(url,{ useNewUrlParser: true });
  var client = db.db('WildShop');
  return client;
}

function createDatabase(){
  connect();
  database.dropDatabase(function(err, res){
    createCollections();
  });
}

function createCollections(){
  connect();
  for(let col in config){
    database.createCollection(col, config[col], function(err, res){
      if(err){
        console.log(err);
      }
    });
  }
}

module.exports = {connect : connect,
                  createDatabase : createDatabase};
