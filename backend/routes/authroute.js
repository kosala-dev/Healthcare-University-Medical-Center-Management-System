const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");

const superadminmodel = require("../models/superadmin");
const patientmodel = require("../models/patient");
const adminmodel = require("../models/admin");

const verifySuperAdmin = require("../security/Superadminauth");
const verifyPatient = require("../security/userauth");
const verifyAdmin = require("../security/adminauth");

const router = express.Router();

router.post("/firebase-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ error: "Token required" });

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;

    let role = "";

    const patient = await patientmodel.findOne({ email: email });
    if (patient) role = "patient";

    const superadmin = await superadminmodel.findOne({ username: email });
    if (superadmin) role = "superadmin";

    const adminUser = await adminmodel.findOne({ username: email });
    if (adminUser) role = adminUser.admintype;

    if (!role) {
      return res.status(404).json({
        success: false,
        error: "Email not found"
      });
    }
    
    let secret;

    if (role === "superadmin") {
      secret = process.env.SUPERADMIN_KEY;
    } else if (role === "patient") {
      secret = process.env.PATIENT_KEY;
    } else {
      secret = process.env.ADMIN_KEY;
    }

    const jwtToken = jwt.sign(
      { email, role },
      secret,
      { expiresIn: "1h" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ success: true, role });

  } catch (error) {
    res.status(401).json({ error: "Invalid Firebase token" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ logout: true });
});

router.get("/verify/superadmin", verifySuperAdmin, (req, res) => {
  res.json({ login: true, role: req.role, username: req.username });
});

router.get("/verify/admin", verifyAdmin, (req, res) => {
  res.json({ login: true, role: req.role, username: req.username });
});

router.get("/verify/patient", verifyPatient, (req, res) => {
  res.json({ login: true, role: req.role, username: req.username });
});

router.post("/admin/register", async (req, res) => {
  try {
    const { username, gender, admintype, faculty, department, password } = req.body;

    if (!username || !gender || !admintype || !password)
      return res.status(400).json({ error: "All required fields missing" });

    const exists = await adminmodel.findOne({ username });
    if (exists)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
      username,
      gender,
      admintype,
      password: hashedPassword,
    };

    if (admintype !== "admin") adminData.faculty = faculty;
    if (admintype === "advisor" || admintype === "hod")
      adminData.department = department;

    await adminmodel.create(adminData);

    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/admin/:username", async (req, res) => {
  try {
    const adminData = await adminmodel.findOne({ username: req.params.username });
    if (!adminData)
      return res.status(404).json({ message: "Admin not found" });

    res.json(adminData);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admins", async (req, res) => {
  try {
    const admins = await adminmodel.find();
    res.json(admins);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/admin/:username", async (req, res) => {
  try {
    const { gender, admintype, faculty, department, password } = req.body;

    const updateData = { gender, admintype };

    if (admintype !== "admin") updateData.faculty = faculty;
    if (admintype === "advisor" || admintype === "hod")
      updateData.department = department;

    if (password)
      updateData.password = await bcrypt.hash(password, 10);

    await adminmodel.updateOne(
      { username: req.params.username },
      { $set: updateData }
    );

    res.json({ message: "Administrator updated successfully" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/:username", async (req, res) => {
  try {
    const deleted = await adminmodel.findOneAndDelete({
      username: req.params.username,
    });

    if (!deleted)
      return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/superadmin/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await superadminmodel.findOne({ username });
    if (exists)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await superadminmodel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "SuperAdmin registered successfully" });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/dashboard/advisor", verifyAdmin, (req, res) => {
  if (req.role !== "advisor")
    return res.status(403).json({ message: "Access denied" });
  res.json({ message: "Welcome Advisor" });
});

router.get("/dashboard/hod", verifyAdmin, (req, res) => {
  if (req.role !== "hod")
    return res.status(403).json({ message: "Access denied" });
  res.json({ message: "Welcome HOD" });
});

router.get("/dashboard/dean", verifyAdmin, (req, res) => {
  if (req.role !== "dean")
    return res.status(403).json({ message: "Access denied" });
  res.json({ message: "Welcome Dean" });
});

module.exports = router;
