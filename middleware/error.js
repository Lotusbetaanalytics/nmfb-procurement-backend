const {ErrorResponse, ErrorResponseJSON} = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to console for dev
  console.log(err);

  //Mongoose bad objectid
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  //mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplcate Field Entered";
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  return new ErrorResponseJSON(res, error.message || "Server Error", error.statusCode || 500)
};

module.exports = errorHandler;
