const reviewModel = require("../model/reviewModel.js");
const catchAsync = require("../utilis/catchAsync");
const handlerController = require("./handlerController")
exports.uploadReview = handlerController.createOne(reviewModel);
exports.getReviews = handlerController.getAll(reviewModel);
exports.deleteReview = handlerController.deleteOne(reviewModel);
exports.getReview = handlerController.getOne(reviewModel);
exports.updateReview = handlerController.updateOne(reviewModel);