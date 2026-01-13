const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    regnum: {
      type: String,
      required: true,
      // unique: true,  // removed to allow multiple appointments per regnum
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
