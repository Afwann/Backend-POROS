const mysql = require("mysql");
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "my_cool_secret",
  port: 3306,
  database: "bookshelf",
});
module.exports = db;
