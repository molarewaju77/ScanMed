import express from "express";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/auth.route.js";
import healthScanRoutes from "./routes/healthScan.route.js";
import medicationRoutes from "./routes/medication.route.js";
import chatRoutes from "./routes/chat.route.js";
import userRoutes from "./routes/users.route.js";
import readingLogRoutes from "./routes/readingLog.route.js";
import settingsRoutes from "./routes/settings.route.js";
import articleRoutes from "./routes/article.route.js";
import mlRoutes from "./routes/ml.route.js";
import adminRoutes from "./routes/admin.routes.js";
import appointmentRoutes from "./routes/appointment.route.js";
import hospitalRoutes from "./routes/hospital.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import adminManagementRoutes from "./routes/adminManagement.route.js";
import setupReminderJob from "./jobs/reminder.job.js";

// DB Connection
import { connectDB } from "./db/connectDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// CORS Configuration
// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://scan-med.vercel.app"],
    credentials: true,
  })
);

// Middleware
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies
app.use("/uploads", express.static("uploads"));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://scanmed-backend.onrender.com"],
        connectSrc: ["'self'", "https://scanmed-backend.onrender.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health-scans", healthScanRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reading-history", readingLogRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin-management", adminManagementRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend API running successfully" });
});

app.listen(PORT, () => {
  connectDB();
  setupReminderJob();
  console.log(`Server is running on port: ${PORT}`);
});
