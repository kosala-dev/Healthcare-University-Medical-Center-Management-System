const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    
    //  NEW FIELD: Differentiate Medicine from Equipment
    category: {
        type: String,
        required: true,
        enum: ['Medicine', 'Medical Equipment'],
    },

    //  NEW FIELD: For quick-issue items (Nurse-issued without prescription)
    isQuickMedicine: {
        type: Boolean,
        default: false,
    },

    stockQuantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },

    //  NEW FIELD: Low-stock alert threshold (default 100)
    lowStockThreshold: {
        type: Number,
        default: 100, 
        min: 0,
    },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model("Drug", drugSchema);

