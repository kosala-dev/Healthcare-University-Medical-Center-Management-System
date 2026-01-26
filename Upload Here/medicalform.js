const mongoose = require("mongoose");

const ApprovalSchema = new mongoose.Schema({
  status: { type: String, default: "Pending" },
  approvedBy: { type: String, default: "" },
  approvedAt: { type: Date },
  remarks: { type: String, default: "" },
});

const MedicalFormSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    email: { type: String },
    registrationNo: { type: String },
    field: { type: String },
    faculty: { type: String },
    department: { type: String },
    examTitle: { type: String },

    subjects: [
      {
        subject: String,
        code: String,
        dateOfExam: String,
      },
    ],

    reasonType: { type: String },
    reason: { type: String },
    studentRequest: { type: String },
    firstAttempt: { type: String },

    attachedARReceipt: { type: Boolean, default: false },
    attachedRegisteredLetter: { type: Boolean, default: false },

    medicalOfficerName: { type: String },
    medicalOfficerTitle: { type: String },
    slmcRegNo: { type: String },

    signature: { type: String },
    otherDocs: { type: String },

    // 🔴 APPROVAL FIELDS (THIS WAS MISSING)
    advisorApproval: { type: ApprovalSchema, default: () => ({}) },
    adminApproval: { type: ApprovalSchema, default: () => ({}) },
    hodApproval: { type: ApprovalSchema, default: () => ({}) },
    deanApproval: { type: ApprovalSchema, default: () => ({}) },

    sentToExamDept: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalForm", MedicalFormSchema);
