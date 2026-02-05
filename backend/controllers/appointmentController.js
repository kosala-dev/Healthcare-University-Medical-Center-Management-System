const Appointment = require("../models/appointment");

exports.create = async (req, res) => {
  try {

    if (!req.body) {
      return res.status(400).send({ message: "Content cannot be empty" });
    }

    const { regnum, fullname, email, date, time, condition } = req.body;

    if (!regnum || !fullname || !email || !date || !time || !condition) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      regnum,
      fullname,
      email,
      date,
      time,
      condition,
    });

    await appointment.save();
    res.status(201).send({ message: "Appointment booked successfully" });

  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).send({
      message: err.message || "Error occurred while registering the appointment",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.send(appointments);
  } catch (err) {
    console.error("Error retrieving appointments:", err);
    res.status(500).send({
      message: err.message || "Error occurred while retrieving appointment information",
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Appointment.findById(id);
    if (!data) {
      return res.status(404).send({ message: "Appointment not found with id " + id });
    }
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving appointment with id " + id });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  if (!req.body) return res.status(400).send({ message: "Data to update cannot be empty" });

  try {
    const data = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) return res.status(404).send({ message: "Appointment not found with id " + id });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Error updating appointment with id " + id });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Appointment.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).send({
        message: `Cannot delete Appointment with id=${id}. Maybe Appointment was not found!`
      });
    }

    res.send({
      message: "Appointment was deleted successfully!"
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Appointment with id=" + id
    });
  }
};