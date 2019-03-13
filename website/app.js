const express = require("express"),
      app = express(),
      bodyParser = require("body-parser");

// App Config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");