import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jobPostingsAPI } from "../utils/api.js";
import logo1 from "../assets/jss.png";

const GREEN = "#0aca00";

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
            setApplicationData(data.applicationData);
            setFormData(data.formData || {});
            
            // Load photo and signature if available
            if (data.formData?.photo) {
              setPhotoPreview(data.formData.photo);
            }
            if (data.formData?.signature) {
              setSignaturePreview(data.formData.signature);
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
            if (data.formData?.photo) setPhotoPreview(data.formData.photo);
            if (data.formData?.signature) setSignaturePreview(data.formData.signature);
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
              onClick={() => navigate("/")}
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
            onClick={() => navigate("/")}
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
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        id="application-slip-pdf"
        style={{
          background: "#fff",
          borderRadius: 0,
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: 0,
          position: "relative",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 20px",
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 12, color: "#666" }}>
            {new Date().toLocaleString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#000",
              textAlign: "center",
            }}
          >
            Application Slip - {job?.postTitle?.en || job?.post?.en || ""}{" "}
            Recruitment 2024
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "20px",
            background: GREEN,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "3px solid #fff",
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
                padding: "8px",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              जन स्वास्थ्य सहायता अभियान
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#fff",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              A Project Of Healthcare Research & Development Board
            </div>
            <div style={{ fontSize: 11, color: "#fff", marginBottom: 6 }}>
              (HRDB is Division of social welfare organization "NAC India")
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              Registration No. : 053083
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            color: "#000",
            padding: "12px 20px",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 16,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {job?.postTitle?.en || job?.post?.en || ""} Recruitment
        </div>
        <div
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
          >
            Advt. No.: {job?.advtNo || ""}
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
              flex: 1,
            }}
          >
            Application Slip
          </div>
          <div style={{ fontSize: 12, whiteSpace: "nowrap" }}>
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
            padding: "16px 20px",
            background: "#f9f9f9",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Post Applied for: {job?.postTitle?.en || job?.post?.en || ""}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            Application No.: {applicationNumber}
          </div>
        </div>
        <div style={{ padding: "20px", background: "#fff" }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#000",
              marginBottom: 16,
              paddingBottom: 8,
              borderBottom: "2px solid #e0e0e0",
            }}
          >
            Personal Details
          </h3>
          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px 24px",
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              <div>
                <strong style={{ color: "#333" }}>Name:</strong>{" "}
                <span>{finalFormData.candidateName?.toUpperCase() || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Application No.:</strong>{" "}
                <span>{applicationNumber}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Father's Name:</strong>{" "}
                <span>{finalFormData.fatherName?.toUpperCase() || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Mother's Name:</strong>{" "}
                <span>{finalFormData.motherName?.toUpperCase() || ""}</span>
              </div>
              <div>
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
              <div>
                <strong style={{ color: "#333" }}>Gender:</strong>{" "}
                <span>
                  {finalFormData.gender?.charAt(0).toUpperCase() +
                    finalFormData.gender?.slice(1) || ""}
                </span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Nationality:</strong>{" "}
                <span>
                  {finalFormData.nationality?.charAt(0).toUpperCase() +
                    finalFormData.nationality?.slice(1) || ""}
                </span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Category:</strong>{" "}
                <span>{finalFormData.category?.toUpperCase() || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Aadhar Number:</strong>{" "}
                <span>{finalFormData.aadhar || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>PAN Number:</strong>{" "}
                <span>{finalFormData.pan?.toUpperCase() || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Mobile Number:</strong>{" "}
                <span>{finalFormData.mobile || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Email ID:</strong>{" "}
                <span>{finalFormData.email || ""}</span>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <strong style={{ color: "#333" }}>Permanent Address:</strong>{" "}
                <span>{finalFormData.address?.toUpperCase() || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>State:</strong>{" "}
                <span>{finalFormData.state || ""}</span>
              </div>
              <div>
                <strong style={{ color: "#333" }}>District:</strong>{" "}
                <span>{finalFormData.district || ""}</span>
              </div>
              {finalFormData.block && (
                <div>
                  <strong style={{ color: "#333" }}>Block:</strong>{" "}
                  <span>{finalFormData.block}</span>
                </div>
              )}
              {finalFormData.panchayat && (
                <div>
                  <strong style={{ color: "#333" }}>Panchayat:</strong>{" "}
                  <span>{finalFormData.panchayat}</span>
                </div>
              )}
              <div>
                <strong style={{ color: "#333" }}>Pin Code:</strong>{" "}
                <span>{finalFormData.pincode || ""}</span>
              </div>
            </div>
            {photoPreview && (
              <div
                style={{ width: 140, flexShrink: 0, textAlign: "center" }}
              >
                <img
                  src={photoPreview}
                  alt="Applicant Photo"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    border: "2px solid #000",
                    borderRadius: 4,
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#000",
              marginBottom: 16,
              paddingBottom: 8,
              borderBottom: "2px solid #e0e0e0",
            }}
          >
            Educational Details
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 24px",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >
            <div>
              <strong style={{ color: "#333" }}>Higher Education:</strong>{" "}
              <span>{finalFormData.higherEducation || ""}</span>
            </div>
            <div>
              <strong style={{ color: "#333" }}>Board/University:</strong>{" "}
              <span>{finalFormData.board || ""}</span>
            </div>
            <div>
              <strong style={{ color: "#333" }}>Total Marks:</strong>{" "}
              <span>{finalFormData.marks || ""}</span>
            </div>
            <div>
              <strong style={{ color: "#333" }}>Marks in Percentage:</strong>{" "}
              <span>{finalFormData.markPercentage || ""}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              marginBottom: 16,
              fontSize: 13,
              lineHeight: 1.8,
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
          {signaturePreview && (
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <div
                style={{
                  display: "inline-block",
                  border: "1px solid #e0e0e0",
                  background: "#f0f8ff",
                  padding: "12px 20px",
                  borderRadius: 4,
                }}
              >
                <img
                  src={signaturePreview}
                  alt="Signature"
                  style={{
                    width: 200,
                    height: 80,
                    objectFit: "contain",
                    display: "block",
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  Candidate's Signature
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 20, padding: "0 20px 20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              border: "1px solid #e0e0e0",
            }}
          >
            <thead>
              <tr style={{ background: "#1a2a4a", color: "#fff" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                  }}
                >
                  Application No.
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
                  }}
                >
                  Payment Status
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: 700,
                    border: "1px solid #1a2a4a",
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
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    color: "#000",
                  }}
                >
                  {applicationNumber}
                </td>
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    color: "#000",
                  }}
                >
                  {finalFormData.email || ""}
                </td>
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    color: GREEN,
                    fontWeight: 700,
                  }}
                >
                  Complete
                </td>
                <td
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    color: "#000",
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
        </div>
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
            color: "#666",
            background: "#f9f9f9",
          }}
        >
          <div style={{ wordBreak: "break-all" }}>
            https://www.jssabhiyan-nac.in/fill_application_print?oid=
            {applicationData?._id || applicationData?.id || ""}
          </div>
          <div>1/1</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "20px",
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
                    scale: 2,
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
                  const imgData = canvas.toDataURL("image/png", 1.0);
                  const pdf = new jsPDF({
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                  });
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const margin = 10;
                  const imgWidth = pdfWidth - 2 * margin;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  if (imgHeight <= pdfHeight - 2 * margin) {
                    pdf.addImage(
                      imgData,
                      "PNG",
                      margin,
                      margin,
                      imgWidth,
                      imgHeight,
                    );
                  } else {
                    const ratio = canvas.width / imgWidth;
                    const sliceHeight = (pdfHeight - 2 * margin) * ratio;
                    let yOffset = 0;
                    let page = 0;
                    while (yOffset < canvas.height) {
                      if (page > 0) pdf.addPage();
                      const sliceCanvas = document.createElement("canvas");
                      sliceCanvas.width = canvas.width;
                      sliceCanvas.height = Math.min(
                        sliceHeight,
                        canvas.height - yOffset,
                      );
                      sliceCanvas
                        .getContext("2d")
                        .drawImage(canvas, 0, -yOffset);
                      pdf.addImage(
                        sliceCanvas.toDataURL("image/png", 1.0),
                        "PNG",
                        margin,
                        margin,
                        imgWidth,
                        (sliceCanvas.height * imgWidth) / canvas.width,
                      );
                      yOffset += sliceHeight;
                      page++;
                    }
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
