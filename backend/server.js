import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import applicationsRoutes from "./routes/applications.js";
import jobPostingsRoutes from "./routes/jobPostings.js";
import studentsRoutes from "./routes/students.js";
import dashboardRoutes from "./routes/dashboard.js";
import settingsRoutes from "./routes/settings.js";
import galleryRoutes from "./routes/gallery.js";
import scrollerRoutes from "./routes/scroller.js";
import paymentsRoutes from "./routes/payments.js";
import notificationsRoutes from "./routes/notifications.js";
import { connectDB } from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - Allow domains from environment variables
const allowedOrigins = [
  // Localhost for development
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  // Parse CORS_ALLOWED_ORIGINS from .env (comma-separated)
  ...(process.env.CORS_ALLOWED_ORIGINS 
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
    : []
  ),
  // Legacy support for FRONTEND_URL
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Increase body parser limit to handle base64 images (10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "JSSA Backend API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/job-postings", jobPostingsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/scroller", scrollerRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/notifications", notificationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start server
connectDB()
  .then((connected) => {
    app.listen(PORT, () => {
      console.log(`🚀 JSSA Backend server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      if (!connected) {
        console.log(`⚠️  Note: MongoDB not connected - update MONGODB_URI in .env`);
      }
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    // Still start server even if DB connection fails (for testing)
    app.listen(PORT, () => {
      console.log(`🚀 JSSA Backend server running on http://localhost:${PORT} (without DB)`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.warn(`⚠️  MongoDB connection failed - database operations will not work`);
    });
  });
