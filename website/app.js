/*global require*/
/*global process*/
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser");

// App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// RESTful Routes

// index route
app.get("/", (req, res) => {
      res.render("index");
});

// contact route
app.get("/contact", (req, res) => {
      res.render("contact");   
});

// dashboard route
app.get("/dashboard", (req, res) => {
      res.render("dashboard");   
});

// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server has started...");
});
