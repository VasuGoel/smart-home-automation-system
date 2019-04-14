const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      methodOverride = require("method-override"),
      
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose');
      

// App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Session config
app.use(require('express-session')({
    secret: "I think Vasu did a pretty good job with this project.",
    resave: false,
    saveUninitialized: false
}));

// Passport Auth config
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose Config
mongoose.connect("mongodb://localhost/uAutomate", {useNewUrlParser: true});
const User = require('./models/user');


// ------------------------------------------------------------------------

// RESTful Routes
// Index route
app.get("/", (req, res) => {
      res.render("index");
});

// Contact page route
app.get("/contact", (req, res) => {
      res.render("contact");   
});

// About page route
app.get("/about", (req, res) => {
      res.render("about");   
});


// Auth Routes
// /account redirects to login page
app.get("/account", (req, res) => {
      res.redirect("/account/login");   
});

// Login page route
app.get("/account/login", (req, res) => {
      res.render("login");   
});

// Signup page - New route
app.get("/account/signup", (req, res) => {
      res.render("signup");   
});

// Creating user POST route - Create route
app.post("/account", (req, res) => {
      res.send("User Signing up");
      const name = req.body.user.firstName + " " + req.body.user.lastName;
      console.log("Name: " + name);
      console.log("Username: " + req.body.user.userName);
      console.log("Email: "+ req.body.user.email);
      console.log("Password: " + req.body.user.password);
});

// User with username (from mongodb) account page - Show Route
app.get("/account/:username", (req, res) => {
      res.render("account");
});



// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("üAutomate server has started...");
});
