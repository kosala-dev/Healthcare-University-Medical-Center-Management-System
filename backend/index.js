const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); 

import("./mongodb.js"); 
const cors = require("cors");
const cookieParser = require("cookie-parser"); 

const Authroute = require("./routes/authroute.js");
const Patientroute = require("./routes/patientroute.js");
const Messageroute = require("./routes/msgroute.js");
const appointmentroute = require("./routes/appointmentroute.js");
const MedicalHistory = require("./routes/Medicalhistoryroute.js");
const DrugRoutes = require("./routes/drugroute.js");
const appointmentRoutes = require("./routes/appointmentroute.js");
const medicalFormRoute = require("./routes/medicalformroute.js"); 
const notificationRoute = require("./routes/notificationRoute.js");

const passport = require("./config/passport");

const seed = require("./seed.js");

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", Authroute);
app.use("/patient", Patientroute);
app.use("/message", Messageroute);
app.use("/Appointments", appointmentroute);
app.use("/medicalhis", MedicalHistory);
app.use("/drugs", DrugRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api", medicalFormRoute);
app.use("/notifications", notificationRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
