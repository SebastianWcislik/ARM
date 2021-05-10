const express = require("express");
const mySql = require("mysql");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const bodyparser = require("body-parser");

const connection = mySql.createPool({
  host: "db-mysql-fra1-95681-do-user-9198283-0.b.db.ondigitalocean.com", // Adress to your database (localhost)
  port: 25060,
  user: "admin", // Login to your database
  password: "fggzx7yiy1s3ht1m", // Password
  database: "defaultdb", // Name of used database
});

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

// Parse request of content-type - application/json
app.use(bodyparser.json());

// Ustawienie limitu odpytań do 100 na 5 minut na każdego użytkownika
const limiter = rateLimit({
  windowMs: 1,
  max: 100,
  message:
    "Osiągnięto limit odpytań do bazy danych, spróbuj ponownie za 5 minut",
  handler: function handler(req, res) {
    logger.log("osiągnięto maksymalną ilość zapytań");
    logger.log(res);
  },
});

// GET All Users from database
app.get("/users", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query(
      "SELECT Name, State, Email FROM users",
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) res.status(200).send(results);
      }
    );
  });
});

// GET All events
app.get("/events", function (req, res) {
  connection.getConnection(function (err, connection) {
    connection.query(
      "SELECT Name, DateFrom, DateTo FROM events",
      function (error, results, fields) {
        if (error) throw error;

        res.status(200).send(results);
      }
    );
  });
});

// GET sepecific event by Id
app.get("/eventById", function (req, res) {
  connection.getConnection(function (err, connection) {
    var Id = req.query.Id;
    connection.query(
      "SELECT Name, DateFrom, DateTo, Localization FROM events WHERE Id=" + Id,
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) res.status(200).send(results);
      }
    );
  });
});

// GET users in events by eventId
app.get("/getUsersInEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var eventId = req.query.eventId;
    connection.query(
      "SELECT UserName, Email FROM v_usersinevents WHERE EventId=" + eventId,
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
      }
    );
  });
});

// GET specific user in event by email
app.get("/getUserInEvent", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.Email;
    connection.query(
      "SELECT Id FROM v_usersinevents WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
      }
    );
  });
});

// GET Specific user's Id and Name by email
// app.get("/userToLogin", function (req, res) {
//   connection.getConnection(function (err, connection) {
//     var email = req.query.email;
//     connection.query(
//       "SELECT Id, Name FROM users WHERE Email=" + email,
//       function (error, results, fields) {
//         if (error) throw error;

//         res.status(200).send(results);
//       }
//     );
//   });
// });

// GET Specific user's Name, Email and State by email
app.get("/getUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "SELECT Id, Name, Email, State FROM users WHERE Email=" + email,
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) res.status(200).send(results);
      }
    );
  });
});

// GET Specific user's Info by email
app.get("/getSelectedUserInfo", function (req, res) {
  connection.getConnection(function (err, connection) {
    var email = req.query.email;
    connection.query(
      "SELECT Name, State, RoleName, Email FROM v_userdetails WHERE Email=" +
        email,
      function (error, results, fields) {
        if (error) throw error;

        res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

        if (results.length > 0) res.status(200).send(results);
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

// Error Handling
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500; // Sets a generic server error status code if none is part of the err

  if (err.shouldRedirect) {
    //res.render() // Renders a myErrorPage.html for the user
  } else {
    res.status(err.statusCode).send(err.message); // If shouldRedirect is not defined in our error, sends our original err data
  }
});

app.get("*", function (req, res, next) {
  let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); // Tells us which IP tried to reach a particular URL
  err.statusCode = 404;
  err.shouldRedirect = true; //New property on err so that our middleware will redirect
  next(err);
});

app.use(limiter);

var PORT = process.env.PORT || 3000;
// Starting our server.
app.listen(PORT, () => {
  console.log("Server Running at " + PORT);
});
