const bookModel = require("../model/bookModel.js");
const catchAsync = require("../utilis/catchAsync");
const handlerController = require("./handlerController")
exports.uploadBook = handlerController.createOne(bookModel);
exports.getBooks = handlerController.getAll(bookModel);
exports.deleteBook = handlerController.deleteOne(bookModel);
exports.getBook = handlerController.getOne(bookModel);


exports.getBest = (req, res, next) => {
  if (!req.query)  {req.query = {}}

   req.query["ratingAverage"] = { gt: '4' }
   req.query["ratingNumbers"] = { gt: '10' }
   next();
} //GET BEST SELLER END POINT
