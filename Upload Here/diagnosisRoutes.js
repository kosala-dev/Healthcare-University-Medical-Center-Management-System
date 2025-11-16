const express = require("express");
const router = express.Router();
const Diagnosis = require("../models/diagnosis");
const Drug = require("../models/Drug");
const Notification = require("../models/Notification");

// Create new diagnosis
router.post("/", async (req, res) => {
  const { patientId, diagnosisText, drugs } = req.body;

  if (!patientId || !diagnosisText || !drugs || drugs.length === 0) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Update drug quantities
    for (let d of drugs) {
      const drug = await Drug.findById(d.drugId);
      if (!drug) return res.status(404).json({ error: `Drug not found: ${d.drugId}` });

      if (drug.quantity < d.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${drug.name}` });
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

    // Save diagnosis
    const newDiagnosis = await Diagnosis.create({
      patientId,
      diagnosisText,
      drugs,
      date: new Date(),
    });

    res.status(201).json({ success: true, diagnosis: newDiagnosis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all diagnoses for a patient
router.get("/patient/:id", async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({ patientId: req.params.id })
      .populate("drugs.drugId", "name dosage")
      .sort({ date: -1 });
    res.json(diagnoses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
