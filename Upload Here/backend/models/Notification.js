const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  drugId: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" }, // optional, but useful
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
module.exports = Notification;
