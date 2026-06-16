const mongoose = require("mongoose");

const renterSearchSchema = new mongoose.Schema(
  {
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    searchKeyword: String,
    pickupDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["searching", "pending", "approved", "rejected", "cancelled", "completed"],
      required: true,
      default: "searching",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RenterSearch", renterSearchSchema);
