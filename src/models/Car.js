const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric"],
      required: true,
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    rentPerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    availabilityStatus: {
      type: Boolean,
      required: true,
      default: true,
    },
    carImage: String,
    description: String,
  },
  { timestamps: true }
);

carSchema.index({ carName: "text", brand: "text", model: "text", description: "text" });

module.exports = mongoose.model("Car", carSchema);
