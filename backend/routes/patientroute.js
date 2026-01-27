const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
const validator = require("validator");
const patientmodel = require("../models/patient");
require("dotenv").config(); 

// mail config
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transport.verify((error, success) => {
  if (error) {
    console.error("❌ Email transport connection failed:", error);
  } else {
    console.log("✅ Email transporter is ready to send messages!");
  }
});


// register patient
router.post("/patientregister", async (req, res) => {
  try {
    const {
      regnum,
      fullname,
      email,
      address,
      city,
      course,
      department,
      faculty,
      bloodgroup,
      gender,
      password,
    } = req.body;

    if (
      !regnum ||
      !fullname ||
      !email ||
      !password ||
      !gender ||
      !address ||
      !city ||
      !course ||
      !department ||
      !faculty ||
      !bloodgroup
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if patient already exists
    const existingPatient = await patientmodel.findOne({ regnum });
    if (existingPatient) {
      return res.status(400).json({
        message: "Patient with this registration number already exists",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);

    const newPatient = new patientmodel({
      regnum,
      fullname,
      email,
      address,
      city,
      course,
      department,
      faculty,
      bloodgroup,
      gender,
      password: hashpassword,
    });

    await newPatient.save();

    const mailOptions = {
      from: `"Medical Center - University of Vavuniya" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Patient Registration Successful",
      html: `
        <h3>Dear ${fullname},</h3>
        <p>Your registration as a student in university of vavuniya health center has been successfully completed.</p>
        <p><strong>Username:</strong> ${regnum}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please note that your password is temporary, update your password & keep your credentials safe and do not share them with anyone.</p>
        <br/>
        <p>Best regards,<br/>
        <strong>Medical Center</strong><br/>
        University of Vavuniya</p>
      `,
    };

    // Send email
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message: "Patient registered, but email sending failed",
          error: error.message,
        });
      } else {
        console.log("Email sent successfully:", info.response);
        return res.json({
          registered: true,
          message:
            "Patient registered successfully. Credentials have been sent via email.",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


transport.verify((error, success) => {
  if (error) {
    console.error("Email transport connection failed:", error);
  } else {
    console.log("Email transporter is ready to send messages!");
  }
});

// get patient
router.get("/getpatientdetails", async (req, res) => {
  try {
    const patients = await patientmodel.find();
    return res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get patient by reg no
router.get("/patientdetails/:regnum", async (req, res) => {
  try {
    const regnum = req.params.regnum;
    const patient = await patientmodel.findOne({ regnum });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ success: true, patdet: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// count patients
router.get("/countpatients", async (req, res) => {
  try {
    const count = await patientmodel.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// delete patient
router.delete("/:regnum", async (req, res) => {
  try {
    const { regnum } = req.params;
    const deletedPatient = await patientmodel.findOneAndDelete({ regnum });

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
      data: deletedPatient,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// update patient
router.put("/updatepatient/:regnum", async (req, res) => {
  try {
    const { regnum } = req.params;
    const {
      fullname,
      email,
      address,
      city,
      course,
      department,
      faculty,
      bloodgroup,
      gender,
      password,
    } = req.body;

    if (
      !fullname ||
      !email ||
      !gender ||
      !address ||
      !city ||
      !course ||
      !department ||
      !faculty ||
      !bloodgroup
    ) {
      return res.status(400).json({
        message: "All fields except password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const patient = await patientmodel.findOne({ regnum });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const updateData = {
      fullname,
      email,
      address,
      city,
      course,
      department,
      faculty,
      bloodgroup,
      gender,
    };

    if (password && password.trim() !== "") {
      const hashpassword = await bcrypt.hash(password, 10);
      updateData.password = hashpassword;
    }

    const updatedPatient = await patientmodel.findOneAndUpdate(
      { regnum },
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Patient details updated successfully",
      patient: updatedPatient,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// medical report upload
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/medical-reports/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.params.regnum + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadReport = multer({
  storage: reportStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Upload medical report
router.post("/upload-report/:regnum", uploadReport.single("report"), async (req, res) => {
  try {
    const { regnum } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const report = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
    };

    await patientmodel.findOneAndUpdate(
      { regnum },
      { $push: { medicalReports: report } }
    );

    res.status(200).json({
      success: true,
      message: "Report uploaded successfully",
      filePath: `/uploads/medical-reports/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get patient’s reports
router.get("/medical-reports/:regnum", async (req, res) => {
  try {
    const { regnum } = req.params;
    const patient = await patientmodel.findOne({ regnum }).select("medicalReports");

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({ success: true, reports: patient.medicalReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// otp for passowrd recovery
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const patient = await patientmodel.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // otp generaters in here
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP 
    patient.resetPasswordOtp = otp;
    patient.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await patient.save();

    // Send Email
    const mailOptions = {
      from: `"Medical Center Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested to reset your password.</p>
        <p>Your OTP code is: <b style="font-size: 24px;">${otp}</b></p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      res.json({ message: "OTP sent to your email successfully" });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// verify otp
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const patient = await patientmodel.findOne({
      email: email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashpassword = await bcrypt.hash(newPassword, 10);

    patient.password = hashpassword;
    patient.resetPasswordOtp = undefined;
    patient.resetPasswordExpires = undefined;

    await patient.save();

    res.json({ message: "Password has been reset successfully. You can now login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
