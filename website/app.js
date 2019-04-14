const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      methodOverride = require("method-override"),
      User = require('./models/user'),
      
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose');
      

// App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Mongoose Config
mongoose.connect("mongodb://localhost/uAutomate", {useNewUrlParser: true});

// Session config
app.use(require('express-session')({
    secret: "I think Vasu did a pretty good job with this project.",
    resave: false,
    saveUninitialized: false
}));

// Passport Auth config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

// User (stored in mongodb) account page - Show Route
// isLoggedIn is a middleware function at the bottom to check if user is still logged in
app.get("/:username", isLoggedIn, (req, res) => {
      res.render("account", {username: req.params.username});
});


// Auth Routes

// Signup page - New route
app.get("/account/signup", (req, res) => {
      res.render("signup");   
});

// Creating user - Create route
// After creation redirect user to account page
app.post("/account", (req, res) => {
      const newUser = new User({
            // name: req.body.user.firstname + " " + req.body.user.lastname,
            username: req.body.user.username,
            // email: req.body.user.email
      });
      User.register(newUser, req.body.user.password, (err, user) => {
            if(err) {
                  console.log(err);
                  res.render("signup");
            }
            res.redirect("/account/login");
            // passport.authenticate("local")(req, res, () => {
            //       res.send(req.body.user.username);
            //       // res.redirect("/" + req.body.user.username);   
            // });
      });
});

// Login page route
app.get("/account/login", (req, res) => {
      res.render("login");   
});

// Logging in logic
// middleware pass.authenticate runs after call to /account/login and before (req, res)
app.post("/account/login", passport.authenticate("local", {
      // For testing pusposes only
      successRedirect: "/user",
      failureRedirect: "/account/login"
}), (req, res) => {
      
});

// Logout route
app.get("/account/logout", (req, res) => {
      req.session.destroy((err) => {
            if(err) {
                  console.error(err);
            }
            res.redirect('/');
      });
});



// Middleware function isLoggedIn() to check if user is still authenticated
function isLoggedIn(req, res, next) {
      if(req.isAuthenticated()) {
            return next();
      }
      res.redirect("/account/login");
}


// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("üAutomate server has started...");
});
