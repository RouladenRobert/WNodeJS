const config = require("./database_local.json");
Sequelize = require("sequelize");

const seq = new Sequelize(config);

module.exports = seq;
