const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // fs = file system
const nodemailer = require("nodemailer");
const MedicalForm = require("../models/medicalform");
const PatientModel = require("../models/patient"); 
require("dotenv").config();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// in here the mail is config
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// connecting
transport.verify((error, success) => {
  if (error) {
    console.error("❌ Medical Route: Email transport connection failed:", error);
  } else {
    console.log("✅ Medical Route: Email transporter is ready!");
  }
});

// pdf uploading 
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

const cpUpload = upload.fields([
  { name: "otherDocs", maxCount: 1 },
  { name: "extraDocs", maxCount: 1 }
]);

router.post("/submitMedicalForm", cpUpload, async (req, res) => {
  try {
    const {
      name, address, contact, registrationNo, field, faculty, department,
      examTitle, subjects, reasonType, reason, studentRequest, firstAttempt,
      attachedARReceipt, attachedRegisteredLetter, medicalOfficerName,
      medicalOfficerTitle, slmcRegNo, signature,
    } = req.body;

    if (!registrationNo || !name || !address || !contact || !field || !faculty || !department || !examTitle || !reason || !studentRequest || !firstAttempt) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!req.files || !req.files['otherDocs']) {
      return res.status(400).json({ message: "Medical Certificate PDF is required" });
    }

    let parsedSubjects = [];
    if (subjects) {
      try {
        parsedSubjects = JSON.parse(subjects);
      } catch {
        return res.status(400).json({ message: "Subjects field is not valid JSON" });
      }
    }

    const uploadedMedicalCert = req.files['otherDocs'][0].filename;
    const uploadedExtraDoc = req.files['extraDocs'] ? req.files['extraDocs'][0].filename : null;

    const newForm = new MedicalForm({
      name, address, contact, registrationNo, field, faculty, department,
      examTitle, subjects: parsedSubjects, reasonType, reason, studentRequest,
      firstAttempt,
      attachedARReceipt: attachedARReceipt === "true",
      attachedRegisteredLetter: attachedRegisteredLetter === "true",
      medicalOfficerName, medicalOfficerTitle, slmcRegNo, signature,
      otherDocs: uploadedMedicalCert,
      extraDocs: uploadedExtraDoc, 
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

// pdf download
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
    const filter = {};
    const isAny = (val) => val === "any" || val === "null" || val === "undefined" || !val;

    switch (role.toLowerCase()) {
      case "admin":
        filter["adminApproval.status"] = "Pending";
        break;

      case "advisor":
        filter["adminApproval.status"] = "Approved";
        filter["advisorApproval.status"] = "Pending";
        if (!isAny(faculty)) filter.faculty = faculty;
        if (!isAny(department)) filter.department = department;
        break;

      case "hod":
        filter["advisorApproval.status"] = "Approved";
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

    const forms = await MedicalForm.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch forms", error: err.message });
  }
});

// approval form
router.post("/approveForm/:role/:id", async (req, res) => {
  const { role, id } = req.params;
  let { status, username, comment } = req.body;

  status = status?.trim();
  username = username?.trim() || "Unknown";

  if (!["Approved", "Rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const form = await MedicalForm.findById(id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const approvalData = { 
        status, 
        approvedBy: username, 
        approvedAt: new Date(), 
        remarks: comment 
    };

    const roleLower = role.toLowerCase();

    if (roleLower === "admin") {
      form.adminApproval = approvalData;
    } else if (roleLower === "advisor") {
      form.advisorApproval = approvalData;
    } else if (roleLower === "hod") {
      form.hodApproval = approvalData;
    } else if (roleLower === "dean") {
      form.deanApproval = approvalData;
      
      if (status === "Approved") {
        form.sentToExamDept = true;
        sendFinalApprovalEmails(form).catch(err => console.error("Email Error:", err));
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await form.save();
    res.json({ success: true, form });

  } catch (err) {
    console.error("Error saving approval:", err);
    res.status(500).json({ message: "Failed to save approval" });
  }
});

// emails
async function sendFinalApprovalEmails(form) {
  try {
    const student = await PatientModel.findOne({ regnum: form.registrationNo });
    const studentEmail = student ? student.email : null;

    console.log(`📧 Preparing emails for Form: ${form.registrationNo}`);
    
    const examDeptEmail = "examdept.vau.ac.lk"; 
    
    if (examDeptEmail) {
      const examMailOptions = {
        from: `"Medical Forms System" <${process.env.EMAIL_USER}>`,
        to: examDeptEmail,
        subject: `Medical Form Approval Notification: ${form.name} (${form.registrationNo})`,
        html: `
          <p>Dear Exam Department,</p>
          <p>The following student's medical form has been <strong>approved by the Dean</strong> and is ready for processing:</p>
          <ul>
            <li><strong>Reference:</strong> ${form._id}</li>
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