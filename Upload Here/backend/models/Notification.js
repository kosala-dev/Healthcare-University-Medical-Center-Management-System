const mongoose = require("mongoose");



// models/Notification.js


const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  drugId: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" }, // optional, but useful
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // 🔴 new field
});

module.exports = mongoose.model("Notification", notificationSchema);
