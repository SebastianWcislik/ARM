const express = require("express");
const mySql = require("mysql");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const connection = mySql.createPool({
  host: "eu-mm-dub-cb593a2aad08.g5.cleardb.net", // Adress to your database (localhost)
  port: 3306,
  user: "bcc403db2a704a", // Login to your database
  password: "52948415", // Password
  database: "heroku_ade82250053542c", // Name of used database
});

const app = express();

// Ustawienie limitu odpytań do 100 na 5 minut na każdego użytkownika
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message:
    "Osiągnięto limit odpytań do bazy danych, spróbuj ponownie za 5 minut",
});

// GET All Users from database
app.get("/users", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM users", function (error, results, fields) {
      if (error) throw error;

      res.send(results);
      res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
    });
  });
});

// GET All events
app.get("/events", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query("SELECT * FROM events", function (error, results, fields) {
      if (error) throw error;

      res.send(results);
      res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
    });
  });
});

// GET sepecific event by Id
app.get("/eventById", function (req, res) {
  connection.getConnection(function (err, connection) {
    var Id = req.query.Id;
    connection.query(
      "SELECT * FROM events WHERE Id=" + Id,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET users in events by eventId
app.get("/getUsersInEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var eventId = req.query.eventId;
    connection.query(
      "SELECT * FROM v_usersinevents WHERE EventId=" + eventId,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET add user to event
app.get("/addToEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var userId = req.query.userId;
    var eventId = req.query.eventId;
    connection.query(
      "Select f_addToEvent(" + userId + ", " + eventId + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET delete event
app.get("/deleteEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var eventId = req.query.eventId;
    connection.query(
      "Select f_deleteEvent(" + eventId + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET add event
app.get("/addEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var eventName = req.query.eventName;
    var eventLocalization = req.query.eventLocalization;
    var eventFrom = req.query.eventFrom;
    var eventTo = req.query.eventTo == "" ? null : req.query.eventTo;
    connection.query(
      "Select f_addEvent(" +
        eventName +
        "," +
        eventLocalization +
        "," +
        eventFrom +
        "," +
        eventTo +
        ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET specific user in event by email
app.get("/getUserInEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.Email;
    connection.query(
      "SELECT * FROM v_usersinevents WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET delete user from event
app.get("/deleteFromEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var Id = req.query.Id;
    connection.query(
      "Select f_deleteFromEvent(" + Id + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET Specific user's Id and Name by email
app.get("/userToLogin", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "SELECT Id, Name FROM users WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET Specific user's Name, Email and State by email
app.get("/getUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "SELECT Id, Name, Email, State FROM users WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET Specific user's Info by email
app.get("/getSelectedUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "SELECT * FROM v_userdetails WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET change user's state by email
app.get("/getUserState", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    var state = req.query.state;
    connection.query(
      "SELECT f_changeState(" + email + ", " + state + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET user's password by email
app.get("/getPassword", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    var pass = req.query.password;
    connection.query(
      "Select f_checkPassword(" + email + ", " + pass + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET change user's password by email
app.get("/setPassword", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    var pass = req.query.password;
    connection.query(
      "Select f_changePassword(" + email + ", " + pass + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET user's role by email
app.get("/getRoles", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "SELECT Name FROM v_usersroles WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET is there user
app.get("/isThereUser", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "Select f_checkIsThereUser(" + email + ") as result",
      function (error, results, fields) {
        if (error) throw error;

        res.send(results);
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

// GET create new user
app.get("/createUser", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    var pass = req.query.password;
    var name = req.query.name;
    var role = req.query.role;
    connection.query(
      "Select f_createUser(" +
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
        res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
      }
    );
  });
});

app.get("/sendMail", function (req, res) {
  var pass = req.query.password;
  var email = req.query.email;

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

app.use(limiter);

var PORT = process.env.PORT || 3000;
// Starting our server.
app.listen(PORT, () => {
  console.log("Server Running at " + PORT);
});
