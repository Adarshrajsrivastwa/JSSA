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
        email: "admin@jssa.in",
        password: "admin123", // Plain text for static login
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
      const isPasswordValid = await bcrypt.compare(password, user.password);
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

export default router;
