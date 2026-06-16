const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").trim().notEmpty(),
    body("username").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("mobileNumber").isNumeric(),
    body("password").isLength({ min: 6 }),
    body("confirmPassword").notEmpty(),
    body("role").isIn(["admin", "owner", "renter"]),
  ],
  validateRequest,
  authController.register
);

router.post(
  "/login",
  [body("emailOrUsername").trim().notEmpty(), body("password").notEmpty()],
  validateRequest,
  authController.login
);

router.get("/me", protect, authController.me);

module.exports = router;
