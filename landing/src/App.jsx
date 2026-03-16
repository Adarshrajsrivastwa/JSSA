import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopBarNotification from "./pages/TopBarComponents/TopBarNotification";
import TopBarMail from "./pages/TopBarComponents/TopBarMail";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import PaymentSuccess from "./pages/PaymentSuccess";

// NOTE: BrowserRouter is in main.jsx — DO NOT add it here

// Global payment redirect handler - catches payment redirects on any page
function PaymentRedirectHandler() {
  const location = useLocation();

  useEffect(() => {
    // Skip if already on payment-success page
    if (location.pathname === "/payment-success") {
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get("orderId") || urlParams.get("order_id");
    const applicationId = urlParams.get("applicationId");
    const payment = urlParams.get("payment");
    const paymentStatus = urlParams.get("payment_status") || urlParams.get("txStatus") || urlParams.get("tx_status");
    const cfPaymentId = urlParams.get("cf_payment_id") || urlParams.get("paymentId");

    // Check if we have payment-related parameters
    if (orderId || applicationId || cfPaymentId || payment === "success" || paymentStatus === "SUCCESS" || paymentStatus === "success") {
      // Get payment status to check if payment failed
      const txStatus = urlParams.get("txStatus") || urlParams.get("tx_status") || urlParams.get("payment_status") || "";
      
      // Don't redirect if payment explicitly failed
      if (txStatus === "FAILED" || txStatus === "failed" || txStatus === "CANCELLED" || txStatus === "cancelled") {
        return;
      }

      // Get data from sessionStorage
      const pendingData = sessionStorage.getItem("pendingApplication");
      let finalApplicationId = applicationId || "";
      let finalOrderId = orderId || "";

      // Try to get from sessionStorage if not in URL
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);
          if (!finalApplicationId) {
            finalApplicationId = data.applicationId || data.applicationData?._id || "";
          }
          if (!finalOrderId) {
            finalOrderId = data.orderId || "";
          }
        } catch (e) {
          console.error("Error parsing pendingData:", e);
        }
      }

      // Build redirect URL
      const redirectUrl = `/payment-success?orderId=${finalOrderId}&applicationId=${finalApplicationId}`;
      console.log("🌐 GLOBAL PAYMENT REDIRECT: Redirecting to", redirectUrl);

      // Redirect immediately
      window.location.replace(redirectUrl);
    }
  }, [location]);

  return null;
}

function App() {
  // Log to identify landing app
  console.log("🌐 Landing App Running on Port 5174");
  
  return (
    <>
      <PaymentRedirectHandler />
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
    </>
  );
}

export default App;
