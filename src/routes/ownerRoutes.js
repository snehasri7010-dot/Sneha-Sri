const express = require("express");
const ownerController = require("../controllers/ownerController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("owner", "admin"));

router.get("/approvals", ownerController.getOwnerApprovals);
router.get("/bookings", ownerController.getOwnerBookings);

module.exports = router;
