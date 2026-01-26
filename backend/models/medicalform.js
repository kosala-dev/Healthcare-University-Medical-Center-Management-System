const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject: String,
  code: String,
  dateOfExam: String,
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
    address: String,
    contact: String,
    registrationNo: { type: String, required: true },
    field: String,
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    examTitle: { type: String, required: true },
    subjects: [subjectSchema],
    reasonType: String,
    reason: String,
    studentRequest: String,
    firstAttempt: String,
    attachedARReceipt: Boolean,
    attachedRegisteredLetter: Boolean,
    medicalOfficerName: String,
    medicalOfficerTitle: String,
    slmcRegNo: String,
    otherDocs: String,
    signature: String,

    advisorApproval: { type: approvalSchema, default: () => ({}) },
    adminApproval: { type: approvalSchema, default: () => ({}) },
    hodApproval: { type: approvalSchema, default: () => ({}) },
    deanApproval: { type: approvalSchema, default: () => ({}) },

    sentToExamDept: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalForm", medicalFormSchema);
