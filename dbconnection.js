const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "dennyraymond",
  password: "denny123",
  database: "node_crud",
});

// untuk bisa diakses dari luar
module.exports = db;
