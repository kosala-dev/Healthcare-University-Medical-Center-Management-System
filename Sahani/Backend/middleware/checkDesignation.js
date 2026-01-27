// backend/middleware/checkDesignation.js (NEW FILE)

const checkDesignation = (requiredDesignation) => (req, res, next) => {
    // req.designation is set by the modified verifyAdmin middleware
    if (req.role !== 'admin') {
        return res.status(403).json({ message: 'Authorization Failed: Access restricted to Admin roles.' });
    }
    
    if (!req.designation || req.designation !== requiredDesignation) {
        return res.status(403).json({ 
            message: `Not authorized. Required designation: ${requiredDesignation}` 
        });
    }

    next();
};

module.exports = { checkDesignation };