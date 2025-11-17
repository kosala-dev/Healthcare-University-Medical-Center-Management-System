const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  diagnosisText: {
    type: String,
    required: true,
  },
  drugs: [
    {
      drugId: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" },
      quantity: { type: Number, required: true },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Diagnosis", diagnosisSchema);