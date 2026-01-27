// backend/controllers/inventoryController.js

const IssueLog = require('../models/issueLogModel'); // Need this for reports
const Drug = require('../models/drug');

// 1. New Logic: Get all inventory for Doctor's view (Read-only)
const getInventoryForDoctor = async (req, res) => {
   try {
        // Find all drugs/items and only return essential fields
        const allInventory = await Drug.find({}).select('name category stockQuantity');
        res.status(200).json(allInventory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory for doctor', error: error.message });
    }
};

// 2. New Logic: Get Low Stock Items (for Admin/Nurse alert)
const getLowStockAlerts = async (req, res) => {
    try {
        // Find items where stockQuantity is less than lowStockThreshold (100 is a safe default for now)
        const lowStockItems = await Drug.find({ 
            stockQuantity: { $lt: 100 } // Assuming you added lowStockThreshold to the model
        }).select('name category stockQuantity lowStockThreshold');
        
        res.status(200).json(lowStockItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching low stock alerts', error: error.message });
    }
};

// 3. Existing Logic (Example): Create New Item (Update to use new fields)
const createInventoryItem = async (req, res) => {
    const { name, category, stockQuantity, isQuickMedicine } = req.body;
    
    // Validation: Only allow Nurse/Admin to perform CRUD (handled by middleware)
    
    try {
        const newItem = new Drug({
            name,
            category,
            stockQuantity,
            isQuickMedicine: category === 'Medicine' ? isQuickMedicine : false, // Equipment cannot be quick-issue
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Export all functions
module.exports = {
    getInventoryForDoctor,
    getLowStockAlerts,
    createInventoryItem,
};