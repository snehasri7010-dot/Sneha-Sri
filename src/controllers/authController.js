const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const signToken = require("../utils/token");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.register = asyncHandler(async (req, res) => {
  const { username, email, mobileNumber, password, confirmPassword, role, fullName, address } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const user = await User.create({ fullName, username, email, mobileNumber, password, role });

  if (fullName && address) {
    await Profile.create({
      user: user._id,
      fullName,
      email,
      mobileNumber,
      address,
    });
  }


  res.status(201).json({
    success: true,
    token: signToken(user),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
    },
  });
});


exports.me = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({ success: true, user: req.user, profile });
});
exports.login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  console.log("Login Request:", {
    emailOrUsername,
    password,
  });

  const user = await User.findOne({
    $or: [
      { email: emailOrUsername?.toLowerCase() },
      { username: emailOrUsername },
    ],
  }).select("+password");

  console.log("User Found:", user);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const match = await user.comparePassword(password);

  console.log("Password Match:", match);

  if (!match) {
    throw new ApiError(401, "Invalid password");
  }

  res.json({
    success: true,
    token: signToken(user),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
    },
  });
});