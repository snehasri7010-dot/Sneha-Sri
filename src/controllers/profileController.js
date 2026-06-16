const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate(
    "user",
    "fullName username email mobileNumber role"
  );

  res.json({
    success: true,
    profile,
    user: req.user,
  });
});

exports.upsertMyProfile = asyncHandler(async (req, res) => {
  const {
    address,
    dateOfBirth,
    email,
    fullName,
    gender,
    mobileNumber,
    removeProfileImage,
    username,
  } = req.body;

  const duplicateUser = await User.findOne({
    _id: { $ne: req.user._id },
    $or: [{ email }, { username }],
  });

  if (duplicateUser) {
    throw new ApiError(409, "Email or username is already in use");
  }

  const payload = {
    address,
    dateOfBirth: dateOfBirth || undefined,
    email,
    fullName,
    gender: gender || undefined,
    mobileNumber,
    user: req.user._id,
  };

  const update = { $set: payload };

  if (req.file) {
    update.$set.profileImage = `/uploads/profiles/${req.file.filename}`;
  } else if (removeProfileImage === "true" || removeProfileImage === true) {
    update.$unset = { profileImage: "" };
  }

  if (!payload.dateOfBirth) {
    update.$unset = { ...(update.$unset || {}), dateOfBirth: "" };
    delete update.$set.dateOfBirth;
  }

  if (!payload.gender) {
    update.$unset = { ...(update.$unset || {}), gender: "" };
    delete update.$set.gender;
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    update,
    {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      fullName,
      mobileNumber,
      username,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  res.json({
    success: true,
    message: "Profile updated successfully",
    profile,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

exports.getProfileByUserId = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({
    user: req.params.userId,
  }).populate("user", "username role");

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  res.json({
    success: true,
    profile,
  });
});
