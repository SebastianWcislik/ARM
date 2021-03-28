const express = require("express");
const mySql = require("mysql");

const connection = mySql.createPool({
  host: "localhost", // Your connection adress (localhost).
  user: "admin", // Your database's username.
  password: "asdasdasd", // Your database's password.
  database: "sys", // Your database's name.
});

const app = express();

// Creating a GET route that returns data from the 'users' table.
app.get("/users", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM users", function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    });
  });
});

app.get("/userToLogin", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    connection.query(
      "SELECT Id, Name FROM users WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

app.get("/getUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    connection.query(
      "SELECT Name, Email FROM users WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

app.get("/getPassword", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    var pass = req.param("password");
    connection.query(
      "Select sys.f_checkPassword(" + email + ", " + pass + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// Starting our server.
app.listen(3000, () => {
  console.log("Server Running");
});
