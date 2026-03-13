import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { authAPI } from "../utils/api";

const GREEN = "#3AB000";
const DARK_GREEN = "#2d8a00";

function Logo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="white"
        stroke={GREEN}
        strokeWidth="4"
      />
      <defs>
        <path id="topArcL" d="M 16,60 a44,44 0 0,1 88,0" />
        <path id="botArcL" d="M 16,60 a44,44 0 0,0 88,0" />
      </defs>
      <text fontSize="7" fill="#444" fontWeight="bold" letterSpacing="1.2">
        <textPath href="#topArcL" startOffset="5%">
          जन स्वास्थ्य सहायता अभियान
        </textPath>
      </text>
      <text fontSize="6" fill="#444" fontWeight="600" letterSpacing="0.8">
        <textPath href="#botArcL" startOffset="4%">
          A Project Of Healthcare R&amp;D Board
        </textPath>
      </text>
      <circle cx="38" cy="52" r="7" fill="#22c55e" />
      <ellipse cx="38" cy="72" rx="9" ry="13" fill="#22c55e" />
      <line
        x1="29"
        y1="65"
        x2="20"
        y2="58"
        stroke="#22c55e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="47"
        y1="65"
        x2="56"
        y2="58"
        stroke="#22c55e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="60" cy="49" r="7.5" fill="#f97316" />
      <ellipse cx="60" cy="70" rx="9" ry="14" fill="#f97316" />
      <line
        x1="51"
        y1="62"
        x2="42"
        y2="55"
        stroke="#f97316"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="69"
        y1="62"
        x2="78"
        y2="55"
        stroke="#f97316"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="82" cy="52" r="7" fill="#3b82f6" />
      <ellipse cx="82" cy="72" rx="9" ry="13" fill="#3b82f6" />
      <line
        x1="73"
        y1="65"
        x2="64"
        y2="58"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="91"
        y1="65"
        x2="100"
        y2="58"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.forgotPassword(email.trim());

      if (response.success) {
        setSuccess("OTP has been sent to your email. Please check your inbox.");
        setStep(2);
      } else {
        // Check for database connection error
        if (response.error && response.error.includes("Database connection")) {
          setError("Database connection unavailable. Please contact support or try again later.");
        } else {
          setError(response.error || "Failed to send OTP. Please try again.");
        }
      }
    } catch (err) {
      // Check for network or database errors
      if (err.message && (err.message.includes("503") || err.message.includes("Database"))) {
        setError("Database connection unavailable. Please contact support or try again later.");
      } else {
        setError(err.message || "Failed to send OTP. Please try again.");
      }
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.verifyOTP(email.trim(), otp.trim());

      if (response.success) {
        setSuccess("OTP verified successfully!");
        setStep(3);
      } else {
        setError(response.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      console.error("Verify OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.resetPassword(
        email.trim(),
        otp.trim(),
        newPassword.trim()
      );

      if (response.success) {
        setSuccess("Password reset successfully!");
        setStep(4);
      } else {
        setError(response.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0">
                <Logo size={60} />
              </div>
              <div>
                <h1
                  className="text-base sm:text-lg lg:text-xl font-extrabold text-green-700 leading-tight"
                  style={{ fontFamily: "'Noto Sans Devanagari', serif" }}
                >
                  जन स्वास्थ्य सहायता अभियान
                </h1>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">
                  A Project Of Healthcare Research &amp; Development Board
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Password Reset Successful!"}
            </h2>
            <p className="text-sm text-gray-600">
              {step === 1 && "Enter your email address to receive an OTP"}
              {step === 2 && "Enter the 6-digit OTP sent to your email"}
              {step === 3 && "Enter your new password"}
              {step === 4 && "Your password has been reset successfully"}
            </p>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm"
                    onFocus={(e) => (e.target.style.borderColor = GREEN)}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendOTP();
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {success}
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading || !email.trim()}
                className="w-full text-white py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm text-center text-2xl font-bold tracking-widest"
                  style={{
                    letterSpacing: "0.5em",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = GREEN)}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && otp.length === 6) handleVerifyOTP();
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  OTP sent to: <span className="font-semibold">{email}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {success}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="flex-1 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                  }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm"
                    onFocus={(e) => (e.target.style.borderColor = GREEN)}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm"
                    onFocus={(e) => (e.target.style.borderColor = GREEN)}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleResetPassword();
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {success}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep(2);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
                  className="flex-1 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                  }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "#e8f5e2" }}
                >
                  <CheckCircle className="w-10 h-10" style={{ color: GREEN }} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Password Reset Successful!
              </h3>
              <p className="text-sm text-gray-600">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm"
                style={{
                  background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                }}
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Back to Login Link */}
          {step !== 4 && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                style={{ color: GREEN }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
