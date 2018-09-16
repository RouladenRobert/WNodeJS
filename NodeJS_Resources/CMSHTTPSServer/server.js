const fs = require('fs');
const https = require("https");
const express = require('express');
const path = require("path")
const router = require("./router");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("./sessionHandler.js");
const sessionConsts = require("./sessionConstants.js");


const app = express();
//use cors to allow acces from localhost
app.use(cors());
app.use(bodyParser());

const certificate = fs.readFileSync(path.join(__dirname, 'certificate.pem'), 'utf8');
const privateKey = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');

app.route('/orderList').all(authorize);
app.route('/orderDetails').all(authorize);
app.route('/finishOrder').all(authorize);
app.route('/deleteOrder').all(authorize);
app.route('/userList').all(authorize);
router(app);

const server = https.createServer({
  cert: certificate,
  key: privateKey
}, app);

server.listen(4000);
console.log("Server startet at port 4000. \n");


setInterval(session.cleanSessions, sessionConsts.SESSION_TIMEOUT_CHECK_INTERVALL);
console.log("[SESSION] Timer active");

function authorize(req, res, next){
  // falls "Passwort vergessen" geklickt wird, wird ein Objekt mit "mail" verschickt, dann wird ausnahmsweise der Zugriff genehmeigt.
  if(req.body.mail !== undefined){
    console.log(req.mail);
    req.mail = req.body.mail;
    next();
    return;
  }
  var sessionID = req.body.session.sessionID || req.query.session;
  req.session = req.body.session;
  req.session.sessionID = sessionID;
  console.log("[SESSION] SessionID: "+sessionID);
  if(sessionID){
    const sessionData = session.getSession(sessionID, req.session);
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
    session.invalidateSession(req.session.sessionId);
    res.status(401);
    res.send("Unauthorized!");
  }
}
