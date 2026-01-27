// backend/routes/dispenseRoutes.js

const express = require('express');
const router = express.Router();
const verifyAdmin = require("../security/adminauth.js"); 
const { checkDesignation } = require('../middleware/checkDesignation'); 
const { dispenseByPrescription,dispenseQuickMedicine,generateMonthlyReport } = require('../controllers/dispenseController');

// Nurse-specific routes

// 1. Issue based on prescription
router.post('/prescription', verifyAdmin, checkDesignation('Nurse'), dispenseByPrescription);

// 2. Issue quick medicine (no prescription required)
router.post('/quick-issue', verifyAdmin, checkDesignation('Nurse'), dispenseQuickMedicine);

// 3. Generate end-of-month report
router.get('/report/monthly', verifyAdmin, checkDesignation('Nurse'), generateMonthlyReport);

module.exports = router;