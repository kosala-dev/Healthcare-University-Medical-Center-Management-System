import express from "express";
import dotenv from "dotenv";
dotenv.config();

import("./mongodb.js"); 
import cors from "cors";
import cookieParser from "cookie-parser";

import Authroute from "./routes/authroute.js";
import Patientroute from "./routes/patientroute.js";
import Messageroute from "./routes/msgroute.js";
import appointmentroute from "./routes/appointmentroute.js";
import MedicalHistory from "./routes/Medicalhistoryroute.js";
import DrugRoutes from "./routes/drugroute.js";
import appointmentRoutes from "./routes/appointmentroute.js";
import medicalFormRoute from "./routes/medicalformroute.js"; 
import notificationRoute from "./routes/notificationRoute.js";

const app = express();

// Allow localhost for dev, deployed URL for production
const allowedOrigins = [
  "http://localhost:5173",
  "https://uov-healthcaresystemproject.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", Authroute);
app.use("/patient", Patientroute);
app.use("/message", Messageroute);
app.use("/Appointments", appointmentroute);
app.use("/medicalhis", MedicalHistory);
app.use("/drugs", DrugRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api", medicalFormRoute);
app.use("/notifications", notificationRoute);

// Listen on Render's port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});