const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
