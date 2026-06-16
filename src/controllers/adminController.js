const asyncHandler = require("../utils/asyncHandler");
const AdminSetting = require("../models/AdminSetting");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.getDashboard = asyncHandler(async (req, res) => {
  const [users, owners, renters, cars, bookings, pendingBookings, approvedBookings] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "owner" }),
    User.countDocuments({ role: "renter" }),
    Car.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ bookingStatus: "pending" }),
    Booking.countDocuments({ bookingStatus: "approved" }),
  ]);

  res.json({
    success: true,
    dashboard: {
      users,
      owners,
      renters,
      cars,
      bookings,
      pendingBookings,
      approvedBookings,
    },
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  const profiles = await Profile.find({ user: { $in: users.map((user) => user._id) } });
  const profilesByUser = new Map(profiles.map((profile) => [String(profile.user), profile]));
  const enrichedUsers = users.map((user) => {
    const profile = profilesByUser.get(String(user._id));
    return {
      ...user.toObject(),
      profile,
      address: profile?.address || "",
      profileImage: profile?.profileImage || "",
    };
  });

  res.json({ success: true, count: enrichedUsers.length, users: enrichedUsers });
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true, runValidators: true }
  ).select("-password");

  res.json({ success: true, user });
});

exports.upsertAdminSettings = asyncHandler(async (req, res) => {
  const settings = await AdminSetting.findOneAndUpdate(
    { admin: req.user._id },
    { ...req.body, admin: req.user._id },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, settings });
});

exports.getReports = asyncHandler(async (req, res) => {
  const bookingsByStatus = await Booking.aggregate([
    { $group: { _id: "$bookingStatus", count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
    { $sort: { _id: 1 } },
  ]);

  const carsByFuelType = await Car.aggregate([
    { $group: { _id: "$fuelType", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    reports: {
      bookingsByStatus,
      carsByFuelType,
    },
  });
});
