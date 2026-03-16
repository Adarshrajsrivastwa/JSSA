import express from "express";
import { body, validationResult } from "express-validator";
import { authenticate } from "../middleware/auth.js";
// import { getRazorpayInstance, getRazorpayKeyId } from "../utils/razorpay.js"; // COMMENTED: Razorpay replaced with Cashfree
import { createCashfreeOrder, getCashfreeAppId, verifyCashfreePayment, verifyCashfreeSignature } from "../utils/cashfree.js";
import JobPosting from "../models/JobPosting.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { sendPaymentSuccessEmail } from "../utils/email.js";
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
 * Create Cashfree order for application fee payment
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
      
      // Get customer details from user if available
      const customerName = req.user?.name || "Customer";
      const customerEmail = req.user?.email || "";
      const customerPhone = req.user?.phone || "";

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

      // Get Cashfree App ID for frontend
      const appId = await getCashfreeAppId();

      // Create unique order ID
      const timestamp = Date.now().toString().slice(-10); // Last 10 digits
      const userIdShort = req.user.id.toString().slice(-8); // Last 8 chars of user ID
      const orderId = `JSSA_${userIdShort}_${timestamp}`;
      
      // Get return URL from request or use default
      // For local development, we'll skip return_url as Cashfree requires HTTPS
      const returnUrl = req.body.returnUrl || req.headers.origin || "";
      // Note: Cashfree requires HTTPS for return_url, so HTTP localhost URLs will be skipped
      
      // Create Cashfree order
      console.log("Creating Cashfree order with data:", {
        orderId,
        amountInPaise,
        amountInRupees,
        customerName: customerName || "Customer",
        hasCustomerEmail: !!customerEmail,
        hasCustomerPhone: !!customerPhone,
        hasReturnUrl: !!returnUrl,
        hasAppId: !!appId,
      });
      
      const order = await createCashfreeOrder({
        amount: amountInPaise,
        orderId: orderId,
        customerName: customerName || "Customer",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        notes: {
          jobPostingId: jobPostingId,
          userId: req.user.id,
          gender: gender,
          category: category,
          returnUrl: returnUrl,
        },
      });

      console.log("Cashfree order created successfully:", {
        orderId: order.order_id || orderId,
        hasPaymentSessionId: !!order.payment_session_id,
      });

      res.json({
        success: true,
        data: {
          orderId: order.order_id || orderId,
          paymentSessionId: order.payment_session_id,
          amount: amountInPaise,
          amountInRupees: amountInRupees,
          currency: "INR",
          appId: appId,
          feeKey: feeKey,
        },
      });
    } catch (error) {
      console.error("Create order error:", error);
      console.error("Error stack:", error.stack);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        orderId: req.body?.orderId || "N/A",
        jobPostingId: req.body?.jobPostingId || "N/A",
      });
      
      // Provide more detailed error message
      let errorMessage = error.message || "Payment gateway error";
      
      // If it's a Cashfree API error, include more context
      if (error.message && error.message.includes("Cashfree")) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes("credentials")) {
        errorMessage = error.message;
      } else {
        // Generic error - provide helpful message
        errorMessage = `Failed to create payment order: ${error.message || "Unknown error. Please check server logs for details."}`;
      }
      
      res.status(500).json({
        error: "Failed to create payment order",
        message: errorMessage,
      });
    }
  }
);

/* COMMENTED: Razorpay create order code
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
*/

/**
 * POST /api/payments/verify
 * Verify Cashfree payment and update application
 * Supports both authenticated users and public applications (from landing page)
 * Authentication is optional - signature verification provides security
 */
router.post(
  "/verify",
  [
    body("orderId").notEmpty().withMessage("Order ID is required"),
    body("paymentId").notEmpty().withMessage("Payment ID is required"),
    body("signature").notEmpty().withMessage("Signature is required"),
    body("applicationId").notEmpty().withMessage("Application ID is required"),
    body("orderAmount").notEmpty().withMessage("Order amount is required"),
    body("txStatus").notEmpty().withMessage("Transaction status is required"),
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

      const { orderId, paymentId, signature, applicationId, orderAmount, txStatus, paymentMode, txMsg, txTime } = req.body;

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

      // Verify Cashfree signature
      const isValidSignature = await verifyCashfreeSignature(
        orderId,
        orderAmount,
        paymentId,
        txStatus,
        paymentMode || "",
        txMsg || "",
        txTime || "",
        signature
      );

      if (!isValidSignature) {
        return res.status(400).json({
          error: "Payment verification failed",
          message: "Invalid payment signature",
        });
      }

      // Verify payment status
      if (txStatus !== "SUCCESS") {
        return res.status(400).json({
          error: "Payment verification failed",
          message: `Payment status is ${txStatus}. Payment must be successful.`,
        });
      }

      // Verify payment with Cashfree API
      try {
        const paymentDetails = await verifyCashfreePayment(orderId, paymentId);
        if (paymentDetails.payment_status !== "SUCCESS") {
          return res.status(400).json({
            error: "Payment verification failed",
            message: "Payment verification failed with Cashfree",
          });
        }
      } catch (verifyError) {
        console.error("Cashfree payment verification error:", verifyError);
        // Continue with signature verification if API call fails
      }

      // Update application with payment details
      application.paymentStatus = "paid";
      application.paymentId = paymentId;
      application.orderId = orderId;
      await application.save();

      // Send payment success email
      console.log("📧 ========== EMAIL SEND PROCESS START ==========");
      try {
        console.log("📧 Preparing to send payment success email...");
        console.log("📧 Application ID:", application._id);
        console.log("📧 Application email:", application.email);
        console.log("📧 Application createdBy:", application.createdBy);
        console.log("📧 Application paymentStatus:", application.paymentStatus);
        
        // Check if application has email
        if (!application.email) {
          console.warn("⚠️ Application email not found. Skipping email send.");
        } else {
          // Get user data for login credentials
          let user = null;
          if (application.createdBy) {
            try {
              user = await User.findById(application.createdBy);
              console.log("📧 User found:", user ? "Yes" : "No");
            } catch (userErr) {
              console.error("Error fetching user:", userErr);
            }
          }
          
          // Get job posting data
          let jobPosting = null;
          if (application.jobPostingId) {
            try {
              jobPosting = await JobPosting.findById(application.jobPostingId);
              console.log("📧 Job posting found:", jobPosting ? "Yes" : "No");
            } catch (jobErr) {
              console.error("Error fetching job posting:", jobErr);
            }
          }
          
          // Prepare login credentials - use user email/phone if available, otherwise use application email
          const defaultPassword = "JSSA@123";
          const loginCredentials = {
            identifier: user?.email || user?.phone || application.email,
            password: defaultPassword,
          };
          console.log("📧 Login credentials prepared:", loginCredentials.identifier);

          // Prepare application data for email (include all fields)
          const applicationDataForEmail = {
            ...application.toObject(),
            applicationNumber: application.applicationNumber,
            candidateName: application.candidateName,
            fatherName: application.fatherName,
            motherName: application.motherName,
            dob: application.dob,
            gender: application.gender,
            nationality: application.nationality,
            category: application.category,
            aadhar: application.aadhar,
            pan: application.pan,
            mobile: application.mobile,
            email: application.email,
            address: application.address,
            state: application.state,
            district: application.district,
            block: application.block,
            panchayat: application.panchayat,
            pincode: application.pincode,
            higherEducation: application.higherEducation,
            board: application.board,
            marks: application.marks,
            markPercentage: application.markPercentage,
            photo: application.photo,
            signature: application.signature,
          };

          console.log("📧 Sending payment success email to:", application.email);
          
          // Send email - use await to ensure it's called
          try {
            const emailResult = await sendPaymentSuccessEmail(
              applicationDataForEmail,
              loginCredentials,
              jobPosting
            );
            
            if (emailResult && emailResult.success) {
              console.log("✅ Payment success email sent successfully to:", application.email);
              console.log("✅ Message ID:", emailResult.messageId);
            } else {
              console.error("❌ Payment success email failed:", emailResult?.message || emailResult?.error || "Unknown error");
            }
          } catch (emailErr) {
            console.error("❌ Exception while sending payment success email:", emailErr);
            console.error("❌ Error message:", emailErr.message);
            console.error("❌ Error stack:", emailErr.stack);
          }
        }
      } catch (emailError) {
        console.error("❌ Error preparing payment success email:", emailError);
        console.error("❌ Error stack:", emailError.stack);
        // Don't fail the request if email preparation fails
      }

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

/* COMMENTED: Razorpay verify payment code
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
*/

/**
 * POST /api/payments/test-email
 * Test email sending (for debugging)
 * Admin only
 */
router.post(
  "/test-email",
  authenticate,
  async (req, res) => {
    try {
      // Only admin can test email
      if (req.user.role !== "admin") {
        return res.status(403).json({
          error: "Access denied",
          message: "Only admin can test email",
        });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "Email is required",
        });
      }

      console.log("📧 TEST EMAIL REQUEST");
      console.log("📧 Test email to:", email);
      console.log("📧 SMTP_USER:", process.env.SMTP_USER ? "Set" : "Not set");
      console.log("📧 SMTP_PASS:", process.env.SMTP_PASS ? "Set" : "Not set");

      // Import email function
      const { sendPaymentSuccessEmail } = await import("../utils/email.js");

      // Create test data
      const testApplicationData = {
        applicationNumber: "TEST123",
        candidateName: "Test User",
        email: email,
        mobile: "1234567890",
      };

      const testLoginCredentials = {
        identifier: email,
        password: "JSSA@123",
      };

      const result = await sendPaymentSuccessEmail(
        testApplicationData,
        testLoginCredentials,
        null
      );

      if (result.success) {
        res.json({
          success: true,
          message: "Test email sent successfully",
          data: result,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to send test email",
          message: result.message || result.error,
        });
      }
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({
        error: "Failed to send test email",
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/payments/status
 * Get payment status by orderId and applicationId
 * Optional authentication
 */
router.get("/status", async (req, res) => {
  try {
    const { orderId, applicationId } = req.query;

    if (!orderId || !applicationId) {
      return res.status(400).json({
        error: "Missing parameters",
        message: "orderId and applicationId are required",
      });
    }

    // Get application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: application.paymentStatus || "pending",
        paymentId: application.paymentId || null,
        orderId: application.orderId || orderId,
      },
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      error: "Failed to get payment status",
      message: error.message || "Payment status error",
    });
  }
});

export default router;
