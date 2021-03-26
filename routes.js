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
    var username = req.param("username");
    connection.query(
      "SELECT Id, Name FROM users WHERE Name=" + username, // change to mail
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

////////////////////////////////////////

// const MySqlConnection = require("react-native-my-sql-connection");

// let config = {
//   host: "hostname",
//   database: "sys",
//   user: "admin",
//   password: "asdasdasd",
//   port: 3000,
// };

// const connection = MySqlConnection.createConnection(config);
// let res = connection.executeQuery("SELECT * FROM users");
// connection.close();
