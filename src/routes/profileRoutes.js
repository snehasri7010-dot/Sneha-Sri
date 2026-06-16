const express = require("express");
const { body, param } = require("express-validator");
const profileController = require("../controllers/profileController");
const { authorize, protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);

// Get logged-in user's profile
router.get("/me", profileController.getMyProfile);

// Create / Update profile
router.put(
  "/me",
  upload.single("profileImage"),

  [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full Name is required"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("mobileNumber")
      .notEmpty()
      .withMessage("Mobile Number is required")
      .isNumeric()
      .withMessage("Mobile Number must contain only numbers"),

    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required"),

    body("gender")
      .optional({ checkFalsy: true })
      .trim()
      .toLowerCase()
      .isIn(["male", "female", "other", "prefer_not_to_say"])
      .withMessage(
        "Gender must be male, female, other, or prefer_not_to_say"
      ),

    body("dateOfBirth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Date of Birth must be a valid date"),
  ],

  validateRequest,
  profileController.upsertMyProfile
);

// Admin: Get profile by user ID
router.get(
  "/:userId",
  authorize("admin"),
  [
    param("userId")
      .isMongoId()
      .withMessage("Invalid User ID"),
  ],
  validateRequest,
  profileController.getProfileByUserId
);

module.exports = router;
