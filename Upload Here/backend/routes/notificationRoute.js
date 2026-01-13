const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", async (req, res) => {
  const notifications = await Notification.find().sort({ date: -1 });
  res.json(notifications);
});


module.exports = router;
