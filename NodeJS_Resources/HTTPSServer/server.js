const express = require("express")
const fs = require("fs")
const https = require("https")
const path = require("path")
const router = require("./router");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("./sessionHandler.js");
const sessionConsts = require("./sessionConstants.js");

const app = express()

//load certificate and Private Key
const certificate = fs.readFileSync(path.join(__dirname, 'certificate.pem'), 'utf8');
const privateKey = fs.readFileSync(path.join(__dirname, 'privateKey.pem'), 'utf8');

//use cors to allow acces from localhost
app.use(cors());
app.use(bodyParser());

app.route('/shop').all(authorize);
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

setInterval(session.cleanSessions, sessionConsts.SESSION_TIMEOUT_CHECK_INTERVALL);
console.log("[SESSION] Timer active");

function authorize(req, res, next){
  var sessionID = req.body.session || req.query.session;
  req.session = {};
  req.session.sessionId = sessionID;

  if(sessionID){
    const sessionData = session.getSession(sessionID);
    if(!sessionData || !sessionData.userID){
      console.log("[SESSION] No session found");
      responseUnauthorized(req, res);
      return;
    }
    req.session.userId = sessionData.userID;
    next();
  }
  else{
    responseUnauthorized(req, res);
    return;
  }

  function responseUnauthorized(req, res){
    session.invalidate(req.session.sessionId);
    res.status(401);
    res.send("Unauthorized!");
  }
}
