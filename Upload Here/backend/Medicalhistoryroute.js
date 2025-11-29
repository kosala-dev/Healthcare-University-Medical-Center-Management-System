const express = require("express");
const router = express.Router();
const MedicalHistoryModel = require("../models/Medicalhistory");
const PatientModel = require("../models/patient");
const Drug = require("../models/drug"); // your drug model
const Notification = require("../models/Notification"); // optional for low-stock alert

// Add Medical History with diagnosis and drugs
router.post("/medical-history", async (req, res) => {
  try {
    const {
      regNo,
      bloodPressure,
      bloodSugar,
      weight,
      temperature,
      symptoms,
      diagnosis,
      visitDate,
      drugs, // [{ drugId, quantity }]
    } = req.body;

    // Validate fields
    if (
      !regNo ||
      !bloodPressure ||
      !bloodSugar ||
      !weight ||
      !temperature ||
      !symptoms||
      !diagnosis ||
      !visitDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if patient exists
    const patient = await PatientModel.findOne({ regnum: regNo });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Handle drugs
    if (!drugs || drugs.length === 0) {
      return res.status(400).json({ message: "At least one drug must be selected" });
    }

    for (let d of drugs) {
      const drug = await Drug.findById(d.drugId);
      if (!drug) return res.status(404).json({ message: `Drug not found: ${d.drugId}` });

      if (drug.quantity < d.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${drug.name}. Available: ${drug.quantity}` });
      }

      drug.quantity -= d.quantity;
      await drug.save();

      // Low stock notification
      if (drug.quantity < 100) {
        await Notification.create({
          message: `Low stock alert: ${drug.name} has only ${drug.quantity} items left.`,
          type: "low_stock",
          date: new Date(),
        });
      }
    }

    // Save medical history
    const medicalHistory = new MedicalHistoryModel({
      regNo,
      bloodPressure,
      bloodSugar,
      weight,
      temperature,
      symptoms,
      diagnosis,
      visitDate,
      drugs,
    });

    await medicalHistory.save();

    res.status(201).json({ message: "Medical history added successfully", medicalHistory });
  } catch (error) {
    console.error("Error adding medical history:", error);
    res.status(500).json({ message: "Failed to add medical history" });
  }
});

// Get all medical histories
router.get("/medical-history-get", async (req, res) => {
  try {
    const medicalHistory = await MedicalHistoryModel.find().populate("drugs.drugId");
    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch medical history" });
  }
});

// Get medical histories of a patient
router.get("/medical-history-user/:regNo", async (req, res) => {
  const { regNo } = req.params;

  try {
    const medicalHistories = await MedicalHistoryModel.find({ regNo }).populate("drugs.drugId");
    if (medicalHistories.length === 0) {
      return res.status(404).json({ message: "No medical histories found for this patient" });
    }
    res.status(200).json(medicalHistories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch medical histories" });
  }
});

module.exports = router;
