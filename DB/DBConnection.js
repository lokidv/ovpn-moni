/**
 * Created by vahid76 on 3/7/18.
 */

var mysql = require('mysql');
var util = require('util');

db = mysql.createConnection({
    host: 'localhost',
    user: 'usage',
    password: 'usage2580',
    database: 'usage',
});



let query = util.promisify(db.query).bind(db);

module.exports = {
    DBConnection: db,
    Query: query
};