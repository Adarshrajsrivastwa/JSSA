import express from "express";
import { uploadPDF } from "../middleware/upload.js";
import { authenticate } from "../middleware/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads/advertisements");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadsDir);
}

/**
 * POST /api/upload/advertisement
 * Upload advertisement PDF or image (admin only) - saves locally
 */
router.post("/advertisement", uploadPDF.single("file"), async (req, res) => {
  try {
    // Only admin can upload files
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only admins can upload advertisement files",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file provided",
        message: "Please select a file to upload",
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const originalName = req.file.originalname || "file";
    const ext = path.extname(originalName) || (req.file.mimetype === "application/pdf" ? ".pdf" : ".jpg");
    const filename = `${timestamp}_${randomStr}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to local storage
    fs.writeFileSync(filepath, req.file.buffer);

    // Get base URL from request or environment
    const protocol = req.protocol || "http";
    const host = req.get("host") || process.env.BACKEND_URL || `localhost:${process.env.PORT || 3006}`;
    const baseUrl = `${protocol}://${host}`;
    
    // Return full local file URL
    const fileUrl = `${baseUrl}/api/files/advertisements/${filename}`;

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: fileUrl,
        filename: filename,
      },
    });
  } catch (error) {
    console.error("Upload advertisement file error:", error);
    res.status(500).json({
      error: "Failed to upload file",
      message: error.message,
    });
  }
});

export default router;
