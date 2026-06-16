const express = require("express");
const { body } = require("express-validator");
const renterController = require("../controllers/renterController");
const { authorize, protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect, authorize("renter", "admin"));

router.post(
  "/search",
  [
    body("searchKeyword").optional().isString(),
    body("pickupDate").isISO8601(),
    body("returnDate").isISO8601(),
  ],
  validateRequest,
  renterController.searchCars
);

router.get("/searches", renterController.getMySearches);

module.exports = router;
