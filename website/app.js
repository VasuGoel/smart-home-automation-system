const express = require("express"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      User = require("./models/user"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      nodemailer = require('nodemailer');
      
// Mongoose config
mongoose.connect("mongodb://localhost/auth", {useNewUrlParser: true});

// App config
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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


// ----------------------------------------------------------------------------------------

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
    // stop user from accessing another accounts if they're logged in or are loggin in
    if(req.params.username == req.user.username) {
        // render account page and pass the current user session details to template
        res.render("account", {user: req.user});
    } else {
        // if logged in user types the name of another user in address bar destroy their
        // session and redirect to login page
        req.session.destroy((err) => {
            if(err) {
                  console.error(err);
            }
            res.redirect("/account/login");
        });
    }
});


// ----------------------------------------------------------------------------------------
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


// ----------------------------------------------------------------------------------------

// Contact form submission route
app.post("/contact", (req, res) => {
      const name = req.body.cf_name;
    const output = `
        <p>Hello,<p>
        <p>You have a message from, ${req.body.cf_name}</p>
        <h3>Contact Details</h3>
        <ul>  
            <li>Name: ${req.body.cf_name}</li>
            <li>Email: ${req.body.cf_email}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.cf_message}</p>
    `
    
// create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: 'true',
        auth: {
            user: 'node.mailer.smtp@gmail.com', // could use generated ethereal user
            pass: 'nodemailertest123'  // could use generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
    });
      
// setup email data with unicode symbols
    let mailOptions = {
      from: `${name} <node.mailer.smtp@gmail.com>`, // sender address
      to: 'uautomate.com@gmail.com', // list of receivers
      subject: 'üAutomate Customer Feedback', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
          res.redirect('/contact/send');
    });
});

// render thank you page upon successful form submission
app.get("/contact/send", (req, res) => {
      res.render("messagesent");   
});

// ----------------------------------------------------------------------------------------

//The 404 Route
app.get('*', function(req, res){
  res.status(404).render('error404');
});

// ----------------------------------------------------------------------------------------

// Starts a UNIX socket and listens for connections on the given path
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("üAutomate server has started...");
});
