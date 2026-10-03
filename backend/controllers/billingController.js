const Billing = require("../models/Billing");

// ==========================
// CREATE BILL
// ==========================
const createBilling = async (req, res) => {
  try {
    const {
      patient,
      appointment,
      consultationFee,
      medicineCharges,
      testCharges,
      otherCharges,
      totalAmount,
      paymentStatus,
      paymentMethod,
    } = req.body;

    if (!patient || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Patient and total amount are required",
      });
    }

    const billing = await Billing.create({
      patient,
      appointment,
      consultationFee:
        consultationFee || 0,
      medicineCharges:
        medicineCharges || 0,
      testCharges: testCharges || 0,
      otherCharges: otherCharges || 0,
      totalAmount,
      paymentStatus:
        paymentStatus || "Pending",
      paymentMethod:
        paymentMethod || "Cash",
    });

    res.status(201).json({
      success: true,
      message: "Billing created successfully",
      billing,
    });
  } catch (error) {
    console.error(
      "Create Billing Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET ALL BILLING
// ==========================
const getBillings = async (req, res) => {
  try {
    const billings =
      await Billing.find()
        .populate("patient", "name phone")
        .populate(
          "appointment",
          "appointmentDate reason status"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      billings,
    });
  } catch (error) {
    console.error(
      "Get Billing Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET SINGLE BILL
// ==========================
const getBillingById = async (req, res) => {
  try {
    const billing =
      await Billing.findById(req.params.id)
        .populate("patient", "name phone")
        .populate(
          "appointment",
          "appointmentDate reason status"
        );

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing not found",
      });
    }

    res.status(200).json({
      success: true,
      billing,
    });
  } catch (error) {
    console.error(
      "Get Billing By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE BILL
// ==========================
const updateBilling = async (req, res) => {
  try {
    const billing =
      await Billing.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("patient", "name phone")
        .populate(
          "appointment",
          "appointmentDate reason status"
        );

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Billing updated successfully",
      billing,
    });
  } catch (error) {
    console.error(
      "Update Billing Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// DELETE BILL
// ==========================
const deleteBilling = async (req, res) => {
  try {
    const billing =
      await Billing.findByIdAndDelete(
        req.params.id
      );

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Billing deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Billing Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
};
