const asyncHandler = require("../utils/asyncHandler");
const Car = require("../models/Car");
const RenterSearch = require("../models/RenterSearch");

exports.searchCars = asyncHandler(async (req, res) => {
  const { searchKeyword, pickupDate, returnDate } = req.body;

  const renterSearch = await RenterSearch.create({
    renter: req.user._id,
    searchKeyword,
    pickupDate,
    returnDate,
    bookingStatus: "searching",
  });

  const filter = { availabilityStatus: true };
  if (searchKeyword) {
    filter.$text = { $search: searchKeyword };
  }

  const cars = await Car.find(filter).populate("owner", "username email mobileNumber");

  res.status(201).json({
    success: true,
    renterSearch,
    count: cars.length,
    cars,
  });
});

exports.getMySearches = asyncHandler(async (req, res) => {
  const searches = await RenterSearch.find({ renter: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: searches.length, searches });
});
