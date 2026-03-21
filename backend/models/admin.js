const mongoose = require("mongoose"); // npm install mongoose
// connection between database and node.js

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    gender: { type: String, required: true },

    admintype: {
      type: String,
      enum: ["admin", "advisor", "hod", "dean"], // only can contain this values
      required: true,
    },

    faculty: {
      type: String,
      required: function () {
        return this.admintype !== "admin"; // this function use faculty is required if the admin type is not "admin"
      },
      trim: true, // no spaces in front and end
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