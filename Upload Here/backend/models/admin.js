const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    gender: { type: String, required: true },

    admintype: {
      type: String,
      enum: ["admin", "advisor", "hod", "dean"],
      required: true,
    },

    faculty: {
      type: String,
      required: function () {
        return this.admintype !== "admin"; // admin (medical admin) doesn't need faculty
      },
    },

    department: {
      type: String,
      required: function () {
        return this.admintype === "advisor" || this.admintype === "hod";
      },
    },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
