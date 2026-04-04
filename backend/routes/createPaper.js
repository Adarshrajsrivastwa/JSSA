import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import CreatePaper from "../models/CreatePaper.js";
import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Attempt from "../models/Attempt.js";
import QuestionBank from "../models/QuestionBank.js";
import { authenticate } from "../middleware/auth.js";
import { sendExamAssignmentSMS, sendExamPassSMS } from "../utils/smsService.js";

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
  mouStartDate: body.mouStartDate || "",
  mouEndDate: body.mouEndDate || "",
  assignedStudents: Array.isArray(body.assignedStudents) ? body.assignedStudents : [],
  startDate: body.startDate || "",
  endDate: body.endDate || "",
});

const sendAssignmentNotifications = async (studentIds, startDate, endDate) => {
  if (!studentIds || studentIds.length === 0) {
    console.log("⚠️ No students assigned, skipping SMS notifications.");
    return;
  }
  
  console.log(`📱 Initiating SMS notifications for ${studentIds.length} students...`);
  
  try {
    const students = await Application.find({ _id: { $in: studentIds } }).select("mobile candidateName");
    console.log(`📱 Found ${students.length} student records for notification.`);

    const phones = students.map(s => s.mobile).filter(m => m && m.length === 10);
    console.log(`📱 Valid mobile numbers found: ${phones.length}`);
    
    // Format dates for SMS
    const formatSmsDate = (dateStr) => {
      if (!dateStr) return "N/A";
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {
        return dateStr;
      }
    };

    const formattedStart = formatSmsDate(startDate);
    const formattedEnd = formatSmsDate(endDate);
    console.log(`📱 Exam Window: ${formattedStart} to ${formattedEnd}`);

    // Send SMS to each student
    const smsPromises = students.map(student => {
      if (student.mobile && student.mobile.length === 10) {
        console.log(`📱 Sending SMS to: ${student.candidateName} (${student.mobile})`);
        return sendExamAssignmentSMS(student.mobile, formattedStart, formattedEnd);
      }
      return Promise.resolve({ success: false, error: "Invalid mobile" });
    });
    
    const results = await Promise.allSettled(smsPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`✅ Exam assignment SMS process completed. Success: ${successCount}/${phones.length}`);
  } catch (error) {
    console.error("❌ Error in sendAssignmentNotifications:", error);
  }
};

/**
 * GET /api/create-paper
 * Get all tests/papers (Default: Full details for compatibility)
 * Pass ?minimal=true to get only basic exam metadata
 */
router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 100, minimal = "false" } = req.query;
    const isMinimal = minimal === "true";
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
    
    // If limit is "0", treat as no limit (capped at 10000 for safety)
    let limitNum = parseInt(limit, 10);
    if (limit === "0") {
      limitNum = 10000;
    } else {
      limitNum = Math.min(Math.max(limitNum || 100, 1), 1000);
    }
    const skip = (pageNum - 1) * limitNum;

    // Build selection and population based on minimal flag
    let findQuery = CreatePaper.find(query)
      .sort({ createdAt: -1 })
      .allowDiskUse(true)
      .skip(skip)
      .limit(limitNum);

    if (isMinimal) {
      // Return only basic metadata fields
      findQuery = findQuery.select("title class type difficulty duration passingMarks description startDate endDate isPublic shuffleQuestions showResult status createdDate createdBy totalQuestions totalMarks assignedStudents");
      findQuery = findQuery.populate("createdBy", "email role");
    } else {
      // Full details with populations
      findQuery = findQuery.populate("createdBy", "email role")
        .populate("assignedStudents")
        .populate("questionConfigs.questionId");
    }

    const [testsRaw, total] = await Promise.all([
      findQuery.lean(),
      CreatePaper.countDocuments(query),
    ]);

    // Recalculate real-time attempts if needed
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
 * GET /api/create-paper/details/:id
 * Get ALL details for a specific test (full population)
 */
router.get("/details/:id", async (req, res) => {
  try {
    const test = await CreatePaper.findById(req.params.id)
      .populate("createdBy", "email role")
      .populate({
        path: "assignedStudents",
        select: "-__v", // Get all fields except version key
      })
      .populate({
        path: "questionConfigs.questionId",
        select: "-__v",
      });

    if (!test) {
      return res.status(404).json({
        success: false,
        error: "Test not found",
      });
    }

    // Convert to object to modify safely
    const testObj = test.toObject();
    testObj.id = testObj._id.toString();

    // Dynamically calculate totalQuestions and totalMarks if they are 0
    if (!testObj.totalQuestions || testObj.totalQuestions === 0) {
      testObj.totalQuestions = (testObj.questionConfigs || []).length;
    }
    if (!testObj.totalMarks || testObj.totalMarks === 0) {
      testObj.totalMarks = (testObj.questionConfigs || []).reduce(
        (sum, q) => sum + (q.marks || 0),
        0
      );
    }

    res.json({
      success: true,
      data: { test: testObj },
    });
  } catch (error) {
    console.error("Get full test details error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch full test details",
      message: error.message,
    });
  }
});

/**
 * GET /api/create-paper/:id/attempts
 * Get attempts for a specific test with pagination
 */
router.get("/:id/attempts", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 1. Initial query by testId
    const query = { testId: req.params.id };

    // 2. Search filter (requires Application join/lookup)
    let applicationFilter = {};
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      applicationFilter = {
        $or: [
          { candidateName: searchRegex },
          { mobile: searchRegex },
          { email: searchRegex },
          { applicationNumber: searchRegex },
          { district: searchRegex }
        ]
      };
    }

    // 3. Status filter (requires CreatePaper for passingMarks)
    const test = await CreatePaper.findById(req.params.id).select("passingMarks totalMarks").lean();
    if (!test) return res.status(404).json({ error: "Test not found" });
    const passingMarks = test.passingMarks || 40;

    // Use aggregation to handle search and status filtering efficiently
    const aggregate = Attempt.aggregate([
      { $match: { testId: new mongoose.Types.ObjectId(req.params.id) } },
      
      // Lookup application details
      {
        $lookup: {
          from: "applications",
          localField: "applicationId",
          foreignField: "_id",
          as: "application"
        }
      },
      { $unwind: { path: "$application", preserveNullAndEmptyArrays: true } },

      // Apply search filters
      ...(search ? [{
        $match: {
          $or: [
            { "application.candidateName": { $regex: search, $options: "i" } },
            { "application.mobile": { $regex: search, $options: "i" } },
            { "application.email": { $regex: search, $options: "i" } },
            { "application.applicationNumber": { $regex: search, $options: "i" } },
            { "application.district": { $regex: search, $options: "i" } }
          ]
        }
      }] : []),

      // Apply status filters
      ...(status !== "all" ? [{
        $addFields: {
          pct: { 
            $cond: [
              { $gt: [test.totalMarks || 100, 0] },
              { $multiply: [{ $divide: ["$score", test.totalMarks || 100] }, 100] },
              0
            ]
          }
        }
      }, {
        $match: {
          ...(status === "pass" ? { score: { $gte: passingMarks } } : {}),
          ...(status === "fail" ? { score: { $lt: passingMarks } } : {})
          // Missed/Pending are handled differently (usually no attempt record exists)
        }
      }] : []),

      // Final structure mapping to match previous populate output
      {
        $project: {
          _id: 1,
          testId: 1,
          userId: 1,
          applicationId: "$application", // Rename unwound application back
          score: 1,
          totalQuestions: 1,
          answeredCount: 1,
          autoSubmitted: 1,
          startTime: 1,
          endTime: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    const [results] = await Attempt.aggregate([
      { $facet: {
        data: [
          ...aggregate.pipeline(),
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limitNum }
        ],
        totalCount: [
          ...aggregate.pipeline(),
          { $count: "count" }
        ]
      }}
    ]);

    const attempts = results.data;
    const total = results.totalCount[0]?.count || 0;

    res.json({
      success: true,
      data: { 
        attempts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      },
    });
  } catch (error) {
    console.error("Get test attempts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch test attempts",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/create-paper/:id/attempts/:applicationId
 * Delete attempts for a specific student to allow re-exam
 */
router.delete("/:id/attempts/:applicationId", async (req, res) => {
  try {
    const { id, applicationId } = req.params;
    
    // Find attempts count for this user
    const deleted = await Attempt.deleteMany({ 
      testId: id, 
      applicationId: applicationId 
    });

    if (deleted.deletedCount > 0) {
      // Decrement the total attempts count in CreatePaper
      await CreatePaper.findByIdAndUpdate(id, { 
        $inc: { attempts: -deleted.deletedCount } 
      });
    }

    res.json({
      success: true,
      message: `Successfully reset attempts for student. They can now re-take the exam.`,
      deletedCount: deleted.deletedCount
    });
  } catch (error) {
    console.error("Delete test attempt error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset test attempts",
      message: error.message,
    });
  }
});

/**
 * DELETE /api/create-paper/:id/attempts/bulk-reset
 * Reset attempts for all provided student IDs
 */
router.delete("/:id/attempts/bulk-reset", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: "No student IDs provided." });
    }

    const deleted = await Attempt.deleteMany({
      testId: id,
      applicationId: { $in: studentIds }
    });

    if (deleted.deletedCount > 0) {
      await CreatePaper.findByIdAndUpdate(id, {
        $inc: { attempts: -deleted.deletedCount }
      });
    }

    res.json({
      success: true,
      message: `Successfully reset attempts for ${deleted.deletedCount} students.`,
      deletedCount: deleted.deletedCount
    });
  } catch (error) {
    console.error("Bulk reset attempts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to bulk reset attempts",
      message: error.message,
    });
  }
});

/**
 * POST /api/create-paper/:id/re-exam
 * Create a new exam by cloning the questions of :id but only for failed/missed students
 */
router.post("/:id/re-exam", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds, titlePrefix = "Re-Exam: " } = req.body;
    
    const original = await CreatePaper.findById(id);
    if (!original) return res.status(404).json({ error: "Original test not found" });

    // Clone data
    const cloneData = original.toObject();
    delete cloneData._id;
    delete cloneData.createdAt;
    delete cloneData.updatedAt;
    delete cloneData.attempts;
    delete cloneData.avgScore;
    
    cloneData.title = `${titlePrefix}${original.title}`;
    cloneData.assignedStudents = studentIds || [];
    cloneData.status = "draft"; // Start as draft
    cloneData.createdDate = new Date();
    cloneData.createdBy = req.user.id;

    const newTest = await CreatePaper.create(cloneData);

    res.json({
      success: true,
      message: "Re-Exam paper created successfully as a draft.",
      data: { test: newTest }
    });
  } catch (error) {
    console.error("Create re-exam error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create re-exam paper",
      message: error.message,
    });
  }
});

/**
 * GET /api/create-paper/:id
 * Get single test/paper (standard population)
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
  console.log("🚀 POST /api/create-paper called");
  console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
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

    // If published, send SMS to all assigned students
    console.log(`🔍 Checking for SMS trigger (Create). Status: ${test.status}, Assigned: ${test.assignedStudents?.length || 0}`);
    if (test.status === "published" && test.assignedStudents && test.assignedStudents.length > 0) {
      console.log("🎯 Triggering sendAssignmentNotifications (Create)");
      sendAssignmentNotifications(test.assignedStudents, test.startDate, test.endDate);
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
  console.log(`🚀 PUT /api/create-paper/${req.params.id} called`);
  console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "Only admins can update tests",
      });
    }

    const test = await CreatePaper.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    // Use req.body directly for partial updates to avoid overwriting with defaults
    const updateData = { ...req.body };
    
    // Check if status is being updated to published
    const statusChangedToPublished = test.status !== "published" && updateData.status === "published";
    
    // Check if new students are being added (only if assignedStudents is in request)
    let newStudents = [];
    if (Array.isArray(updateData.assignedStudents)) {
      const oldStudents = test.assignedStudents.map(id => id.toString());
      newStudents = updateData.assignedStudents.filter(id => !oldStudents.includes(id.toString()));
    }

    // Apply only provided fields
    Object.assign(test, updateData);
    
    // Handle specific type conversions if they are provided
    if (updateData.duration !== undefined) test.duration = toNumberOrDefault(updateData.duration, test.duration);
    if (updateData.passingMarks !== undefined) test.passingMarks = toNumberOrDefault(updateData.passingMarks, test.passingMarks);
    if (updateData.maxAttempts !== undefined) test.maxAttempts = toNumberOrDefault(updateData.maxAttempts, test.maxAttempts);
    if (updateData.isPublic !== undefined) test.isPublic = toBooleanOrDefault(updateData.isPublic, test.isPublic);
    if (updateData.shuffleQuestions !== undefined) test.shuffleQuestions = toBooleanOrDefault(updateData.shuffleQuestions, test.shuffleQuestions);
    if (updateData.showResult !== undefined) test.showResult = toBooleanOrDefault(updateData.showResult, test.showResult);
    if (updateData.mouStartDate !== undefined) test.mouStartDate = updateData.mouStartDate;
    if (updateData.mouEndDate !== undefined) test.mouEndDate = updateData.mouEndDate;

    await test.save();
    await test.populate("createdBy", "email role");

    console.log(`🔍 Checking for SMS trigger (Update). Published: ${test.status === "published"}, StatusChanged: ${statusChangedToPublished}, NewStudents: ${newStudents.length}, TotalAssigned: ${test.assignedStudents?.length || 0}`);

    // If status changed to published, send to ALL assigned students
    if (statusChangedToPublished && test.assignedStudents && test.assignedStudents.length > 0) {
      console.log(`🎯 Triggering sendAssignmentNotifications (Status change to Published for ${test.assignedStudents.length} students)`);
      sendAssignmentNotifications(test.assignedStudents, test.startDate, test.endDate);
    } 
    // Otherwise, if already published and new students were added in this update
    else if (test.status === "published" && newStudents.length > 0) {
      console.log(`🎯 Triggering sendAssignmentNotifications for ${newStudents.length} new students`);
      sendAssignmentNotifications(newStudents, test.startDate, test.endDate);
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

    // Get the student's application to link it
    const application = await Application.findOne({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

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
      applicationId: application ? application._id : null,
      answers,
      answeredCount,
      autoSubmitted,
      score,
      totalQuestions: test.totalQuestions || 0,
      endTime: new Date(),
    });

    // Increment attempts count in CreatePaper
    await CreatePaper.findByIdAndUpdate(test._id, { $inc: { attempts: 1 } });

    // Send instant Result SMS if results are public and student PASSED
    const isPassed = score >= (test.passingMarks || 0);
    if (test.showResult && isPassed && application && application.mobile) {
      console.log(`📱 Instant Result: Student ${application.candidateName} passed. Triggering SMS...`);
      sendExamPassSMS(
        application.mobile,
        application.applicationNumber,
        score,
        test.mouStartDate || "N/A",
        test.mouEndDate || "N/A"
      ).catch(err => console.error("❌ Instant pass SMS failed:", err));
    }

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
