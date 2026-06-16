const express = require("express");
const { body, param, query } = require("express-validator");
const carController = require("../controllers/carController");
const { authorize, protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get(
  "/",
  [
    query("available").optional().isBoolean(),
    query("seats").optional().isInt({ min: 1 }),
  ],
  validateRequest,
  carController.getCars
);

router.get("/my-cars", protect, authorize("owner", "admin"), carController.getMyCars);
router.get("/:id", [param("id").isMongoId()], validateRequest, carController.getCarById);

router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.single("carImage"),
  [
    body("carName").trim().notEmpty(),
    body("brand").trim().notEmpty(),
    body("model").trim().notEmpty(),
    body("vehicleNumber").trim().notEmpty(),
    body("fuelType").isIn(["petrol", "diesel", "electric"]),
    body("seatingCapacity").isInt({ min: 1 }),
    body("rentPerDay").isFloat({ min: 0 }),
    body("availabilityStatus").optional().isBoolean(),
  ],
  validateRequest,
  carController.createCar
);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.single("carImage"),
  [param("id").isMongoId(), body("fuelType").optional().isIn(["petrol", "diesel", "electric"])],
  validateRequest,
  carController.updateCar
);

router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  [param("id").isMongoId()],
  validateRequest,
  carController.deleteCar
);

module.exports = router;
