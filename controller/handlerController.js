const catchAsync = require("../utilis/catchAsync");
const AppError = require("../utilis/AppError");
const ApiFeatures = require("../utilis/ApiFeatures");
exports.createOne = Model => {
  return catchAsync(async (req, res, next) => {

  const data = await Model.create(req.body);

  res.status(202).json({
    status:"Sucess",
    data

  });
});
}
exports.getAll = Model => {
return catchAsync(async (req, res, next) => {
  console.log(req.user);
 
 
const data = new ApiFeatures(Model.find({}), req.query).filter().sort().paginate().field();

const result = await data.query;
//Res.stauts(204) L Process sucess bs No JSON TO BE SENT TO THE CLIENT (NOT VERY GOOD HERE);
res.status(202).json({
  status:"sucess",
  result
})

});
}
exports.deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) return next(new AppError("Please Enter a Valid data Id", 404))
      res.status(202).json({
        status:"Sucess",
        message:"data has been deleted"
      });
  });

}
exports.getOne = Model => {
  return catchAsync(async (req, res, next) => {
      const data = await Model.findById(req.params.id);
      if (!data) return next(new AppError("Please Enter a Valid data Id", 404))
      res.status(202).json({
        status:"Sucess",

        data
      });
  });

}

exports.updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(202).json({
        status:"sucess",
        data
    })

});
}

/*
Best practice bdl l data t3rf azay t7ot book aw review aw ka haza

*/
