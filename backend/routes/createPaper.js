import express from "express";
import { body, validationResult } from "express-validator";
import CreatePaper from "../models/CreatePaper.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const toNumberOrDefault = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toBooleanOrDefault = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const normalizePayload = (body) => ({
  ...body,
  difficulty: String(body.difficulty || "Mixed").trim(),
  duration: toNumberOrDefault(body.duration, 1),
  passingMarks: toNumberOrDefault(body.passingMarks, 0),
  maxAttempts: toNumberOrDefault(body.maxAttempts, 1),
  totalQuestions: toNumberOrDefault(body.totalQuestions, 0),
  totalMarks: toNumberOrDefault(body.totalMarks, 0),
  attempts: toNumberOrDefault(body.attempts, 0),
  avgScore: toNumberOrDefault(body.avgScore, 0),
  isPublic: toBooleanOrDefault(body.isPublic, true),
  shuffleQuestions: toBooleanOrDefault(body.shuffleQuestions, false),
  showResult: toBooleanOrDefault(body.showResult, true),
  assignedStudents: Array.isArray(body.assignedStudents) ? body.assignedStudents : [],
  startDate: body.startDate || "",
  endDate: body.endDate || "",
});

/**
 * GET /api/create-paper
 * Get all tests/papers
 */
router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 100 } = req.query;
    const query = {};

    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const skip = (pageNum - 1) * limitNum;

    const [tests, total] = await Promise.all([
      CreatePaper.find(query)
        .sort({ createdAt: -1 })
        .allowDiskUse(true)
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "email role"),
      CreatePaper.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Get create paper list error:", error);
    res.status(500).json({
      error: "Failed to fetch tests",
      message: error.message,
    });
  }
});

/**
 * GET /api/create-paper/:id
 * Get single test/paper
 */
router.get("/:id", async (req, res) => {
  try {
    const test = await CreatePaper.findById(req.params.id).populate(
      "createdBy",
      "email role",
    );
    if (!test) return res.status(404).json({ error: "Test not found" });

    res.json({
      success: true,
      data: { test },
    });
  } catch (error) {
    console.error("Get create paper by id error:", error);
    res.status(500).json({
      error: "Failed to fetch test",
      message: error.message,
    });
  }
});

// Mutations need authentication
router.use(authenticate);

const createValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be at least 1"),
  body("status")
    .optional()
    .isIn(["published", "draft"])
    .withMessage("Status must be published or draft"),
  body("questionConfigs").optional().isArray(),
  body("rewards").optional().isArray(),
];

/**
 * POST /api/create-paper
 * Create test/paper (admin only)
 */
router.post("/", createValidation, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only admins can create tests",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        errors: errors.array(),
      });
    }

    const payload = normalizePayload(req.body);
    const test = await CreatePaper.create({
      ...payload,
      createdBy: req.user.id,
      status: payload.status === "published" ? "published" : "draft",
      createdDate: payload.createdDate ? new Date(payload.createdDate) : new Date(),
    });

    await test.populate("createdBy", "email role");

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: { test },
    });
  } catch (error) {
    console.error("Create paper error:", error);
    res.status(500).json({
      error: "Failed to create test",
      message: error.message,
    });
  }
});

/**
 * PUT /api/create-paper/:id
 * Update test/paper (admin only)
 */
router.put("/:id", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only admins can update tests",
      });
    }

    const test = await CreatePaper.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    const payload = normalizePayload(req.body);
    Object.assign(test, payload);
    await test.save();
    await test.populate("createdBy", "email role");

    res.json({
      success: true,
      message: "Test updated successfully",
      data: { test },
    });
  } catch (error) {
    console.error("Update paper error:", error);
    res.status(500).json({
      error: "Failed to update test",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/create-paper/:id
 * Delete test/paper (admin only)
 */
router.delete("/:id", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only admins can delete tests",
      });
    }

    const test = await CreatePaper.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    await CreatePaper.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("Delete paper error:", error);
    res.status(500).json({
      error: "Failed to delete test",
      message: error.message,
    });
  }
});

export default router;
