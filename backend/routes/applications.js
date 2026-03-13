import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";
import { generateToken } from "../utils/jwt.js";
import { normalizePhone } from "../utils/validation.js";
import { sendApplicationEmail } from "../utils/email.js";

const router = express.Router();

// Public route for applying with auto-user creation
/**
 * POST /api/applications/apply
 * Apply for job posting - auto-creates user if application number doesn't exist
 */
router.post(
  "/apply",
  [
    body("candidateName").notEmpty().withMessage("Candidate name is required"),
    body("fatherName").notEmpty().withMessage("Father's name is required"),
    body("mobile")
      .matches(/^\d{10}$/)
      .withMessage("Mobile must be exactly 10 digits"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("district").notEmpty().withMessage("District is required"),
    body("higherEducation")
      .notEmpty()
      .withMessage("Higher education is required"),
    body("jobPostingId").notEmpty().withMessage("Job posting ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        applicationNumber,
        candidateName,
        fatherName,
        motherName,
        dob,
        gender,
        nationality,
        category,
        aadhar,
        pan,
        mobile,
        email,
        address,
        state,
        district,
        block,
        panchayat,
        pincode,
        higherEducation,
        board,
        marks,
        markPercentage,
        jobPostingId,
        photo,
        signature,
      } = req.body;

      // Normalize phone
      const normalizedPhone = normalizePhone(mobile);

      // Generate application number if not provided
      // Format: First 4 letters of name + Month (2 digits) + Year (4 digits)
      let generatedApplicationNumber = applicationNumber;
      if (!generatedApplicationNumber && candidateName) {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
        const year = now.getFullYear(); // 2024
        
        // Get first 4 letters of candidate name (uppercase, remove spaces)
        const namePart = candidateName
          .replace(/\s+/g, "")
          .substring(0, 4)
          .toUpperCase()
          .padEnd(4, "X"); // If name is less than 4 chars, pad with X
        
        generatedApplicationNumber = `${namePart}${month}${year}`;
      }

      // Check if user exists by phone or email
      let user = await User.findOne({
        $or: [
          { phone: normalizedPhone },
          ...(email ? [{ email: email.toLowerCase() }] : []),
        ],
      });

      // If user doesn't exist, create new user with default password
      if (!user) {
        const defaultPassword = "JSSA@123"; // Default password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        user = await User.create({
          phone: normalizedPhone,
          email: email ? email.toLowerCase() : null,
          password: hashedPassword,
          role: "applicant",
        });
      }

      // Create application with all fields
      const applicationData = {
        applicationNumber: generatedApplicationNumber || null,
        candidateName,
        fatherName,
        mobile: normalizedPhone,
        district,
        higherEducation,
        jobPostingId,
        createdBy: user._id,
        gender: gender || null,
        category: category || null,
        photo: photo || null,
        signature: signature || null,
        // Additional fields (stored in application document)
        motherName: motherName || null,
        dob: dob || null,
        nationality: nationality || null,
        aadhar: aadhar || null,
        pan: pan || null,
        email: email || null,
        address: address || null,
        state: state || null,
        block: block || null,
        panchayat: panchayat || null,
        pincode: pincode || null,
        board: board || null,
        marks: marks || null,
        markPercentage: markPercentage || null,
      };

      const application = await Application.create(applicationData);

      // Generate token for the user
      const token = generateToken({
        id: user._id.toString(),
        email: user.email || user.phone,
        role: user.role,
      });

      // Prepare login credentials for email
      const defaultPassword = "JSSA@123";
      const loginCredentials = {
        identifier: user.email || user.phone,
        password: defaultPassword,
      };

      // Send email with application details (async, don't wait for it)
      if (email) {
        sendApplicationEmail(
          {
            ...applicationData,
            applicationNumber: generatedApplicationNumber,
            email: email,
          },
          loginCredentials
        ).catch((err) => {
          console.error("Failed to send application email:", err);
          // Don't fail the request if email fails
        });
      }

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: {
          application,
          user: {
            id: user._id,
            phone: user.phone,
            email: user.email,
            role: user.role,
          },
          token,
          defaultPassword: defaultPassword,
        },
      });
    } catch (error) {
      console.error("Apply error:", error);
      res.status(500).json({
        error: "Failed to submit application",
        message: error.message,
      });
    }
  }
);

// All routes below require authentication
router.use(authenticate);

/**
 * GET /api/applications
 * Get all applications (with filters)
 */
router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, jobPostingId } = req.query;
    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by job posting ID
    if (jobPostingId) {
      query.jobPostingId = jobPostingId;
    }

    // Search filter
    if (search) {
      query.$or = [
        { candidateName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    // Role-based access: applicants can only see their own applications
    if (req.user.role === "applicant") {
      query.createdBy = req.user.id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "email phone role")
      .populate("jobPostingId", "advtNo post title");

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({
      error: "Failed to fetch applications",
      message: error.message,
    });
  }
});

/**
 * GET /api/applications/:id
 * Get application by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("createdBy", "email phone role")
      .populate("jobPostingId", "advtNo post title location education");

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    // Role-based access check
    if (
      req.user.role === "applicant" &&
      application.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only view your own applications",
      });
    }

    res.json({
      success: true,
      data: { application },
    });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({
      error: "Failed to fetch application",
      message: error.message,
    });
  }
});

/**
 * POST /api/applications
 * Create new application
 */
router.post(
  "/",
  [
    body("candidateName").notEmpty().withMessage("Candidate name is required"),
    body("fatherName").notEmpty().withMessage("Father's name is required"),
    body("mobile")
      .matches(/^\d{10}$/)
      .withMessage("Mobile must be exactly 10 digits"),
    body("district").notEmpty().withMessage("District is required"),
    body("higherEducation")
      .notEmpty()
      .withMessage("Higher education is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const applicationData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const application = await Application.create(applicationData);

      res.status(201).json({
        success: true,
        message: "Application created successfully",
        data: { application },
      });
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({
        error: "Failed to create application",
        message: error.message,
      });
    }
  }
);

/**
 * PUT /api/applications/:id
 * Update application
 */
router.put(
  "/:id",
  [
    body("candidateName").optional().notEmpty(),
    body("fatherName").optional().notEmpty(),
    body("mobile")
      .optional()
      .matches(/^\d{10}$/)
      .withMessage("Mobile must be exactly 10 digits"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({
          error: "Application not found",
        });
      }

      // Role-based access check
      if (
        req.user.role === "applicant" &&
        application.createdBy.toString() !== req.user.id
      ) {
        return res.status(403).json({
          error: "Access denied",
          message: "You can only update your own applications",
        });
      }

      // Only admin can change status
      if (req.body.status && req.user.role !== "admin") {
        delete req.body.status;
      }

      Object.assign(application, req.body);
      await application.save();

      res.json({
        success: true,
        message: "Application updated successfully",
        data: { application },
      });
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({
        error: "Failed to update application",
        message: error.message,
      });
    }
  }
);

/**
 * DELETE /api/applications/:id
 * Delete application
 */
router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    // Role-based access check
    if (
      req.user.role === "applicant" &&
      application.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only delete your own applications",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({
      error: "Failed to delete application",
      message: error.message,
    });
  }
});

/**
 * GET /api/applications/check/:jobPostingId
 * Check if current user has already applied for a job posting
 */
router.get("/check/:jobPostingId", async (req, res) => {
  try {
    const { jobPostingId } = req.params;
    
    // Only applicants can check their own applications
    if (req.user.role !== "applicant") {
      return res.json({
        success: true,
        data: { hasApplied: false },
      });
    }

    const existingApplication = await Application.findOne({
      jobPostingId: jobPostingId,
      createdBy: req.user.id,
    });

    res.json({
      success: true,
      data: {
        hasApplied: !!existingApplication,
        applicationId: existingApplication?._id || null,
        paymentStatus: existingApplication?.paymentStatus || null,
        gender: existingApplication?.gender || null,
        category: existingApplication?.category || null,
      },
    });
  } catch (error) {
    console.error("Check application error:", error);
    res.status(500).json({
      error: "Failed to check application",
      message: error.message,
    });
  }
});

export default router;
