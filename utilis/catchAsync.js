function catchAsync(fn) {
return (req, res, next) => {
fn(req, res, next).catch(v => { next(v)});
}
}
module.exports = catchAsync;
