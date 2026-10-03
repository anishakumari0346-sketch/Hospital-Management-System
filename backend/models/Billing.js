const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    medicineCharges: {
      type: Number,
      default: 0,
    },

    testCharges: {
      type: Number,
      default: 0,
    },

    otherCharges: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partial"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Online"],
      default: "Cash",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Billing", billingSchema);
