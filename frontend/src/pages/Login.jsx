import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Phone, MessageSquare } from "lucide-react";
import logo from "../assets/img0.png";
import { useAuth } from "../auth/AuthProvider";
import { roleHomePath } from "../auth/auth";
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

function IllustrationSVG() {
  return (
    <svg
      viewBox="0 0 480 380"
      style={{ width: "100%", maxWidth: 420, height: "auto" }}
    >
      <circle cx="240" cy="190" r="180" fill="#fff" opacity="0.06" />
      <circle cx="240" cy="190" r="130" fill="#fff" opacity="0.08" />
      <rect
        x="70"
        y="295"
        width="340"
        height="18"
        rx="9"
        fill="#fff"
        opacity="0.25"
      />
      <ellipse cx="240" cy="313" rx="170" ry="14" fill="#fff" opacity="0.15" />
      <rect
        x="100"
        y="250"
        width="80"
        height="45"
        rx="6"
        fill="#fff"
        opacity="0.2"
      />
      <rect
        x="108"
        y="285"
        width="10"
        height="25"
        rx="4"
        fill="#fff"
        opacity="0.3"
      />
      <rect
        x="162"
        y="285"
        width="10"
        height="25"
        rx="4"
        fill="#fff"
        opacity="0.3"
      />
      <ellipse cx="140" cy="235" rx="22" ry="28" fill="#4ade80" />
      <circle cx="140" cy="200" r="22" fill="#fde68a" />
      <path
        d="M120 196 Q128 180 140 180 Q152 180 160 196 L160 200 Q152 190 140 190 Q128 190 120 200Z"
        fill="#166534"
      />
      <ellipse
        cx="120"
        cy="240"
        rx="8"
        ry="22"
        fill="#fde68a"
        transform="rotate(-20 120 240)"
      />
      <ellipse
        cx="162"
        cy="240"
        rx="8"
        ry="22"
        fill="#fde68a"
        transform="rotate(20 162 240)"
      />
      <rect
        x="150"
        y="248"
        width="22"
        height="30"
        rx="3"
        fill="#ef4444"
        opacity="0.9"
      />
      <line
        x1="155"
        y1="248"
        x2="155"
        y2="278"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <rect
        x="90"
        y="268"
        width="70"
        height="28"
        rx="3"
        fill="#fff"
        opacity="0.9"
      />
      <rect x="95" y="272" width="60" height="20" rx="2" fill="#bbf7d0" />
      <rect
        x="85"
        y="294"
        width="80"
        height="5"
        rx="2"
        fill="#fff"
        opacity="0.6"
      />
      <rect x="305" y="255" width="13" height="50" rx="6" fill="#16a34a" />
      <rect x="323" y="255" width="13" height="50" rx="6" fill="#16a34a" />
      <ellipse cx="323" cy="225" rx="26" ry="34" fill="#22c55e" />
      <circle cx="323" cy="183" r="23" fill="#fcd34d" />
      <ellipse cx="323" cy="172" rx="25" ry="17" fill="#14532d" />
      <ellipse
        cx="297"
        cy="228"
        rx="10"
        ry="26"
        fill="#fcd34d"
        transform="rotate(-22 297 228)"
      />
      <ellipse
        cx="349"
        cy="228"
        rx="10"
        ry="26"
        fill="#fcd34d"
        transform="rotate(22 349 228)"
      />
      <rect
        x="290"
        y="238"
        width="66"
        height="46"
        rx="4"
        fill="#fff"
        opacity="0.95"
      />
      <rect x="293" y="244" width="60" height="36" rx="2" fill="#dcfce7" />
      <rect x="305" y="236" width="26" height="6" rx="3" fill="#aaa" />
      <line
        x1="299"
        y1="254"
        x2="345"
        y2="254"
        stroke={GREEN}
        strokeWidth="2"
        opacity="0.6"
      />
      <line
        x1="299"
        y1="262"
        x2="345"
        y2="262"
        stroke={GREEN}
        strokeWidth="2"
        opacity="0.6"
      />
      <line
        x1="299"
        y1="270"
        x2="330"
        y2="270"
        stroke={GREEN}
        strokeWidth="2"
        opacity="0.6"
      />
      <g transform="translate(50,90)">
        <rect
          x="8"
          y="0"
          width="10"
          height="28"
          rx="3"
          fill="#fff"
          opacity="0.85"
        />
        <rect
          x="0"
          y="8"
          width="28"
          height="10"
          rx="3"
          fill="#fff"
          opacity="0.85"
        />
      </g>
      <g transform="translate(390,80)">
        <path
          d="M20 8 Q20 0 12 0 Q4 0 4 8 Q4 16 12 22 Q20 16 20 8Z"
          fill="#fca5a5"
          opacity="0.85"
        />
      </g>
      <g transform="translate(40,200)">
        <circle cx="10" cy="10" r="10" fill="#fff" opacity="0.85" />
        <path
          d="M6 6 Q6 14 14 14 Q22 14 22 22"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
        />
        <circle
          cx="22"
          cy="24"
          r="4"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
        />
      </g>
      <g transform="translate(400,200)">
        <rect
          x="0"
          y="6"
          width="38"
          height="16"
          rx="8"
          fill="#a7f3d0"
          opacity="0.85"
        />
        <rect
          x="0"
          y="6"
          width="19"
          height="16"
          rx="8"
          fill="#6ee7b7"
          opacity="0.85"
        />
        <line x1="19" y1="6" x2="19" y2="22" stroke="#fff" strokeWidth="1.5" />
      </g>
      <g transform="translate(218,42)">
        <rect
          x="0"
          y="0"
          width="48"
          height="32"
          rx="5"
          fill="#fff"
          opacity="0.85"
        />
        <circle cx="12" cy="12" r="6" fill="#bbf7d0" />
        <line
          x1="22"
          y1="10"
          x2="40"
          y2="10"
          stroke="#22c55e"
          strokeWidth="2"
          opacity="0.7"
        />
        <line
          x1="22"
          y1="16"
          x2="40"
          y2="16"
          stroke="#22c55e"
          strokeWidth="2"
          opacity="0.7"
        />
        <line
          x1="8"
          y1="24"
          x2="40"
          y2="24"
          stroke="#22c55e"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </g>
      <circle cx="100" cy="95" r="5" fill="#fde68a" opacity="0.7" />
      <circle cx="380" cy="140" r="4" fill="#bbf7d0" opacity="0.8" />
      <circle cx="420" cy="170" r="5" fill="#fde68a" opacity="0.6" />
      <circle cx="60" cy="270" r="5" fill="#a7f3d0" opacity="0.7" />
      <circle cx="430" cy="280" r="4" fill="#fde68a" opacity="0.6" />
      <circle cx="200" cy="345" r="4" fill="#bbf7d0" opacity="0.7" />
      <circle cx="300" cy="350" r="5" fill="#fde68a" opacity="0.6" />
      <path
        d="M450 230 L453 240 L463 240 L455 246 L458 256 L450 250 L442 256 L445 246 L437 240 L447 240Z"
        fill="#fde68a"
        opacity="0.7"
      />
      <path
        d="M55 145 L57 152 L64 152 L58 157 L61 164 L55 159 L49 164 L52 157 L46 152 L53 152Z"
        fill="#bbf7d0"
        opacity="0.8"
      />
    </svg>
  );
}

export default function JSSAbhiyanLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, role, login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "applicant",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Nimbus OTP States
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Only redirect if user is already authenticated AND they're not on the login page intentionally
  // This ensures login page always shows first on app start
  useEffect(() => {
    if (isAuthenticated && role) {
      // Small delay to ensure login page renders first
      const timer = setTimeout(() => {
        navigate(roleHomePath(role), { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async () => {
    if (!formData.identifier.trim() || !formData.password) {
      setError("Please enter email/phone and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(
        formData.identifier.trim(),
        formData.password,
        formData.role,
      );

      if (response.success && response.data) {
        const { user, token } = response.data;
        login({
          identifier: user.email || user.phone,
          role: user.role,
          token: token,
        });
        navigate("/dashboard", { replace: true });
      } else if (response.error) {
        setError(response.error);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!phoneValue || phoneValue.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.nimbusLoginRequest(phoneValue, formData.role);
      if (response.success) {
        setOtpSent(true);
      } else {
        setError(response.message || "Wrong phone number");
      }
    } catch (err) {
      setError(err.message || "Wrong phone number");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpValue || otpValue.length < 4) {
      setError("Please enter the OTP sent to your mobile");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.nimbusLoginVerify(phoneValue, otpValue, formData.role);
      if (response.success && response.data) {
        const { user, token } = response.data;
        login({
          identifier: user.phone || user.email,
          role: user.role,
          token: token,
        });
        navigate("/dashboard", { replace: true });
      } else {
        setError(response.message || response.error || "Wrong OTP");
      }
    } catch (err) {
      setError(err.message || "Wrong OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT: Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 bg-white">
          {/* Brand Header */}
          <div className="mb-8 flex items-start gap-4">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 object-contain flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="text-[#3AB000] text-2xl font-bold leading-tight">
                जन स्वास्थ्य सहायता अभियान
              </h1>
              <p className="text-[#3AB000] text-[11px] font-semibold mt-0.5 uppercase tracking-tight">
                A Project Of Healthcare Research & Development Board
              </p>
              <p className="text-gray-500 text-[9px] mt-0.5 leading-tight italic">
                (HRDB is Division of social welfare organization 'NAC India')
              </p>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[#3AB000] text-xs font-bold">Registration No. :</span>
                <span className="text-[#3AB000] text-xs font-bold">053083</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Login as
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "applicant", label: "Applicant" },
                  { value: "admin", label: "Admin" },
                ].map((opt) => {
                  const active = formData.role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, role: opt.value }));
                      }}
                      className="px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-200"
                      style={{
                        borderColor: active ? GREEN : "#e5e7eb",
                        background: active ? "#fff" : "#fff",
                        color: active ? "#000" : "#374151",
                        boxShadow: active ? "inset 0 0 0 1px #3AB000" : "none"
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {loginMethod === "otp" ? (
              /* Nimbus OTP Login View */
              <div className="animate-in fade-in duration-300 space-y-5">
                {!otpSent ? (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Enter your Mobile Number
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-2 border-gray-200 h-6">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-green-600">IN +91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneValue}
                        onChange={(e) => setPhoneValue(e.target.value.replace(/\D/g, ""))}
                        placeholder="8271093372"
                        className="w-full pl-28 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm font-medium focus:border-[#3AB000] group-hover:border-gray-300"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-bold text-gray-800">
                        Enter 6-digit OTP
                      </label>
                      <button 
                        onClick={() => setOtpSent(false)}
                        className="text-xs font-bold text-green-600 hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm text-center tracking-[0.5em] font-bold focus:border-[#3AB000]"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setLoginMethod("password");
                    setError("");
                  }}
                  className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  login with email
                </button>
              </div>
            ) : (
              /* Password Login View */
              <div className="animate-in fade-in duration-300 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Enter your email
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm font-medium focus:border-[#3AB000] group-hover:border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Enter your password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:outline-none text-sm font-medium focus:border-[#3AB000] group-hover:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* 
                <button
                  onClick={() => {
                    setLoginMethod("otp");
                    setError("");
                  }}
                  className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  Login with Mobile Number
                </button>
                */}
              </div>
            )}

            {formData.role === "applicant" && loginMethod === "password" && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-[#3AB000] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <button
              onClick={
                loginMethod === "password" 
                  ? handleLogin 
                  : (!otpSent ? handleRequestOTP : handleVerifyOTP)
              }
              disabled={loading}
              className="w-full text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-95 text-base disabled:opacity-50"
              style={{
                background: GREEN,
                letterSpacing: "0.02em",
              }}
            >
              {loading 
                ? "Processing..." 
                : loginMethod === "password" 
                  ? "Login" 
                  : (!otpSent ? "Send OTP" : "Verify & Login")}
            </button>
          </div>
        </div>

        {/* RIGHT: Illustration */}
        <div
          className="hidden lg:flex w-full lg:w-1/2 flex-col items-center justify-center p-12 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
          }}
        >
          {/* Animated background blobs */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-200 rounded-full blur-[120px] animate-pulse delay-700" />
          </div>

          <div className="mb-8 relative z-10">
            <h3 className="text-white/80 text-xs font-bold mb-3 uppercase tracking-[0.2em]">
              Nice to see you again
            </h3>
            <h2 className="text-white text-5xl font-extrabold mb-4 tracking-tight">
              Welcome back
            </h2>
            <div className="w-20 h-1.5 bg-white/30 rounded-full mx-auto" />
          </div>

          <div className="relative w-full max-w-md z-10 transform hover:scale-105 transition-transform duration-500">
            <IllustrationSVG />
          </div>

          <div className="mt-8 space-y-6 relative z-10">
            <p className="text-white/90 text-sm max-w-sm mx-auto leading-relaxed">
              Providing affordable healthcare &amp; welfare services for{" "}
              <span className="font-black text-white underline decoration-white/30 underline-offset-4">
                every citizen of India
              </span>
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {["Medical Camps", "Yoga Camps", "Free Health Cards"].map((b, i) => (
                <span
                  key={i}
                  className="text-white text-[11px] font-bold px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all cursor-default"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
