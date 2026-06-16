const express = require("express");
const { body, param } = require("express-validator");
const bookingController = require("../controllers/bookingController");
const { authorize, protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorize("renter", "admin"),
  [
    body("carId").isMongoId(),
    body("pickupDate").isISO8601(),
    body("returnDate").isISO8601(),
  ],
  validateRequest,
  bookingController.createBooking
);

router.get("/", bookingController.getBookings);

router.get(
  "/:id",
  [param("id").isMongoId()],
  validateRequest,
  bookingController.getBookingById
);

router.patch(
  "/:id/status",
  authorize("owner", "admin"),
  [
    param("id").isMongoId(),
    body("bookingStatus").isIn(["pending", "approved", "rejected", "cancelled", "completed"]),
    body("comments").optional().isString(),
  ],
  validateRequest,
  bookingController.updateBookingStatus
);

router.patch(
  "/:id/cancel",
  authorize("renter"),
  [param("id").isMongoId()],
  validateRequest,
  bookingController.cancelMyBooking
);

module.exports = router;
