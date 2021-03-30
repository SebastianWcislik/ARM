const express = require("express");
const mySql = require("mysql");

const connection = mySql.createPool({
  host: "localhost", // Adress to your database (localhost)
  user: "admin", // Login to your database
  password: "asdasdasd", // Password
  database: "sys", // Name of used database
});

const app = express();

// GET All Users from database
app.get("/users", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM users", function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    });
  });
});

// GET Specific user's Id and Name by email
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

// GET Specific user's Name, Email and State by email
app.get("/getUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    connection.query(
      "SELECT Name, Email, State FROM users WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// GET change user's state by email
app.get("/getUserState", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    var state = req.param("state");
    connection.query(
      "SELECT sys.f_changeState(" + email + ", " + state + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// GET user's password by email
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

// GET change user's password by email
app.get("/setPassword", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    var pass = req.param("password");
    connection.query(
      "Select sys.f_changePassword(" + email + ", " + pass + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// GET user's role by email
app.get("/getRoles", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    connection.query(
      "SELECT Name FROM sys.v_usersroles WHERE Email=" + email,
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
