const express = require("express")
const fs = require("fs")
const https = require("https")
const path = require("path")
const router = require("./router");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express()

//load certificate and Private Key
const certificate = fs.readFileSync(path.join(__dirname, 'certificate.pem'), 'utf8');
const privateKey = fs.readFileSync(path.join(__dirname, 'privateKey.pem'), 'utf8');

//use cors to allow acces from localhost
app.use(cors());
app.use(bodyParser());
router(app);

/*app.get('/', (req, res) => {
  res.send("Test mit HTTPS!");
  res.end();
});*/

const server = https.createServer({
  cert: certificate,
  key: privateKey
}, app);

server.listen(3000);
console.log("Server startet at port 3000. \n");
