const Doctor = require("../models/Doctor");

// Create Doctor
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      experience,
      consultationFee,
      availableDays,
      status,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !specialization ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor with this email already exists",
      });
    }

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      experience: experience || 0,
      consultationFee,
      availableDays: availableDays || [],
      status: status || "Active",
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
};
