const Patient = require("../models/Patient");

// CREATE PATIENT
const createPatient = async (req, res) => {
  try {
    console.log("Patient request body:", req.body);

    const {
      name,
      email,
      phone,
      age,
      gender,
      address,
      bloodGroup,
      medicalHistory,
    } = req.body;

    if (!name || !phone || age === undefined || !gender) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, age and gender are required",
      });
    }

    const patient = await Patient.create({
      name,
      email,
      phone,
      age: Number(age),
      gender,
      address,
      bloodGroup,
      medicalHistory,
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    console.error("Create Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PATIENTS
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Get Patients Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PATIENT BY ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get Patient By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PATIENT
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PATIENT
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete Patient Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};