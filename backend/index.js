const express = require("express");
const dotenv = require("dotenv");
import("./mongodb.js");
const cors = require("cors");
const cookie = require("cookie-parser");
const path = require("path");

const Authroute = require("./routes/authroute.js");
const Patientroute = require("./routes/patientroute.js");
const Messageroute = require("./routes/msgroute.js");
const PasswordRecoveryroute = require("./routes/passwordrecoveryroute.js");
const passwordchange = require("./routes/changepassword.js");
const appointmentroute = require("./routes/appointmentroute.js");
const MedicalHistory = require("./routes/Medicalhistoryroute.js");
const DrugRoutes = require("./routes/drugroute.js");
const appointmentRoutes = require("./routes/appointmentroute.js")

const app = express();

app.use(express.json());
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
app.use("/appointments", appointmentRoutes);


const PORT = 8080;

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
