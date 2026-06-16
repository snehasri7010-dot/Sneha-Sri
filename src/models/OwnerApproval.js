const mongoose = require("mongoose");

const ownerApprovalSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    comments: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerApproval", ownerApprovalSchema);
