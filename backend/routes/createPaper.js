import express from "express";
import { body, validationResult } from "express-validator";
import CreatePaper from "../models/CreatePaper.js";
import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Attempt from "../models/Attempt.js";
import QuestionBank from "../models/QuestionBank.js";
import { authenticate } from "../middleware/auth.js";
import { sendTestAssignmentEmail } from "../utils/email.js";

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
  resultDate: body.resultDate || "",
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

    const [testsRaw, total] = await Promise.all([
      CreatePaper.find(query)
        .sort({ createdAt: -1 })
        .allowDiskUse(true)
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "email role")
        .populate("assignedStudents")
        .lean(),
      CreatePaper.countDocuments(query),
    ]);

    // Recalculate real-time attempts if needed, but for now we'll just ensure the count is correct
    // In a production app, we might want to aggregate this, but the $inc approach is usually fine.
    // Let's add the attempt count calculation just in case the manual $inc failed before.
    const testIds = testsRaw.map(t => t._id);
    const attemptsCounts = await Attempt.aggregate([
      { $match: { testId: { $in: testIds } } },
      { $group: { _id: "$testId", count: { $sum: 1 } } }
    ]);

    const attemptsMap = attemptsCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const tests = testsRaw.map(test => ({
      ...test,
      id: test._id.toString(),
      attempts: attemptsMap[test._id.toString()] || 0
    }));

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
 * GET /api/create-paper/assigned
 * Get exams assigned to the current student
 */
router.get("/assigned", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "applicant") {
      return res.json({ success: true, data: { tests: [] } });
    }

    // Parallel lookup for applications and student record
    const [applications, student] = await Promise.all([
      Application.find({ createdBy: req.user.id }).select("_id").lean(),
      Student.findOne({ userId: req.user.id }).select("_id").lean()
    ]);

    const applicationIds = applications.map(app => app._id);
    const studentId = student ? student._id : null;

    // Find tests assigned to any of these IDs
    const tests = await CreatePaper.find({
      $or: [
        { assignedStudents: { $in: applicationIds } },
        { assignedStudents: req.user.id },
        ...(studentId ? [{ assignedStudents: studentId }] : [])
      ]
    })
    .populate({
      path: "questionConfigs.questionId",
      select: "question questionHi options optionsHi _id" // Include Hindi fields
    })
    .lean();

    // Fetch existing attempts for this user to calculate attemptsUsed
    const userAttempts = await Attempt.find({ userId: req.user.id }).select("testId score createdAt").lean();
    const attemptData = userAttempts.reduce((acc, curr) => {
      const id = curr.testId.toString();
      if (!acc[id]) acc[id] = [];
      acc[id].push(curr);
      return acc;
    }, {});

    // Process tests to add windowStatus and canStart based on current date
    const now = new Date();
    const processedTests = tests.map(test => {
      let windowStatus = "active";
      const attempts = attemptData[test._id.toString()] || [];
      const attemptsUsed = attempts.length;
      let canStart = attemptsUsed < (test.maxAttempts || 1);

      const startDate = test.startDate ? new Date(test.startDate) : null;
      const endDate = test.endDate ? new Date(test.endDate) : null;

      if (startDate && now < startDate) {
        windowStatus = "upcoming";
        canStart = false;
      } else if (endDate && now > endDate) {
        windowStatus = "ended";
        canStart = false;
      }

      // Check if result can be shown
      let resultAvailable = test.showResult;
      if (!resultAvailable && test.resultDate) {
        const resDate = new Date(test.resultDate);
        if (now >= resDate) resultAvailable = true;
      }

      return {
        ...test,
        id: test._id.toString(), // Ensure frontend has 'id' field
        windowStatus,
        canStart,
        attemptsUsed,
        maxAttempts: test.maxAttempts || 1,
        shuffleQuestions: test.shuffleQuestions,
        resultDate: test.resultDate,
        resultAvailable,
        userAttempt: attempts.length > 0 ? attempts[0] : null, // Send first attempt for now
        // Map questions for frontend
        questions: (test.questionConfigs || []).map(q => ({
          id: q.questionId?._id,
          question: q.questionId?.question,
          questionHi: q.questionId?.questionHi,
          options: q.questionId?.options,
          optionsHi: q.questionId?.optionsHi,
          marks: q.marks,
          isCompulsory: q.isCompulsory
        }))
      };
    });

    res.json({
      success: true,
      data: { tests: processedTests }
    });
  } catch (error) {
    console.error("Get assigned exams error:", error);
    res.status(500).json({
      error: "Failed to fetch assigned exams",
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
    const test = await CreatePaper.findById(req.params.id)
      .populate("createdBy", "email role")
      .populate("assignedStudents", "candidateName mobile email district fatherName")
      .populate("questionConfigs.questionId", "question options marks difficulty topic");
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

    // Send emails to assigned students asynchronously
    if (test.assignedStudents && test.assignedStudents.length > 0) {
      (async () => {
        try {
          const students = await Application.find({ _id: { $in: test.assignedStudents } });
          for (const student of students) {
            if (student.email) {
              await sendTestAssignmentEmail(student.email, student.candidateName, {
                title: test.title,
                subject: test.subject,
                duration: test.duration,
                totalQuestions: test.totalQuestions,
                passingMarks: test.passingMarks,
                startDate: test.startDate,
                endDate: test.endDate,
              });
            }
          }
        } catch (emailErr) {
          console.error("Async creation assignment email error:", emailErr);
        }
      })();
    }

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
    
    // Check for newly assigned students to send emails
    const oldAssignedIds = (test.assignedStudents || []).map(id => id.toString());
    const newAssignedIds = (payload.assignedStudents || []).map(id => id.toString());
    
    const newlyAssigned = newAssignedIds.filter(id => !oldAssignedIds.includes(id));

    Object.assign(test, payload);
    await test.save();
    await test.populate("createdBy", "email role");

    // Send emails to newly assigned students asynchronously
    if (newlyAssigned.length > 0) {
      (async () => {
        try {
          const students = await Application.find({ _id: { $in: newlyAssigned } });
          for (const student of students) {
            if (student.email) {
              await sendTestAssignmentEmail(student.email, student.candidateName, {
                title: test.title,
                subject: test.subject,
                duration: test.duration,
                totalQuestions: test.totalQuestions,
                passingMarks: test.passingMarks,
                startDate: test.startDate,
                endDate: test.endDate,
              });
            }
          }
        } catch (emailErr) {
          console.error("Async assignment email error:", emailErr);
        }
      })();
    }

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

/**
 * POST /api/create-paper/:id/submit
 * Submit an exam attempt (applicant only)
 */
router.post("/:id/submit", authenticate, async (req, res) => {
  try {
    const test = await CreatePaper.findById(req.params.id).populate("questionConfigs.questionId");
    if (!test) return res.status(404).json({ error: "Test not found" });

    // Check attempts limit
    const attemptsCount = await Attempt.countDocuments({
      testId: test._id,
      userId: req.user.id,
    });

    if (attemptsCount >= (test.maxAttempts || 1)) {
      return res.status(400).json({
        error: "Max attempts reached",
        message: "You have already reached the maximum attempts for this test.",
      });
    }

    const { answers, answeredCount, autoSubmitted } = req.body;

    // Calculate score
    let score = 0;
    const testQuestions = test.questionConfigs || [];
    
    testQuestions.forEach(config => {
      const qId = config.questionId?._id?.toString();
      const studentAnswerIndex = answers[qId];
      
      if (studentAnswerIndex !== undefined) {
        const correctOption = config.questionId?.correctAnswer; // Usually "A", "B", "C", "D" or the text
        const options = config.questionId?.options || [];
        
        // Match by index (0=A, 1=B, etc.) or by text
        const selectedOptionText = options[studentAnswerIndex];
        
        if (selectedOptionText === correctOption || 
            String.fromCharCode(65 + studentAnswerIndex) === correctOption) {
          score += config.marks || 1;
        }
      }
    });

    const attempt = await Attempt.create({
      testId: test._id,
      userId: req.user.id,
      answers,
      answeredCount,
      autoSubmitted,
      score,
      totalQuestions: test.totalQuestions || 0,
      endTime: new Date(),
    });

    // Increment attempts count in CreatePaper
    await CreatePaper.findByIdAndUpdate(test._id, { $inc: { attempts: 1 } });

    // Determine if result should be shown instantly
    const showInstant = test.showResult;
    const resultDate = test.resultDate;
    const now = new Date();
    
    let resultMessage = "";
    if (showInstant) {
      resultMessage = `You scored ${score} marks.`;
    } else if (resultDate) {
      resultMessage = `Your result will be declared on ${resultDate}.`;
    } else {
      resultMessage = "Your attempt has been saved. Results will be announced later.";
    }

    res.json({
      success: true,
      message: "Attempt submitted successfully",
      data: { 
        attemptId: attempt._id,
        score: showInstant ? score : null,
        showInstant,
        resultMessage
      },
    });
  } catch (error) {
    console.error("Submit attempt error:", error);
    res.status(500).json({
      error: "Failed to submit attempt",
      message: error.message,
    });
  }
});

/**
 * GET /api/create-paper/:id/review
 * Get attempt details for review (without correct answers)
 */
router.get("/:id/review", authenticate, async (req, res) => {
  try {
    const test = await CreatePaper.findById(req.params.id).populate("questionConfigs.questionId");
    if (!test) return res.status(404).json({ error: "Test not found" });

    const attempt = await Attempt.findOne({
      testId: test._id,
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return res.status(404).json({ error: "No attempt found for this test" });
    }

    // Map questions with user answers and correctness, but NO correct answers
    const reviewData = (test.questionConfigs || []).map(config => {
      const qId = config.questionId?._id?.toString();
      const userAnswerIndex = attempt.answers.get(qId);
      const options = config.questionId?.options || [];
      const correctAnswer = config.questionId?.correctAnswer;

      let isCorrect = false;
      if (userAnswerIndex !== undefined) {
        const selectedOptionText = options[userAnswerIndex];
        if (selectedOptionText === correctAnswer || 
            String.fromCharCode(65 + userAnswerIndex) === correctAnswer) {
          isCorrect = true;
        }
      }

      return {
        id: qId,
        question: config.questionId?.question,
        questionHi: config.questionId?.questionHi,
        options: options,
        optionsHi: config.questionId?.optionsHi || [],
        userAnswerIndex,
        isCorrect,
        // We explicitly do NOT send the correct answer index or text
      };
    });

    res.json({
      success: true,
      data: {
        testTitle: test.title,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        review: reviewData
      }
    });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({
      error: "Failed to fetch review data",
      message: error.message,
    });
  }
});

export default router;
