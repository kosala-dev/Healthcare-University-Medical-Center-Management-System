const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  
});

const Drug = mongoose.models.Drug || mongoose.model("Drug", drugSchema);
// if Drug is already having in the databse || if not crete a new collection

module.exports = Drug;