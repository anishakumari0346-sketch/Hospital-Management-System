const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const router = express.Router();

router.post("/", createPatient);

router.get("/", getPatients);

router.get("/:id", getPatientById);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

module.exports = router;