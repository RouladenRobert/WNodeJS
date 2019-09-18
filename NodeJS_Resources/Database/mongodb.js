const mongoClient = require('mongodb').MongoClient;
const config = require("./collectionsConfig.json"); //load config-file, being paresd to an object automatically
const connectionConfig = config.connection;
const dbConfig = config.config;

class Connector{

  constructor(){
    this.database = null;
    this.client = null;
  }

  async connect(){
    this.database = await mongoClient.connect(connectionConfig.url,{ useNewUrlParser: true });
    this.client = await this.database.db(connectionConfig.collection);
    return this.client;
  }

  async createDatabase(){
    await this.connect();
    await this.client.dropDatabase();
    this.createCollections();
  }

  createCollections(){
    console.log("Creating collections...");
    for(let col in dbConfig){
      this.client.createCollection(col, dbConfig[col], function(err, res){
        if(err){
          console.log(err);
        }
        console.log("Collection created successfully!");
      });
    }
    return;
  }
}

module.exports = {Connector : Connector};
