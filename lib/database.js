const mysql = require('mysql')
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'db_name'
});
module.exports = connection;