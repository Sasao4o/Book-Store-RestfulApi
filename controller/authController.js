//NPM MODULES
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const salt = crypto.randomBytes(22).toString("hex")
const resetToken = crypto.createHash("sha256").update(salt).digest("hex")
 
 
//REQUIRING 
const userModel = require("../model/userModel");
const catchAsync = require("../utilis/catchAsync")
const AppError = require("../utilis/AppError")
 

//GENERATE AND SEND TOKEN SECTION
const sendEmail = require("../utilis/email");
const { reset } = require("nodemon");
const generateToken = (user) => {
    const token = jwt.sign({name:user.name, _id:user._id}, process.env.JWT_SECRET, {expiresIn: 2592000})
    return token;
}

const sendToken = (user, res, status) => {
    const token = generateToken(user);
    res.cookie("jwt", token, {secure:false, httpOnly:true, expires:new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)})
    return res.status(status).json({
        status:"sucess",
        message:`Welcome ${user.name} To Our website `,
        token
    })
}
//END 

exports.register = catchAsync(async (req, res, next) => {
    const user =  await userModel.create(req.body);
    sendToken(user, res, 202);
});

exports.login = catchAsync(async (req, res, next) => {
     
    const {email, password} = req.body
    if (!email, !password) return next(new AppError("Please Enter your email and password", 404));
    const user = await userModel.findOne({email}).select("+password");
     
    if (!user || !await user.checkPw(password, user.password)) return next(new AppError("Your email or pw is incorrect", 404))
 
    sendToken(user, res, 202);

});

exports.protect = catchAsync(async (req, res, next) => {
    const bearrerToken = req.get("Authorization");
    if (!bearrerToken || !bearrerToken.startsWith("Bearer")) return next(new AppError("Please Enter a correct token", 404))
    const token = bearrerToken.split("Bearer ")[1];
    const payload=  jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById({_id:payload._id}).select("+password");
    if (!user) return next(new AppError("This user is not on the system right now", 404));
    if (user.passwordUpdated) { 
    if (payload.iat * 1000 < new Date(user.passwordUpdatedAt).getTime()) return next(new AppError("Please Sign in again as ur password changed recently", 404))
    }
    req.user = user;
    next();  
});
 
exports.restrictedTo = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) return next(new AppError("Your forrbidden to enter that resource", 403));
        next();
    }
}

exports.forgetPw = catchAsync(async (req, res, next) => {
    const salt = crypto.randomBytes(22).toString("hex")
    const resetToken = crypto.createHash("sha256").update(salt).digest("hex")
    const {email} = req.body;
    if (!email) return next(new AppError("Please Enter Your Email",404));
    const user = await userModel.findOne({email})
    if (!user) return next(new AppError("Please Enter a correct email", 404));
    const url = `${req.protocol}://${req.hostname}:3000/resetPw/${salt}`
    const result = sendEmail({
        from:"SERVER",
        to:email,
        subject:"Reset Your Password Vertfication",
        text:"Please Enter The Following Link " + url + " If You Donot forget this pw please forget that message"
      });
      user.pwResetToken = resetToken;
      user.pwResetTokenExpire = Date.now() + 10 * 60 * 1000;
      user.save({validateBeforeSave:false});
     
      res.status(202).json({
          status:"sucess",
          message:"email sent"
      })
      
});


exports.resetPw = catchAsync(async (req, res, next) => {
    const {password, passwordConfirm} = req.body;
    const pwResetToken = req.params.token;
    const hashed = crypto.createHash("sha256").update(pwResetToken).digest("hex");
   
    const user = await userModel.findOne({pwResetToken:hashed, pwResetTokenExpire: {$gt: Date.now()}}).select("+password")
    if (!password || !passwordConfirm) return next(new AppError("Please enter your pw and pw confirmation", 404));
    
    if (!user) return next(new AppError("Please resend a pw reset token"))
    
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.pwResetToken = undefined;
    user.pwResetTokenExpire = undefined;
    await user.save();
   sendToken(user, res, 202)
})


exports.updatePw = catchAsync(async (req, res, next) => {
    const user = req.user;
    const {oldPassword, password, passwordConfirm} = req.body;
    if (!password || !passwordConfirm) return next(new AppError("Please Enter Your New Password And Password Confirm", 404))
    if (!oldPassword) return next(new AppError("Please Enter Your Old Password", 404));
    const result = await user.checkPw(oldPassword, user.password);
    if (!result) return next(new AppError("Please ENter a correct password", 404))
    user.password = password;
    user.passwordConfirm = password;
    await user.save();
    sendToken(user, res, 202);

});