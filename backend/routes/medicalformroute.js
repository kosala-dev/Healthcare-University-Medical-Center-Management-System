const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const MedicalForm = require("../models/medicalform");
const PatientModel = require("../models/patient"); 
require("dotenv").config();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// configure email
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// connection 
transport.verify((error, success) => {
  if (error) {
    console.error("❌ Medical Route: Email transport connection failed:", error);
  } else {
    console.log("✅ Medical Route: Email transporter is ready!");
  }
});

// PDF Uploads
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
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

// form submittion

router.post("/submitMedicalForm", upload.single("otherDocs"), async (req, res) => {
  try {
    const {
      name, address, contact, registrationNo, field, faculty, department,
      examTitle, subjects, reasonType, reason, studentRequest, firstAttempt,
      attachedARReceipt, attachedRegisteredLetter, medicalOfficerName,
      medicalOfficerTitle, slmcRegNo, signature,
    } = req.body;

    if (!registrationNo || !name || !examTitle || !faculty || !department) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let parsedSubjects = [];
    if (subjects) {
      try {
        parsedSubjects = JSON.parse(subjects);
      } catch {
        return res.status(400).json({ message: "Subjects field is not valid JSON" });
      }
    }

    let uploadedFile = null;
    if (req.file) uploadedFile = req.file.filename;
    else if (req.body.otherDocs) uploadedFile = req.body.otherDocs;

    const newForm = new MedicalForm({
      name, address, contact, registrationNo, field, faculty, department,
      examTitle, subjects: parsedSubjects, reasonType, reason, studentRequest,
      firstAttempt,
      attachedARReceipt: attachedARReceipt === "true",
      attachedRegisteredLetter: attachedRegisteredLetter === "true",
      medicalOfficerName, medicalOfficerTitle, slmcRegNo, signature,
      otherDocs: uploadedFile,
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


router.get("/getFormsByStudent/:registrationNo", async (req, res) => {
  try {
    const forms = await MedicalForm.find({ registrationNo: req.params.registrationNo }).sort({ createdAt: -1 });
    res.json({ success: true, forms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch forms", error: err.message });
  }
});

// pdf downalod
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

// get approvals
router.get("/approvalForms/:role/:faculty/:department", async (req, res) => {
  try {
    const { role, faculty, department } = req.params;

    console.log(`📥 API Request: Get Forms | Role: ${role} | Faculty: ${faculty} | Dept: ${department}`);

    const filter = {};
    const isAny = (val) => val === "any" || val === "null" || val === "undefined" || !val;

    switch (role) {
      case "advisor":
        filter["advisorApproval.status"] = "Pending";
        if (!isAny(faculty)) filter.faculty = faculty;
        if (!isAny(department)) filter.department = department;
        break;

      case "admin":
        filter["advisorApproval.status"] = "Approved";
        filter["adminApproval.status"] = "Pending";
        break;

      case "hod":
        filter["adminApproval.status"] = "Approved";
        filter["hodApproval.status"] = "Pending";
        if (!isAny(faculty)) filter.faculty = faculty;
        if (!isAny(department)) filter.department = department;
        break;

      case "dean":
        filter["hodApproval.status"] = "Approved";
        filter["deanApproval.status"] = "Pending";
        if (!isAny(faculty)) filter.faculty = faculty;
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    console.log("🔍 MongoDB Query Filter:", JSON.stringify(filter, null, 2));

    const forms = await MedicalForm.find(filter).sort({ createdAt: -1 });
    console.log(`✅ Found ${forms.length} forms.`);

    res.json({ success: true, forms });
  } catch (err) {
    console.error("❌ APPROVAL FETCH ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch approval forms",
      error: err.message,
    });
  }
});

// approval form

router.post("/approveForm/:role/:id", async (req, res) => {
  const { role, id } = req.params;
  let { status, username, comment } = req.body;

  status = status?.trim();
  username = username?.trim() || "Unknown";
  comment = comment?.trim() || "";

  if (!["Approved", "Rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const form = await MedicalForm.findById(id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const approvalData = { status, approvedBy: username, approvedAt: new Date(), remarks: comment };
    const roleLower = role.toLowerCase();

    if (roleLower === "advisor") form.advisorApproval = approvalData;
    else if (roleLower === "admin") form.adminApproval = approvalData;
    else if (roleLower === "hod") form.hodApproval = approvalData;
    else if (roleLower === "dean") {
      form.deanApproval = approvalData;
      
      if (status === "Approved") {
        form.sentToExamDept = true;
        sendFinalApprovalEmails(form).catch(err => console.error("Background Email Error:", err));
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await form.save();
    res.json({ success: true, form });

  } catch (err) {
    console.error("Error saving form approval:", err);
    res.status(500).json({ message: "Failed to save form approval" });
  }
});

// emails

async function sendFinalApprovalEmails(form) {
  try {
    const student = await PatientModel.findOne({ regnum: form.registrationNo });
    const studentEmail = student ? student.email : null;

    console.log(`📧 Preparing emails for Form: ${form.registrationNo}`);
    
    const examDeptEmail = "examdept@vau.ac.lk"; 
    
    if (examDeptEmail) {
      const examMailOptions = {
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
          <p>Please review the attached document and take necessary actions.</p>
          <p>Best regards,<br/>Medical Forms System</p>
        `,
        attachments: form.otherDocs ? [{ filename: form.otherDocs, path: path.join(uploadDir, form.otherDocs) }] : [],
      };
      await transport.sendMail(examMailOptions);
      console.log(`✅ Email sent to Exam Dept`);
    }

    // student email
    if (studentEmail) {
      const studentMailOptions = {
        from: `"Medical Center - University of Vavuniya" <${process.env.EMAIL_USER}>`,
        to: studentEmail,
        subject: `Medical Request Approved: ${form.examTitle}`,
        html: `
          <h3>Dear ${form.name},</h3>
          <p>We are pleased to inform you that your medical request for the exam <strong>"${form.examTitle}"</strong> has been successfully <strong>APPROVED</strong> by the Dean.</p>
          <p><strong>Details:</strong></p>
          <ul>
             <li><strong>Reference:</strong> ${form._id}</li>
             <li><strong>Status:</strong> Approved & Sent to Exam Department</li>
          </ul>
          <p>The Exam Department has been notified and will process your request further.</p>
          <br/>
          <p>Best regards,<br/>
          <strong>Medical Center</strong><br/>
          University of Vavuniya</p>
        `,
      };
      await transport.sendMail(studentMailOptions);
      console.log(`✅ Email sent to Student (${studentEmail})`);
    } else {
      console.warn(`⚠️ Student email not found for RegNo: ${form.registrationNo}`);
    }

  } catch (error) {
    console.error("❌ Error sending final approval emails:", error);
  }
}

module.exports = router;