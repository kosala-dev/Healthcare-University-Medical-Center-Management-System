const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    admintype: { type: String, required: true },
    password: { type: String, required: true },
   /* role: {
        type: String,
        required: true,
        // Ensure 'Admin' is present
        enum: ['Patient', 'Doctor', 'Nurse'], 
        default: 'Patient'
    },*/
    
    // NEW FIELD: Used to distinguish Admin roles
    designation: {
        type: String,
        // The SuperAdmin who creates the others, the Nurse admin, or the Doctor admin
        enum: ['SuperAdmin', 'Nurse', 'Doctor', null], 
        default: null
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("admin", adminSchema);

 

