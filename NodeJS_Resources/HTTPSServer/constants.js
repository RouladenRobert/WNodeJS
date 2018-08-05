//define constants

const https = require('https');
const url = require('url');
const fs = require('fs');
//const db = require('F:/Jonas/Programme/Node JS/node_modules/mysql');


const ORDER_ID_CONST = 12;

module.exports = {
  ORDER_ID_LENGTH : ORDER_ID_CONST,
  MAIL_TRANSPORT : {
    service : 'gmail',
    auth : {
      user : 'jonas.seng1@gmail.com',
      pass : 'louisundrene'
    }
  },
  MAIL_ADDR : 'jonas.seng1@gmail.com',
  ORDER_MAIL_SUBJECT : 'Bestellbestätigung',
  REG_MAIL_SUBJECT : 'Authentifizierung',
  REG_MAIL_URL : 'https://localhost:3000/auth?id='
}
