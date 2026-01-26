const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Patient = require("../models/patient");

router.post("/", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await Patient.findOne({ email });
    if (!user) return res.status(404).json({ message: "Patient not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
});

module.exports = router;
