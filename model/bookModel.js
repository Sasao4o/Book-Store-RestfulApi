const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
  name : {
    type:String,
    required:[true, "You Must Enter a Book Name"],
    unique:true
  },
  price:{
    type:Number,
    required:[true, "You Must Enter a Price"]
  },
  category: {
    type:String,
    required:[true, "You Must Enter a Category"],
    enum:{
      values:["religious", "drama", "science-fiction", "romantic", "other"],
      message:"Please Enter a Suitable Category"
    }
  },
  links:[],
  ratingAverage:{
    type:Number,
    default:4.5
  },
  ratingNumbers:{
    type:Number,
    default:0
  },
  publishedAt:{
    type:Date,
    default:Date.now(),
    enum:[Date.now()]
  },
 authors:[
  {
    type:mongoose.Schema.ObjectId,
    ref:"User"
  }
 ]

},
{
toJSON:{virtuals:true}
});


//Middlewares
//QUERY

//PRE MIDDLEWARE
schema.pre("find", function () {
  this.populate({
    path:"authors",
    select:"-position"
  });
})

//POST MIDDLEWARE

  //TEST
  

//HATEOS IMPLEMENTATION
schema.post("find", function(doc, next) {
  if (!!doc) {
  doc.forEach(v => v.links = {
    rel:"Self",
    href:"http://localhost:3000/api/v1/book/" + v._id
  });
}
    next();
  });
schema.post("findOne", function(doc, next) {
  if (doc) {
  doc.links = [
    {
      ref:"Delete Book",
      href:`http://localhost:3000/api/v1/book/${doc._id}`
    },
    {
      ref:"Update Book",
      href:`http://localhost:3000/api/v1/book`
    },
    {
      ref:"Create Book",
      href:"http://localhost:3000/api/v1/book"
    }
  ]
}

    next();
  });

//SAVE HOOK

//PRE MIDDLEWARE


//POST MIDDLEWARE

const schemaModel = mongoose.model("Book", schema);
 
// console.log(x.select("_id"));
// console.log(x.projection());
// x.projection("name");    PROJECTION v s Select
// console.log(x.projection());
 
module.exports = schemaModel;
