const express = require("express");
const router = express.Router();
const MedicalHistoryModel = require("../models/Medicalhistory");
const PatientModel = require("../models/patient");
const Drug = require("../models/drug");
const Notification = require("../models/Notification");

router.get("/medical-history-get", async (req, res) => {
  try {
    const medicalHistory = await MedicalHistoryModel.find();
    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch medical history" });
  }
});

router.get("/medical-history-user/:regNo", async (req, res) => {
  const { regNo } = req.params;

  try {
    const medicalHistories = await MedicalHistoryModel.find({ regNo });
    if (medicalHistories.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical histories found for this patient" });
    }
    res.status(200).json(medicalHistories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch medical histories" });
  }
});

router.post("/medical-history", async (req, res) => {
  try {
    const {
      regNo,
      bloodPressure,
      height,
      weight,
      temperature,
      diagnosis,
      prescription,
      visitDate,
      bmi,
      bmiCategory,
      drugs,
    } = req.body;

    if (
      !regNo ||
      !bloodPressure ||
      !weight ||
      !temperature ||
      !diagnosis ||
      !prescription ||
      !visitDate
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const patient = await PatientModel.findOne({ regnum: regNo });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!drugs || drugs.length === 0) {
      return res.status(400).json({
        message: "At least one drug must be selected",
      });
    }

    for (let d of drugs) {
      const drug = await Drug.findById(d.drugId);

      if (!drug) {
        return res.status(404).json({
          message: `Drug not found: ${d.drugId}`,
        });
      }

      if (drug.quantity < d.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${drug.name}. Available: ${drug.quantity}`,
        });
      }

      drug.quantity -= d.quantity;
      await drug.save();

      if (drug.quantity < 100) {
        await Notification.create({
          message: `Low stock alert: ${drug.name} has only ${drug.quantity} items left.`,
          type: "low_stock",
          date: new Date(),
        });
      }
    }

    const medicalHistory = new MedicalHistoryModel({
      regNo,
      bloodPressure,
      height, 
      weight,
      temperature,
      diagnosis,
      prescription,
      visitDate,
      bmi,
      bmiCategory,
      drugs,
      status: "Pending",
    });

    await medicalHistory.save();

    res.status(201).json({
      message: "Medical history added successfully",
      medicalHistory,
    });
  } catch (error) {
    console.error("Error adding medical history:", error);
    res.status(500).json({
      message: "Failed to add medical history",
    });
  }
});

router.put("/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedRecord = await MedicalHistoryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Status updated successfully", updatedRecord });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
