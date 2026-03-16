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
import uploadRoutes from "./routes/upload.js";
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
const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
  // Localhost for development (common ports)
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:4173",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5174",
  // Parse CORS_ALLOWED_ORIGINS from .env (comma-separated)
  ...(process.env.CORS_ALLOWED_ORIGINS 
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
    : []
  ),
  // Legacy support for FRONTEND_URL
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  // Support for LANDING_URL (landing page URL)
  ...(process.env.LANDING_URL ? [process.env.LANDING_URL] : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // In development, allow all localhost origins
    if (isDevelopment) {
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Production convenience: allow our own domains (landing + dashboard) without env wiring
    // This prevents Razorpay authenticated routes from failing due to missing LANDING_URL/FRONTEND_URL.
    if (!isDevelopment) {
      try {
        const { hostname, protocol } = new URL(origin);
        const isHttp = protocol === "http:" || protocol === "https:";
        const isJssaDomain = hostname === "jssabhiyan.com" || hostname.endsWith(".jssabhiyan.com");
        if (isHttp && isJssaDomain) {
          return callback(null, true);
        }
      } catch (e) {
        // ignore parse errors; fall through to allowlist check
      }
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.warn(`CORS blocked origin: ${origin}`);
      console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400 // 24 hours
}));

// Set Permissions-Policy header to prevent accelerometer permission violations
// This suppresses warnings from third-party scripts trying to access accelerometer
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  );
  next();
});
// Increase body parser limit to handle base64 images (10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files statically with proper MIME types
const uploadsPath = path.join(__dirname, "uploads");
app.use("/api/files", express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    // Set proper Content-Type for PDFs
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');
    }
  }
}));

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
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error: Origin not allowed',
      message: `The origin ${req.headers.origin || 'unknown'} is not allowed by CORS policy.`,
      allowedOrigins: isDevelopment ? 'All localhost origins' : allowedOrigins
    });
  }
  
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
      console.log(`🌐 CORS Mode: ${isDevelopment ? 'Development (allowing all localhost)' : 'Production'}`);
      if (isDevelopment) {
        console.log(`   Allowing all localhost origins for development`);
      } else {
        console.log(`   Allowed origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'None configured'}`);
      }
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
      console.log(`🌐 CORS Mode: ${isDevelopment ? 'Development (allowing all localhost)' : 'Production'}`);
      console.warn(`⚠️  MongoDB connection failed - database operations will not work`);
    });
  });
