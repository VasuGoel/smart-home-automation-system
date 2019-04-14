const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      methodOverride = require("method-override");

// App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Mongoose Config/ userSchema/ User Model
mongoose.connect("mongodb://localhost/uAutomate", {useNewUrlParser: true});

const userSchema = mongoose.Schema({
      name: String,
      username: String,
      email: String,
      password: String
}); 

const User = mongoose.model("User", userSchema);


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

// User with id (mongodb _id) account page - Show Route
app.get("/account/:id", (req, res) => {
      res.send(req.params.id + " Account Page"); 
});



// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("üAutomate server has started...");
});
