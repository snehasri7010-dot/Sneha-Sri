const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication token required");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "User is not authorized");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission for this action"));
  }

  return next();
};

module.exports = { authorize, protect };
