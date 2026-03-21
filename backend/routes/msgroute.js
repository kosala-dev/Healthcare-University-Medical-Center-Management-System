const express = require("express");
const router = express.Router();

const messagemodel = require("../models/sendmessage");

//save messages into database
router.post("/sendmsg", async (req, res) => {
  try {
    const { regnum, name, faculty, course, email, mobnum, message } = req.body;
    if (
      !regnum ||
      !name ||
      !faculty ||
      !course ||
      !email ||
      !mobnum ||
      !message
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newmsg = new messagemodel({
      regnum,
      name,
      faculty,
      course,
      email,
      mobnum,
      message,
    });
    await newmsg.save();
    return res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get user messages
router.get("/getusermessages", async (req, res) => {
  try {
    const messages = await messagemodel.find(); 
    res.status(200).json(messages); 
  } catch (error) {
    res.status(500).json({ message: "Error retrieving messages", error });
  }
});

// count messages
router.get("/countmessages", async (req, res) => {
  try {
    const numofmessages = await messagemodel.countDocuments(); 
    res.json({ count: numofmessages }); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


router.delete('/deletemessage/:id', async (req, res) => {
  try {
    const deletedMessage = await messagemodel.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
});

module.exports = router;
