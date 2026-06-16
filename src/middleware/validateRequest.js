const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const error = new ApiError(400, "Validation failed");
  error.errors = result.array();
  return next(error);
}

module.exports = validateRequest;
