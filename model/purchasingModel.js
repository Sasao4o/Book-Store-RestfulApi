const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
    user : {
        type:mongoose.Schema.ObjectId,
        required:[true, "You must be a user to commit purchase process"]
    },
    book : {
        type:mongoose.Schema.ObjectId,
        required:[true, "You must be a user to commit purchase process"]
    },
    price:{
        type:Number,
        required:[true, "item must have a price"]
    },
    paid:{
        type:Boolean,
        default:false
    }

});



const purchasingModel = mongoose.model("Purchasing", schema)