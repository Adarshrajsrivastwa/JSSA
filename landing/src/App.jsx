import { Routes, Route } from "react-router-dom";
import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";

// NOTE: BrowserRouter is in main.jsx — DO NOT add it here

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/topbar-notifications" element={<TopBarNotification />} />
      <Route path="/mail" element={<TopBarMail />} />
      <Route path="/job-postings/view/:id" element={<JobDetail />} />

      {/* All JSS Abhiyan pages — Dashboard reads URL and shows correct page */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<Dashboard />} />
      <Route path="/membership" element={<Dashboard />} />
      <Route path="/services" element={<Dashboard />} />
      <Route path="/jobs" element={<Dashboard />} />
      <Route path="/notifications" element={<Dashboard />} />
      <Route path="/gallery" element={<Dashboard />} />
      <Route path="/verification" element={<Dashboard />} />
      <Route path="/contacts" element={<Dashboard />} />
      <Route path="/privacy-policy" element={<Dashboard />} />
      <Route path="/terms-of-service" element={<Dashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
