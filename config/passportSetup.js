
const passport = require("passport");
const userModel = require("../model/userModel");
const { reset } = require("nodemon");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(new GoogleStrategy({
    clientID:"779015728896-7bs51rgepj5n12b92ssgbf8nig69bcc2.apps.googleusercontent.com",
    clientSecret:"lUAg7zjoduLyugPO4W_qixYG",
    callbackURL:"/api/v1/auth/google/redirect"
    },  (accessToken, refreshToken, profile, done) => {
    //     const user = await userModel.findOne({googleId:profile.id});
 
    //     if (user) {
    // console.log(true);
    //     } else {
    //        await userModel.collection.insert({
    //         googleId:profile.id,
    //         name:profile["name"].givenName,
    //         position:"reader",
    //         role:"user",
    //         email:profile["_json"].email
    //        })

    //     }

        done(null, profile);
    }));
 passport.serializeUser((user, done) => {
  
    done(null, user.id);

});

 passport.deserializeUser((id, done) => {
  userModel.findOne({googleId: id}, (err, data) => {
  
    done(err, data)
  })
    
});