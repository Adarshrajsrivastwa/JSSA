import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  FileText,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Users,
  ClipboardList,
  TrendingUp,
  Calendar,
  MapPin,
  Eye,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { dashboardAPI, applicationsAPI } from "../utils/api";
import ScrollerCarousel from "../components/Scroller/ScrollerCarousel";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { identifier } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch dashboard stats
        const statsResponse = await dashboardAPI.getStats();
        if (statsResponse.success && statsResponse.data) {
          setDashboardData(statsResponse.data);
        } else if (statsResponse.error) {
          setError(statsResponse.error);
        }

        // Fetch recent applications
        const appsResponse = await applicationsAPI.getAll({ limit: 5 });
        if (appsResponse.success && appsResponse.data) {
          const transformed = appsResponse.data.applications.map((app) => ({
            id: app._id,
            candidateName: app.candidateName,
            district: app.district,
            status: app.status || "Pending",
            createdAt: app.createdAt,
            jobPosting: app.jobPostingId
              ? app.jobPostingId.post?.en || app.jobPostingId.post || "General"
              : "General",
          }));
          setRecentApplications(transformed);
        } else if (appsResponse.error && !statsResponse.error) {
          // Only set error if stats didn't already set one
          setError(appsResponse.error);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format stats for display
  const stats = dashboardData
    ? [
        {
          title: "Total Applications",
          value: dashboardData.stats.totalApplications.toString(),
          change: `+${dashboardData.stats.todayChange}%`,
          isPositive: true,
          icon: ClipboardList,
          lightColor: "bg-gradient-to-br from-green-50 to-green-100",
          textColor: "text-green-600",
        },
        {
          title: "Applications Today",
          value: dashboardData.stats.applicationsToday.toString(),
          change: `+${dashboardData.stats.todayChange}%`,
          isPositive: parseInt(dashboardData.stats.todayChange) >= 0,
          icon: TrendingUp,
          lightColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
          textColor: "text-emerald-600",
        },
        {
          title: "Approved",
          value: (dashboardData.statusDistribution?.Approved || 0).toString(),
          change: "",
          isPositive: true,
          icon: CheckCircle,
          lightColor: "bg-gradient-to-br from-teal-50 to-teal-100",
          textColor: "text-teal-600",
        },
        {
          title: "Pending",
          value: (dashboardData.statusDistribution?.Pending || 0).toString(),
          change: "",
          isPositive: false,
          icon: Clock,
          lightColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
          textColor: "text-yellow-600",
        },
      ]
    : [];

  const enrollmentData = dashboardData?.enrollmentData || [];

  // Convert status distribution to pie chart data
  const statusData = dashboardData?.statusDistribution
    ? Object.entries(dashboardData.statusDistribution)
        .map(([name, value], index) => {
          const colors = ["#16a34a", "#22c55e", "#f59e0b", "#ef4444", "#6366f1"];
          const statusColors = {
            Approved: "#16a34a",
            Active: "#22c55e",
            Pending: "#f59e0b",
            Rejected: "#ef4444",
            Inactive: "#6366f1",
          };
          return {
            name: name || "Pending",
            value: value,
            color: statusColors[name] || colors[index % colors.length],
          };
        })
        .filter((item) => item.value > 0)
    : [];

  const getStatusColor = (status) => {
    const colors = {
      Approved: "bg-green-100 text-green-700 border-green-200",
      Active: "bg-blue-100 text-blue-700 border-blue-200",
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Rejected: "bg-red-100 text-red-700 border-red-200",
      Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || colors.Pending;
  };

  const getStatusIcon = (status) => {
    if (status === "Approved") return CheckCircle;
    if (status === "Rejected") return XCircle;
    if (status === "Pending") return Clock;
    return AlertCircle;
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white p-4">
          <div className="max-w-[99rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AB000]"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white p-4">
          <div className="max-w-[99rem] mx-auto">
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Failed to Load Dashboard
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#3AB000] text-white px-6 py-2 rounded-lg hover:bg-[#2d8a00] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-[99rem] mx-auto">
          {/* Scroller Carousel */}
          <ScrollerCarousel />

          {/* Welcome Header */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 border border-green-200 rounded-2xl p-6 shadow-sm mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Applicant Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome{identifier ? `, ${identifier}` : ""}! Track your applications and apply for new positions.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`${stat.lightColor} p-4 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${stat.textColor}`} />
                    </div>
                    {stat.change && (
                      <span
                        className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                          stat.isPositive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stat.isPositive ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-4xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Application Growth Chart */}
            {enrollmentData.length > 0 && (
              <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-sm p-6 border border-green-200 hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Application History
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your applications over the last 6 months
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={enrollmentData}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid #bbf7d0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applicants"
                      stroke="#16a34a"
                      strokeWidth={4}
                      fill="url(#greenGrad)"
                      dot={{
                        fill: "#16a34a",
                        r: 6,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8, strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Status Distribution Chart */}
            {statusData.length > 0 && (
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-sm p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Application Status
                  </h2>
                  <p className="text-sm text-gray-600">
                    Distribution of your applications
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={90}
                      dataKey="value"
                      strokeWidth={3}
                      stroke="#fff"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "2px solid #a7f3d0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent Applications & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Recent Applications Table */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Recent Applications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your latest application submissions
                  </p>
                </div>
                <button
                  onClick={() => navigate("/application-form")}
                  className="text-green-600 text-sm font-bold hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                {recentApplications.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {["Name", "District", "Job Posting", "Status", "Action"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left py-4 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app) => {
                        const StatusIcon = getStatusIcon(app.status);
                        return (
                          <tr
                            key={app.id}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all duration-200"
                          >
                            <td className="py-4 px-4 text-sm font-medium text-gray-700">
                              {app.candidateName}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {app.district}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {app.jobPosting}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border flex items-center gap-1.5 w-fit ${getStatusColor(
                                  app.status,
                                )}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => navigate(`/applications/view/${app.id}`)}
                                className="text-[#3AB000] hover:text-[#2d8a00] transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No applications yet. Start by applying for a job!
                    </p>
                    <button
                      onClick={() => navigate("/application-form?new=true")}
                      className="mt-4 bg-[#3AB000] text-white px-6 py-2 rounded-lg hover:bg-[#2d8a00] transition-colors"
                    >
                      Create Application
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <button
                onClick={() => navigate("/application-form")}
                className="group text-left p-5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 transition shadow-sm hover:shadow-md w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">My Applications</h2>
                      <p className="text-xs text-gray-600">
                        View and track all applications
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-700 transition" />
                </div>
              </button>

              <button
                onClick={() => navigate("/application-form?new=true")}
                className="group text-left p-5 rounded-xl border-2 border-[#3AB000] bg-green-50 hover:bg-green-100 transition shadow-sm hover:shadow-md w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#3AB000] flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">New Application</h2>
                      <p className="text-xs text-gray-600">
                        Create a new application
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#3AB000] group-hover:translate-x-1 transition" />
                </div>
              </button>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-sm p-6 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Quick Stats</h2>
                    <p className="text-xs text-gray-600">Your overview</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: "Approval Rate",
                      value: `${dashboardData?.stats.approvalRate || "0"}%`,
                      sub: "Last 30 days",
                    },
                    {
                      label: "Total Applications",
                      value: dashboardData?.stats.totalApplications.toString() || "0",
                      sub: "All time",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white border border-green-200 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {item.value}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {item.label}
                        </h3>
                        <p className="text-xs text-gray-600">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
