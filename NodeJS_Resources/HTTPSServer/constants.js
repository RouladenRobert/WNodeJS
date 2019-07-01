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
      user : '',
      pass : ''
    }
  },
  MAIL_ADDR : 'jonas.seng1@gmail.com',
  ORDER_MAIL_SUBJECT : 'Bestellbestätigung',
  REG_MAIL_SUBJECT : 'Authentifizierung',
  PW_MAIL_SUBJECT : 'Ihr Passwort wurde geändert!',
  REG_MAIL_URL : 'https://localhost:3000/auth?id=',
  LOGGER_LOG_ERR : '[LOGGER ERR]',
  LOGGER_MAIL_ERR : '[MAIL ERR]',
  LOGGER_MAIL_SUCC : '[MAIL SENT]',
  LOGGER_ORDER_ERR : '[ORDER ERR]',
  LOGGER_ORDER_SUCC : '[ORDER OK]',
  LOGGER_GET_PROD_ERR : '[GET PRODUCT ERROR]',
  LOGGER_DESCR_ERR : '[DESCRIPTION ERROR]',
  LOGGER_REG_ERR : '[REGISTRATION ERR]',
  LOGGER_REG_SUCC : '[REGISTRATION OK]',
  LOGGER_LOGIN_ERR : '[LOGIN ERR]',
  LOGGER_LOGIN_SUCC : '[LOGIN OK]',
  LOGGER_LOGIN_TRY : '[LOGIN TRIAL]',
  LOGOIN_LOGOUT_ERR : '[LOGOUT ERR]',
  LOGGER_LOGOUT_SUCC : '[LOGOUT OK]',
  LOGGER_DEL_USER_ERR : '[DELETE ACCOUNT ERR]',
  LOGGER_DEL_USER_SUCC : '[DELETE ACCOUNT OK]',
  LOGGER_CONFIRM_ERR : '[CONFIRMATION ERR]',
  LOGGER_NEW_PASS_ERR : '[NEW_PASSWORD ERR]',
  LOGGER_LOGIN_TRY : '[LOGIN TRIAL]',
  LOGGER_REGISTER_TRY : '[REGISTER TRIAL]',
  LOGGER_CONFIRM_TRY : '[CONFIMRATION TRIAL]',
  LOGFILE_PATH : 'HTTPSServer/log.txt'
}
