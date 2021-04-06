const express = require("express");
const mySql = require("mysql");
const nodemailer = require("nodemailer");

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

// GET Specific user's Info by email
app.get("/getSelectedUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    connection.query(
      "SELECT * FROM sys.v_userdetails WHERE Email=" + email,
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

// GET is there user
app.get("/isThereUser", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    connection.query(
      "Select sys.f_checkIsThereUser(" + email + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// GET create new user
app.get("/createUser", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.param("email");
    var pass = req.param("password");
    var name = req.param("name");
    var role = req.param("role");
    connection.query(
      "Select sys.f_createUser(" +
        email +
        ", " +
        name +
        ", " +
        pass +
        ", " +
        role +
        ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

app.get("/sendMail", function (req, res) {
  var pass = req.param("password");
  var email = req.param("email");

  // TODO: Ustawić poprawny email do wysyłania potwierdzeń
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
  });

  let info = transporter.sendMail({
    from: "", // TODO: wpisać poprawny adres do wysyłania maili
    to: email,
    subject: "Rejestracja Nowego Użytkownika",
    html:
      "<h1>Rejestracja użytkownika powiodła się</h1><br /><b>Zalogujesz się poprzez podanie swojego maila <br />Twoje tymczasowe hasło to: </b>" +
      pass, // TODO: Sprecyzować wiadomość
  });
});

// Starting our server.
app.listen(3000, () => {
  console.log("Server Running");
});
