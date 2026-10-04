const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");

dotenv.config();

const app = express();

// ===============================
// DATABASE
// ===============================
connectDB();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/billing", billingRoutes);

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital Management API is running",
  });
});

// ===============================
// TEST ROUTES
// ===============================
app.get("/api/patient-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Patient route is working",
  });
});

app.get("/api/appointment-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Appointment route is working",
  });
});

app.get("/api/billing-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Billing route is working",
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});