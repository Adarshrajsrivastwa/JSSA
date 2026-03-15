import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { dashboardAPI } from "../utils/api";
import ScrollerCarousel from "../components/Scroller/ScrollerCarousel";
import {
  Users,
  FileText,
  Briefcase,
  Settings,
  PlusCircle,
  Eye,
  Edit,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  CreditCard,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dashboardAPI.getStats();
        if (response.success && response.data) {
          setDashboardData(response.data);
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
          value: dashboardData.stats.totalApplications.toLocaleString(),
          change: `+${dashboardData.stats.todayChange}%`,
          isPositive: true,
          icon: FileText,
          color: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          link: "/application-form",
        },
        {
          title: "Applications Today",
          value: dashboardData.stats.applicationsToday.toString(),
          change: `+${dashboardData.stats.todayChange}%`,
          isPositive: parseInt(dashboardData.stats.todayChange) >= 0,
          icon: TrendingUp,
          color: "from-green-500 to-green-600",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          link: "/application-form",
        },
        {
          title: "Active Job Postings",
          value: dashboardData.stats.activeJobPostings.toString(),
          change: "+0%",
          isPositive: true,
          icon: Briefcase,
          color: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
          link: "/job-postings",
        },
        {
          title: "Total Job Postings",
          value: dashboardData.stats.totalJobPostings.toString(),
          change: "+0%",
          isPositive: true,
          icon: Users,
          color: "from-orange-500 to-orange-600",
          bgColor: "bg-orange-50",
          textColor: "text-orange-600",
          link: "/job-postings",
        },
      ]
    : [];

  const enrollmentData = dashboardData?.enrollmentData || [];
  const recentApplicants = dashboardData?.recentApplications || [];

  // Quick Actions
  const quickActions = [
    {
      title: "Add Job Posting",
      description: "Create a new job posting",
      icon: PlusCircle,
      color: "from-[#3AB000] to-[#2d8a00]",
      bgColor: "bg-green-50",
      action: () => {
        const event = new CustomEvent("openJobPostingModal");
        window.dispatchEvent(event);
        navigate("/job-postings");
      },
    },
    {
      title: "View Applications",
      description: "Manage all applications",
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      action: () => navigate("/application-form"),
    },
    {
      title: "Payment Settings",
      description: "Manage Razorpay credentials",
      icon: CreditCard,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      action: () => navigate("/settings"),
    },
    {
      title: "Manage Settings",
      description: "Configure system settings",
      icon: Settings,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      action: () => navigate("/settings"),
    },
  ];

  // Status distribution for pie chart
  const categoryData = dashboardData?.statusDistribution
    ? Object.entries(dashboardData.statusDistribution)
        .map(([name, value], index) => {
          const colors = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#f59e0b"];
          return {
            name: name || "Pending",
            value: value,
            color: colors[index % colors.length],
          };
        })
        .filter((item) => item.value > 0)
    : [];

  // District distribution
  const districtData = dashboardData?.districtDistribution
    ? dashboardData.districtDistribution.map((item) => ({
        district: item._id || "Unknown",
        count: item.count,
      }))
    : [];

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-[99rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
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
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-[99rem] mx-auto">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
    <DashboardLayout activePath="/admin/dashboard">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[99rem] mx-auto">
          {/* Scroller Carousel */}
          <ScrollerCarousel />

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage applications, job postings, and system settings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  onClick={() => stat.link && navigate(stat.link)}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <span
                      className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.isPositive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.bgColor} rounded-lg p-6 text-left hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-gray-200 group`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <ArrowRight className="w-5 h-5 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Application Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Application Growth
                </h2>
                <p className="text-sm text-gray-600">
                  Monthly registration trend
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={enrollmentData.length > 0 ? enrollmentData : [{ month: "No Data", applicants: 0 }]}>
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3AB000" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3AB000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applicants"
                    stroke="#3AB000"
                    strokeWidth={3}
                    fill="url(#greenGrad)"
                    dot={{ fill: "#3AB000", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Application Status
                </h2>
                <p className="text-sm text-gray-600">
                  Distribution by status
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{ name: "No Data", value: 1, color: "#e5e7eb" }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    dataKey="value"
                  >
                    {(categoryData.length > 0 ? categoryData : [{ name: "No Data", value: 1, color: "#e5e7eb" }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Management Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Management
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage Razorpay payment gateway credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 px-4 py-2 bg-[#3AB000] hover:bg-[#2d8a00] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Manage Credentials
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Payment Gateway
                  </span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Razorpay</p>
                <p className="text-xs text-gray-600 mt-1">
                  Payment processing enabled
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Test Mode
                  </span>
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-lg font-bold text-gray-900">Active</p>
                <p className="text-xs text-gray-600 mt-1">
                  Using test credentials
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Quick Actions
                  </span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Configure Settings →
                </button>
                <p className="text-xs text-gray-600 mt-1">
                  Update credentials & preferences
                </p>
              </div>
            </div>
          </div>

          {/* District Distribution & Recent Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* District Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  District Distribution
                </h2>
                <p className="text-sm text-gray-600">
                  Applications by district
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={districtData.length > 0 ? districtData : [{ district: "No Data", count: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="district"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3AB000" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Recent Applications
                  </h2>
                  <p className="text-sm text-gray-600">
                    Latest submissions
                  </p>
                </div>
                <button
                  onClick={() => navigate("/application-form")}
                  className="text-[#3AB000] text-sm font-semibold hover:text-[#2d8a00]"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {recentApplicants.length > 0 ? (
                  recentApplicants.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => navigate(`/applications/view/${app.id}`)}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3AB000] bg-opacity-10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#3AB000]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {app.name}
                          </p>
                          <p className="text-xs text-gray-600">{app.district}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : app.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent applications
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

