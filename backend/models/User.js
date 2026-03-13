import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allows multiple null values
      index: true,
      validate: {
        validator: function (v) {
          // Email is optional, but if provided, must be valid
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    phone: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
      index: true,
      validate: {
        validator: function (v) {
          // Phone is optional, but if provided, must be 10 digits
          return !v || /^\d{10}$/.test(v);
        },
        message: "Phone must be exactly 10 digits",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "applicant"],
      default: "applicant",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Compound index: at least one of email or phone must be provided
userSchema.index({ email: 1, phone: 1 }, { unique: true, sparse: true });

// Index for email uniqueness (when not null)
userSchema.index({ email: 1 }, { unique: true, sparse: true, partialFilterExpression: { email: { $ne: null } } });

// Index for phone uniqueness (when not null)
userSchema.index({ phone: 1 }, { unique: true, sparse: true, partialFilterExpression: { phone: { $ne: null } } });

// Pre-save validation: ensure at least email or phone is provided
userSchema.pre("save", function (next) {
  if (!this.email && !this.phone) {
    const error = new Error("Either email or phone number is required");
    error.name = "ValidationError";
    return next(error);
  }
  next();
});

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
