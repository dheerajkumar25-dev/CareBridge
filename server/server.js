// server.js
// Entry point: sets up Express, middleware, routes, and starts the server.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();

// ---- Global middleware ----
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

// ---- Routes ----
app.get("/api/health", (req, res) => res.json({ status: "CareBridge API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler for unknown routes
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler - must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CareBridge server running on port ${PORT}`));
