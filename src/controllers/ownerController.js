const asyncHandler = require("../utils/asyncHandler");
const Booking = require("../models/Booking");
const OwnerApproval = require("../models/OwnerApproval");

exports.getOwnerApprovals = asyncHandler(async (req, res) => {
  const approvals = await OwnerApproval.find({ owner: req.user._id })
    .populate("car")
    .populate({
      path: "booking",
      populate: [
        { path: "renter", select: "username email mobileNumber" },
        { path: "car" },
      ],
    });

  res.json({ success: true, count: approvals.length, approvals });
});

exports.getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .populate("car")
    .populate("renter", "username email mobileNumber");

  res.json({ success: true, count: bookings.length, bookings });
});
