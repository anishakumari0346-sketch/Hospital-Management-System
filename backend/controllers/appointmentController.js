const Appointment = require("../models/Appointment");

// ==========================
// CREATE APPOINTMENT
// ==========================
const createAppointment = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointmentDate,
      reason,
      status,
    } = req.body;

    if (
      !patient ||
      !doctor ||
      !appointmentDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Patient, doctor, appointment date and reason are required",
      });
    }

    const appointment =
      await Appointment.create({
        patient,
        doctor,
        appointmentDate,
        reason,
        status: status || "Pending",
      });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Create Appointment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET ALL APPOINTMENTS
// ==========================
const getAppointments = async (req, res) => {
  try {
    const appointments =
      await Appointment.find()
        .populate("patient", "name phone")
        .populate(
          "doctor",
          "name specialization phone"
        )
        .sort({
          appointmentDate: -1,
        });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(
      "Get Appointments Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET SINGLE APPOINTMENT
// ==========================
const getAppointmentById = async (req, res) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      )
        .populate("patient", "name phone")
        .populate(
          "doctor",
          "name specialization phone"
        );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(
      "Get Appointment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE APPOINTMENT
// ==========================
const updateAppointment = async (req, res) => {
  try {
    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("patient", "name phone")
        .populate(
          "doctor",
          "name specialization phone"
        );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Update Appointment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// DELETE APPOINTMENT
// ==========================
const deleteAppointment = async (req, res) => {
  try {
    const appointment =
      await Appointment.findByIdAndDelete(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Appointment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Appointment Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
