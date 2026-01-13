// routes/medicalForm.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const MedicalForm = require("../models/medicalform");
const adminmodel = require("../models/admin");
const verifyAdmin = require("../security/adminauth");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ----------------------
// Multer setup for PDF uploads
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ----------------------
// POST /submitMedicalForm
// ----------------------
router.post("/submitMedicalForm", upload.single("otherDocs"), async (req, res) => {
  try {
    const {
      name,
      address,
      contact,
      registrationNo,
      field,
      faculty,
      department,
      examTitle,
      subjects,
      reasonType,
      reason,
      studentRequest,
      firstAttempt,
      attachedARReceipt,
      attachedRegisteredLetter,
      medicalOfficerName,
      medicalOfficerTitle,
      slmcRegNo,
      signature,
    } = req.body;

    if (!registrationNo || !name || !examTitle || !faculty || !department) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Parse subjects safely
    let parsedSubjects = [];
    if (subjects) {
      try {
        parsedSubjects = JSON.parse(subjects);
      } catch {
        return res.status(400).json({ message: "Subjects field is not valid JSON" });
      }
    }

    // Handle file
    let uploadedFile = null;
    if (req.file) uploadedFile = req.file.filename;
    else if (req.body.otherDocs) uploadedFile = req.body.otherDocs; // fallback

    const newForm = new MedicalForm({
      name,
      address,
      contact,
      registrationNo,
      field,
      faculty,
      department,
      examTitle,
      subjects: parsedSubjects,
      reasonType,
      reason,
      studentRequest,
      firstAttempt,
      attachedARReceipt: attachedARReceipt === "true",
      attachedRegisteredLetter: attachedRegisteredLetter === "true",
      medicalOfficerName,
      medicalOfficerTitle,
      slmcRegNo,
      signature,
      otherDocs: uploadedFile,
      // Initial statuses
      advisorApproval: { status: "Pending" },
      adminApproval: { status: "Pending" },
      hodApproval: { status: "Pending" },
      deanApproval: { status: "Pending" },
      sentToExamDept: false,
    });

    await newForm.save();
    res.status(201).json({ message: "Form submitted successfully", form: newForm });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ message: "Failed to submit form", error: err.message });
  }
});

// ----------------------
// GET forms by student
// ----------------------
router.get("/getFormsByStudent/:registrationNo", async (req, res) => {
  try {
    const forms = await MedicalForm.find({ registrationNo: req.params.registrationNo }).sort({ createdAt: -1 });
    res.json({ success: true, forms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch forms", error: err.message });
  }
});

// ----------------------
// Download attached PDF
// ----------------------
router.get("/download/:filename", (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download file", error: err.message });
  }
});

// GET /approvalForms/:role/:faculty/:department
router.get("/approvalForms/:role/:faculty/:department", async (req, res) => {
  try {
    const { role, faculty, department } = req.params;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const filter = {};

    switch (role) {
      case "advisor":
        filter["advisorApproval.status"] = "Pending";
        if (faculty !== "any") filter.faculty = faculty;
        if (department !== "any") filter.department = department;
        break;

      case "admin":
        filter["advisorApproval.status"] = "Approved";
        filter["adminApproval.status"] = "Pending";
        break;

      case "hod":
        filter["adminApproval.status"] = "Approved";
        filter["hodApproval.status"] = "Pending";
        if (faculty !== "any") filter.faculty = faculty;
        if (department !== "any") filter.department = department;
        break;

      case "dean":
        filter["hodApproval.status"] = "Approved";
        filter["deanApproval.status"] = "Pending";
        if (faculty !== "any") filter.faculty = faculty;
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    console.log(" FINAL FILTER USED:", filter);

    const forms = await MedicalForm.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, forms });
  } catch (err) {
    console.error("APPROVAL FETCH ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch approval forms",
      error: err.message,
    });
  }
});

// POST approve/reject form by role
router.post("/approveForm/:role/:id", async (req, res) => {
  const { role, id } = req.params;
  const { status, username, comment } = req.body;

  if (!["Approved", "Rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const form = await MedicalForm.findById(id);
  if (!form) return res.status(404).json({ message: "Form not found" });

  const approvalData = { status, approvedBy: username, approvedAt: new Date(), remarks: comment || "" };

  if (role === "advisor") form.advisorApproval = approvalData;
  else if (role === "admin") form.adminApproval = approvalData;
  else if (role === "hod") form.hodApproval = approvalData;
  else if (role === "dean") {
    form.deanApproval = approvalData;
    if (status === "Approved") form.sentToExamDept = true;
  } else return res.status(400).json({ message: "Invalid role" });

  await form.save();
  res.json({ success: true, form });
});



const nodemailer = require("nodemailer");

async function sendToExamDept(form) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "examdept@univ.edu", // replace with actual exam dept email
    subject: `Medical Form Approved: ${form.name}`,
    text: `The medical form of ${form.name} (${form.registrationNo}) has been approved by Dean.\nCheck attached document if needed.`,
    attachments: form.otherDocs ? [{ path: path.join(uploadDir, form.otherDocs) }] : [],
  });
}



module.exports = router;
