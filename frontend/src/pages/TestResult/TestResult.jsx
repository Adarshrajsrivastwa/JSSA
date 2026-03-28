import React, { useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  History,
  Search,
  Download,
  Eye,
  Clock,
  BarChart3,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  X,
  User,
  Calendar,
  BookOpen,
  TrendingUp,
  FileText,
  Filter,
} from "lucide-react";

// ─── Static Mock Data ─────────────────────────────────────────────────────────
const MOCK_HISTORY = [
  {
    id: 1,
    student: "Aarav Sharma",
    avatar: "AS",
    testTitle: "Algebra Basics",
    subject: "Mathematics",
    cls: "Class 10A",
    type: "Unit Test",
    totalMarks: 100,
    duration: 60,
    score: 88,
    pct: 88,
    timeTaken: 52,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-15T10:30:00Z",
  },
  {
    id: 2,
    student: "Priya Verma",
    avatar: "PV",
    testTitle: "Algebra Basics",
    subject: "Mathematics",
    cls: "Class 10A",
    type: "Unit Test",
    totalMarks: 100,
    duration: 60,
    score: 72,
    pct: 72,
    timeTaken: 58,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-15T11:00:00Z",
  },
  {
    id: 3,
    student: "Rohan Gupta",
    avatar: "RG",
    testTitle: "Human Body Systems",
    subject: "Biology",
    cls: "Class 9B",
    type: "Mid Term",
    totalMarks: 80,
    duration: 90,
    score: 45,
    pct: 56,
    timeTaken: 85,
    attempts: 2,
    status: "fail",
    completedAt: "2024-03-14T09:00:00Z",
  },
  {
    id: 4,
    student: "Sneha Patel",
    avatar: "SP",
    testTitle: "Newton's Laws",
    subject: "Physics",
    cls: "Class 11C",
    type: "Weekly Test",
    totalMarks: 50,
    duration: 45,
    score: 47,
    pct: 94,
    timeTaken: 40,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-13T14:00:00Z",
  },
  {
    id: 5,
    student: "Karan Mehta",
    avatar: "KM",
    testTitle: "Periodic Table",
    subject: "Chemistry",
    cls: "Class 11A",
    type: "Quiz",
    totalMarks: 30,
    duration: 20,
    score: 18,
    pct: 60,
    timeTaken: 18,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-12T10:00:00Z",
  },
  {
    id: 6,
    student: "Anjali Singh",
    avatar: "AN",
    testTitle: "World War II",
    subject: "History",
    cls: "Class 10B",
    type: "Unit Test",
    totalMarks: 100,
    duration: 60,
    score: 35,
    pct: 35,
    timeTaken: 55,
    attempts: 3,
    status: "fail",
    completedAt: "2024-03-11T13:00:00Z",
  },
  {
    id: 7,
    student: "Vikram Nair",
    avatar: "VN",
    testTitle: "Algebra Basics",
    subject: "Mathematics",
    cls: "Class 10A",
    type: "Unit Test",
    totalMarks: 100,
    duration: 60,
    score: 91,
    pct: 91,
    timeTaken: 48,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-15T09:45:00Z",
  },
  {
    id: 8,
    student: "Divya Rao",
    avatar: "DR",
    testTitle: "Newton's Laws",
    subject: "Physics",
    cls: "Class 11C",
    type: "Weekly Test",
    totalMarks: 50,
    duration: 45,
    score: 28,
    pct: 56,
    timeTaken: 43,
    attempts: 2,
    status: "fail",
    completedAt: "2024-03-13T15:30:00Z",
  },
  {
    id: 9,
    student: "Amit Kumar",
    avatar: "AK",
    testTitle: "Human Body Systems",
    subject: "Biology",
    cls: "Class 9B",
    type: "Mid Term",
    totalMarks: 80,
    duration: 90,
    score: 68,
    pct: 85,
    timeTaken: 78,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-14T10:30:00Z",
  },
  {
    id: 10,
    student: "Pooja Joshi",
    avatar: "PJ",
    testTitle: "Periodic Table",
    subject: "Chemistry",
    cls: "Class 11A",
    type: "Quiz",
    totalMarks: 30,
    duration: 20,
    score: 12,
    pct: 40,
    timeTaken: 19,
    attempts: 2,
    status: "fail",
    completedAt: "2024-03-12T11:00:00Z",
  },
  {
    id: 11,
    student: "Rahul Tiwari",
    avatar: "RT",
    testTitle: "World War II",
    subject: "History",
    cls: "Class 10B",
    type: "Unit Test",
    totalMarks: 100,
    duration: 60,
    score: 82,
    pct: 82,
    timeTaken: 57,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-11T14:00:00Z",
  },
  {
    id: 12,
    student: "Neha Saxena",
    avatar: "NS",
    testTitle: "Algebra Basics",
    subject: "Mathematics",
    cls: "Class 10A",
    type: "Unit Test",
    totalMarks: 100,
    duration: 60,
    score: 65,
    pct: 65,
    timeTaken: 60,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-15T12:00:00Z",
  },
  {
    id: 13,
    student: "Suresh Iyer",
    avatar: "SI",
    testTitle: "Newton's Laws",
    subject: "Physics",
    cls: "Class 11C",
    type: "Weekly Test",
    totalMarks: 50,
    duration: 45,
    score: 42,
    pct: 84,
    timeTaken: 38,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-13T13:00:00Z",
  },
  {
    id: 14,
    student: "Meera Pillai",
    avatar: "MP",
    testTitle: "Human Body Systems",
    subject: "Biology",
    cls: "Class 9B",
    type: "Mid Term",
    totalMarks: 80,
    duration: 90,
    score: 30,
    pct: 38,
    timeTaken: 88,
    attempts: 3,
    status: "fail",
    completedAt: "2024-03-14T11:00:00Z",
  },
  {
    id: 15,
    student: "Arjun Desai",
    avatar: "AD",
    testTitle: "Periodic Table",
    subject: "Chemistry",
    cls: "Class 11A",
    type: "Quiz",
    totalMarks: 30,
    duration: 20,
    score: 27,
    pct: 90,
    timeTaken: 15,
    attempts: 1,
    status: "pass",
    completedAt: "2024-03-12T09:30:00Z",
  },
];

const pctColor = (p) =>
  p >= 80
    ? "text-[#3AB000]"
    : p >= 60
      ? "text-blue-600"
      : p >= 40
        ? "text-yellow-600"
        : "text-red-500";

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ record, allHistory, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  const testAll = allHistory.filter(
    (h) =>
      h.testTitle === record.testTitle &&
      h.subject === record.subject &&
      h.cls === record.cls,
  );

  const testStats = useMemo(() => {
    const total = testAll.length;
    if (!total)
      return { total: 0, avgPct: 0, best: 0, passed: 0, failed: 0, avgTime: 0 };
    const avgPct = Math.round(testAll.reduce((s, r) => s + r.pct, 0) / total);
    const best = Math.max(...testAll.map((r) => r.pct));
    const passed = testAll.filter((r) => r.status === "pass").length;
    const avgTime = Math.round(
      testAll.reduce((s, r) => s + r.timeTaken, 0) / total,
    );
    return { total, avgPct, best, passed, failed: total - passed, avgTime };
  }, [testAll]);

  const tabs = [
    { id: "overview", label: "Overview", icon: ClipboardList },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "history", label: "Attempts", icon: History },
  ];

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="text-gray-400 mt-0.5 shrink-0" size={18} />}
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );

  const StatBox = ({ label, value, color }) => {
    const cls = {
      green: "bg-[#e8f5e2] text-[#2d8a00]",
      blue: "bg-blue-50 text-blue-700",
      purple: "bg-purple-50 text-purple-700",
      red: "bg-red-50 text-red-600",
      gray: "bg-gray-50 text-gray-700",
    };
    return (
      <div
        className={`${cls[color]} rounded p-4 text-center border border-gray-100`}
      >
        <p className="text-xs font-semibold mb-1 uppercase tracking-wide opacity-75">
          {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        {/* Modal Header */}
        <div
          style={{ backgroundColor: "#3AB000" }}
          className="text-white p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded bg-white bg-opacity-20 flex items-center justify-center">
              <ClipboardList size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{record.testTitle}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white overflow-x-auto shrink-0">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 bg-[#e8f5e2]"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    activeTab === tab.id
                      ? { color: "#3AB000", borderColor: "#3AB000" }
                      : {}
                  }
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded border border-gray-200 p-6 flex items-center justify-center gap-10 shadow-sm">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-800">
                    {record.score}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    out of {record.totalMarks}
                  </p>
                </div>
                <div
                  className="w-24 h-24 rounded-full border-4 flex items-center justify-center"
                  style={{
                    borderColor:
                      record.status === "pass" ? "#3AB000" : "#ef4444",
                  }}
                >
                  <p className={`text-2xl font-bold ${pctColor(record.pct)}`}>
                    {record.pct}%
                  </p>
                </div>
                <div className="text-center">
                  <span
                    className={`px-4 py-2 rounded font-bold text-xs uppercase tracking-wide ${
                      record.status === "pass"
                        ? "bg-[#e8f5e2] text-[#2d8a00]"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {record.status === "pass" ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded border border-gray-200 p-6 space-y-4 shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700 border-b pb-2">
                    Test Information
                  </h3>
                  <InfoRow
                    icon={BookOpen}
                    label="Test Name"
                    value={record.testTitle}
                  />
                </div>
                <div className="bg-white rounded border border-gray-200 p-6 space-y-4 shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700 border-b pb-2">
                    Attempt Details
                  </h3>
                  <InfoRow
                    icon={Clock}
                    label="Duration"
                    value={`${record.duration} min`}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Time Taken"
                    value={`${record.timeTaken} min`}
                  />
                  <InfoRow
                    icon={ClipboardList}
                    label="Attempts"
                    value={record.attempts}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Completed On"
                    value={new Date(record.completedAt).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Performance */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <StatBox
                  label="Avg Score"
                  value={`${testStats.avgPct}%`}
                  color="green"
                />
                <StatBox
                  label="Best Score"
                  value={`${testStats.best}%`}
                  color="green"
                />
                <StatBox
                  label="Avg Time"
                  value={`${testStats.avgTime} min`}
                  color="blue"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <StatBox
                  label="Total Attempts"
                  value={testStats.total}
                  color="purple"
                />
                <StatBox
                  label="Passed"
                  value={testStats.passed}
                  color="green"
                />
                <StatBox label="Failed" value={testStats.failed} color="red" />
              </div>

              <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-4">
                  Score Trend (Last {Math.min(6, testAll.length)} Attempts)
                </h3>
                <div className="h-40 flex items-end gap-2">
                  {testAll
                    .slice(0, 6)
                    .reverse()
                    .map((r, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center group"
                      >
                        <span className="text-xs font-bold text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition">
                          {r.pct}%
                        </span>
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${r.pct}%`,
                            backgroundColor: "#3AB000",
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Pass Rate
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {Math.round(
                      (testStats.passed / Math.max(testStats.total, 1)) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${Math.round((testStats.passed / Math.max(testStats.total, 1)) * 100)}%`,
                      backgroundColor: "#3AB000",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>{testStats.passed} passed</span>
                  <span>{testStats.failed} failed</span>
                </div>
              </div>
            </div>
          )}

          {/* All Attempts */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wide text-gray-700">
                All Attempts for this test ({testAll.length})
              </h3>
              <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#3AB000" }}>
                      {["Student", "Score", "%", "Time", "Date", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-black"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {testAll.map((r) => (
                      <tr
                        key={r.id}
                        className={`transition-colors ${r.id === record.id ? "bg-[#e8f5e2]" : "hover:bg-[#e8f5e2]"}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">
                            {r.student}
                          </p>
                          <p className="text-xs text-gray-400">{r.cls}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-800">
                          {r.score}
                          <span className="text-xs text-gray-400 font-normal">
                            /{r.totalMarks}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-bold ${pctColor(r.pct)}`}
                          >
                            {r.pct}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {r.timeTaken} min
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(r.completedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              r.status === "pass"
                                ? "bg-[#e8f5e2] text-[#2d8a00]"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {r.status === "pass" ? "Pass" : "Fail"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white flex gap-3 justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors"
            style={{ backgroundColor: "#3AB000" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2d8a00")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3AB000")
            }
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TestHistory() {
  const [history] = useState(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "completedAt",
    direction: "desc",
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const stats = useMemo(() => {
    const total = history.length;
    const passed = history.filter((h) => h.status === "pass").length;
    const avgPct = total
      ? Math.round(history.reduce((s, h) => s + h.pct, 0) / total)
      : 0;
    return { total, passed, failed: total - passed, avgPct };
  }, [history]);

  const filtered = useMemo(() => {
    let d = [...history];
    if (searchQuery)
      d = d.filter(
        (h) =>
          String(h.student).toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(h.testTitle).toLowerCase().includes(searchQuery.toLowerCase()),
      );
    if (filterStatus !== "all")
      d = d.filter(
        (h) => String(h.status || "").toLowerCase() === filterStatus,
      );
    d.sort((a, b) => {
      const av = a[sortConfig.key],
        bv = b[sortConfig.key];
      if (typeof av === "number")
        return sortConfig.direction === "asc" ? av - bv : bv - av;
      return sortConfig.direction === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return d;
  }, [history, searchQuery, filterStatus, sortConfig]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleSort = (key) => {
    setSortConfig((p) => ({
      key,
      direction: p.key === key && p.direction === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  };

  const SI = ({ col }) =>
    sortConfig.key !== col ? (
      <ChevronUp className="w-3 h-3 opacity-30" />
    ) : sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );

  const isFiltered = searchQuery || filterStatus !== "all";
  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setPage(1);
  };

  const handleExport = () => {
    const rows = [
      [
        "Student",
        "Test",
        "Score",
        "Total",
        "%",
        "Time",
        "Attempts",
        "Status",
        "Date",
      ],
      ...filtered.map((h) => [
        h.student,
        h.testTitle,
        h.score,
        h.totalMarks,
        h.pct,
        h.timeTaken,
        h.attempts,
        h.status === "pass" ? "Pass" : "Fail",
        h.completedAt,
      ]),
    ];
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(
        new Blob([rows.map((r) => r.join(",")).join("\n")], {
          type: "text/csv",
        }),
      ),
      download: `test-history-${new Date().toISOString().split("T")[0]}.csv`,
    });
    a.click();
  };

  const pageNums = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i,
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white ml-0 p-0 md:ml-6 px-2 md:px-0">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Attempts",
              value: stats.total,
              icon: ClipboardList,
            },
            { label: "Passed", value: stats.passed, icon: CheckCircle },
            { label: "Failed", value: stats.failed, icon: XCircle },
            { label: "Avg Score", value: `${stats.avgPct}%`, icon: BarChart3 },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white rounded border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {value}
                  </p>
                </div>
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: "#e8f5e2" }}
                >
                  <Icon size={22} style={{ color: "#3AB000" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Top Bar: Tabs + Search + Filters ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
            {/* Status Tabs */}
            <div className="flex items-center gap-0 border border-gray-300 rounded overflow-hidden flex-shrink-0 w-full sm:w-auto">
              {["all", "pass", "fail"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setFilterStatus(tab);
                    setPage(1);
                  }}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors whitespace-nowrap"
                  style={
                    filterStatus === tab
                      ? { backgroundColor: "#3AB000", color: "#fff" }
                      : { backgroundColor: "#fff", color: "#4b5563" }
                  }
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[500px]">
              <input
                type="text"
                placeholder="Search by student or test name..."
                className="flex-1 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 focus:outline-none h-full bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
              <button
                className="text-white text-xs sm:text-sm px-4 sm:px-6 h-full font-medium transition-colors whitespace-nowrap"
                style={{ backgroundColor: "#3AB000" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d8a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3AB000")
                }
              >
                Search
              </button>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="bg-black hover:bg-[#3AB000] text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2.5 rounded-sm transition-colors whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Active filters indicator */}
        {isFiltered && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filtered.length}
              </span>{" "}
              result{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: "#3AB000" }}
            >
              <X size={12} /> Clear
            </button>
          </div>
        )}

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr style={{ backgroundColor: "#3AB000" }}>
                  {[
                    { label: "Student", key: "student" },
                    { label: "Test", key: "testTitle" },
                    { label: "Score", key: "pct" },
                    { label: "Time / Attempts", key: "timeTaken" },
                    { label: "Date", key: "completedAt" },
                    { label: "Status", key: "status" },
                  ].map(({ label, key }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap cursor-pointer hover:bg-[#2d8a00] select-none transition-colors"
                    >
                      <div className="flex items-center justify-center gap-1">
                        {label}
                        <SI col={key} />
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <History size={36} className="text-gray-300" />
                        <p>No records found.</p>
                        {isFiltered && (
                          <button
                            onClick={clearFilters}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: "#3AB000" }}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((h) => (
                    <tr
                      key={h.id}
                      className="hover:bg-[#e8f5e2] transition-colors"
                    >
                      {/* Student */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                            style={{ backgroundColor: "#3AB000" }}
                          >
                            {h.avatar}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm text-gray-800">
                              {h.student}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Test */}
                      <td className="px-4 py-4 text-center">
                        <p className="font-semibold text-sm text-gray-800 truncate max-w-[180px] mx-auto">
                          {h.testTitle}
                        </p>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-4 text-center">
                        <p className="font-bold text-gray-800 text-sm">
                          {h.score}
                          <span className="text-xs text-gray-400 font-normal">
                            /{h.totalMarks}
                          </span>
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 justify-center">
                          <div className="w-14 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${h.pct}%`,
                                backgroundColor: "#3AB000",
                              }}
                            />
                          </div>
                          <span
                            className={`text-xs font-bold ${pctColor(h.pct)}`}
                          >
                            {h.pct}%
                          </span>
                        </div>
                      </td>

                      {/* Time / Attempts */}
                      <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                        <p className="text-sm flex items-center gap-1 justify-center">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {h.timeTaken} min
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {h.attempts} attempt{h.attempts !== 1 ? "s" : ""}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap text-sm">
                        {new Date(h.completedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold ${
                            h.status === "pass"
                              ? "bg-[#e8f5e2] text-[#2d8a00]"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {h.status === "pass" ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {h.status === "pass" ? "Pass" : "Fail"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedRecord(h)}
                          className="transition-colors"
                          style={{ color: "#3AB000" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#2d8a00")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#3AB000")
                          }
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Mobile Card View ── */}
        <div className="md:hidden space-y-3">
          {paginated.length === 0 ? (
            <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No records found.
            </div>
          ) : (
            paginated.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                      style={{ backgroundColor: "#3AB000" }}
                    >
                      {h.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {h.student}
                      </p>
                      <p className="text-xs text-gray-500">{h.cls}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      h.status === "pass"
                        ? "bg-[#e8f5e2] text-[#2d8a00]"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {h.status === "pass" ? "Pass" : "Fail"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700 mb-3">
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">
                      Test:
                    </span>
                    <span className="flex-1">{h.testTitle}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">
                      Score:
                    </span>
                    <span className="flex-1">
                      {h.score}/{h.totalMarks}
                      <span
                        className={`ml-2 font-bold text-xs ${pctColor(h.pct)}`}
                      >
                        {h.pct}%
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">
                      Time:
                    </span>
                    <span className="flex-1">{h.timeTaken} min</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">
                      Date:
                    </span>
                    <span className="flex-1">
                      {new Date(h.completedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedRecord(h)}
                    className="p-2 transition-colors"
                    style={{ color: "#3AB000" }}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3 sm:gap-4 mt-6">
            <div className="text-xs sm:text-sm text-gray-600 sm:hidden">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors rounded-sm flex-1 sm:flex-none"
                style={{ backgroundColor: "#3AB000" }}
                onMouseEnter={(e) =>
                  !e.currentTarget.disabled &&
                  (e.currentTarget.style.backgroundColor = "#2d8a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3AB000")
                }
              >
                Back
              </button>

              <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                {pageNums.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-7 h-7 flex items-center justify-center rounded text-sm transition-colors"
                    style={
                      p === page
                        ? { color: "#3AB000", fontWeight: "700" }
                        : { color: "#6b7280" }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="sm:hidden text-sm font-medium text-gray-700 px-2">
                {page}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors rounded-sm flex-1 sm:flex-none"
                style={{ backgroundColor: "#3AB000" }}
                onMouseEnter={(e) =>
                  !e.currentTarget.disabled &&
                  (e.currentTarget.style.backgroundColor = "#2d8a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3AB000")
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <DetailModal
          record={selectedRecord}
          allHistory={history}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </DashboardLayout>
  );
}
