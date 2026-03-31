import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { api } from "../../utils/api";
import {
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  Briefcase,
  Users,
} from "lucide-react";

const pctColor = (p) =>
  p >= 80
    ? "text-[#3AB000]"
    : p >= 60
      ? "text-blue-600"
      : p >= 40
        ? "text-yellow-600"
        : "text-red-500";

export default function TestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.testResults.getAll();
        if (response.message === "exam not done yet") {
          setHistory([]);
          setErrorMsg("exam not done yet");
        } else if (Array.isArray(response)) {
          setHistory(response);
          setErrorMsg("");
        } else if (response.error) {
          setErrorMsg(response.error);
        }
      } catch (err) {
        console.error("Failed to fetch test results:", err);
        setErrorMsg("Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const uniqueJobs = useMemo(() => {
    const jobs = {};
    history.forEach((h) => {
      const key = `${h.testTitle}`;
      if (!jobs[key]) {
        jobs[key] = {
          title: h.testTitle,
          type: h.type,
          difficulty: h.difficulty,
          duration: h.duration,
          totalMarks: h.totalMarks,
          count: 0,
          lastAttempt: h.completedAt,
        };
      }
      jobs[key].count++;
      if (new Date(h.completedAt) > new Date(jobs[key].lastAttempt)) {
        jobs[key].lastAttempt = h.completedAt;
      }
    });
    return Object.values(jobs);
  }, [history]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "completedAt",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = useMemo(() => {
    let d = [...history];
    if (selectedJob) {
      d = d.filter(
        (h) =>
          h.testTitle === selectedJob.title &&
          h.cls === selectedJob.cls,
      );
    }
    if (searchQuery)
      d = d.filter(
        (h) =>
          String(h.student).toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(h.email).toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(h.mobile).toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(h.applicationNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }, [history, searchQuery, filterStatus, sortConfig, selectedJob]);

  const stats = useMemo(() => {
    const d = filtered;
    const total = d.length;
    const passed = d.filter((h) => h.status === "pass").length;
    const avgPct = total
      ? Math.round(d.reduce((s, h) => s + h.pct, 0) / total)
      : 0;
    return { total, passed, failed: total - passed, avgPct };
  }, [filtered]);

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
      <ChevronUp className="w-3 h-3 text-[#3AB000]" />
    ) : (
      <ChevronDown className="w-3 h-3 text-[#3AB000]" />
    );

  const handleExport = () => {
    const rows = [
      [
        "Student",
        "Application No",
        "Mobile",
        "Email",
        "Test",
        "Score",
        "Total",
        "%",
        "Status",
        "Date",
      ],
      ...filtered.map((h) => [
        h.student,
        h.applicationNumber,
        h.mobile,
        h.email,
        h.testTitle,
        h.score,
        h.totalMarks,
        h.pct,
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {(selectedJob || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
              >
                <X size={20} className="text-gray-500" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedJob ? selectedJob.title : searchQuery ? "Search Results" : "Exam Results"}
              </h1>
              <p className="text-sm text-gray-500">
                {selectedJob 
                  ? `Viewing all candidates for this exam`
                  : searchQuery 
                    ? `Found ${filtered.length} matching candidates`
                    : "Select an exam to view candidate-wise results"}
              </p>
            </div>
          </div>
          {(selectedJob || searchQuery) && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#3AB000] text-white rounded font-bold text-sm hover:bg-[#2d8a00] transition-colors shadow-sm self-start md:self-auto"
            >
              <Download size={16} /> Export CSV
            </button>
          )}
        </div>

        {!selectedJob && !searchQuery ? (
          /* ── Exam List View (Redesigned) ── */
          <div className="space-y-3 pb-8">
            {loading ? (
              <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-[#3AB000] border-t-transparent rounded-full animate-spin"></div>
                <span>Loading Exams...</span>
              </div>
            ) : uniqueJobs.length === 0 ? (
              <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No exam attempts found yet.</p>
              </div>
            ) : (
              uniqueJobs.map((job) => (
                <div
                  key={job.title}
                  onClick={() => setSelectedJob(job)}
                  className="bg-white rounded border border-gray-200 overflow-hidden p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-[#3AB000] hover:border-[#3AB000]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-[#3AB000]" />
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">
                            {job.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-green-50 text-green-600 border-green-100">
                            Exam Results Active
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-8">
                        <p className="text-sm text-gray-600 font-medium">Type: {job.type}</p>
                        <p className="text-sm text-gray-600 font-medium">Difficulty: {job.difficulty}</p>
                        <p className="text-sm text-gray-600 font-medium">Max Marks: {job.totalMarks}</p>
                        <p className="text-xs text-gray-500">
                          Last Attempt: {new Date(job.lastAttempt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-[#3AB000]">
                          <Users className="w-5 h-5" />
                          <span className="text-lg font-bold">
                            {job.count.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Total Attempts</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ── Student List View ── */
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Candidates", value: stats.total, color: "bg-blue-50 text-blue-700", icon: User },
                { label: "Passed", value: stats.passed, color: "bg-green-50 text-green-700", icon: CheckCircle },
                { label: "Failed", value: stats.failed, color: "bg-red-50 text-red-700", icon: XCircle },
                { label: "Avg Score", value: `${stats.avgPct}%`, color: "bg-purple-50 text-purple-700", icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} className={`p-4 rounded-xl border border-transparent shadow-sm ${s.color} flex items-center justify-between`}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{s.label}</p>
                    <p className="text-2xl font-black">{s.value}</p>
                  </div>
                  <s.icon size={24} className="opacity-20" />
                </div>
              ))}
            </div>

            {/* Filters & Global Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  {["all", "pass", "fail"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setFilterStatus(tab); setPage(1); }}
                      className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        filterStatus === tab ? "bg-[#3AB000] text-white" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or app no..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-transparent outline-none shadow-sm"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {[
                        { label: "Candidate", key: "student" },
                        { label: "Application No", key: "applicationNumber" },
                        { label: "Contact Info", key: "mobile" },
                        { label: "Marks", key: "score" },
                        { label: "Percentage", key: "pct" },
                        { label: "Status", key: "status" },
                        { label: "Date", key: "completedAt" },
                      ].map((col) => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-[#3AB000] transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            {col.label}
                            <SI col={col.key} />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-20 text-center text-gray-400 italic">
                          No candidates found matching the filters.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((h) => (
                        <tr key={h.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#e8f5e2] text-[#3AB000] flex items-center justify-center font-bold text-sm shadow-sm">
                                {String(h.student || "?").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{h.student}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{h.district}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {h.applicationNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs space-y-0.5">
                              <p className="font-bold text-gray-700 flex items-center gap-1">
                                <Phone size={10} className="text-gray-400" /> {h.mobile}
                              </p>
                              <p className="text-gray-400 flex items-center gap-1">
                                <Mail size={10} className="text-gray-400" /> {h.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {h.score} <span className="text-gray-300 font-normal">/ {h.totalMarks}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#3AB000] h-full" style={{ width: `${h.pct}%` }}></div>
                              </div>
                              <span className={`text-xs font-black ${pctColor(h.pct)}`}>{h.pct}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              h.status === "pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                              {h.status === "pass" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                              {h.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                            {new Date(h.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">
                    Showing <span className="text-gray-900 font-bold">{paginated.length}</span> of <span className="text-gray-900 font-bold">{filtered.length}</span> candidates
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronUp size={16} className="-rotate-90" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          page === i + 1 ? "bg-[#3AB000] text-white shadow-md" : "text-gray-500 hover:bg-white hover:border-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronUp size={16} className="rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
