import express from "express";
import { body, validationResult } from "express-validator";
import JobPosting from "../models/JobPosting.js";
import Application from "../models/Application.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/job-postings
 * Get all job postings (public, but filtered by status)
 */
router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { post: { $regex: search, $options: "i" } },
        { advtNo: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const postings = await JobPosting.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "email phone role");

    const total = await JobPosting.countDocuments(query);

    res.json({
      success: true,
      data: {
        postings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get job postings error:", error);
    res.status(500).json({
      error: "Failed to fetch job postings",
      message: error.message,
    });
  }
});

/**
 * GET /api/job-postings/latest-vacancies
 * Get latest vacancies (active job postings) - Public endpoint
 */
router.get("/latest-vacancies", async (req, res) => {
  try {
    // Get all active job postings
    const postings = await JobPosting.find({
      status: "Active",
    })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to latest 20 vacancies

    // Format vacancies with separate English and Hindi fields for parallel display
    const vacancies = postings.map((posting) => {
      const hindiTitle = posting.postTitle?.hi || posting.post?.hi || "";
      const englishTitle = posting.postTitle?.en || posting.post?.en || "";
      const advtNo = posting.advtNo || "";

      return {
        id: posting._id,
        english: `Recruitment for the Posts of ${englishTitle} Advt. No. ${advtNo}`,
        hindi: `${hindiTitle} विज्ञप्ति संख्या: ${advtNo}`,
        advtNo: advtNo,
        link: `/job-postings/view/${posting._id}`,
      };
    });

    res.json({
      success: true,
      data: {
        vacancies,
      },
    });
  } catch (error) {
    console.error("Get latest vacancies error:", error);
    res.status(500).json({
      error: "Failed to fetch latest vacancies",
      message: error.message,
    });
  }
});

/**
 * GET /api/job-postings/latest-results
 * Get latest results (job postings with applications) - Public endpoint
 */
router.get("/latest-results", async (req, res) => {
  try {
    // Get all job postings that have applications
    const jobPostingsWithApplications = await Application.distinct("jobPostingId", {
      jobPostingId: { $ne: null },
    });

    if (jobPostingsWithApplications.length === 0) {
      return res.json({
        success: true,
        data: {
          results: [],
        },
      });
    }

    // Get job postings details
    const postings = await JobPosting.find({
      _id: { $in: jobPostingsWithApplications },
      status: "Active",
    })
      .sort({ firstMeritListDate: -1, createdAt: -1 })
      .limit(20); // Limit to latest 20 results

    // Format results with separate English and Hindi fields for parallel display
    const results = postings.map((posting) => {
      const hindiTitle = posting.postTitle?.hi || posting.post?.hi || "";
      const englishTitle = posting.postTitle?.en || posting.post?.en || "";
      const advtNo = posting.advtNo || "";

      return {
        id: posting._id,
        english: `First Merit List ${englishTitle} Advt.No: ${advtNo}`,
        hindi: `प्रथम मेधा सूची ${hindiTitle}`,
        advtNo: advtNo,
        link: `/job-postings/view/${posting._id}`,
      };
    });

    res.json({
      success: true,
      data: {
        results,
      },
    });
  } catch (error) {
    console.error("Get latest results error:", error);
    res.status(500).json({
      error: "Failed to fetch latest results",
      message: error.message,
    });
  }
});

/**
 * GET /api/job-postings/:id
 * Get job posting by ID (public)
 */
router.get("/:id", async (req, res) => {
  try {
    const posting = await JobPosting.findById(req.params.id).populate(
      "createdBy",
      "email phone role"
    );

    if (!posting) {
      return res.status(404).json({
        error: "Job posting not found",
      });
    }

    res.json({
      success: true,
      data: { posting },
    });
  } catch (error) {
    console.error("Get job posting error:", error);
    res.status(500).json({
      error: "Failed to fetch job posting",
      message: error.message,
    });
  }
});

// All routes below require authentication
router.use(authenticate);

/**
 * POST /api/job-postings
 * Create new job posting (admin only)
 */
router.post(
  "/",
  [
    body("advtNo").notEmpty().withMessage("Advertisement number is required"),
    body("title.en").notEmpty().withMessage("Title (English) is required"),
    body("title.hi").optional(),
    body("postTitle.en").notEmpty().withMessage("Post title (English) is required"),
    body("postTitle.hi").optional(),
    body("post.en").notEmpty().withMessage("Post name (English) is required"),
    body("post.hi").notEmpty().withMessage("Post name (Hindi) is required"),
    body("income.en").notEmpty().withMessage("Income range (English) is required"),
    body("income.hi").notEmpty().withMessage("Income range (Hindi) is required"),
    body("incomeMin").isNumeric().withMessage("Minimum income must be a number"),
    body("incomeMax").isNumeric().withMessage("Maximum income must be a number"),
    body("education.en").notEmpty().withMessage("Education (English) is required"),
    body("education.hi").notEmpty().withMessage("Education (Hindi) is required"),
    body("location.en").notEmpty().withMessage("Location (English) is required"),
    body("location.hi").notEmpty().withMessage("Location (Hindi) is required"),
    body("fee.en").optional().notEmpty().withMessage("Application fee (English) is required"),
    body("fee.hi").optional().notEmpty().withMessage("Application fee (Hindi) is required"),
    body("ageLimit.en").notEmpty().withMessage("Age limit (English) is required"),
    body("ageLimit.hi").notEmpty().withMessage("Age limit (Hindi) is required"),
    body("selectionProcess.en").optional(),
    body("selectionProcess.hi").optional(),
    body("lastDate").notEmpty().withMessage("Last date is required"),
    body("applicationOpeningDate").notEmpty().withMessage("Application opening date is required"),
    body("feeStructure").optional().isObject().withMessage("Fee structure must be an object"),
    body("locationArrHi").optional().isArray().withMessage("Location array (Hindi) must be an array"),
    body("advertisementFile").optional().isString(),
    body("advertisementFileHi").optional().isString(),
  ],
  async (req, res) => {
    try {
      // Only admin can create job postings
      if (req.user.role !== "admin") {
        return res.status(403).json({
          error: "Access denied",
          message: "Only admins can create job postings",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", JSON.stringify(errors.array(), null, 2));
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({
          error: "Validation failed",
          message: "Please check all required fields",
          errors: errors.array(),
        });
      }

      // Ensure all Hindi fields are included
      const postingData = {
        ...req.body,
        // Ensure locationArrHi is saved
        locationArrHi: req.body.locationArrHi || [],
        // Ensure feeStructure is saved
        feeStructure: req.body.feeStructure || {},
        // Ensure advertisement files are saved
        advertisementFile: req.body.advertisementFile || "",
        advertisementFileHi: req.body.advertisementFileHi || "",
        createdBy: req.user.id,
      };

      const posting = await JobPosting.create(postingData);

      res.status(201).json({
        success: true,
        message: "Job posting created successfully",
        data: { posting },
      });
    } catch (error) {
      console.error("Create job posting error:", error);
      if (error.code === 11000) {
        return res.status(409).json({
          error: "Duplicate entry",
          message: "Advertisement number already exists",
        });
      }
      res.status(500).json({
        error: "Failed to create job posting",
        message: error.message,
      });
    }
  }
);

/**
 * PUT /api/job-postings/:id
 * Update job posting (admin only)
 */
router.put(
  "/:id",
  [
    body("advtNo").optional().notEmpty(),
    body("postTitle").optional().notEmpty(),
    body("post").optional().notEmpty(),
  ],
  async (req, res) => {
    try {
      // Only admin can update job postings
      if (req.user.role !== "admin") {
        return res.status(403).json({
          error: "Access denied",
          message: "Only admins can update job postings",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const posting = await JobPosting.findById(req.params.id);

      if (!posting) {
        return res.status(404).json({
          error: "Job posting not found",
        });
      }

      // Ensure all Hindi fields are updated
      const updateData = {
        ...req.body,
        // Ensure locationArrHi is updated
        locationArrHi: req.body.locationArrHi !== undefined ? req.body.locationArrHi : posting.locationArrHi,
        // Ensure feeStructure is updated
        feeStructure: req.body.feeStructure || posting.feeStructure || {},
        // Ensure advertisement files are updated
        advertisementFile: req.body.advertisementFile !== undefined ? req.body.advertisementFile : posting.advertisementFile,
        advertisementFileHi: req.body.advertisementFileHi !== undefined ? req.body.advertisementFileHi : posting.advertisementFileHi,
      };

      Object.assign(posting, updateData);
      await posting.save();

      res.json({
        success: true,
        message: "Job posting updated successfully",
        data: { posting },
      });
    } catch (error) {
      console.error("Update job posting error:", error);
      res.status(500).json({
        error: "Failed to update job posting",
        message: error.message,
      });
    }
  }
);

/**
 * DELETE /api/job-postings/:id
 * Delete job posting (admin only)
 */
router.delete("/:id", async (req, res) => {
  try {
    // Only admin can delete job postings
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only admins can delete job postings",
      });
    }

    const posting = await JobPosting.findById(req.params.id);

    if (!posting) {
      return res.status(404).json({
        error: "Job posting not found",
      });
    }

    await JobPosting.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job posting deleted successfully",
    });
  } catch (error) {
    console.error("Delete job posting error:", error);
    res.status(500).json({
      error: "Failed to delete job posting",
      message: error.message,
    });
  }
});

export default router;
