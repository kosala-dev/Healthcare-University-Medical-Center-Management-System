// backend/controllers/dispenseController.js

const Drug = require('../models/drug');
const IssueLog = require('../models/issueLogModel');

// Helper function to handle stock decrement and log creation
const dispenseItem = async (itemId, quantity, patientId, issuedBy, prescriptionRef = null, isQuickIssue = false) => {
    const item = await Drug.findById(itemId);

    if (!item) {
        throw new Error('Item not found');
    }
    if (item.stockQuantity < quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${item.stockQuantity}`);
    }

    // 1. Decrement stock
    item.stockQuantity -= quantity;
    await item.save();

    // 2. Create issue log
    const log = new IssueLog({
        itemId,
        itemName: item.name,
        quantityIssued: quantity,
        patientId,
        issuedBy,
        prescriptionRef,
        isQuickIssue,
    });
    await log.save();
    
    return log;
};


// 1. Logic: Handle dispensing based on Doctor's prescription
const dispenseByPrescription = async (req, res) => {
    const { items, patientId, prescriptionRef } = req.body; // items is an array: [{itemId, quantity}]
    
    // Middleware ensures this is a Nurse
    if (!prescriptionRef) {
        return res.status(400).json({ message: 'Prescription reference is required for this type of issue.' });
    }
    
    try {
        const dispensedLogs = [];
        for (const item of items) {
            const log = await dispenseItem(
                item.itemId, 
                item.quantity, 
                patientId, 
                req.user._id, // The logged-in Nurse's ID
                prescriptionRef
            );
            dispensedLogs.push(log);
        }
        
        res.status(200).json({ message: 'Items dispensed successfully by prescription.', logs: dispensedLogs });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Logic: Handle dispensing of quick medicine (without prescription)
const dispenseQuickMedicine = async (req, res) => {
    const { itemId, quantity, patientId } = req.body;
    
    // Middleware ensures this is a Nurse
    
    try {
        const item = await Drug.findById(itemId);
        
        if (!item || !item.isQuickMedicine) {
            return res.status(400).json({ message: 'Item is not authorized for quick issue.' });
        }
        
        const log = await dispenseItem(
            itemId, 
            quantity, 
            patientId, 
            req.user._id, // The logged-in Nurse's ID
            null, // No prescription reference
            true // Mark as quick issue
        );
        
        res.status(200).json({ message: 'Quick medicine dispensed successfully.', log });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. Logic: Generate End-of-Month Report
const generateMonthlyReport = async (req, res) => {
    const { year, month } = req.query; // e.g., ?year=2024&month=11
    
    try {
        // Calculate start and end dates for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Aggregate usage from Issue Log
        const monthlyUsage = await IssueLog.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$itemName',
                    totalQuantityIssued: { $sum: '$quantityIssued' },
                    item: { $first: '$itemId' }
                }
            },
            {
                $lookup: { // Join with Inventory to get current stock
                    from: 'inventories', 
                    localField: 'item',
                    foreignField: '_id',
                    as: 'inventoryDetails'
                }
            },
            {
                $unwind: '$inventoryDetails'
            },
            {
                $project: {
                    _id: 0,
                    item: '$_id',
                    totalQuantityIssued: 1,
                    currentStock: '$inventoryDetails.stockQuantity',
                    category: '$inventoryDetails.category',
                }
            }
        ]);

        res.status(200).json({ 
            month: `${year}-${month}`,
            report: monthlyUsage 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    dispenseByPrescription,
    dispenseQuickMedicine,
    generateMonthlyReport,
};