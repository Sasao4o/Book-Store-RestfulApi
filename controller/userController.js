const userModel = require("../model/userModel");
const catchAsync = require("../utilis/catchAsync");
const handlerController = require("./handlerController")

exports.createUser = handlerController.createOne(userModel);
exports.getUser = handlerController.getAll(userModel);