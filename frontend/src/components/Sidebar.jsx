import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCog,
  Shield,
  ScrollText,
  CreditCard,
  Film,
  Bell,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

const GREEN = "#3AB000";
const GREEN_DARK = "#2d8a00";
const GREEN_LIGHT = "#e8f5e2";
const GREEN_BORDER = "#bbf7d0";

/* ── Logo ── */
function SidebarLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="white"
        stroke={GREEN}
        strokeWidth="4"
      />
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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  const activeItem = location.pathname;

  const menuItems = useMemo(() => {
    const dashboardPath =
      role === "admin"
        ? "/admin/dashboard"
        : role === "applicant"
          ? "/applicant/dashboard"
          : "/dashboard";

    /** @type {Array<any>} */
    const base = [
      { name: "Dashboard", icon: LayoutDashboard, path: dashboardPath },
      { name: "Job Postings", icon: Users, path: "/job-postings" },
      { name: "Application Form", icon: FileText, path: "/application-form" },
    ];

    if (role === "admin") {
      base.push(
        { name: "Gallery", icon: ImageIcon, path: "/gallery" },
        { name: "Scroller", icon: Film, path: "/scroller" },
        { name: "Notifications", icon: Bell, path: "/notifications-manage" },
        { name: "Payment Settings", icon: CreditCard, path: "/settings" },
        {
          name: "Settings",
          icon: Settings,
          path: "/settings",
          children: [
            { name: "Account", path: "/settings/account", icon: UserCog },
            { name: "Manage Role", path: "/settings/manage-role", icon: Shield },
            { name: "Logs", path: "/settings/logs", icon: ScrollText },
          ],
        },
      );
    }

    base.push({ name: "Logout", icon: LogOut, path: "/logout" });
    return base;
  }, [role]);

  const isParentActive = (item) =>
    item.path === activeItem ||
    (item.children || []).some((c) => c.path === activeItem);

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? "" : name));
  };

  const handleNavigation = (item) => {
    if (item.children && item.children.length > 0) {
      toggleMenu(item.name);
    } else {
      setOpenMenu("");
      if (window.innerWidth < 768) setIsOpen(false);
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-3 left-3 z-50 md:hidden text-white p-2.5 rounded-lg shadow-lg transition-colors"
        style={{ background: GREEN }}
        onClick={() => setIsOpen((s) => !s)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white text-gray-800 shadow-xl flex flex-col transition-transform duration-300 z-40 border-r
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ borderColor: GREEN_BORDER }}
      >
        {/* ── Header ── */}
        <div
          className="px-4 py-4 mx-3 mt-3 rounded-xl shadow-md"
          style={{
            background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
              <SidebarLogo />
            </div>
            <div>
              <h2
                className="text-sm font-extrabold text-white leading-tight"
                style={{ fontFamily: "'Noto Sans Devanagari', serif" }}
              >
                जन स्वास्थ्य सहायता
              </h2>
              <p className="text-[10px] text-green-100 font-medium">अभियान</p>
            </div>
          </div>
          {/* Role badge */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[10px] text-green-100 font-medium bg-white/20 px-2 py-0.5 rounded-full">
              {role === "admin" ? "Admin" : role === "applicant" ? "Applicant" : "User"}
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-5 mb-2 mt-4">
          <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
            Main Menu
          </p>
        </div>

        {/* ── Menu Items ── */}
        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar-green">
          <ul className="text-sm flex flex-col space-y-1">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const parentActive = isParentActive(item);
              const isOpenThis = openMenu === item.name;
              const Icon = item.icon;
              const isLogout = item.name === "Logout";

              return (
                <li key={item.name} className="flex flex-col">
                  {/* Parent button */}
                  <button
                    onClick={() => handleNavigation(item)}
                    className="flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 w-full text-left"
                    style={{
                      background:
                        isOpenThis || parentActive
                          ? isLogout
                            ? "#fee2e2"
                            : GREEN
                          : "transparent",
                      color:
                        isOpenThis || parentActive
                          ? isLogout
                            ? "#dc2626"
                            : "#fff"
                          : isLogout
                            ? "#dc2626"
                            : "#374151",
                    }}
                    onMouseEnter={(e) => {
                      if (!isOpenThis && !parentActive) {
                        e.currentTarget.style.background = isLogout
                          ? "#fee2e2"
                          : GREEN_LIGHT;
                        e.currentTarget.style.color = isLogout
                          ? "#dc2626"
                          : GREEN_DARK;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isOpenThis && !parentActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = isLogout
                          ? "#dc2626"
                          : "#374151";
                      }
                    }}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        style={{
                          color:
                            isOpenThis || parentActive
                              ? isLogout
                                ? "#dc2626"
                                : "#fff"
                              : isLogout
                                ? "#dc2626"
                                : "#6b7280",
                        }}
                      />
                      <span className="text-[13px]">{item.name}</span>
                    </span>
                    {hasChildren && (
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-300 ${isOpenThis ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {hasChildren && (
                    <div
                      className={`ml-6 mt-1 overflow-hidden transition-all duration-300 ${
                        isOpenThis
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul
                        className="flex flex-col space-y-0.5 pb-1 pl-3 border-l-2"
                        style={{ borderColor: "#bbf7d0" }}
                      >
                        {item.children.map((sub) => {
                          const subActive = activeItem === sub.path;
                          const SubIcon = sub.icon || FileText;
                          return (
                            <li key={sub.name}>
                              <button
                                onClick={() => {
                                  setActiveItem(sub.path);
                                  setOpenMenu(item.name);
                                  if (window.innerWidth < 768) setIsOpen(false);
                                  navigate(sub.path);
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-all duration-200 w-full text-left"
                                style={{
                                  background: subActive
                                    ? "#dcfce7"
                                    : "transparent",
                                  color: subActive ? GREEN_DARK : "#4b5563",
                                }}
                                onMouseEnter={(e) => {
                                  if (!subActive) {
                                    e.currentTarget.style.background =
                                      GREEN_LIGHT;
                                    e.currentTarget.style.color = GREEN_DARK;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!subActive) {
                                    e.currentTarget.style.background =
                                      "transparent";
                                    e.currentTarget.style.color = "#4b5563";
                                  }
                                }}
                              >
                                <SubIcon size={14} />
                                <span>{sub.name}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Custom scrollbar */}
      <style>{`
        .custom-scrollbar-green::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-green::-webkit-scrollbar-thumb {
          background: #bbf7d0;
          border-radius: 10px;
        }
        .custom-scrollbar-green::-webkit-scrollbar-thumb:hover {
          background: #86efac;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
