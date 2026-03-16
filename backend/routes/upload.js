import express from "express";
import { uploadPDF, uploadFileToCloudinary } from "../middleware/upload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/upload/advertisement
 * Upload advertisement PDF or image (admin only)
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

    // Upload to Cloudinary
    const cloudinaryResult = await uploadFileToCloudinary(
      req.file.buffer,
      "jssa/advertisements",
      req.file.mimetype
    );

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.public_id,
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
