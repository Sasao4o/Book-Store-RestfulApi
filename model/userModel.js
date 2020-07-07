const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const schema = new Schema({
    name :{
        type:String,
        required:[true, "You Must Enter a name"],
        unique:true
    },
    email:{
        unique:true,
        type:String,
        required:[true, "You Must Enter an email address"],
        trim:true,
        lowercase:true,
        validate:{
            validator:validator.isEmail, //Note b2 an l function deh feha automatic parameter l str w da fl mkan da l hwa validator: by4el ll email lazm note 7lwa ha
            message:"Please Enter a valid email address"
          }

    },
    password:{
        type:String,
        required:[true, "You Must Enter a password"],
        
        minlength:8,
        select:false
        
    },
    passwordConfirm:{
        type:String,
        required:[true, "You Must Enter a password confirmation"],
        validate: {
            validator: function (confirmation) {
               
                return confirmation == this.password
            },
            message:"Wrong Password Confirmation. Please Try Again...."
        }
    },
    passwordUpdated:Boolean,
    passwordUpdatedAt:Date,
    position:{
        type:String,
        enum:{
            values:["reader", "author"],
            message:"You Must Enter READER, AUTHOR"
        },
        lowercase:true,
        required:[true, "Please enter your position"]
    },
    books:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Book"
        }
    ],
    role: {
        type:String,
        enum:["admin", "user"],
        required:[true, "You must enter a role"]
    },
    pwResetToken:{
        type:String
    },
    pwResetTokenExpire :{
        type:Date
    },
    multiFactorAuth:{
        type:Boolean,
        default:false
    },
    secret : {
        type:String
    },
    tempSecret : String



});

//SCHEMA LEVEL METHODS

schema.methods.checkPw = async function (plainPw, hashedPw) {
    return await bcrypt.compare(plainPw, hashedPw);
}
//PRE MIDDLEWARES
schema.pre("save", function (next) {
    
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordUpdatedAt = Date.now();
    this.passwordUpdated = true;
    next()
});
schema.pre("save", function () {
    if (!this.isModified("password")) return;
    const salt = bcrypt.genSaltSync(8);
    const hashedPw = bcrypt.hashSync(this.password, salt)
    this.password = hashedPw;
    this.passwordConfirm = undefined;
}) 


const userModel = mongoose.model("User", schema);


module.exports = userModel;