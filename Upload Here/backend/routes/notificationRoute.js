// routes/notificationRoute.js
const express = require("express");
const Notification = require("../models/Notification");

module.exports = (io) => {
  const router = express.Router();

  // GET all notifications
  router.get("/", async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ date: -1 });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST new notification (optional, could be triggered from other routes)
  router.post("/", async (req, res) => {
    try {
      const { message, type } = req.body;

      const notification = new Notification({ message, type });
      await notification.save();

      // Emit real-time to all connected admins
      if (io) io.emit("newNotification", notification);

      res.status(200).json({ success: true, notification });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
