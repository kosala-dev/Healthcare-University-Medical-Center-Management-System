// routes/medicalForm.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const MedicalForm = require("../models/medicalform");

// ----------------------
// Ensure uploads folder exists
// ----------------------
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ----------------------
// Multer setup for PDF uploads
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
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

    let parsedSubjects = [];
    if (subjects) {
      try { parsedSubjects = JSON.parse(subjects); } 
      catch { return res.status(400).json({ message: "Subjects not valid JSON" }); }
    }

    const uploadedFile = req.file ? req.file.filename : null;

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
      advisorApproval: { status: "Pending" },
      adminApproval: { status: "Pending" },
      hodApproval: { status: "Pending" },
      deanApproval: { status: "Pending" },
      sentToExamDept: false,
    });

    await newForm.save();

    res.status(201).json({ success: true, message: "Form submitted successfully", form: newForm });
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

// ----------------------
// GET approval forms by role
// ----------------------
router.get("/approvalForms/:role/:faculty/:department", async (req, res) => {
  try {
    const { role } = req.params;
    const filter = {};

    switch (role) {
      case "advisor":
        filter["advisorApproval.status"] = "Pending";
        break;
      case "admin":
        filter["advisorApproval.status"] = "Approved";
        filter["adminApproval.status"] = "Pending";
        break;
      case "hod":
        filter["adminApproval.status"] = "Approved";
        filter["hodApproval.status"] = "Pending";
        break;
      case "dean":
        filter["hodApproval.status"] = "Approved";
        filter["deanApproval.status"] = "Pending";
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const forms = await MedicalForm.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, forms });
  } catch (err) {
    console.error("APPROVAL FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch approval forms", error: err.message });
  }
});

// ----------------------
// POST approve / reject form
// ----------------------
router.post("/approveForm/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;
    const { status, username, comment } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const form = await MedicalForm.findById(id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const approvalData = {
      status,
      approvedBy: username,
      approvedAt: new Date(),
      remarks: comment || "",
    };

    // ---- ENFORCE APPROVAL ORDER ----
    if (role === "advisor") {
      if (form.advisorApproval.status !== "Pending") return res.status(400).json({ message: "Advisor already processed" });
      form.advisorApproval = approvalData;
    } else if (role === "admin") {
      if (form.advisorApproval.status !== "Approved") return res.status(400).json({ message: "Advisor approval required first" });
      if (form.adminApproval.status !== "Pending") return res.status(400).json({ message: "Admin already processed" });
      form.adminApproval = approvalData;
    } else if (role === "hod") {
      if (form.adminApproval.status !== "Approved") return res.status(400).json({ message: "Admin approval required first" });
      if (form.hodApproval.status !== "Pending") return res.status(400).json({ message: "HOD already processed" });
      form.hodApproval = approvalData;
    } else if (role === "dean") {
      if (form.hodApproval.status !== "Approved") return res.status(400).json({ message: "HOD approval required first" });
      if (form.deanApproval.status !== "Pending") return res.status(400).json({ message: "Dean already processed" });

      form.deanApproval = approvalData;

      if (status === "Approved") form.sentToExamDept = true;

      // --- SEND EMAILS ONLY TO EXAM DEPARTMENT ---
      try {
        if (status === "Approved") await sendEmailToExamDept(form);
      } catch (mailErr) {
        console.error("Email send failed:", mailErr.message);
      }
    } else return res.status(400).json({ message: "Invalid role" });

    await form.save();
    res.json({ success: true, message: `Form ${status} by ${role}`, form });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
});

// ----------------------
// Email to Exam Department (only if approved)
// ----------------------
async function sendEmailToExamDept(form) {
  const examDeptEmail = "2021ict65@stu.vau.ac.lk"; // replace with real exam dept email
  if (!examDeptEmail) return;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Medical Forms System" <${process.env.EMAIL_USER}>`,
    to: examDeptEmail,
    subject: `Medical Form Approval Notification: ${form.name} (${form.registrationNo})`,
    html: `
      <p>Dear Exam Department,</p>
      <p>The following student's medical form has been <strong>approved by the Dean</strong> and is ready for processing:</p>
      <ul>
        <li><strong>Name:</strong> ${form.name}</li>
        <li><strong>Registration No:</strong> ${form.registrationNo}</li>
        <li><strong>Faculty:</strong> ${form.faculty}</li>
        <li><strong>Department:</strong> ${form.department}</li>
        <li><strong>Exam Title:</strong> ${form.examTitle}</li>
      </ul>
      <p>Please review and take the necessary actions.</p>
      <p>Best regards,<br/>Medical Forms System</p>
    `,
    attachments: form.otherDocs ? [{ filename: form.otherDocs, path: path.join(uploadDir, form.otherDocs) }] : [],
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to Exam Department for form ${form.registrationNo}`);
}

module.exports = router;
