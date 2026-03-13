import { verifyToken, extractToken } from "../utils/jwt.js";
import User from "../models/User.js";

// Must be a valid 24-hex MongoDB ObjectId string so Mongoose can store it in ObjectId fields.
const STATIC_ADMIN_ID = "000000000000000000000001";

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "No token provided",
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: "Invalid token",
        message: "Token is expired or invalid",
      });
    }

    // Handle static admin user (support both old and new ID format)
    if (decoded.id === STATIC_ADMIN_ID || decoded.id === "static_admin_001") {
      req.user = {
        id: STATIC_ADMIN_ID, // Always use the new valid ObjectId format
        email: decoded.email || "admin@jssa.in",
        phone: null,
        role: decoded.role || "admin",
      };
      return next();
    }

    // Find user by ID from token (database users)
    // Only query database if it's a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(decoded.id)) {
      return res.status(401).json({
        error: "Invalid user ID format",
        message: "Token contains invalid user ID",
      });
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: "User not found",
        message: "Token is valid but user doesn't exist",
      });
    }

    // Attach user to request (password is automatically excluded by toJSON)
    req.user = {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "Authentication failed",
      message: error.message,
    });
  }
}
