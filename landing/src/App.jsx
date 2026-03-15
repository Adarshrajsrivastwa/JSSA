import { Routes, Route } from "react-router-dom";
import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import PaymentSuccess from "./pages/PaymentSuccess";

// NOTE: BrowserRouter is in main.jsx — DO NOT add it here

function App() {
  // Log to identify landing app
  console.log("🌐 Landing App Running on Port 5174");
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/topbar-notifications" element={<TopBarNotification />} />
      <Route path="/mail" element={<TopBarMail />} />
      <Route path="/job-postings/view/:id" element={<JobDetail />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

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
