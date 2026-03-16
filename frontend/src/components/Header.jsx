import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiGrid,
  FiMaximize,
  FiBell,
  FiMail,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPhone,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { roleHomePath } from "../auth/auth";

const GREEN = "#3AB000";
const GREEN_DARK = "#2d8a00";

/* ── Static Avatar ── */
function StaticAvatar({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#3AB000" />
      <circle cx="20" cy="14" r="7" fill="white" />
      <ellipse cx="20" cy="36" rx="13" ry="9" fill="white" />
    </svg>
  );
}

/* ── Digital Clock ── */
function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const dayName = days[time.getDay()];
  const monthStr = months[time.getMonth()];
  const dateNum = pad(time.getDate());
  const year = time.getFullYear();

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-lg select-none"
      style={{
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.2)",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Time */}
      <div className="flex items-center gap-0.5">
        <span
          className="text-white font-bold text-lg leading-none"
          style={{ letterSpacing: 2 }}
        >
          {hours}
        </span>
        <span
          className="text-green-200 font-bold text-lg leading-none animate-pulse"
          style={{ letterSpacing: 1 }}
        >
          :
        </span>
        <span
          className="text-white font-bold text-lg leading-none"
          style={{ letterSpacing: 2 }}
        >
          {minutes}
        </span>
        <span
          className="text-green-200 font-bold text-lg leading-none animate-pulse"
          style={{ letterSpacing: 1 }}
        >
          :
        </span>
        <span
          className="text-green-300 font-bold text-base leading-none"
          style={{ letterSpacing: 2 }}
        >
          {seconds}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/25" />

      {/* Date */}
      <div className="flex flex-col leading-none">
        <span className="text-green-200 text-[10px] font-bold tracking-widest">
          {dayName}
        </span>
        <span className="text-white text-[10px] font-semibold">
          {dateNum} {monthStr} {year}
        </span>
      </div>
    </div>
  );
}

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { role, identifier } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 sm:left-64 h-[56px] flex items-center px-4 sm:px-6 lg:px-8 shadow-md z-50"
      style={{
        background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
      }}
    >
      {/* Mobile Sidebar Toggle */}
      <button className="text-white text-2xl mr-3 sm:hidden p-1 rounded hover:bg-white/20 transition">
        <FiMenu />
      </button>

      {/* ── Digital Clock ── */}
      <div className="flex-1">
        <DigitalClock />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        {/* Divider */}
        <div className="w-px h-6 mx-1 bg-white/30" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg transition focus:outline-none"
            style={{ background: "transparent" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {/* Avatar with online dot */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-2 border-white/60 overflow-hidden">
                <StaticAvatar size={32} />
              </div>
              {/* Online dot */}
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: "#4ade80", borderColor: GREEN_DARK }}
              />
            </div>

            {/* Name — hidden on small screens */}
            <div className="hidden md:block text-left">
              <p className="text-white text-xs font-bold leading-tight">
                {role === "admin"
                  ? "Admin"
                  : role === "applicant"
                    ? "Applicant"
                    : "User"}
              </p>
              <p className="text-white/70 text-[10px] leading-tight">
                {identifier || "JSS Abhiyan"}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl overflow-hidden"
              style={{ border: "1px solid #e5e7eb" }}
            >
              {/* Profile Header */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                }}
              >
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
                  <StaticAvatar size={40} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">
                    {role === "admin"
                      ? "Admin"
                      : role === "applicant"
                        ? "Applicant"
                        : "User"}
                  </p>
                  <p className="text-[11px] text-green-100">
                    {identifier || "support@jssabhiyan-nac.in"}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1.5">
                {[
                  { icon: FiUser, label: "My Profile", path: "/profile" },
                  {
                    icon: FiGrid,
                    label: "Go to Dashboard",
                    path: roleHomePath(role),
                  },
                  ...(role === "admin"
                    ? [
                        {
                          icon: FiSettings,
                          label: "Settings",
                          path: "/settings",
                        },
                      ]
                    : []),
                  { icon: FiPhone, label: "9471987611", path: null },
                ].map(({ icon: Icon, label, path }, i) => (
                  <button
                    key={i}
                    onClick={() => path && navigate(path)}
                    className="w-full px-4 py-2.5 text-sm flex items-center gap-3 text-gray-700 transition"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e8f5e2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span style={{ color: GREEN }}>
                      <Icon size={15} />
                    </span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Divider + Logout */}
              <div style={{ borderTop: "1px solid #e5e7eb" }}>
                <button
                  onClick={() => navigate("/logout")}
                  className="w-full px-4 py-2.5 text-sm flex items-center gap-3 text-red-600 font-semibold transition"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
