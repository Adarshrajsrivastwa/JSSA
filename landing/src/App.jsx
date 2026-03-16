import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import PaymentSuccess from "./pages/PaymentSuccess";

// NOTE: BrowserRouter is in main.jsx — DO NOT add it here

// Payment Redirect Handler - checks for payment parameters and redirects to payment-success
function PaymentRedirectHandler({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check if we're NOT already on payment-success page
    if (location.pathname !== "/payment-success") {
      const params = new URLSearchParams(location.search);
      const orderId = params.get("orderId");
      const applicationId = params.get("applicationId");
      const paymentId = params.get("paymentId") || params.get("referenceId") || params.get("cf_payment_id");
      const signature = params.get("signature") || params.get("cf_signature");
      const txStatus = params.get("txStatus") || params.get("tx_status") || params.get("payment_status");
      const payment = params.get("payment");

      // If we have payment-related parameters, redirect to payment-success
      if ((orderId || applicationId || paymentId || payment === "success") && (txStatus === "SUCCESS" || payment === "success")) {
        console.log("🔄 Payment parameters detected on", location.pathname, "- redirecting to payment-success");
        const redirectUrl = `/payment-success?${params.toString()}`;
        navigate(redirectUrl, { replace: true });
      }
    }
  }, [location, navigate]);

  return children;
}

function App() {
  // Log to identify landing app
  console.log("🌐 Landing App Running on Port 5174");
  
  return (
    <PaymentRedirectHandler>
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
    </PaymentRedirectHandler>
  );
}

export default App;
