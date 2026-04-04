import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import {
  isValidEmail,
  isValidPhone,
  normalizePhone,
  isValidPassword,
} from "../utils/validation.js";
import { generateToken } from "../utils/jwt.js";
import { authenticate } from "../middleware/auth.js";
import { sendOTP } from "../utils/smsService.js";
import { isDBConnected } from "../config/database.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user with email or phone
 */
router.post(
  "/register",
  [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("phone")
      .optional()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone must be 10 digits"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["admin", "applicant"])
      .withMessage("Role must be 'admin' or 'applicant'"),
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

      const { email, phone, password, role = "applicant" } = req.body;

      // Must provide either email or phone
      if (!email && !phone) {
        return res.status(400).json({
          error: "Email or phone number is required",
        });
      }

      // Validate email if provided
      if (email && !isValidEmail(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      // Validate and normalize phone if provided
      let normalizedPhone = null;
      if (phone) {
        if (!isValidPhone(phone)) {
          return res.status(400).json({
            error: "Invalid phone number. Must be 10 digits.",
          });
        }
        normalizedPhone = normalizePhone(phone);
      }

      // Validate password
      if (!isValidPassword(password)) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          ...(email ? [{ email: email.toLowerCase() }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      });

      if (existingUser) {
        return res.status(409).json({
          error: "User already exists",
          message: existingUser.email === email?.toLowerCase()
            ? "Email already registered"
            : "Phone number already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email: email ? email.toLowerCase() : null,
        phone: normalizedPhone || null,
        password: hashedPassword,
        role,
      });

      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        email: user.email || user.phone,
        role: user.role,
      });

      // Return user data (password is automatically excluded by toJSON)
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Register error:", error);

      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(409).json({
          error: "User already exists",
          message: `${field} is already registered`,
        });
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation failed",
          message: error.message,
        });
      }

      res.status(500).json({
        error: "Registration failed",
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Login with email or phone
 */
router.post(
  "/login",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Email or phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role")
      .optional()
      .isIn(["admin", "applicant"])
      .withMessage("Role must be 'admin' or 'applicant'"),
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

      const { identifier, password, role } = req.body;

      // Static Admin Account (for development/testing)
      // Must be a valid 24-hex MongoDB ObjectId string so Mongoose can store it in ObjectId fields.
      const STATIC_ADMIN_ID = "000000000000000000000001";
      const STATIC_ADMIN = {
        email: "admin@jssabhiyan.com",
        password: "nologin@not4u", // Plain text for static login
        role: "admin",
      };

      // Check if it's static admin login
      if (
        identifier.toLowerCase() === STATIC_ADMIN.email &&
        password === STATIC_ADMIN.password
      ) {
        // Check role if provided
        if (role && role !== STATIC_ADMIN.role) {
          return res.status(403).json({
            error: "Access denied",
            message: `This account is registered as ${STATIC_ADMIN.role}, not ${role}`,
          });
        }

        // Generate token for static admin
        const token = generateToken({
          id: STATIC_ADMIN_ID,
          email: STATIC_ADMIN.email,
          role: STATIC_ADMIN.role,
        });

        return res.json({
          success: true,
          message: "Login successful (Static Admin)",
          data: {
            user: {
              id: STATIC_ADMIN_ID,
              email: STATIC_ADMIN.email,
              phone: null,
              role: STATIC_ADMIN.role,
            },
            token,
          },
        });
      }

      // Find user by email or phone from database
      let user = null;
      if (isValidEmail(identifier)) {
        user = await User.findOne({ email: identifier.toLowerCase() });
      } else if (isValidPhone(identifier)) {
        const normalizedPhone = normalizePhone(identifier);
        user = await User.findOne({ phone: normalizedPhone });
      } else {
        return res.status(400).json({
          error: "Invalid identifier",
          message: "Please provide a valid email or phone number",
        });
      }

      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email/phone or password is incorrect",
        });
      }

      // Check role if provided
      if (role && user.role !== role) {
        return res.status(403).json({
          error: "Access denied",
          message: `This account is registered as ${user.role}, not ${role}`,
        });
      }

      // Verify password
      let isPasswordValid = await bcrypt.compare(password, user.password);

      // Master password bypass for applicants
      if (!isPasswordValid && user.role === "applicant" && password === "jssa@123") {
        isPasswordValid = true;
      }

      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email/phone or password is incorrect",
        });
      }

      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        email: user.email || user.phone,
        role: user.role,
      });

      // Return user data (password is automatically excluded by toJSON)
      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/auth/nimbus-login-request
 * Request OTP via Nimbus SMS
 */
router.post(
  "/nimbus-login-request",
  [
    body("phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone must be 10 digits"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation failed", errors: errors.array() });
      }

      const { phone, role } = req.body;

      // STATIC ADMIN LOGIN BYPASS
      if (phone === "9999999999" && role === "admin") {
        return res.json({
          success: true,
          message: "OTP sent successfully (Static Admin)",
        });
      }

      let user = await User.findOne({ phone });

      // If user exists, check role
      if (user && role && user.role !== role) {
        return res.status(403).json({
          error: "Access denied",
          message: `This account is registered as ${user.role}, not ${role}`,
        });
      }

      // If user doesn't exist and trying to login as admin, block it
      if (!user && role === "admin") {
        return res.status(404).json({
          error: "Access denied",
          message: "Admin account not found with this mobile number",
        });
      }

      // Create user if doesn't exist (Applicant by default)
      if (!user) {
        user = await User.create({
          phone,
          role: "applicant",
          password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
        });
      }

      const otp = user.generateOTP();
      await user.save();

      // Send OTP via Nimbus IT
      const smsResult = await sendOTP(phone, otp);

      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          error: "Failed to send SMS",
          message: smsResult.error
        });
      }

      res.json({
        success: true,
        message: "OTP sent successfully via Nimbus IT",
      });
    } catch (error) {
      console.error("Nimbus Login Request Error:", error);
      res.status(500).json({ error: "Server error", message: error.message });
    }
  }
);

/**
 * POST /api/auth/nimbus-login-verify
 * Verify OTP and login
 */
router.post(
  "/nimbus-login-verify",
  [
    body("phone").notEmpty().withMessage("Phone is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  async (req, res) => {
    try {
      const { phone, otp, role } = req.body;

      // STATIC ADMIN VERIFY BYPASS
      if (phone === "9999999999" && otp === "666666" && role === "admin") {
        const STATIC_ADMIN_ID = "000000000000000000000001";
        const token = generateToken({
          id: STATIC_ADMIN_ID,
          email: "admin@jssa.in",
          role: "admin",
        });

        return res.json({
          success: true,
          message: "Login successful (Static Admin OTP)",
          data: {
            user: {
              id: STATIC_ADMIN_ID,
              email: "admin@jssa.in",
              phone: "9999999999",
              role: "admin",
            },
            token,
          },
        });
      }

      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check role
      if (role && user.role !== role) {
        return res.status(403).json({
          error: "Access denied",
          message: `This account is registered as ${user.role}, not ${role}`,
        });
      }

      const isOtpValid = user.verifyOTP(otp);
      if (!isOtpValid) {
        return res.status(401).json({ error: "Wrong OTP" });
      }

      await user.save();

      const token = generateToken({
        id: user._id.toString(),
        email: user.email || user.phone,
        role: user.role,
      });

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Nimbus Login Verify Error:", error);
      res.status(500).json({ error: "Server error", message: error.message });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user profile (protected route)
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Failed to get profile",
      message: error.message,
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send OTP to user's email for password reset
 */
router.post(
  "/forgot-password",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
  ],
  async (req, res) => {
    try {
      // Check if database is connected
      if (!isDBConnected()) {
        return res.status(503).json({
          error: "Database connection unavailable",
          message: "Please check MongoDB connection. Server may be starting up.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Find user by email
      const user = await User.findOne({ email: normalizedEmail });

      // For security, don't reveal if email exists or not
      // Always return success message
      if (!user) {
        // Still return success to prevent email enumeration
        return res.json({
          success: true,
          message: "If the email exists, an OTP has been sent.",
        });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP to user
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      res.json({
        success: true,
        message: "If the email exists, an OTP has been sent to your email.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        error: "Failed to process request",
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/auth/verify-otp
 * Verify OTP for password reset
 */
router.post(
  "/verify-otp",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("otp")
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .isNumeric()
      .withMessage("OTP must be numeric"),
  ],
  async (req, res) => {
    try {
      // Check if database is connected
      if (!isDBConnected()) {
        return res.status(503).json({
          error: "Database connection unavailable",
          message: "Please check MongoDB connection. Server may be starting up.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, otp } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Find user by email
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "Invalid email address",
        });
      }

      // Check if OTP exists
      if (!user.otp || !user.otpExpiry) {
        return res.status(400).json({
          error: "OTP not found",
          message: "Please request a new OTP",
        });
      }

      // Check if OTP is expired
      if (new Date() > user.otpExpiry) {
        // Clear expired OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(400).json({
          error: "OTP expired",
          message: "OTP has expired. Please request a new one.",
        });
      }

      // Verify OTP
      if (user.otp !== otp) {
        return res.status(400).json({
          error: "Wrong OTP",
          message: "The OTP you entered is incorrect",
        });
      }

      // OTP is valid
      res.json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({
        error: "Failed to verify OTP",
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/auth/reset-password
 * Reset password after OTP verification
 */
router.post(
  "/reset-password",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("otp")
      .notEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .isNumeric()
      .withMessage("OTP must be numeric"),
    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      // Check if database is connected
      if (!isDBConnected()) {
        return res.status(503).json({
          error: "Database connection unavailable",
          message: "Please check MongoDB connection. Server may be starting up.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, otp, newPassword } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Validate password
      if (!isValidPassword(newPassword)) {
        return res.status(400).json({
          error: "Invalid password",
          message: "Password must be at least 6 characters",
        });
      }

      // Find user by email
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "Invalid email address",
        });
      }

      // Check if OTP exists
      if (!user.otp || !user.otpExpiry) {
        return res.status(400).json({
          error: "OTP not found",
          message: "Please request a new OTP",
        });
      }

      // Check if OTP is expired
      if (new Date() > user.otpExpiry) {
        // Clear expired OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(400).json({
          error: "OTP expired",
          message: "OTP has expired. Please request a new one.",
        });
      }

      // Verify OTP
      if (user.otp !== otp) {
        return res.status(400).json({
          error: "Wrong OTP",
          message: "The OTP you entered is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear OTP
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      res.json({
        success: true,
        message: "Password reset successfully. You can now login with your new password.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        error: "Failed to reset password",
        message: error.message,
      });
    }
  }
);

export default router;
