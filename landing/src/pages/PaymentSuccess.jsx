import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jobPostingsAPI } from "../utils/api.js";
import logo1 from "../assets/jss.png";

const GREEN = "#0aca00";

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 768px) {
    .payment-success-container {
      padding: 10px !important;
    }
    
    .payment-success-banner {
      padding: 16px !important;
      margin-bottom: 16px !important;
    }
    
    .payment-success-banner h1 {
      font-size: 24px !important;
      margin-bottom: 8px !important;
    }
    
    .payment-success-banner h2 {
      font-size: 16px !important;
      margin-bottom: 8px !important;
    }
    
    .payment-success-banner p {
      font-size: 14px !important;
    }
    
    .payment-success-actions {
      flex-direction: column !important;
      gap: 12px !important;
    }
    
    .payment-success-actions button {
      width: 100% !important;
      padding: 14px 20px !important;
      font-size: 15px !important;
    }
    
    /* Educational Details - Single line on mobile */
    #application-slip-pdf .educational-details-content > div {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      margin-bottom: 8px !important;
      line-height: 1.5 !important;
    }
    
    #application-slip-pdf .educational-details-content > div strong {
      margin-right: 8px !important;
      flex-shrink: 0 !important;
    }
    
    #application-slip-pdf .educational-details-content > div span {
      flex: 1 !important;
    }
    
    /* Payment Status Table - Desktop view (default) */
    #application-slip-pdf .payment-status-table-container table {
      display: table !important;
    }
    
    #application-slip-pdf .payment-status-mobile-view {
      display: none !important;
    }
    
    /* Payment Status Table - Convert to 4 lines on mobile */
    @media (max-width: 768px) {
      #application-slip-pdf .payment-status-table-container table {
        display: none !important;
      }
      
      #application-slip-pdf .payment-status-mobile-view {
        display: block !important;
      }
      
      #application-slip-pdf .payment-status-mobile-view > div {
        padding: 10px 0 !important;
        border-bottom: 1px solid #e0e0e0 !important;
        font-size: 13px !important;
      }
      
      #application-slip-pdf .payment-status-mobile-view > div:last-child {
        border-bottom: none !important;
      }
      
      #application-slip-pdf .payment-status-mobile-view strong {
        font-weight: 700 !important;
        color: #1a2a4a !important;
        margin-right: 8px !important;
      }
    }
    
    #application-slip-pdf {
      font-size: 11px !important;
      padding: 10px !important;
    }
    
    #application-slip-pdf h3 {
      font-size: 13px !important;
    }
    
    #application-slip-pdf table {
      font-size: 10px !important;
    }
    
    #application-slip-pdf th,
    #application-slip-pdf td {
      padding: 8px 6px !important;
    }
    
    #application-slip-pdf .header-section {
      flex-direction: column !important;
      gap: 10px !important;
      padding: 12px !important;
    }
    
    #application-slip-pdf .logo-circle {
      width: 60px !important;
      height: 60px !important;
    }
    
    #application-slip-pdf .header-title {
      font-size: 18px !important;
    }
    
    #application-slip-pdf .header-subtitle {
      font-size: 10px !important;
    }
  }
  
  @media (max-width: 480px) {
    .payment-success-container {
      padding: 8px !important;
    }
    
    .payment-success-banner {
      padding: 12px !important;
    }
    
    .payment-success-banner h1 {
      font-size: 20px !important;
    }
    
    .payment-success-banner h2 {
      font-size: 14px !important;
    }
    
    .payment-success-banner p {
      font-size: 12px !important;
    }
    
    /* Educational Details - Single line on small mobile */
    #application-slip-pdf .educational-details-content > div {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      margin-bottom: 6px !important;
      line-height: 1.4 !important;
      font-size: 13px !important;
    }
    
    #application-slip-pdf .educational-details-content > div strong {
      margin-right: 6px !important;
      flex-shrink: 0 !important;
      font-size: 13px !important;
    }
    
    #application-slip-pdf .educational-details-content > div span {
      flex: 1 !important;
      font-size: 13px !important;
    }
    
    #application-slip-pdf {
      font-size: 10px !important;
      padding: 8px !important;
    }
    
    #application-slip-pdf .personal-details-grid {
      grid-template-columns: 1fr !important;
    }
    
    #application-slip-pdf .educational-details-grid {
      grid-template-columns: 1fr !important;
    }
    
    #application-slip-pdf .photo-container {
      position: static !important;
      margin: 10px auto !important;
      width: 100% !important;
    }
    
    #application-slip-pdf .signature-container {
      position: static !important;
      margin: 10px auto !important;
      text-align: center !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = responsiveStyles;
  document.head.appendChild(styleSheet);
}

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [job, setJob] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  // Prevent any auto-redirects - ensure we stay on this page
  useEffect(() => {
    console.log("✅ PaymentSuccess page mounted/updated - staying on this page");
    // Clear any pending redirects or navigation
    const currentPath = window.location.pathname;
    if (!currentPath.includes("/payment-success")) {
      console.warn("⚠️ Warning: PaymentSuccess component loaded but URL is not payment-success:", currentPath);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("📄 PaymentSuccess page loading data...");
        // Get data from sessionStorage or URL params
        const pendingData = sessionStorage.getItem("pendingApplication");
        const orderId = searchParams.get("orderId");
        const applicationId = searchParams.get("applicationId");
        console.log("PaymentSuccess - orderId:", orderId, "applicationId:", applicationId, "pendingData exists:", !!pendingData);

        // Wait a bit for sessionStorage to be available (in case of redirect timing)
        await new Promise(resolve => setTimeout(resolve, 100));

        // Try to get pendingData again after a short delay
        const finalPendingData = sessionStorage.getItem("pendingApplication") || pendingData;

        if (finalPendingData) {
          try {
            const data = JSON.parse(finalPendingData);
            console.log("✅ Found pending application data in sessionStorage");
            console.log("📦 Full formData keys:", Object.keys(data.formData || {}));
            console.log("📸 Photo exists:", !!data.formData?.photo, "Type:", typeof data.formData?.photo);
            console.log("✍️ Signature exists:", !!data.formData?.signature, "Type:", typeof data.formData?.signature);
            
            setApplicationData(data.applicationData);
            setFormData(data.formData || {});
            
            // Load photo and signature if available
            
            if (data.formData?.photo) {
              // Ensure it's a valid base64 or URL string
              const photoSrc = data.formData.photo;
              if (typeof photoSrc === 'string' && (photoSrc.startsWith('data:') || photoSrc.startsWith('http'))) {
                setPhotoPreview(photoSrc);
                console.log("✅ Photo loaded successfully");
              } else if (typeof photoSrc === 'string') {
                // If it's base64 without data URI prefix, add it
                setPhotoPreview(`data:image/jpeg;base64,${photoSrc}`);
                console.log("✅ Photo loaded (added data URI prefix)");
              }
            }
            
            if (data.formData?.signature) {
              // Ensure it's a valid base64 or URL string
              const signatureSrc = data.formData.signature;
              if (typeof signatureSrc === 'string' && (signatureSrc.startsWith('data:') || signatureSrc.startsWith('http'))) {
                setSignaturePreview(signatureSrc);
                console.log("✅ Signature loaded successfully");
              } else if (typeof signatureSrc === 'string') {
                // If it's base64 without data URI prefix, add it
                setSignaturePreview(`data:image/png;base64,${signatureSrc}`);
                console.log("✅ Signature loaded (added data URI prefix)");
              }
            }

            // Load job details
            if (data.applicationData?.jobPostingId) {
              try {
                const jobResponse = await jobPostingsAPI.getById(data.applicationData.jobPostingId);
                if (jobResponse.success && jobResponse.data.posting) {
                  setJob(jobResponse.data.posting);
                }
              } catch (err) {
                console.error("Error loading job:", err);
              }
            }
            setLoading(false);
            return; // Exit early if we have data
          } catch (parseErr) {
            console.error("Error parsing pendingData:", parseErr);
          }
        }

        // If no pendingData, try to fetch from API using applicationId
        if (applicationId) {
          console.log("📡 Fetching application from API...");
          const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";
          if (apiUrl) {
            try {
              const response = await fetch(`${apiUrl}/applications/${applicationId}`);
              const result = await response.json();
              if (result.success && result.data.application) {
                console.log("✅ Found application in API");
                const app = result.data.application;
                setApplicationData(app);
                
                // Load job details
                if (app.jobPostingId) {
                  const jobResponse = await jobPostingsAPI.getById(app.jobPostingId);
                  if (jobResponse.success && jobResponse.data.posting) {
                    setJob(jobResponse.data.posting);
                  }
                }
                setLoading(false);
                return; // Exit early if we have data
              }
            } catch (err) {
              console.error("Error fetching application:", err);
            }
          }
        }

        // If we reach here, we don't have data yet
        // Wait a bit more and try again (maybe data is still loading)
        console.log("⏳ No data found yet, waiting a bit more...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try one more time
        const retryPendingData = sessionStorage.getItem("pendingApplication");
        if (retryPendingData) {
          try {
            const data = JSON.parse(retryPendingData);
            setApplicationData(data.applicationData);
            setFormData(data.formData || {});
            
            // Load photo and signature in retry
            if (data.formData?.photo) {
              const photoSrc = data.formData.photo;
              if (typeof photoSrc === 'string' && (photoSrc.startsWith('data:') || photoSrc.startsWith('http'))) {
                setPhotoPreview(photoSrc);
              } else if (typeof photoSrc === 'string') {
                setPhotoPreview(`data:image/jpeg;base64,${photoSrc}`);
              }
            }
            
            if (data.formData?.signature) {
              const signatureSrc = data.formData.signature;
              if (typeof signatureSrc === 'string' && (signatureSrc.startsWith('data:') || signatureSrc.startsWith('http'))) {
                setSignaturePreview(signatureSrc);
              } else if (typeof signatureSrc === 'string') {
                setSignaturePreview(`data:image/png;base64,${signatureSrc}`);
              }
            }
            if (data.applicationData?.jobPostingId) {
              const jobResponse = await jobPostingsAPI.getById(data.applicationData.jobPostingId);
              if (jobResponse.success && jobResponse.data.posting) {
                setJob(jobResponse.data.posting);
              }
            }
          } catch (err) {
            console.error("Error in retry:", err);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading payment success data:", err);
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: "#666" }}>
          Loading...
        </div>
      </div>
    );
  }

  // Don't show "Application Not Found" immediately - wait a bit more for data to load
  // Only show if we're sure data won't load (after loading is complete and no data)
  if (!loading && !applicationData && !formData) {
    // Check URL params - if we have orderId or applicationId, try to fetch one more time
    const orderId = searchParams.get("orderId");
    const applicationId = searchParams.get("applicationId");
    
    // If we have params but no data, show error (but don't auto-redirect)
    if (orderId || applicationId) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              maxWidth: 500,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#333" }}>
              Application Not Found
            </div>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
              Unable to load application details. Please check your application number or contact support.
            </div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 24 }}>
              Order ID: {orderId || "N/A"} | Application ID: {applicationId || "N/A"}
            </div>
            <button
              onClick={() => {
                // Clear sessionStorage to prevent redirect back to payment-success
                sessionStorage.removeItem("pendingApplication");
                navigate("/");
              }}
              style={{
                background: GREEN,
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🏠 Go to Home
            </button>
          </div>
        </div>
      );
    }
    
    // If no params at all, show error
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#333" }}>
            Invalid Payment Success Page
          </div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
            No payment information found. Please return to the application page.
          </div>
          <button
            onClick={() => {
              // Clear sessionStorage to prevent redirect back to payment-success
              sessionStorage.removeItem("pendingApplication");
              navigate("/");
            }}
            style={{
              background: GREEN,
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🏠 Go to Home
          </button>
        </div>
      </div>
    );
  }

  const finalFormData = formData || applicationData || {};
  const applicationNumber = applicationData?.applicationNumber || finalFormData?.applicationNumber || "";

  return (
    <div
      className="payment-success-container"
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "10px",
      }}
    >
      {/* Payment Success Banner */}
      <div
        className="payment-success-banner"
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto 20px",
          background: "#fff",
          borderRadius: 8,
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: GREEN,
            marginBottom: 12,
          }}
        >
          ✅ Payment Successful!
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#333",
            marginBottom: 8,
          }}
        >
          Your application has been submitted successfully
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#666",
            marginBottom: 16,
          }}
        >
          Application Number:{" "}
          <span style={{ color: GREEN, fontSize: 18 }}>
            {applicationNumber || "N/A"}
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#666",
            lineHeight: 1.6,
          }}
        >
          Please download your application slip below. Keep this application number
          for future reference.
        </div>
      </div>

      <div
        id="application-slip-pdf"
        style={{
          background: "#fff",
          borderRadius: 0,
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: 0,
          overflow: "hidden",
          boxSizing: "border-box",
          position: "relative",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: "14px", // Increased base font size
          lineHeight: "1.5",
        }}
      >
        {/* Remove top timestamp - not in image format */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            padding: "15px 20px",
            background: GREEN,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "2px solid #fff",
              overflow: "hidden",
            }}
          >
            <img
              src={logo1}
              alt="JSSA Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "6px",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 4,
                lineHeight: 1.2,
              }}
            >
              जन स्वास्थ्य सहायता अभियान
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#fff",
                marginBottom: 2,
                fontWeight: 600,
              }}
            >
              A Project Of Healthcare Research & Development Board
            </div>
            <div style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>
              (HRDB is Division of social welfare organization "NAC India")
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
              Registration No. : 053083
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            color: "#000",
            padding: "10px 20px",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 14,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {job?.postTitle?.en || job?.post?.en || ""} Recruitment
        </div>
        <div
          style={{
            background: "#000",
            color: "#fff",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div
            style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
          >
            Advt. No.: {job?.advtNo || ""}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              textAlign: "center",
              flex: 1,
              minWidth: "150px",
            }}
          >
            Application Slip
          </div>
          <div style={{ fontSize: 13, whiteSpace: "nowrap" }}>
            Date:{" "}
            {new Date().toLocaleString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "#f9f9f9",
            borderBottom: "1px solid #e0e0e0",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            Post Applied for: {job?.postTitle?.en || job?.post?.en || ""}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>
            Application No.: {applicationNumber}
          </div>
        </div>
        <div style={{ padding: "15px 20px", background: "#fff", position: "relative" }}>
          {/* Header with Photo in top right */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#000",
                margin: 0,
                paddingBottom: 6,
                borderBottom: "2px solid #e0e0e0",
                flex: 1,
              }}
            >
              Personal Details
            </h3>
            {/* Photo in top right corner */}
            {photoPreview ? (
              <div
                style={{ 
                  marginLeft: 20,
                  width: 100,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={photoPreview}
                  alt="Applicant Photo"
                  onError={(e) => {
                    console.error("❌ Photo failed to load:", photoPreview);
                    e.target.style.display = "none";
                  }}
                  onLoad={() => {
                    console.log("✅ Photo loaded successfully");
                  }}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    border: "2px solid #000",
                    borderRadius: 4,
                    display: "block",
                    background: "#fff",
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#000",
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  Photo
                </div>
              </div>
            ) : null}
          </div>
          {/* Personal details - one field per line */}
          <div
            style={{
              fontSize: 15,
              lineHeight: 2.2,
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Name:</strong>{" "}
              <strong style={{ color: "#000", fontWeight: 700 }}>
                {finalFormData.candidateName?.toUpperCase() || ""}
              </strong>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Application No.:</strong>{" "}
              <span>{applicationNumber}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Father's Name:</strong>{" "}
              <span>{finalFormData.fatherName?.toUpperCase() || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Mother's Name:</strong>{" "}
              <span>{finalFormData.motherName?.toUpperCase() || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Date of Birth:</strong>{" "}
              <span>
                {finalFormData.dob
                  ? new Date(finalFormData.dob).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Gender:</strong>{" "}
              <span>
                {finalFormData.gender?.charAt(0).toUpperCase() +
                  finalFormData.gender?.slice(1) || ""}
              </span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Nationality:</strong>{" "}
              <span>
                {finalFormData.nationality?.charAt(0).toUpperCase() +
                  finalFormData.nationality?.slice(1) || ""}
              </span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Category:</strong>{" "}
              <span>{finalFormData.category?.toUpperCase() || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Aadhar Number:</strong>{" "}
              <span>{finalFormData.aadhar || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>PAN Number:</strong>{" "}
              <span>{finalFormData.pan?.toUpperCase() || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Mobile Number:</strong>{" "}
              <span>{finalFormData.mobile || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Email ID:</strong>{" "}
              <span>{finalFormData.email || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Permanent Address:</strong>{" "}
              <span>{finalFormData.address?.toUpperCase() || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>State:</strong>{" "}
              <span>{finalFormData.state || ""}</span>
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>District:</strong>{" "}
              <span>{finalFormData.district || ""}</span>
            </div>
            {finalFormData.block && (
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Block:</strong>{" "}
                <span>{finalFormData.block}</span>
              </div>
            )}
            {finalFormData.panchayat && (
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Panchayat:</strong>{" "}
                <span>{finalFormData.panchayat}</span>
              </div>
            )}
            <div style={{ marginBottom: 4 }}>
              <strong style={{ color: "#333" }}>Pin Code:</strong>{" "}
              <span>{finalFormData.pincode || ""}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "15px 20px",
            background: "#fff",
            borderTop: "1px solid #e0e0e0",
            position: "relative",
          }}
        >
          {/* Educational Details with Signature in bottom right */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#000",
                margin: 0,
                paddingBottom: 6,
                borderBottom: "2px solid #e0e0e0",
                flex: 1,
              }}
            >
              Educational Details
            </h3>
          </div>
          {/* Content with signature */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {/* Educational details - one field per line */}
            <div
              className="educational-details-content"
              style={{
                fontSize: 15,
                lineHeight: 2.2,
                flex: 1,
                paddingBottom: signaturePreview ? "80px" : "0",
              }}
            >
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Higher Education:</strong>{" "}
                <span>{finalFormData.higherEducation || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Board/University:</strong>{" "}
                <span>{finalFormData.board || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Total Marks:</strong>{" "}
                <span>{finalFormData.marks || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Marks in Percentage:</strong>{" "}
                <span>{finalFormData.markPercentage || ""}</span>
              </div>
            </div>
            {/* Signature in bottom right */}
            {signaturePreview ? (
              <div
                style={{
                  marginLeft: 20,
                  textAlign: "right",
                  flexShrink: 0,
                  alignSelf: "flex-end",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    border: "1px solid #000",
                    background: "#fff",
                    padding: "8px 12px",
                    borderRadius: 4,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={signaturePreview}
                    alt="Signature"
                    onError={(e) => {
                      console.error("❌ Signature failed to load:", signaturePreview);
                      e.target.style.display = "none";
                    }}
                    onLoad={() => {
                      console.log("✅ Signature loaded successfully");
                    }}
                    style={{
                      width: 160,
                      height: 60,
                      objectFit: "contain",
                      display: "block",
                      marginBottom: 4,
                      background: "#fff",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#000",
                      textAlign: "center",
                      borderTop: "1px solid #e0e0e0",
                      paddingTop: 4,
                    }}
                  >
                    Signature
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div
          style={{
            padding: "15px 20px",
            background: "#fff",
            borderTop: "1px solid #e0e0e0",
            position: "relative",
          }}
        >
          <div
            style={{
              marginBottom: 12,
              fontSize: 11,
              lineHeight: 1.6,
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <input
                type="checkbox"
                checked
                readOnly
                style={{ marginRight: 8, cursor: "default" }}
              />
              <span>I have read and agree to the Terms and Conditions.</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked
                readOnly
                style={{ marginRight: 8, cursor: "default" }}
              />
              <span>
                I declare that all the information given in this application form
                is correct to the best of my knowledge and belief. If any
                information provided is found false, my candidature may be
                rejected at any point of time. I have read and understood the
                conditions which I would abide by. Thus, I have given the above
                declaration in my full consciousness without any pressure.
              </span>
            </div>
          </div>
          {/* Signature moved to Educational Details section - removed from here */}
        </div>
        <div 
          className="payment-status-table-container"
          style={{ 
            marginTop: 12, 
            padding: "0 20px 15px", 
            overflowX: "auto",
            overflowY: "visible",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Desktop Table View */}
          <table
            className="payment-status-table-desktop"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              border: "1px solid #e0e0e0",
              tableLayout: "fixed",
              minWidth: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <thead>
              <tr style={{ background: "#1a2a4a", color: "#fff" }}>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                    fontSize: 13,
                    width: "20%",
                    wordBreak: "break-word",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Application No.
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                    fontSize: 13,
                    width: "30%",
                    wordBreak: "break-word",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                    fontSize: 13,
                    width: "20%",
                    wordBreak: "break-word",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Payment Status
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                    fontSize: 13,
                    width: "30%",
                    wordBreak: "break-word",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#f9f9f9" }}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    color: "#000",
                    fontSize: 13,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {applicationNumber}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    color: "#000",
                    fontSize: 13,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {finalFormData.email || ""}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    color: GREEN,
                    fontWeight: 700,
                    fontSize: 13,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Complete
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e0e0e0",
                    color: "#000",
                    fontSize: 13,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date().toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
          
          {/* Mobile View - 4 Lines */}
          <div 
            className="payment-status-mobile-view"
            style={{
              display: "none", // Hidden on desktop, shown on mobile via CSS
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "15px",
              marginTop: "12px",
            }}
          >
            <div style={{ padding: "10px 0", borderBottom: "1px solid #e0e0e0" }}>
              <strong style={{ color: "#1a2a4a", fontWeight: 700 }}>Application No.:</strong>{" "}
              <span>{applicationNumber}</span>
            </div>
            <div style={{ padding: "10px 0", borderBottom: "1px solid #e0e0e0" }}>
              <strong style={{ color: "#1a2a4a", fontWeight: 700 }}>Email:</strong>{" "}
              <span>{finalFormData.email || ""}</span>
            </div>
            <div style={{ padding: "10px 0", borderBottom: "1px solid #e0e0e0" }}>
              <strong style={{ color: "#1a2a4a", fontWeight: 700 }}>Payment Status:</strong>{" "}
              <span style={{ color: GREEN, fontWeight: 700 }}>Complete</span>
            </div>
            <div style={{ padding: "10px 0" }}>
              <strong style={{ color: "#1a2a4a", fontWeight: 700 }}>Date:</strong>{" "}
              <span>{new Date().toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 10,
            color: "#666",
            background: "#f9f9f9",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ wordBreak: "break-all", flex: 1, minWidth: "200px" }}>
            https://www.jssabhiyan-nac.in/fill_application_print?oid=
            {applicationData?._id || applicationData?.id || ""}
          </div>
          <div>1/1</div>
        </div>
        <div
          className="payment-success-actions"
          style={{
            display: "flex",
            gap: 12,
            padding: "15px 20px",
            justifyContent: "center",
            flexWrap: "wrap",
            background: "#fff",
            borderTop: "2px solid #e0e0e0",
          }}
        >
          <button
            onClick={async (e) => {
              try {
                if (!window.html2canvas)
                  await loadScript(
                    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
                  );
                if (!window.jspdf)
                  await loadScript(
                    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
                  );
                await new Promise((resolve) => setTimeout(resolve, 500));
                const container = document.getElementById("application-slip-pdf");
                if (!container || !window.html2canvas || !window.jspdf) {
                  alert(
                    "PDF libraries not loaded. Please wait and try again.",
                  );
                  return;
                }
                const button = e.target;
                const originalText = button.innerHTML;
                button.innerHTML = "⏳ Generating PDF...";
                button.disabled = true;
                try {
                  const originalOverflow = container.style.overflow;
                  const originalMaxHeight = container.style.maxHeight;
                  container.style.overflow = "visible";
                  container.style.maxHeight = "none";
                  container.style.height = "auto";
                  const images = container.querySelectorAll("img");
                  await Promise.all(
                    Array.from(images).map((img) => {
                      if (img.complete) return Promise.resolve();
                      return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                        setTimeout(resolve, 2000);
                      });
                    }),
                  );
                  const fullHeight = Math.max(
                    container.scrollHeight,
                    container.offsetHeight,
                    container.clientHeight,
                  );
                  const fullWidth = Math.max(
                    container.scrollWidth,
                    container.offsetWidth,
                    container.clientWidth,
                  );
                  const canvas = await window.html2canvas(container, {
                    scale: 2.5, // Higher scale for better quality with larger fonts
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff",
                    allowTaint: true,
                    width: fullWidth,
                    height: fullHeight,
                    windowWidth: fullWidth,
                    windowHeight: fullHeight,
                    scrollX: 0,
                    scrollY: 0,
                    removeContainer: false,
                  });
                  container.style.overflow = originalOverflow;
                  container.style.maxHeight = originalMaxHeight;
                  container.style.height = "";
                  const { jsPDF } = window.jspdf;
                  const imgData = canvas.toDataURL("image/png", 0.95);
                  
                  // A4 size: 210mm x 297mm (portrait)
                  const pdf = new jsPDF({
                    unit: "mm",
                    format: "a4", // A4 format
                    orientation: "portrait",
                  });
                  
                  const pdfWidth = 210; // A4 width in mm
                  const pdfHeight = 297; // A4 height in mm
                  const margin = 8; // Slightly increased margin for better appearance
                  const imgWidth = pdfWidth - 2 * margin;
                  let imgHeight = (canvas.height * imgWidth) / canvas.width;
                  
                  // Ensure content fits on single A4 page
                  if (imgHeight > pdfHeight - 2 * margin) {
                    // Scale to fit exactly on one page
                    const scaleFactor = (pdfHeight - 2 * margin) / imgHeight;
                    imgHeight = pdfHeight - 2 * margin;
                    const scaledWidth = imgWidth * scaleFactor;
                    const xOffset = margin + (imgWidth - scaledWidth) / 2;
                    pdf.addImage(
                      imgData,
                      "PNG",
                      xOffset,
                      margin,
                      scaledWidth,
                      imgHeight,
                    );
                  } else {
                    // Fit on single page without scaling - center vertically if content is shorter
                    const yOffset = margin + (pdfHeight - 2 * margin - imgHeight) / 2;
                    pdf.addImage(
                      imgData,
                      "PNG",
                      margin,
                      yOffset,
                      imgWidth,
                      imgHeight,
                    );
                  }
                  
                  pdf.save(`Application_Slip_${applicationNumber}.pdf`);
                } finally {
                  button.innerHTML = originalText;
                  button.disabled = false;
                }
              } catch (err) {
                alert(
                  "Failed to generate PDF: " + (err.message || "Unknown error"),
                );
              }
            }}
            style={{
              background: GREEN,
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            📥 Download PDF
          </button>
          <button
            onClick={() => {
              // Clear sessionStorage to prevent redirect back to payment-success
              sessionStorage.removeItem("pendingApplication");
              navigate("/");
            }}
            style={{
              background: "#1a2a4a",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
