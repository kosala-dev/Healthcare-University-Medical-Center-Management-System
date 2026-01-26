const mongoose = require("mongoose");

const medicalFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contact: { type: String },
  registrationNo: { type: String, required: true },
  field: { type: String },
  faculty: { type: String },
  department: { type: String },
  examTitle: { type: String },
  subjects: { type: Array },
  reasonType: { type: String },
  reason: { type: String },
  studentRequest: { type: String },
  firstAttempt: { type: String },
  attachedARReceipt: { type: Boolean },
  attachedRegisteredLetter: { type: Boolean },
  medicalOfficerName: { type: String },
  medicalOfficerTitle: { type: String },
  slmcRegNo: { type: String },
  otherDocs: { type: String }, // file name
  signature: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("MedicalForm", medicalFormSchema);
