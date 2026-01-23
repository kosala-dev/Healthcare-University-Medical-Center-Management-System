const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Patient = require("../models/patient");

router.post("/", async (req, res) => {
  try {
    const { regnum, currentPassword, newPassword } = req.body;

    const user = await Patient.findOne({ regnum });
    if (!user) return res.status(404).json({ message: "Patient not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    user.tempPassword = false; // clear temp flag
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error in change password" });
  }
});

module.exports = router;
