const mongoose = require("mongoose");

const adminSettingSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userManagement: {
      type: String,
      required: true,
      default: "enabled",
    },
    carManagement: {
      type: String,
      required: true,
      default: "enabled",
    },
    carManagement: {
      type: String,
      required: true,
      default: "enabled",
    },
    reports: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSetting", adminSettingSchema);
