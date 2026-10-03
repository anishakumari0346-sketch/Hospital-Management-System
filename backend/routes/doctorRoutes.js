const express = require("express");

const {
  createDoctor,
  getDoctors,
} = require("../controllers/doctorController");

const router = express.Router();

router.post("/", createDoctor);
router.get("/", getDoctors);

module.exports = router;
