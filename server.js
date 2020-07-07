//NODE JS CORE MODULES
const path = require("path");
//MODULES
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({path: path.join(process.cwd(), "/config.env")});
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
//owasp middlewares 
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require('express-mongo-sanitize');
//end owasp middlewares 

//end modules
//ERROR MIDDLEWARE
const errorHandler = require(path.join(__dirname, "utilis", "errorHandler"));
//END ERROR MIDDLEWARE

//Route Modules
const bookRoute = require(path.join(__dirname, "routes", "bookRoute"));
const reviewRoute = require(path.join(__dirname, "routes", "reviewRoute"));
const userRoute = require(path.join(__dirname, "routes", "userRoute"));
const oauthRoute = require(path.join(__dirname, "routes", "oauthRoute"));

//End Of Our 3RD PARTY MODULES

//ROUTE MODELS
const bookModel = require(path.join(__dirname, "model", "bookModel"));


//END OF MODELS OF ROUTE
//Connect To The Database
const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSSWORD);

mongoose.connect(DB, { useNewUrlParser: true ,useUnifiedTopology: true})
  .then(v => console.log("Connected To Mongo Db......"))
  .catch(v => console.log("Error Happend Due To Connection of Database"))
//End Connection Of Database

const app = express();

//Middlewares
// _______________________________
//Middleware of packages
app.use(cookieParser())
app.use(cookieSession({
    name:"oauthToken",
    keys:["secretCookie"],
    maxAge: 1000000
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(bodyParser.json({limit:"60kb", inflated:false}));
//XSS-CLEAN && mongoSantize Must Come After Body Parser
app.use(xss());
app.use(mongoSanitize());


//Routes MiddleWare 
 app.use("/api/v1/auth", oauthRoute);
 app.use("/api/v1/user", userRoute);
 app.use("/api/v1/book", bookRoute);
 app.use("/api/v1/review", reviewRoute);
 
 
//__________________________________

//Error Middleware
app.use(errorHandler);

app.listen(3000, (err, data) => {
  console.log("Listenning");
})
