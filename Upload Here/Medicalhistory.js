const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true },

    bloodPressure: { type: String, required: true },
    

    height: { type: String },          // 👈 added (optional but recommended)
    weight: { type: String, required: true },

    bmi: { type: String },             // 👈 added
    bmiCategory: { type: String },     // 👈 added

    temperature: { type: String, required: true },
    symptoms: { type: String, required: true },
    diagnosis: { type: String, required: true },
    visitDate: { type: Date, required: true },

    // Drugs used in diagnosis
    drugs: [
      {
        drugId: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MedicalHistoryModel = mongoose.model(
  "MedicalHistory",
  medicalHistorySchema
);

module.exports = MedicalHistoryModel;
