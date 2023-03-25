const mysql = require("mysql");
const db = mysql.createConnection({
  host: "db",
  user: "root",
  password: "my_cool_secret",
  port: 3306,
  database: "bookshelf",
});
module.exports = db;
