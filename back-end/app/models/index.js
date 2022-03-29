const monogoose = require('mongoose');
monogoose.Promise = global.Promise;

const db = {};
db.monogoose = monogoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.product = require('./product.model');

db.ROLES = ["user", "admin"];

module.exports = db;