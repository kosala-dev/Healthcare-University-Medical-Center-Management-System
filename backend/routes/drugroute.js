const express = require("express");
const router = express.Router();
const Drug = require("../models/drug");
const Notification = require("../models/Notification");

async function checkLowStock(drug) {
  if (drug.quantity < 100) {
    const existing = await Notification.findOne({
      message: { $regex: new RegExp(drug.name, "i") },
      type: "low_stock"
    });

    if (!existing) {
      await Notification.create({
        message: `Low stock alert: ${drug.name} has only ${drug.quantity} items left.`,
        type: "low_stock",
        date: new Date()
      });
      console.log(`Low stock alert sent for ${drug.name}`);
    }
  } else {
    await Notification.deleteMany({
      message: { $regex: new RegExp(drug.name, "i") },
      type: "low_stock"
    });
    console.log(`Low stock notifications cleared for ${drug.name}`);
  }
}



// get all drugs
router.get("/", async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// get low drug report
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

// add drug
router.post("/", async (req, res) => {
  const { name, dosage, quantity } = req.body;

  if (!name || !dosage || quantity == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
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
    
    res.json({ success: true, updatedDrug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete drug
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