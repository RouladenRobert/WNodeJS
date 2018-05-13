const constants = require("./constants.js")
const dbCon = require("./dbconnection.js")

constants.https.createServer(function(req, res){

  // Databse connection
  const dbConnection = dbCon.connectToDB();

  // catch data from DB
  var product_list;
  try{
  product_list = get_product_list(con);
  }
  catch(err){
    product_list = "Fehler beim Abrufen der Daten";
  }

  // send response
  var file = null;
  try{
    var filename = get_filename(req);
    file = open_file(filename);
    console.log(file);
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write(file);
    return res.end();
  }
  catch(err){
    res.writeHead(404, {'Content-Type' : 'text/html'});
    return res.end("404 Not Found!");
  }
}).listen(8080);



// Create connection to database
// returns connection object
function connect_to_db(){
    var connection = db.createConnection({
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

// get product list from db
//returns json object
function get_product_list(connection){
  var query = "select p_name from products;"
  connection.query(query, (err, result) => {
      if(err) throw err;
      var sqldata = JSON.stringify(sqlres_to_json(result));
      console.log(sqldata);

  });
  return sqldata;
}

//parse url
// returns filename of requested file
function get_filename(req){
  var par_url = url.parse(req.url, true);
  var filename = 'F:/Jonas/Programmierung/HTML/Idea'+par_url.pathname;
  return filename;
}

//try to open the requested file
// throws an error if file does not exist
function open_file(filename){
  fs.readFile(filename, function(err, data){
      if(err){
        throw err;
        return;
      }
      else{
        return data;
      }
  });
}

function sqlres_to_json(input){
    var json = [];
    for(var i = 0; i < input.length; i++){
        json.push(input[i].p_name);
    }

    return json;

}
