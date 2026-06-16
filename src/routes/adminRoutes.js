const express = require("express");
const { body, param } = require("express-validator");
const adminController = require("../controllers/adminController");
const { authorize, protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getUsers);
router.patch(
  "/users/:id/status",
  [param("id").isMongoId(), body("isActive").isBoolean()],
  validateRequest,
  adminController.updateUserStatus
);
router.put("/settings", adminController.upsertAdminSettings);
router.get("/reports", adminController.getReports);

module.exports = router;
