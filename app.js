const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const db = require("./dbconnection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) throw err;
    response(200, result, "Success get all users", res);
  });
});

app.get("/find", (req, res) => {
  const sql = `SELECT name FROM users WHERE id = ${req.query.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      response(404, result, "User not found", res);
    } else {
      response(200, result, "Success get user by id", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
