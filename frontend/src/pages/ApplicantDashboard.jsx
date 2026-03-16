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
  Bell,
  Briefcase,
  BookOpen,
  UserCheck,
  Award,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { dashboardAPI, applicationsAPI, jobPostingsAPI, notificationsAPI } from "../utils/api";
import ScrollerCarousel from "../components/Scroller/ScrollerCarousel";

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const { identifier } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch dashboard stats
        const statsResponse = await dashboardAPI.getStats();
        if (statsResponse.success && statsResponse.data) {
          setDashboardData(statsResponse.data);
        }

        // Fetch recent applications
        const appsResponse = await applicationsAPI.getAll({ limit: 5 });
        if (appsResponse.success && appsResponse.data) {
          const transformed = appsResponse.data.applications.map((app) => ({
            id: app._id,
            candidateName: app.candidateName,
            district: app.district,
            status: app.status || "Pending",
            paymentStatus: app.paymentStatus || "pending",
            createdAt: app.createdAt,
            jobPosting: app.jobPostingId
              ? app.jobPostingId.post?.en || app.jobPostingId.post || "General"
              : "General",
            jobPostingId: app.jobPostingId?._id || app.jobPostingId,
          }));
          setRecentApplications(transformed);
        }

        // Fetch notifications
        try {
          const notifResponse = await notificationsAPI.getAll(true);
          if (notifResponse.success && notifResponse.data) {
            setNotifications(notifResponse.data.notifications || notifResponse.data || []);
          }
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }

        // Fetch active job postings
        try {
          const jobsResponse = await jobPostingsAPI.getAll({ status: "Active", limit: 6 });
          if (jobsResponse.success && jobsResponse.data) {
            setJobPostings(jobsResponse.data.postings || jobsResponse.data || []);
          }
        } catch (err) {
          console.error("Error fetching job postings:", err);
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

  // Application flow stages
  const applicationFlow = [
    {
      stage: "Application Fill",
      icon: FileText,
      description: "Submit your application form",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      stage: "Test",
      icon: BookOpen,
      description: "Complete the assessment test",
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      stage: "Interview",
      icon: UserCheck,
      description: "Attend the interview",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      stage: "Medical Officer",
      icon: ClipboardList,
      description: "Medical Officer verification",
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      stage: "Employment",
      icon: Award,
      description: "Final employment",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

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

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white p-4">
          <div className="max-w-[99rem] mx-auto">
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-[99rem] mx-auto space-y-6">
          {/* Scroller Carousel */}
          <ScrollerCarousel />

          {/* Welcome Header */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 border border-green-200 rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Applicant Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome{identifier ? `, ${identifier}` : ""}! Track your applications and explore new opportunities.
            </p>
          </div>

          {/* Application Flow */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3AB000]" />
              Application Process Flow
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {applicationFlow.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.stage} className="flex items-center flex-1 min-w-[150px]">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg mb-3`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {step.stage}
                      </h3>
                      <p className="text-xs text-gray-600 text-center">
                        {step.description}
                      </p>
                    </div>
                    {index < applicationFlow.length - 1 && (
                      <ChevronRight className="w-6 h-6 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Notifications & Applications */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#3AB000]" />
                    All Notifications
                  </h2>
                  <button
                    onClick={() => navigate("/notifications")}
                    className="text-[#3AB000] text-sm font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (notif.link) {
                            navigate(notif.link);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#3AB000] flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">
                              {notif.title || "Notification"}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {notif.message || notif.description || ""}
                            </p>
                            {notif.createdAt && (
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No notifications available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#3AB000]" />
                    My Applications
                  </h2>
                  <button
                    onClick={() => navigate("/application-form")}
                    className="text-[#3AB000] text-sm font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/applications/view/${app.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">
                              {app.candidateName}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2">
                              {app.jobPosting}
                            </p>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                                  app.status,
                                )}`}
                              >
                                {app.status}
                              </span>
                              {app.paymentStatus === "pending" && (
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                                  Payment Pending
                                </span>
                              )}
                              {app.paymentStatus === "paid" && (
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                  Payment Done
                                </span>
                              )}
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-4">
                        No applications yet. Start by applying for a job!
                      </p>
                      <button
                        onClick={() => navigate("/application-form?new=true")}
                        className="bg-[#3AB000] text-white px-6 py-2 rounded-lg hover:bg-[#2d8a00] transition-colors text-sm font-semibold"
                      >
                        Create Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Vacancies & Quick Actions */}
            <div className="space-y-6">
              {/* All Related Vacancies */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#3AB000]" />
                    All Related Vacancies
                  </h2>
                  <button
                    onClick={() => navigate("/job-postings")}
                    className="text-[#3AB000] text-sm font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {jobPostings.length > 0 ? (
                    jobPostings.map((job) => (
                      <div
                        key={job._id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/job-postings/view/${job._id}`)}
                      >
                        <h3 className="font-bold text-gray-900 text-sm mb-2">
                          {job.post?.en || job.postTitle?.en || job.post || "Job Posting"}
                        </h3>
                        {job.post?.hi && (
                          <p className="text-xs text-gray-600 mb-2">{job.post.hi}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {job.advtNo && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {job.advtNo}
                            </span>
                          )}
                          {job.location?.en && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location.en}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            {job.status || "Active"}
                          </span>
                          <Eye className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No vacancies available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-sm p-6 border-2 border-green-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#3AB000]" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/application-form")}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 transition shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">My Applications</h3>
                          <p className="text-xs text-gray-600">View all applications</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/application-form?new=true")}
                    className="w-full text-left p-4 rounded-lg border-2 border-[#3AB000] bg-green-50 hover:bg-green-100 transition shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#3AB000] flex items-center justify-center">
                          <PlusCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">New Application</h3>
                          <p className="text-xs text-gray-600">Create a new application</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#3AB000]" />
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/job-postings")}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 transition shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">Browse Jobs</h3>
                          <p className="text-xs text-gray-600">Explore opportunities</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats Summary */}
              {dashboardData && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#3AB000]" />
                    Quick Stats
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                      <span className="text-sm font-semibold text-gray-700">
                        Total Applications
                      </span>
                      <span className="text-lg font-bold text-[#3AB000]">
                        {dashboardData.stats?.totalApplications || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <span className="text-sm font-semibold text-gray-700">
                        Approved
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {dashboardData.statusDistribution?.Approved || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <span className="text-sm font-semibold text-gray-700">
                        Pending
                      </span>
                      <span className="text-lg font-bold text-yellow-600">
                        {dashboardData.statusDistribution?.Pending || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
