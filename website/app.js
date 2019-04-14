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
      email: String,
      password: String
}); 

const User = mongoose.model("User", userSchema);


// RESTful Routes

// Index Route
app.get("/", (req, res) => {
      res.render("index");
});

// Contact Route
app.get("/contact", (req, res) => {
      res.render("contact");   
});

// About Route
app.get("/about", (req, res) => {
      res.render("about");   
});


// Login Route
app.get("/login", (req, res) => {
      res.render("login");   
});

// Signup Route
app.get("/signup", (req, res) => {
      res.render("signup");   
});

// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server has started...");
});
