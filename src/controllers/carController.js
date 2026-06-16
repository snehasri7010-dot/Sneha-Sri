const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const Car = require("../models/Car");

exports.createCar = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    owner: req.user._id,
  };

  if (req.file) {
    payload.carImage = `/uploads/cars/${req.file.filename}`;
  }

  const car = await Car.create(payload);
  res.status(201).json({ success: true, car });
});

exports.getCars = asyncHandler(async (req, res) => {
  const { keyword, brand, fuelType, seats, available } = req.query;
  const filter = {};

  if (keyword) {
    filter.$text = { $search: keyword };
  }
  if (brand) {
    filter.brand = new RegExp(brand, "i");
  }
  if (fuelType) {
    filter.fuelType = fuelType;
  }
  if (seats) {
    filter.seatingCapacity = { $gte: Number(seats) };
  }
  if (available !== undefined) {
    filter.availabilityStatus = available === "true";
  }

  const cars = await Car.find(filter).populate("owner", "username email mobileNumber");
  res.json({ success: true, count: cars.length, cars });
});

exports.getMyCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ owner: req.user._id });
  res.json({ success: true, count: cars.length, cars });
});

exports.getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate("owner", "username email mobileNumber");
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  res.json({ success: true, car });
});

exports.updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  if (String(car.owner) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "Only the owner or admin can update this car");
  }

  const payload = { ...req.body };
  if (req.file) {
    payload.carImage = `/uploads/cars/${req.file.filename}`;
  }

  const updatedCar = await Car.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, car: updatedCar });
});

exports.deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  if (String(car.owner) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "Only the owner or admin can delete this car");
  }

  await car.deleteOne();
  res.json({ success: true, message: "Car deleted" });
});
