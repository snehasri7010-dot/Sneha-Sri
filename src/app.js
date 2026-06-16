require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const carRoutes = require("./routes/carRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const profileRoutes = require("./routes/profileRoutes");
const renterRoutes = require("./routes/renterRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "Car Rental System API",
    modules: ["auth", "profiles", "cars", "owners", "renters", "bookings", "admin"],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/renters", renterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
