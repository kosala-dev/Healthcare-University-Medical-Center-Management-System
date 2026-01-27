// backend/models/issueLogModel.js

const mongoose = require('mongoose');

const issueLogSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drug', // Reference to the Inventory item
        required: true,
    },
    itemName: { // Denormalize for easier reporting
        type: String,
        required: true
    },
    quantityIssued: {
        type: Number,
        required: true,
        min: 1,
    },
    
    patientId: {
        type: String, // Assuming patient ID is stored as a string
        required: true,
    },
    
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Assuming your admin model is 'Admin'
        required: true,
    },

    // Reference ID from the doctor's prescription (can be null for quick-issue)
    prescriptionRef: {
        type: String,
        default: null,
    },

    // Flag for items issued without a formal prescription
    isQuickIssue: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

module.exports = mongoose.model('IssueLog', issueLogSchema);