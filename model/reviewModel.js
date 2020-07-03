const mongoose = require("mongoose");
const bookModel = require("./bookModel")
const Schema = mongoose.Schema;
const schema = new Schema({
    review : {
        type:String,
        minlength:3,
        required:[true, "Please enter review"]
    },
    rating: {
        type:Number,
        min:0,
        max:5,
        required:[true, "Please enter a rating"]
    },

    Book:{
        type:mongoose.Schema.ObjectId,
        ref:"Book",
        required:[true, "The Review Must Belongs to a book"]
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        enum:[Date.now()]
    },
    updatedAt:Date




});

schema.statics.calcStats= async function(bookId) {
   const aggregatedStats = await this.aggregate([
    {$match: {Book: bookId}},
    {$group: {
        _id:"$Book",
        nRatings: {$sum : 1},
        nAv: {$avg:"$rating"}
    }}

   ]); 
 
   if (aggregatedStats.length == 0) {
        
    return await bookModel.findByIdAndUpdate({_id:bookId}, {ratingNumbers: 0, ratingAverage:4.5})
  
   }
const book = await bookModel.findByIdAndUpdate({_id:bookId}, {ratingNumbers: aggregatedStats[0].nRatings, ratingAverage:aggregatedStats[0].nAv})
   
}

// schema.pre("find", function(next) {
//     this.populate("Book");
//     next();
// });


//MIDDLEWARES

//PRE
schema.pre("findOneAndUpdate", function(next) {
    this.set({updatedAt : Date.now()})
    next();
});


//POST
schema.post("save", function (doc, next) {
    this.constructor.calcStats(this.Book);

next();
});

schema.post(/^findOneAnd/, function (doc, next) {
    if (doc) {
        doc.constructor.calcStats(doc.Book);
    }
        next();
        
});
const reviewModel = mongoose.model("Review", schema);

module.exports = reviewModel;