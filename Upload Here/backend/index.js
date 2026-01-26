
const express = require("express");
const dotenv = require("dotenv");
import("./mongodb.js");
const cors = require("cors");
const cookie = require("cookie-parser");
const path = require("path");

//import routes
const Authroute = require("./routes/authRoutes.js");
const Patientroute = require("./routes/patientroute.js");
const Messageroute = require("./routes/msgroute.js");
const PasswordRecoveryroute = require("./routes/passwordrecoveryroute.js");
const passwordchange = require("./routes/changepassword.js");
const appointmentroute = require("./routes/appointmentroute.js");
const MedicalHistory = require("./routes/Medicalhistoryroute.js");
const DrugRoutes = require("./routes/drugroute.js");
const NotificationRoutes = require("./routes/notificationRoute.js");
const DiagnosisRoutes = require("./routes/diagnosisRoutes.js");
const medicalFormRoute = require("./routes/medicalformroute.js"); // import route

//import models
const adminmodel = require("./models/admin.js");

const seed = require("./seed.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookie());

dotenv.config();

app.use("/auth", Authroute);
app.use("/patient", Patientroute);
app.use("/message", Messageroute);
app.use("/password-recovery", PasswordRecoveryroute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/Appointments", appointmentroute);
app.use("/changepassword", passwordchange);
app.use("/medicalhis", MedicalHistory);
app.use("/drugs", DrugRoutes);
app.use("/api/notifications",NotificationRoutes);
app.use("/api/diagnosis",DiagnosisRoutes);
app.use("/api", medicalFormRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 8080;
app.get("/", (req, res) => {
  res.status(200).send("hello");
});

app.listen(PORT, () => {
  console.log("server is running on port-", PORT);
});
