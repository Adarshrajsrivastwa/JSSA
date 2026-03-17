import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import Application from "../models/Application.js";
import User from "../models/User.js";
import JobPosting from "../models/JobPosting.js";
import { authenticate } from "../middleware/auth.js";
import { generateToken } from "../utils/jwt.js";
import { normalizePhone } from "../utils/validation.js";
import { sendPaymentSuccessEmail } from "../utils/email.js"; // Email sent on form submission (before payment)

const router = express.Router();

const getJobTitleFromPosting = (jobPosting) => {
  if (!jobPosting || typeof jobPosting !== "object") return null;
  if (jobPosting.post && typeof jobPosting.post === "object") {
    return jobPosting.post.en || jobPosting.post.hi || jobPosting.title || null;
  }
  if (typeof jobPosting.post === "string" && jobPosting.post.trim()) {
    return jobPosting.post;
  }
  return jobPosting.title || null;
};

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
      // Format: Random 9-digit number
      let generatedApplicationNumber = applicationNumber;
      if (!generatedApplicationNumber) {
        // Generate random 9-digit number (100000000 to 999999999)
        generatedApplicationNumber = String(Math.floor(100000000 + Math.random() * 900000000));
        
        // Ensure uniqueness by checking if it already exists
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 10) {
          const existing = await Application.findOne({ applicationNumber: generatedApplicationNumber });
          if (!existing) {
            isUnique = true;
          } else {
            // Generate a new number if duplicate found
            generatedApplicationNumber = String(Math.floor(100000000 + Math.random() * 900000000));
            attempts++;
          }
        }
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
        console.log("📧 Sending application email on form submission...");
        console.log("📧 Application email:", email);
        
        // Get job posting data for email
        let jobPosting = null;
        if (jobPostingId) {
          try {
            jobPosting = await JobPosting.findById(jobPostingId);
            console.log("📧 Job posting found for email:", jobPosting ? "Yes" : "No");
          } catch (jobErr) {
            console.error("Error fetching job posting for email:", jobErr);
          }
        }
        
        // Prepare login credentials
        const loginCredentials = {
          identifier: user.email || user.phone,
          password: defaultPassword,
        };

        // Prepare application data for email (include all fields)
        const applicationDataForEmail = {
          ...application.toObject(),
            applicationNumber: generatedApplicationNumber,
          candidateName: candidateName,
          fatherName: fatherName,
          motherName: motherName || null,
          dob: dob || null,
          gender: gender || null,
          nationality: nationality || null,
          category: category || null,
          aadhar: aadhar || null,
          pan: pan || null,
          mobile: normalizedPhone,
            email: email,
          address: address || null,
          state: state || null,
          district: district,
          block: block || null,
          panchayat: panchayat || null,
          pincode: pincode || null,
          higherEducation: higherEducation,
          board: board || null,
          marks: marks || null,
          markPercentage: markPercentage || null,
          photo: photo || null,
          signature: signature || null,
        };

        // Send email using payment success email function (same format, no PDF)
        console.log("📧 ========== EMAIL SEND PROCESS START (FORM SUBMISSION) ==========");
        console.log("📧 Preparing to send application email...");
        console.log("📧 Application email:", email);
        console.log("📧 Application Number:", generatedApplicationNumber);
        console.log("📧 User ID:", user._id);
        console.log("📧 Job Posting ID:", jobPostingId);
        console.log("📧 SMTP_USER configured:", !!process.env.SMTP_USER);
        console.log("📧 SMTP_PASS configured:", !!process.env.SMTP_PASS);
        
        try {
          const emailResult = await sendPaymentSuccessEmail(
            applicationDataForEmail,
            loginCredentials,
            jobPosting,
            null // No PDF file path
          );
          
          if (emailResult && emailResult.success) {
            console.log("✅ Application email sent successfully to:", email);
            console.log("✅ Message ID:", emailResult.messageId);
            console.log("✅ PDF attached:", emailResult.pdfAttached || false);
          } else {
            console.error("❌ Application email failed:", emailResult?.message || emailResult?.error || "Unknown error");
          }
        } catch (emailErr) {
          console.error("❌ Exception while sending application email:", emailErr);
          console.error("❌ Error message:", emailErr.message);
          console.error("❌ Error stack:", emailErr.stack);
          // Don't fail the request if email fails
        }
      } else {
        console.log("⚠️ No email provided, skipping email send");
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

    const applicationObjects = applications.map((application) => application.toObject());
    const requestedPosting = jobPostingId
      ? await JobPosting.findById(jobPostingId).select("post title").lean()
      : null;
    const requestedFallbackTitle = getJobTitleFromPosting(requestedPosting);
    const activePostings = await JobPosting.find({ status: "Active" })
      .select("post title")
      .sort({ createdAt: -1 })
      .lean();
    const globalFallbackTitle =
      requestedFallbackTitle ||
      (activePostings.length > 0 ? getJobTitleFromPosting(activePostings[0]) : null);
    const unresolvedJobPostingIds = applicationObjects
      .map((application) => {
        const title = getJobTitleFromPosting(application.jobPostingId) || application.jobTitle || null;
        if (title) return null;
        if (application.jobPostingId && typeof application.jobPostingId === "object") {
          return application.jobPostingId._id?.toString() || null;
        }
        if (application.jobPostingId) return application.jobPostingId.toString();
        return null;
      })
      .filter(Boolean);

    const uniqueUnresolvedIds = [...new Set(unresolvedJobPostingIds)];
    let fallbackTitleMap = new Map();
    if (uniqueUnresolvedIds.length > 0) {
      const fallbackPostings = await JobPosting.find({
        _id: { $in: uniqueUnresolvedIds },
      }).select("_id post title");
      fallbackTitleMap = new Map(
        fallbackPostings.map((posting) => [posting._id.toString(), getJobTitleFromPosting(posting.toObject())]),
      );
    }

    const applicationsWithJobTitle = applicationObjects.map((applicationObj) => {
      const primaryTitle = getJobTitleFromPosting(applicationObj.jobPostingId) || applicationObj.jobTitle || null;
      if (primaryTitle) {
        return { ...applicationObj, jobTitle: primaryTitle };
      }

      const postingId =
        applicationObj.jobPostingId && typeof applicationObj.jobPostingId === "object"
          ? applicationObj.jobPostingId._id?.toString()
          : applicationObj.jobPostingId?.toString();

      return {
        ...applicationObj,
        jobTitle: postingId
          ? fallbackTitleMap.get(postingId) || globalFallbackTitle || null
          : globalFallbackTitle || null,
      };
    });

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: {
        applications: applicationsWithJobTitle,
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

    let fallbackTitle = null;
    if (!application.jobPostingId) {
      const activePostings = await JobPosting.find({ status: "Active" })
        .select("post title")
        .sort({ createdAt: -1 })
        .lean();
      if (activePostings.length > 0) {
        fallbackTitle = getJobTitleFromPosting(activePostings[0]);
      }
    }

    res.json({
      success: true,
      data: {
        application: {
          ...application.toObject(),
          jobTitle:
            getJobTitleFromPosting(application.jobPostingId) ||
            application.jobTitle ||
            (application.jobPostingId
              ? getJobTitleFromPosting(
                  await JobPosting.findById(application.jobPostingId).select("post title").lean(),
                )
              : fallbackTitle),
        },
      },
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
