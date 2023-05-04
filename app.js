const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const db = require("./dbconnection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "API V1 Ready to go", "Success", res);
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, result) => {
    if (err) throw err;
    response(200, result, "Success get all users", res);
  });
});

app.get("/users/:id", (req, res) => {
  const idToFind = req.params.id;
  const sql = `SELECT name FROM users WHERE id = ${idToFind}`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      response(404, result, "User not found", res);
    } else {
      response(200, result, "Success get user by id", res);
    }
  });
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;
  const sql = "INSERT INTO users (name, age) VALUES (?, ?)";
  db.query(sql, [name, age], (err, result) => {
    if (err) response(500, "invalid input", "Failed add new user", res);

    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
      };
      response(200, data, "Success add new user", res);
    }
  });
});

app.put("/users/:id", (req, res) => {
  const { name, age } = req.body;
  const updatedId = req.params.id;

  const selectSql = `SELECT name, age FROM users WHERE id = ?`;
  db.query(selectSql, [updatedId], (selectErr, selectResult) => {
    if (selectErr)
      return response(500, "Server error", "Failed to update user", res);

    if (selectResult[0].name === name && selectResult[0].age === age) {
      const data = {
        isSuccess: true,
        id: updatedId,
      };
      return response(200, data, "No changes made to user", res);
    }

    const updateSql = `UPDATE users SET name = ?, age = ? WHERE id = ?`;
    db.query(updateSql, [name, age, updatedId], (updateErr, updateResult) => {
      if (updateErr)
        return response(500, "Server error", "Failed to update user", res);

      const affectedRows = updateResult?.affectedRows;
      if (affectedRows) {
        const data = {
          isSuccess: true,
          id: updatedId,
        };
        response(200, data, "Success update user", res);
      } else {
        response(404, "User not found", "Failed to update user", res);
      }
    });
  });
});

app.delete("/users/", (req, res) => {
  const { updatedId } = req.body;

  // Check if user with given id exists in the database
  const selectSql = `SELECT id FROM users WHERE id = ?`;
  db.query(selectSql, [updatedId], (selectErr, selectResult) => {
    if (selectErr) {
      return response(500, "Server error", "Failed to delete user", res);
    }

    if (!selectResult.length) {
      return response(404, "User not found", "Failed to delete user", res);
    }

    // User with given id exists, so delete it
    const deleteSql = `DELETE FROM users WHERE id = ?`;
    db.query(deleteSql, [updatedId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        return response(500, "Server error", "Failed to delete user", res);
      } else {
        return response(
          200,
          deleteResult.affectedRows,
          "Success delete user",
          res
        );
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
