const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  code: { type: String, required: true },
  dateOfExam: { type: String, required: true },
});

const approvalSchema = new mongoose.Schema({
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  approvedBy: String,
  approvedAt: Date,
  remarks: String,
});

const medicalFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    registrationNo: { type: String, required: true },
    field: { type: String, required: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    examTitle: { type: String, required: true },
    subjects: [subjectSchema],
    reasonType: { type: String, required: true },
    reason: { type: String, required: true },
    studentRequest: { type: String, required: true },
    firstAttempt: { type: String, required: true },
    otherDocs: { type: String, required: true }, 
    extraDocs: { type: String }, 

    
    advisorApproval: { type: approvalSchema, default: () => ({}) },
    adminApproval: { type: approvalSchema, default: () => ({}) },
    hodApproval: { type: approvalSchema, default: () => ({}) },
    deanApproval: { type: approvalSchema, default: () => ({}) },

    sentToExamDept: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalForm", medicalFormSchema);