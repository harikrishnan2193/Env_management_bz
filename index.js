require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");

require("./src/core/db/connection");

//Routs
const userRouts = require("./src/routes/userRouter");
const accessRouts = require("./src/routes/accessRouter");

const envServer = express();

envServer.set("view engine", "ejs");
envServer.use(express.static("public"));
// Express-session middleware
envServer.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
// Middlewar - flash
envServer.use(flash());
envServer.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Middleware to parse form data
envServer.use(bodyParser.urlencoded({ extended: true }));
// middleware to JSON body parsing
envServer.use(express.json());

//use Router
// envServer.use(authRouts)
envServer.use(userRouts);
envServer.use(accessRouts);

const PORT = process.env.PORT || 4000;

envServer.listen(PORT, () => {
  console.log(`Server running on port number: ${PORT}`);
});

envServer.get("/", (req, res) => {
  // res.send(`<h1>Server running successfully and ready to accept client request </h1>`)
  res.render("auth", { isRegisterPath: false });
});


// 404 handler
envServer.use((req, res, next) => {
  res.status(404).render('404');
});