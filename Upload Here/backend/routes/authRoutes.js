const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const superadminmodel = require("../models/superadmin.js");
const patientmodel = require("../models/patient.js");
const adminmodel = require("../models/admin.js");

const verifySuperAdmin = require("../security/Superadminauth.js");
const verifyPatient = require("../security/userauth.js");
const verifyAdmin = require("../security/adminauth.js");

const router = express.Router();

/* =====================================================
   LOGIN : SuperAdmin / Admin / Patient
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Provide all fields" });
    }

    let user;
    let roleKey;
    let roleName;

    if (role === "superadmin") {
      user = await superadminmodel.findOne({ username });
      roleKey = process.env.superadmin_key;
      roleName = "superadmin";
    } 
    else if (role === "patient") {
      user = await patientmodel.findOne({ regnum: username });
      roleKey = process.env.Patient_Key;
      roleName = "patient";
    } 
    else if (role === "admin") {
      user = await adminmodel.findOne({ username });
      roleKey = process.env.Admin_key;
      roleName = user?.admintype;
    } 
    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { username: user.username || user.regnum, role: roleName },
      roleKey,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.json({
      login: true,
      role: roleName,
      username: user.username || user.regnum,
      faculty: user.faculty || "any",
      department: user.department || "any",
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   VERIFY
===================================================== */
router.get("/verify", verifySuperAdmin, (req, res) => {
  res.json({ login: true, role: req.role, username: req.username });
});

router.get("/verifyadmin", verifyAdmin, (req, res) => {
  res.json({ login: true, role: req.role, username: req.username });
});

router.get("/verifypatient", verifyPatient, (req, res) => {
  res.json({ login: true, role: req.role, username: req.username });
});

/* =====================================================
   LOGOUT
===================================================== */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ logout: true });
});

/* =====================================================
   REGISTER ADMIN (ADMIN / ADVISOR / HOD / DEAN)
===================================================== */
router.post("/registerAdmin", async (req, res) => {
  try {
    let { username, gender, admintype, faculty, department, password } = req.body;

    if (!username || !gender || !admintype || !password) {
      return res.status(400).json({ error: "All required fields missing" });
    }

    // Role rules
    if (admintype === "admin") {
      faculty = undefined;
      department = undefined;
    }

    if (admintype === "dean") {
      department = undefined;
    }

    if ((admintype === "advisor" || admintype === "hod") && !department) {
      return res.status(400).json({ error: "Department is required" });
    }

    const exists = await adminmodel.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminmodel.create({
      username,
      gender,
      admintype,
      faculty,
      department,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Register admin error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   GET ADMIN DETAILS
===================================================== */
router.get("/admindetails/:username", async (req, res) => {
  try {
    const admin = await adminmodel.findOne({ username: req.params.username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getadmindetails", async (req, res) => {
  try {
    const admins = await adminmodel.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE ADMIN
===================================================== */
router.put("/updateAdmin/:username", async (req, res) => {
  try {
    const { gender, admintype, password } = req.body;

    const updateData = { gender, admintype };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await adminmodel.updateOne(
      { username: req.params.username },
      { $set: updateData }
    );

    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE ADMIN
===================================================== */
router.delete("/:username", async (req, res) => {
  try {
    const deleted = await adminmodel.findOneAndDelete({
      username: req.params.username,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   REGISTER SUPER ADMIN
===================================================== */
router.post("/registerSuperAdmin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await superadminmodel.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await superadminmodel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "SuperAdmin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   ROLE DASHBOARDS
===================================================== */
router.get("/advisor-dashboard", verifyAdmin, (req, res) => {
  if (req.role !== "advisor") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome Advisor" });
});

router.get("/hod-dashboard", verifyAdmin, (req, res) => {
  if (req.role !== "hod") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome HOD" });
});

router.get("/dean-dashboard", verifyAdmin, (req, res) => {
  if (req.role !== "dean") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ message: "Welcome Dean" });
});

module.exports = router;
