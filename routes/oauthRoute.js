            //oAuth 2.0 Using Passport.js
//api/v1/auth
const passport = require("passport");
const oauthController = require("../controller/oauthController")
const authController = require("../controller/authController");
const passportSetup = require("../config/passportSetup");
 

const router = require("express").Router();
    
    router.route("/google/login").get(passport.authenticate("google", {
    scope:["profile", "email"]
    }));
    //api/v1/auth/google/redirect
    router.use("/google/redirect", passport.authenticate("google") , (req, res, next) => {
   
    res.redirect("/api/v1/auth/redirect")
    })
    router.use("/redirect", (req, res, next) => {
       const token = authController.generateToken(req.user)
       res.cookie("jwt", token, {secure:false, httpOnly:true, expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)})
       
        res.header('Authorization', `Bearer ${token}`);


        res.redirect("/api/v1/book")
    })
module.exports = router;