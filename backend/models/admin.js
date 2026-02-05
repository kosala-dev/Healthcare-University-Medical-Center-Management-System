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
        return this.admintype !== "admin";
      },
      trim: true,
    },

    department: {
      type: String,
      required: function () {
        return ["advisor", "hod"].includes(this.admintype);
      },
      trim: true,
    },


    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);