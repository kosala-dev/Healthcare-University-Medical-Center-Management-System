const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// CRUD routes
router.post("/", appointmentController.create);
router.get("/", appointmentController.findAll);
router.get("/:id", appointmentController.findOne);
router.put("/:id", appointmentController.update);

module.exports = router;
