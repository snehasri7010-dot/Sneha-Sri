const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const OwnerApproval = require("../models/OwnerApproval");

function calculateDays(pickupDate, returnDate) {
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const ms = end.getTime() - start.getTime();

  if (Number.isNaN(ms) || ms <= 0) {
    throw new ApiError(400, "Return date must be after pickup date");
  }

  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

exports.createBooking = asyncHandler(async (req, res) => {
  const { carId, pickupDate, returnDate } = req.body;
  const car = await Car.findById(carId);

  if (!car) {
    throw new ApiError(404, "Car not found");
  }
  if (!car.availabilityStatus) {
    throw new ApiError(400, "Car is not available");
  }

  const days = calculateDays(pickupDate, returnDate);
  const booking = await Booking.create({
    car: car._id,
    renter: req.user._id,
    owner: car.owner,
    pickupDate,
    returnDate,
    totalAmount: days * car.rentPerDay,
  });

  await OwnerApproval.create({
    owner: car.owner,
    car: car._id,
    booking: booking._id,
    approvalStatus: "pending",
  });

  res.status(201).json({ success: true, booking });
});

exports.getBookings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "renter") {
    filter.renter = req.user._id;
  }
  if (req.user.role === "owner") {
    filter.owner = req.user._id;
  }

  const bookings = await Booking.find(filter)
    .populate("car")
    .populate("renter", "username email mobileNumber")
    .populate("owner", "username email mobileNumber");

  res.json({ success: true, count: bookings.length, bookings });
});

exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("car")
    .populate("renter", "username email mobileNumber")
    .populate("owner", "username email mobileNumber");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isRelated =
    req.user.role === "admin" ||
    String(booking.renter._id) === String(req.user._id) ||
    String(booking.owner._id) === String(req.user._id);

  if (!isRelated) {
    throw new ApiError(403, "You cannot view this booking");
  }

  res.json({ success: true, booking });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus, comments } = req.body;
  const booking = await Booking.findById(req.params.id).populate("car");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (req.user.role === "owner" && String(booking.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Only the owning user can approve or reject this booking");
  }

  booking.bookingStatus = bookingStatus;
  await booking.save();

  if (["approved", "rejected"].includes(bookingStatus)) {
    await OwnerApproval.findOneAndUpdate(
      { booking: booking._id },
      { approvalStatus: bookingStatus, comments },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }

  if (bookingStatus === "approved") {
    await Car.findByIdAndUpdate(booking.car._id, { availabilityStatus: false });
  }
  if (["rejected", "cancelled", "completed"].includes(bookingStatus)) {
    await Car.findByIdAndUpdate(booking.car._id, { availabilityStatus: true });
  }

  res.json({ success: true, booking });
});

exports.cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (String(booking.renter) !== String(req.user._id)) {
    throw new ApiError(403, "Only the renter can cancel this booking");
  }

  booking.bookingStatus = "cancelled";
  await booking.save();
  await Car.findByIdAndUpdate(booking.car, { availabilityStatus: true });

  res.json({ success: true, booking });
});
