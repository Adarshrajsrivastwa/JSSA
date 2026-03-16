import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";

import ApplicationForm from "./pages/ApplicationForm/ApplicationForm";
import ApplicationView from "./pages/ApplicationForm/ApplicationView";
import JobPosting from "./pages/JobPosting/JobPosting";
import JobPostingView from "./pages/JobPosting/JobPostingView.jsx";
import JobPostingApplicants from "./pages/JobPosting/JobPostingApplicants.jsx";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import StudentRegistration from "./pages/StudentRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import DashboardRedirect from "./pages/DashboardRedirect";
import Settings from "./pages/Settings/Settings";
import Gallery from "./pages/Gallery/Gallery";
import Scroller from "./pages/Scroller/Scroller";
import Notifications from "./pages/Notifications/Notifications";
import Logout from "./pages/Logout";

// Landing pages
import LandingDashboard from "./pages/Landing/LandingDashboard";
import JobDetail from "./pages/Landing/JobDetail";

import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth, RequireRole } from "./auth/RequireAuth";

function App() {
  // Log to identify frontend app
  console.log("🚀 FRONTEND App Running on Port 5173");
  
  return (
    <AuthProvider>
      <Router>
    <Routes>
          {/* Frontend default route - Login page */}
          <Route path="/" element={<Login />} />
          
          {/* Landing/Public pages - accessible without authentication */}
          <Route path="/landing" element={<LandingDashboard />} />
          <Route path="/about" element={<LandingDashboard />} />
          <Route path="/membership" element={<LandingDashboard />} />
          <Route path="/services" element={<LandingDashboard />} />
          <Route path="/jobs" element={<LandingDashboard />} />
          <Route path="/notifications" element={<LandingDashboard />} />
          <Route path="/gallery" element={<LandingDashboard />} />
          <Route path="/verification" element={<LandingDashboard />} />
          <Route path="/contacts" element={<LandingDashboard />} />
      <Route path="/job-postings/view/:id" element={<JobDetail />} />

          {/* Login page - always accessible */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/student-register" element={<StudentRegistration />} />

          {/* Protected app routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route
              path="/admin/dashboard"
              element={
                <RequireRole allow={["admin"]}>
                  <AdminDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/applicant/dashboard"
              element={
                <RequireRole allow={["applicant"]}>
                  <ApplicantDashboard />
                </RequireRole>
              }
            />

            {/* Shared routes (both roles can open) */}
            <Route path="/job-postings" element={<JobPosting />} />
            <Route path="/job-postings/view/:id" element={<JobPostingView />} />
            <Route path="/job-postings/:id/applicants" element={<JobPostingApplicants />} />
            <Route path="/application-form" element={<ApplicationForm />} />
            <Route path="/applications/view/:id" element={<ApplicationView />} />

            {/* Settings - Admin only */}
            <Route
              path="/settings"
              element={
                <RequireRole allow={["admin"]}>
                  <Settings />
                </RequireRole>
              }
            />

            {/* Gallery - Admin only */}
            <Route
              path="/admin/gallery"
              element={
                <RequireRole allow={["admin"]}>
                  <Gallery />
                </RequireRole>
              }
            />

            {/* Scroller - Admin only */}
            <Route
              path="/scroller"
              element={
                <RequireRole allow={["admin"]}>
                  <Scroller />
                </RequireRole>
              }
            />

            {/* Notifications - Admin only */}
            <Route
              path="/notifications-manage"
              element={
                <RequireRole allow={["admin"]}>
                  <Notifications />
                </RequireRole>
              }
            />

            {/* Top bar demo pages */}
            <Route path="/notifications-demo" element={<TopBarNotification />} />
            <Route path="/mail" element={<TopBarMail />} />

            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Catch-all: redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
