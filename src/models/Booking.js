const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      required: true,
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ car: 1, renter: 1, pickupDate: 1, returnDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
