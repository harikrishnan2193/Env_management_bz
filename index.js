require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const { logError } = require("./errorLogger");

// Database connection
require("./src/core/db/connection");

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

// Flash middleware
envServer.use(flash());
envServer.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Middleware to parse form data
envServer.use(bodyParser.urlencoded({ extended: true }));
envServer.use(express.json());

// Routes
const userRoutes = require("./src/routes/userRouter");
const accessRoutes = require("./src/routes/accessRouter");

envServer.use(userRoutes);
envServer.use(accessRoutes);

const PORT = process.env.PORT || 4000;

envServer.listen(PORT, () => {
  console.log(`Server running on port number: ${PORT}`);
});

// Home route
envServer.get("/", (req, res) => {
  res.render("auth", { isRegisterPath: false });
});

// 404 error handler
envServer.use((req, res, next) => {
  const error = "Page not found";
  logError(error, req.url);
  res.status(404).render("404");
});

// General error handler
envServer.use((err, req, res, next) => {
  console.error(err.stack);
  logError(err.message, req.url);
  res.status(500).send("Something went wrong!");
});
