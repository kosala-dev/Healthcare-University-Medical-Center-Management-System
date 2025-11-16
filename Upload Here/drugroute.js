const express = require("express");
const router = express.Router();
const Drug = require("../models/drug");
const Notification = require("../models/Notification");

// Check low stock
async function checkLowStock(drug) {
  if (drug.quantity < 100 && !drug.lowStockNotified) {
    await Notification.create({
      message: `Low stock alert: ${drug.name} has only ${drug.quantity} items left.`,
      type: "low_stock",
      date: new Date()
    });

    drug.lowStockNotified = true;
    await drug.save();
    console.log(`Low stock alert sent for ${drug.name}`);
  } else if (drug.quantity >= 100 && drug.lowStockNotified) {
    // reset the flag if stock replenished
    drug.lowStockNotified = false;
    await drug.save();
    console.log(`Low stock flag reset for ${drug.name}`);
  }
}
// GET all drugs
router.get("/", async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /drugs/low-stock-report (must be BEFORE /:id)
router.get("/low-stock-report", async (req, res) => {
  try {
    const lowStockDrugs = await Drug.find({ quantity: { $lt: 100 } });
    if (!lowStockDrugs.length) {
      return res.status(200).json({ message: "No drugs with stock below 100" });
    }
    res.status(200).json(lowStockDrugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch low-stock drugs" });
  }
});

// POST add drug
router.post("/", async (req, res) => {
  const { name, dosage, quantity } = req.body;

  if (!name || !dosage || quantity == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if drug already exists by name + dosage
    const exists = await Drug.findOne({ name, dosage });
    if (exists) {
      return res.status(400).json({ error: "Drug already exists" });
    }

    const newDrug = new Drug({ name, dosage, quantity });
    await newDrug.save();

    await checkLowStock(newDrug);

    res.status(201).json(newDrug);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update drug
router.put("/:id", async (req, res) => {
  const { name, dosage, quantity } = req.body;

  try {
    const updatedDrug = await Drug.findByIdAndUpdate(
      req.params.id,
      { name, dosage, quantity },
      { new: true }
    );

    if (!updatedDrug) return res.status(404).json({ error: "Drug not found" });

    await checkLowStock(updatedDrug);

    res.json(updatedDrug);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE drug
router.delete("/:id", async (req, res) => {
  try {
    const deletedDrug = await Drug.findByIdAndDelete(req.params.id);
    if (!deletedDrug) return res.status(404).json({ error: "Drug not found" });
    res.json({ message: "Drug deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
