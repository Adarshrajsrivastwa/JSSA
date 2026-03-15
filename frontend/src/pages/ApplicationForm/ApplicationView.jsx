import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Building,
  CreditCard,
  Download,
} from "lucide-react";
import { applicationsAPI, paymentsAPI } from "../../utils/api";
import AddApplicationModal from "../../components/ApplicationForm/Form";

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await applicationsAPI.getById(id);
        if (response.success && response.data) {
          const app = response.data.application;
          setApplication({
            id: app._id,
            candidateName: app.candidateName,
            fatherName: app.fatherName,
            motherName: app.motherName,
            dob: app.dob,
            gender: app.gender,
            nationality: app.nationality,
            category: app.category,
            aadhar: app.aadhar,
            pan: app.pan,
            mobile: app.mobile,
            email: app.email,
            address: app.address,
            state: app.state,
            district: app.district,
            block: app.block,
            panchayat: app.panchayat,
            pincode: app.pincode,
            higherEducation: app.higherEducation,
            board: app.board,
            marks: app.marks,
            markPercentage: app.markPercentage,
            applicationNumber: app.applicationNumber,
            photo: app.photo,
            signature: app.signature,
            status: app.status,
            paymentStatus: app.paymentStatus,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            createdBy: app.createdBy,
            jobPostingId: app.jobPostingId,
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load application");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await applicationsAPI.delete(id);
        alert("Application deleted successfully!");
        navigate("/application-form");
      } catch (err) {
        alert(err.message || "Failed to delete application");
        console.error("Delete error:", err);
      }
    }
  };

  const handleUpdate = async (applicationData) => {
    try {
      await applicationsAPI.update(id, applicationData);
      // Refresh the application data
      const response = await applicationsAPI.getById(id);
      if (response.success && response.data) {
        const app = response.data.application;
        setApplication({
          id: app._id,
          candidateName: app.candidateName,
          fatherName: app.fatherName,
          motherName: app.motherName,
          dob: app.dob,
          gender: app.gender,
          nationality: app.nationality,
          category: app.category,
          aadhar: app.aadhar,
          pan: app.pan,
          mobile: app.mobile,
          email: app.email,
          address: app.address,
          state: app.state,
          district: app.district,
          block: app.block,
          panchayat: app.panchayat,
          pincode: app.pincode,
          higherEducation: app.higherEducation,
          board: app.board,
          marks: app.marks,
          markPercentage: app.markPercentage,
          applicationNumber: app.applicationNumber,
          photo: app.photo,
          signature: app.signature,
          status: app.status,
          paymentStatus: app.paymentStatus,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
          createdBy: app.createdBy,
          jobPostingId: app.jobPostingId,
        });
      }
      setIsEditModalOpen(false);
      alert("Application updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update application");
      console.error("Update error:", err);
    }
  };

  // ── Payment Handler ──────────────────────────────────────────────────────────
  const handlePayNow = async () => {
    if (!application || !application.jobPostingId || !application.gender || !application.category) {
      alert("Application data is incomplete. Cannot proceed with payment.");
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        
        // Wait for Razorpay to be available
        let retries = 0;
        while (!window.Razorpay && retries < 10) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          retries++;
        }
        
        if (!window.Razorpay) {
          throw new Error("Razorpay payment gateway is not loaded. Please refresh and try again.");
        }
      }

      // Create Razorpay order
      const orderResponse = await paymentsAPI.createOrder(
        application.jobPostingId,
        application.gender,
        application.category
      );

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.error || "Failed to create payment order");
      }

      const { orderId, amount, amountInRupees, keyId } = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "JSSA Application Fee",
        description: `Application Fee - ₹${amountInRupees}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentsAPI.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              application.id
            );

            if (verifyResponse.success) {
              alert("Payment successful! Your application payment has been completed.");
              
              // Refresh application data
              const refreshResponse = await applicationsAPI.getById(id);
              if (refreshResponse.success && refreshResponse.data) {
                const app = refreshResponse.data.application;
                setApplication({
                  id: app._id,
                  candidateName: app.candidateName,
                  fatherName: app.fatherName,
                  motherName: app.motherName,
                  dob: app.dob,
                  gender: app.gender,
                  nationality: app.nationality,
                  category: app.category,
                  aadhar: app.aadhar,
                  pan: app.pan,
                  mobile: app.mobile,
                  email: app.email,
                  address: app.address,
                  state: app.state,
                  district: app.district,
                  block: app.block,
                  panchayat: app.panchayat,
                  pincode: app.pincode,
                  higherEducation: app.higherEducation,
                  board: app.board,
                  marks: app.marks,
                  markPercentage: app.markPercentage,
                  applicationNumber: app.applicationNumber,
                  photo: app.photo,
                  signature: app.signature,
                  status: app.status,
                  paymentStatus: app.paymentStatus,
                  createdAt: app.createdAt,
                  updatedAt: app.updatedAt,
                  createdBy: app.createdBy,
                  jobPostingId: app.jobPostingId,
                });
              }
            } else {
              alert("Payment verification failed. Please contact support.");
              setError("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
            setError(err.message || "Payment verification failed");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: application.candidateName || "",
          email: application.email || "",
          contact: application.mobile || "",
        },
        theme: {
          color: "#3AB000",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setError("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description || "Please try again."}`);
        setProcessingPayment(false);
        setError("Payment failed");
      });
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Failed to initiate payment");
      setError(err.message || "Failed to initiate payment");
      setProcessingPayment(false);
    }
  };

  // ── PDF Download Function ────────────────────────────────────────────────────
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  };

  const downloadApplicationPDF = async () => {
    if (!application) return;
    
    setDownloadingPDF(true);
    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      );

      const GREEN = "#3AB000";
      const DARK_BLUE = "#1e2840";
      const LIGHT_GRAY = "#f8f9fa";
      const BORDER_COLOR = "#e0e0e0";
      
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed; left: -9999px; top: 0;
        width: 750px; background: #fff;
        font-family: 'Noto Sans Devanagari', 'Noto Sans', Arial, sans-serif;
        font-size: 11px; color: #000;
        padding: 15px;
        line-height: 1.3;
      `;

      const formatDate = (date) => {
        if (!date) return "—";
        const d = new Date(date);
        return d.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      };

      const formatDateTime = (date) => {
        if (!date) {
          const now = new Date();
          return now.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
        const d = new Date(date);
        return d.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      const formatDateTimeShort = (date) => {
        if (!date) {
          const now = new Date();
          return now.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
        const d = new Date(date);
        return d.toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      const formatGender = (gender) => {
        if (!gender) return "—";
        return gender.charAt(0).toUpperCase() + gender.slice(1);
      };

      const formatCategory = (category) => {
        if (!category) return "—";
        return category.toUpperCase();
      };

      // Get job posting details
      const jobPosting = application.jobPostingId || {};
      const postTitle = jobPosting.post?.en || jobPosting.post || "District Manager";
      const advtNo = jobPosting.advtNo || "JSSA/REQ/01/2025/P-III";
      const currentYear = new Date().getFullYear();
      const recruitmentTitle = `${postTitle} Recruitment ${currentYear}`;

      // Current date and time
      const now = new Date();
      const currentDateTime = formatDateTime(now);
      const currentDateTimeShort = formatDateTimeShort(now);

      // Personal details for Application Slip
      const personalDetailsRows = [
        ["Name", application.candidateName || "—"],
        ["Father's Name", application.fatherName || "—"],
        ["Mother's Name", application.motherName || "—"],
        ["Date of Birth", formatDate(application.dob)],
        ["Gender", formatGender(application.gender)],
        ["Nationality", formatGender(application.nationality) || "Indian"],
        ["Category", formatCategory(application.category)],
        ["Aadhar Number", application.aadhar || "—"],
        ["PAN Number", application.pan || "—"],
        ["Mobile Number", application.mobile || "—"],
        ["Email ID", application.email || "—"],
        ["Permanent Address", application.address || "—"],
        ["State", application.state || "—"],
        ["Pincode", application.pincode || "—"],
      ];

      // Educational Details
      const educationDetailsRows = [
        ["Higher Education", application.higherEducation || "—"],
        ["Board/University", application.board || "—"],
        ["Total Marks", application.marks || "—"],
        ["Marks in Percentage", application.markPercentage ? `${application.markPercentage}%` : "—"],
      ];

      // Photo HTML for Application Slip
      const photoHTML = application.photo
        ? `<img src="${application.photo}" style="width:120px;height:150px;object-fit:cover;border:2px solid #ddd;border-radius:4px;" />`
        : "";

      // Signature HTML for bottom
      const signatureHTML = application.signature
        ? `<img src="${application.signature}" style="width:180px;height:50px;object-fit:contain;background:transparent;" />`
        : "";

      // Check if terms accepted
      const termsAccepted = application.termsAccepted || false;
      const declarationAccepted = application.declarationAccepted || false;

      // Logo SVG - exact match to image
      const logoSVG = `
        <svg width="100" height="100" viewBox="0 0 120 120" style="flex-shrink:0">
          <circle cx="60" cy="60" r="58" fill="none" stroke="${GREEN}" stroke-width="4"/>
          <circle cx="60" cy="60" r="50" fill="white"/>
          <defs>
            <path id="topArc" d="M 16,60 a44,44 0 0,1 88,0" />
            <path id="botArc" d="M 16,60 a44,44 0 0,0 88,0" />
          </defs>
          <text font-size="7" fill="white" font-weight="bold" letter-spacing="1.2">
            <textPath href="#topArc" startOffset="5%">जन स्वास्थ्य सहायता अभियान</textPath>
          </text>
          <text font-size="6" fill="white" font-weight="600" letter-spacing="0.8">
            <textPath href="#botArc" startOffset="4%">A Project Of Healthcare R&amp;D Board</textPath>
          </text>
          <circle cx="38" cy="52" r="7" fill="#22c55e"/>
          <ellipse cx="38" cy="72" rx="9" ry="13" fill="#22c55e"/>
          <line x1="29" y1="65" x2="20" y2="58" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
          <line x1="47" y1="65" x2="56" y2="58" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
          <circle cx="60" cy="49" r="7.5" fill="#f97316"/>
          <ellipse cx="60" cy="70" rx="9" ry="14" fill="#f97316"/>
          <line x1="51" y1="62" x2="42" y2="55" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
          <line x1="69" y1="62" x2="78" y2="55" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
          <circle cx="82" cy="52" r="7" fill="#3b82f6"/>
          <ellipse cx="82" cy="72" rx="9" ry="13" fill="#3b82f6"/>
          <line x1="73" y1="65" x2="64" y2="58" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
          <line x1="91" y1="65" x2="100" y2="58" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;

      // Build Personal Information rows for Application Form
      const personalInfoRows = [
        ["Aadhar Number:", application.aadhar || "—"],
        ["PAN Number:", application.pan || "—"],
        ["Mobile Number:", application.mobile || "—"],
        ["Email ID:", application.email || "—"],
        ["Permanent Address:", application.address || "—"],
        ["State:", application.state || "—"],
        ["Pincode:", application.pincode || "—"],
      ];

      // Payment status
      const paymentStatus = application.paymentStatus === "paid" || application.paymentStatus === "complete" ? "Complete" : (application.paymentStatus || "Pending");

      container.innerHTML = `
        <div style="background:#fff;padding:20px;font-family:'Noto Sans Devanagari','Noto Sans',Arial,sans-serif;">
          <!-- Top Header with Date and Title -->
          <div style="display:flex;justify-content:space-between;align-items:start;padding:0;margin-bottom:15px;border-bottom:1px solid ${BORDER_COLOR};padding-bottom:10px;">
            <div style="font-size:12px;color:#666;font-weight:400;">${currentDateTimeShort}</div>
            <div style="font-size:16px;font-weight:700;color:#333;text-align:right;">Application Slip - ${recruitmentTitle}</div>
          </div>

          <!-- Logo and Organization Info -->
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:15px;padding-bottom:12px;border-bottom:1px solid ${BORDER_COLOR};">
            <div style="flex-shrink:0;">${logoSVG}</div>
            <div style="flex:1;">
              <div style="color:${GREEN};font-size:26px;font-weight:900;line-height:1.2;margin-bottom:4px;font-family:'Noto Sans Devanagari',serif;">जन स्वास्थ्य सहायता अभियान</div>
              <div style="color:${GREEN};font-size:13px;font-weight:700;margin-bottom:2px;line-height:1.3;">A Project Of Healthcare Research & Development Board</div>
              <div style="color:${GREEN};font-size:11px;margin-top:2px;line-height:1.2;">(HRDB is Division of social welfare organization "NAC India")</div>
              <div style="color:${GREEN};font-size:13px;font-weight:700;margin-top:4px;">Registration No. : <span style="color:#ff0000;">053083</span></div>
            </div>
          </div>

          <!-- Recruitment Title -->
          <div style="text-align:center;margin-bottom:15px;padding-bottom:8px;border-bottom:1px solid ${BORDER_COLOR};">
            <div style="font-size:16px;font-weight:700;color:#000;">${recruitmentTitle}</div>
          </div>

          <!-- Application Details Bar -->
          <div style="background:#f0fae8;border:2px solid #000;padding:10px 20px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;font-size:13px;color:#1e2840;">Advt. No.: ${advtNo}</span>
            <span style="font-weight:700;font-size:13px;color:#1e2840;">Application Slip</span>
            <span style="font-weight:700;font-size:13px;color:#1e2840;">Date: ${currentDateTime}</span>
          </div>

          <!-- Post and Application Number -->
          <div style="margin-bottom:15px;padding-bottom:10px;">
            <div style="font-size:11px;color:#000;font-weight:700;margin-bottom:5px;">Post Applied for: <span style="font-weight:700;">${postTitle}</span></div>
            <div style="font-size:11px;color:#000;font-weight:700;">Application No.: <span style="font-weight:700;">${application.applicationNumber || "—"}</span></div>
          </div>

          <!-- Personal Details Section with Photo -->
          <div style="display:flex;gap:15px;margin-bottom:20px;align-items:flex-start;">
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:700;color:#000;margin-bottom:10px;">
                Personal Details
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tbody>
                  ${personalDetailsRows.map(([label, value]) => `
                    <tr>
                      <td style="padding:6px 10px;font-weight:700;color:#000;width:35%;vertical-align:top;">${label}:</td>
                      <td style="padding:6px 10px;font-weight:400;color:#000;vertical-align:top;">${value}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            ${photoHTML ? `
              <div style="flex-shrink:0;width:120px;padding-top:0;">
                ${photoHTML}
              </div>
            ` : ""}
          </div>

          <!-- Educational Details Section -->
          <div style="margin-top:15px;margin-bottom:20px;">
            <div style="font-size:15px;font-weight:700;color:#000;margin-bottom:10px;">
              Educational Details
              </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tbody>
                ${educationDetailsRows.map(([label, value]) => `
                  <tr>
                    <td style="padding:6px 10px;font-weight:700;color:#000;width:35%;vertical-align:top;">${label}:</td>
                    <td style="padding:6px 10px;font-weight:400;color:#000;vertical-align:top;">${value}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <!-- Declarations Section -->
          <div style="margin-bottom:15px;">
            <div style="font-size:11px;font-weight:400;color:#000;margin-bottom:5px;display:flex;align-items:center;gap:6px;">
              <div style="width:12px;height:12px;border:1.5px solid #000;background:${termsAccepted ? '#d3d3d3' : '#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${termsAccepted ? '<span style="color:#000;font-size:9px;font-weight:900;">✓</span>' : ''}
              </div>
              <span style="font-weight:400;">I have read and agree to the Terms and Conditions.</span>
            </div>
            <div style="font-size:11px;font-weight:400;color:#000;margin-top:6px;display:flex;align-items:start;gap:6px;">
              <div style="width:12px;height:12px;border:1.5px solid #000;background:${declarationAccepted ? '#d3d3d3' : '#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">
                ${declarationAccepted ? '<span style="color:#000;font-size:9px;font-weight:900;">✓</span>' : ''}
              </div>
              <span style="font-weight:400;line-height:1.4;">I declare that all the information given in this application form is correct to the best of my knowledge and belief. If any information provided is found false, my candidature may be rejected at any point of time. I have read and understood the conditions which I would abide by. Thus, I have given the above declaration in my full consciousness without any pressure.</span>
            </div>
          </div>

          <!-- Signature and Summary Table Side by Side -->
          <div style="display:flex;justify-content:space-between;gap:15px;margin-top:12px;align-items:flex-start;margin-bottom:15px;">
            <!-- Signature Area -->
            <div style="flex:1;">
              ${signatureHTML ? `
                <div style="font-size:11px;font-weight:700;color:#000;margin-bottom:4px;">Candidate's Signature</div>
                <div style="background:#e5e5e5;border:1px solid #ccc;padding:6px;width:200px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:2px;">
                  <img src="${application.signature}" style="width:180px;height:50px;object-fit:contain;background:transparent;" />
            </div>
          ` : ""}
            </div>

            <!-- Application Summary Table -->
            <div style="flex:1;">
              <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #000;">
                <thead>
                  <tr>
                    <th style="padding:8px 10px;font-weight:700;color:#000;text-align:left;border:1px solid #000;background:#fff;">Application No.:</th>
                    <th style="padding:8px 10px;font-weight:700;color:#000;text-align:left;border:1px solid #000;background:#fff;">Email:</th>
                    <th style="padding:8px 10px;font-weight:700;color:#000;text-align:left;border:1px solid #000;background:#fff;">Payment Status:</th>
                    <th style="padding:8px 10px;font-weight:700;color:#000;text-align:left;border:1px solid #000;background:#fff;">Date:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding:8px 10px;font-weight:400;color:#000;border:1px solid #000;background:#fff;">${application.applicationNumber || "—"}</td>
                    <td style="padding:8px 10px;font-weight:400;color:#000;border:1px solid #000;background:#fff;">${application.email || "—"}</td>
                    <td style="padding:8px 10px;font-weight:400;color:#000;border:1px solid #000;background:#fff;">${paymentStatus}</td>
                    <td style="padding:8px 10px;font-weight:400;color:#000;border:1px solid #000;background:#fff;">${currentDateTime}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top:15px;padding-top:10px;border-top:1px solid ${BORDER_COLOR};">
            <div style="font-size:11px;color:#666;text-align:left;margin-bottom:3px;font-weight:400;">
              https://www.jssabhiyan-nac.in/fill_application_print?oid=${application.applicationNumber || ""}
            </div>
            <div style="font-size:11px;color:#666;text-align:right;font-weight:400;">1/1</div>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      await new Promise((r) => setTimeout(r, 300));

      const canvas = await window.html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 750,
        height: container.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pageW = 210; // A4 width in mm
      const pageH = 297; // A4 height in mm
      const margin = 10; // margin on all sides
      const availableW = pageW - (margin * 2);
      const availableH = pageH - (margin * 2);
      
      const imgW = availableW;
      const imgH = (canvas.height * imgW) / canvas.width;

      // Scale to fit on single page if needed
      if (imgH > availableH) {
        const scale = availableH / imgH;
        const scaledW = imgW * scale;
        const scaledH = imgH * scale;
        const xOffset = (pageW - scaledW) / 2;
        pdf.addImage(imgData, "PNG", xOffset, margin, scaledW, scaledH);
      } else {
        pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      }

      const appNumber = application.applicationNumber || application.id || "APP";
      pdf.save(`JSSA_Application_${appNumber.replace(/\//g, "-")}.pdf`);
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF: " + err.message);
    } finally {
      setDownloadingPDF(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout activePath="/application-form">
        <div className="ml-6 animate-pulse space-y-4">
          <div className="h-7 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-200 h-28 w-full" />
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 bg-gray-200 rounded ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Error State ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <DashboardLayout activePath="/application-form">
        <div className="ml-6 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-500 font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate("/application-form")}
            className="bg-[#3AB000] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#2d8a00] transition-colors"
          >
            ← Back to List
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (!application) {
    return (
      <DashboardLayout activePath="/application-form">
        <div className="ml-6 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-500 font-medium mb-4">
            Application not found.
          </p>
          <button
            onClick={() => navigate("/application-form")}
            className="bg-[#3AB000] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#2d8a00] transition-colors"
          >
            ← Back to List
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isActive = application.status === "Active";
  const statusColors = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-gray-50 text-gray-700 border-gray-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Approved: "bg-blue-50 text-blue-700 border-blue-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  // Payment status colors and display
  const getPaymentStatusDisplay = (paymentStatus) => {
    if (paymentStatus === "paid" || paymentStatus === "complete") {
      return "Paid";
    }
    if (paymentStatus === "pending") {
      return "Pending";
    }
    return "Pending"; // Default to Pending if not set
  };

  const getPaymentStatusColors = (paymentStatus) => {
    if (paymentStatus === "paid" || paymentStatus === "complete") {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (paymentStatus === "pending") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
    return "bg-yellow-50 text-yellow-700 border-yellow-200"; // Default to pending colors
  };

  const paymentStatus = application.paymentStatus || "pending";
  const isPaymentPaid = paymentStatus === "paid" || paymentStatus === "complete";

  return (
    <DashboardLayout activePath="/application-form">
      <div className="ml-6 space-y-4 pb-8">
        {/* ── Breadcrumb + Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/application-form")}
              className="flex items-center gap-1.5 text-[#3AB000] font-medium hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Application Form
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 truncate max-w-xs">
              {application.candidateName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Show Pay Now button if payment is not done, otherwise show Download PDF */}
            {(application.paymentStatus === "pending" || 
              !application.paymentStatus || 
              (application.paymentStatus !== "paid" && application.paymentStatus !== "complete")) && 
              application.jobPostingId ? (
              <button
                onClick={handlePayNow}
                disabled={processingPayment}
                className="flex items-center gap-1.5 bg-[#3AB000] text-white hover:bg-[#2d8a00] px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {processingPayment ? "Processing..." : "Pay Now"}
              </button>
            ) : (
              <button
                onClick={downloadApplicationPDF}
                disabled={downloadingPDF}
                className="flex items-center gap-1.5 bg-white border border-[#3AB000] text-[#3AB000] hover:bg-[#3AB000] hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                {downloadingPDF ? "Generating..." : "Download PDF"}
              </button>
            )}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Green Header */}
          <div className="bg-[#3AB000] px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {application.photo ? (
                    <img
                      src={application.photo}
                      alt={application.candidateName}
                      className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-md">
                      {application.candidateName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-1">
                    {application.candidateName}
                  </h1>
                  <p className="text-green-100 text-sm">
                    Application No.: {application.applicationNumber || "—"}
                  </p>
                </div>
              </div>
              <span
                className={`self-start flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  getPaymentStatusColors(paymentStatus)
                }`}
              >
                {isPaymentPaid ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {getPaymentStatusDisplay(paymentStatus)}
              </span>
            </div>
          </div>

          {/* Quick Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
            <QuickInfo
              icon={<User className="w-4 h-4" />}
              label="Father's Name"
              value={application.fatherName}
            />
            <QuickInfo
              icon={<Phone className="w-4 h-4" />}
              label="Mobile"
              value={application.mobile}
            />
            <QuickInfo
              icon={<MapPin className="w-4 h-4" />}
              label="District"
              value={application.district}
            />
            <QuickInfo
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education"
              value={application.higherEducation}
            />
          </div>
        </div>

        {/* ── Body Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information */}
            <DetailCard
              icon={<User className="w-4 h-4 text-[#3AB000]" />}
              title="Personal Information"
            >
              <table className="w-full text-sm mt-2">
                <tbody>
                  {[
                    ["Candidate Name", application.candidateName],
                    ["Father's Name", application.fatherName],
                    ["Mobile Number", application.mobile],
                    ["District", application.district],
                    ["Higher Education", application.higherEducation],
                  ].map(([key, val]) => (
                    <tr
                      key={key}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-gray-500 font-medium w-2/5">
                        {key}
                      </td>
                      <td className="py-2.5 font-semibold text-gray-800">
                        {val || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DetailCard>

            {/* Application Details */}
            <DetailCard
              icon={<FileText className="w-4 h-4 text-[#3AB000]" />}
              title="Application Details"
            >
              <table className="w-full text-sm mt-2">
                <tbody>
                  {[
                    ["Application Number", application.applicationNumber || "—"],
                    ["Status", application.status],
                    [
                      "Payment Status",
                      application.paymentStatus === "paid" || application.paymentStatus === "complete"
                        ? "Paid"
                        : application.paymentStatus === "pending"
                        ? "Pending"
                        : application.paymentStatus || "Pending",
                    ],
                    [
                      "Created At",
                      application.createdAt
                        ? new Date(application.createdAt).toLocaleString()
                        : "—",
                    ],
                    [
                      "Last Updated",
                      application.updatedAt
                        ? new Date(application.updatedAt).toLocaleString()
                        : "—",
                    ],
                  ].map(([key, val]) => (
                    <tr
                      key={key}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-gray-500 font-medium w-2/5">
                        {key}
                      </td>
                      <td
                        className={`py-2.5 font-semibold ${
                          key === "Status"
                            ? isActive
                              ? "text-[#3AB000]"
                              : "text-gray-500"
                            : key === "Payment Status"
                            ? val === "Paid"
                              ? "text-green-600"
                              : val === "Pending"
                              ? "text-orange-600"
                              : "text-gray-800"
                            : "text-gray-800"
                        }`}
                      >
                        {val || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DetailCard>

            {/* Photo & Signature */}
            {(application.photo || application.signature) && (
              <DetailCard
                icon={<FileText className="w-4 h-4 text-[#3AB000]" />}
                title="Documents"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {application.photo && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-2">
                        Photo
                      </p>
                      <img
                        src={application.photo}
                        alt="Candidate Photo"
                        className="w-full h-48 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {application.signature && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-2">
                        Signature
                      </p>
                      <img
                        src={application.signature}
                        alt="Candidate Signature"
                        className="w-full h-48 object-contain rounded border border-gray-200 bg-gray-50"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </DetailCard>
            )}
          </div>

          {/* Right column – Additional Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-bold text-[#3AB000] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Timeline
              </p>
              <div className="space-y-2.5">
                <Row
                  label="Created At"
                  value={
                    application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : "—"
                  }
                />
                <Row
                  label="Last Updated"
                  value={
                    application.updatedAt
                      ? new Date(application.updatedAt).toLocaleDateString()
                      : "—"
                  }
                />
              </div>
            </div>

            {application.createdBy && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <p className="text-xs font-bold text-[#3AB000] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Created By
                </p>
                <div className="space-y-2.5">
                  {application.createdBy.email && (
                    <Row label="Email" value={application.createdBy.email} />
                  )}
                  {application.createdBy.phone && (
                    <Row label="Phone" value={application.createdBy.phone} />
                  )}
                  {application.createdBy.role && (
                    <Row
                      label="Role"
                      value={application.createdBy.role}
                      valueClass="capitalize"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Back Button ── */}
        <div>
          <button
            onClick={() => navigate("/application-form")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#3AB000] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </button>
        </div>
      </div>

      {/* ── Edit Application Modal ── */}
      <AddApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleUpdate}
        isEdit={true}
        applicationId={id}
      />
    </DashboardLayout>
  );
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const QuickInfo = ({ icon, label, value, valueClass = "text-gray-800 font-semibold" }) => (
  <div className="flex items-start gap-3 px-5 py-4">
    <div className="w-8 h-8 rounded-lg bg-[#e8f5e2] flex items-center justify-center flex-shrink-0 text-[#3AB000] mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-sm mt-0.5 truncate ${valueClass}`}>{value || "—"}</p>
    </div>
  </div>
);

const DetailCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-1">
      {icon}
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
        {title}
      </p>
    </div>
    {children}
  </div>
);

const Row = ({
  label,
  value,
  valueClass = "text-gray-800 font-medium text-sm",
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={valueClass}>{value || "—"}</span>
  </div>
);

export default ApplicationView;
