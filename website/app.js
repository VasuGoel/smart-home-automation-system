const express = require("express"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      User = require("./models/user"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose");
      
// Mongoose config
mongoose.connect("mongodb://localhost/auth", {useNewUrlParser: true});

// App config
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "Vasu is actually pretty frickin funny",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport config
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
            name: req.body.firstname + " " + req.body.lastname,
            username: req.body.username,
            email: req.body.email
      });
      User.register(newUser, req.body.password, (err, user) => {
            if(err) {
                console.log(err);
                return res.render('signup');
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect("/" + req.body.username);
            });
      });
});

// Login page route
app.get("/account/login", (req, res) => {
      res.render("login");   
});

// Logging in logic
// middleware pass.authenticate runs after call to /account/login and before (req, res)
app.post("/account/login", passport.authenticate("local", {
    //   successRedirect: "/user",
      failureRedirect: "/account/login"
}), (req, res) => {
       res.redirect("/" + req.body.username);
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


// Contact fomr submission


// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("üAutomate server has started...");
});
