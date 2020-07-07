const AppError = require("./AppError")
function handlerProd(err, res) {
  return res.status(err.statusCode).json({
    status:err.status,
    message:err.message,
    code:err.statusCode
  });
}


function  handlerDev(err, res) {
  return res.status(err.statusCode).json({
    status:err.status,
    message:err.message
  })

}


module.exports = (err, req, res, next) =>  {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Failed";

  if (process.env.NODE_ENV === "development") {

    handlerDev(err, res);
  }

  if (process.env.NODE_ENV == "production") {
    if (err.code == 11000) err = new AppError("This Name is already exist please enter another name", 404);


    handlerProd(err, res);
  }

  next();
};
