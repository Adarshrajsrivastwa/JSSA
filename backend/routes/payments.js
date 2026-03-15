import express from "express";
import { body, validationResult } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import { getRazorpayInstance, getRazorpayKeyId } from "../utils/razorpay.js";
import JobPosting from "../models/JobPosting.js";
import Application from "../models/Application.js";
import crypto from "crypto";

const router = express.Router();

/**
 * GET /api/payments/calculate-fee
 * Calculate fee for a job posting based on gender and category (PUBLIC)
 */
router.get("/calculate-fee", async (req, res) => {
  try {
    const { jobPostingId, gender, category } = req.query;

    if (!jobPostingId || !gender || !category) {
      return res.status(400).json({
        error: "Missing parameters",
        message: "jobPostingId, gender, and category are required",
      });
    }

    // Get job posting
    const jobPosting = await JobPosting.findById(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({
        error: "Job posting not found",
      });
    }

    // Calculate fee
    const feeKey = `${gender}_${category}`;
    const feeAmount = jobPosting.feeStructure?.[feeKey] || "0";
    const amountInRupees = parseFloat(feeAmount.toString().replace(/[₹,]/g, "")) || 0;

    res.json({
      success: true,
      data: {
        amount: amountInRupees,
        feeKey: feeKey,
        feeStructure: jobPosting.feeStructure,
      },
    });
  } catch (error) {
    console.error("Calculate fee error:", error);
    res.status(500).json({
      error: "Failed to calculate fee",
      message: error.message,
    });
  }
});

/**
 * POST /api/payments/create-order
 * Create Razorpay order for application fee payment
 * Requires authentication
 */
router.post(
  "/create-order",
  authenticate,
  [
    body("jobPostingId").notEmpty().withMessage("Job posting ID is required"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Valid gender is required"),
    body("category").isIn(["general", "obc", "sc", "st", "ews"]).withMessage("Valid category is required"),
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

      const { jobPostingId, gender, category } = req.body;

      // Get job posting
      const jobPosting = await JobPosting.findById(jobPostingId);
      if (!jobPosting) {
        return res.status(404).json({
          error: "Job posting not found",
        });
      }

      // Calculate fee based on gender and category
      const feeKey = `${gender}_${category}`;
      const feeAmount = jobPosting.feeStructure?.[feeKey] || "0";
      
      // Convert fee to number (remove ₹ if present, handle empty string)
      const amountInRupees = parseFloat(feeAmount.toString().replace(/[₹,]/g, "")) || 0;
      const amountInPaise = Math.round(amountInRupees * 100);

      if (amountInPaise <= 0) {
        return res.status(400).json({
          error: "Invalid fee amount",
          message: "Fee amount is zero or invalid for this combination",
        });
      }

      // Get Razorpay instance
      const razorpay = await getRazorpayInstance();
      if (!razorpay) {
        return res.status(500).json({
          error: "Payment gateway not configured",
          message: "Razorpay credentials are not configured. Please contact administrator.",
        });
      }

      // Get Razorpay key ID for frontend
      const keyId = await getRazorpayKeyId();

      // Create order with shortened receipt (max 40 chars)
      const timestamp = Date.now().toString().slice(-10); // Last 10 digits
      const userIdShort = req.user.id.toString().slice(-8); // Last 8 chars of user ID
      const receipt = `app_${userIdShort}_${timestamp}`.substring(0, 40); // Ensure max 40 chars
      
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt,
        notes: {
          jobPostingId: jobPostingId,
          userId: req.user.id,
          gender: gender,
          category: category,
        },
      });

      res.json({
        success: true,
        data: {
          orderId: order.id,
          amount: amountInPaise,
          amountInRupees: amountInRupees,
          currency: "INR",
          keyId: keyId,
          feeKey: feeKey,
        },
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({
        error: "Failed to create payment order",
        message: error.message || "Payment gateway error",
      });
    }
  }
);

/**
 * POST /api/payments/verify
 * Verify payment and update application
 * Supports both authenticated users and public applications (from landing page)
 * Authentication is optional - signature verification provides security
 */
router.post(
  "/verify",
  [
    body("razorpay_order_id").notEmpty().withMessage("Order ID is required"),
    body("razorpay_payment_id").notEmpty().withMessage("Payment ID is required"),
    body("razorpay_signature").notEmpty().withMessage("Signature is required"),
    body("applicationId").notEmpty().withMessage("Application ID is required"),
  ],
  // Optional authentication - try to authenticate but don't fail if no token
  async (req, res, next) => {
    try {
      // Try to authenticate if token is provided
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const { verifyToken, extractToken } = await import("../utils/jwt.js");
        const token = extractToken(authHeader);
        if (token) {
          const decoded = verifyToken(token);
          if (decoded) {
            req.user = { id: decoded.id, role: decoded.role };
          }
        }
      }
      next();
    } catch (err) {
      // Continue without authentication if token is invalid
      next();
    }
  },
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId } = req.body;

      // Get application
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          error: "Application not found",
        });
      }

      // Verify ownership - allow if user is authenticated and owns the application
      // OR if no user is authenticated (public application from landing page)
      // The signature verification will ensure security
      if (req.user) {
        // If user is authenticated, verify ownership
        if (application.createdBy && application.createdBy.toString() !== req.user.id) {
          return res.status(403).json({
            error: "Access denied",
            message: "You can only verify payments for your own applications",
          });
        }
      }
      // If no user is authenticated (public application), proceed with signature verification only

      // Get Razorpay credentials for signature verification
      const { getRazorpayCredentials } = await import("../utils/razorpay.js");
      const credentials = await getRazorpayCredentials();

      // Verify signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", credentials.keySecret)
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          error: "Payment verification failed",
          message: "Invalid payment signature",
        });
      }

      // Update application with payment details
      application.paymentStatus = "paid";
      application.paymentId = razorpay_payment_id;
      application.orderId = razorpay_order_id;
      await application.save();

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          application: {
            id: application._id,
            paymentStatus: application.paymentStatus,
            paymentId: application.paymentId,
            orderId: application.orderId,
          },
        },
      });
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(500).json({
        error: "Failed to verify payment",
        message: error.message || "Payment verification error",
      });
    }
  }
);

export default router;
