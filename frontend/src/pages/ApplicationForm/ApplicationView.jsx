import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
import { applicationsAPI, jobPostingsAPI } from "../../utils/api";
import logo1 from "../../assets/jss.png";
import img0 from "../../assets/img0.png";

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [jobPosting, setJobPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

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
            paymentStatus: app.paymentStatus || "pending",
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            createdBy: app.createdBy,
            jobPostingId: app.jobPostingId,
          });
          
          // Fetch job posting details if available
          if (app.jobPostingId) {
            try {
              const jobResponse = await jobPostingsAPI.getById(app.jobPostingId);
              if (jobResponse.success && jobResponse.data) {
                setJobPosting(jobResponse.data.posting);
              }
            } catch (jobErr) {
              console.error("Error fetching job posting:", jobErr);
            }
          }
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
      
      const originalOverflow = container.style.overflow;
      const originalMaxHeight = container.style.maxHeight;
      container.style.overflow = "visible";
      container.style.maxHeight = "none";
      container.style.height = "auto";
      const images = container.querySelectorAll("img");
      // Wait for all images to load completely
      await Promise.all(
        Array.from(images).map((img) => {
          // If image is already loaded and has dimensions, resolve immediately
          if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
            return Promise.resolve();
          }
          // Otherwise wait for load
          return new Promise((resolve) => {
            const timeout = setTimeout(() => {
              console.log("Image load timeout:", img.src.substring(0, 50));
              resolve();
            }, 5000);
            img.onload = () => {
              clearTimeout(timeout);
              // Double check dimensions after load
              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                resolve();
              } else {
                setTimeout(resolve, 100);
              }
            };
            img.onerror = () => {
              clearTimeout(timeout);
              console.error("Image failed to load:", img.src.substring(0, 50));
              resolve();
            };
            // Force reload if src is set but not loaded
            if (img.src && !img.complete) {
              const currentSrc = img.src;
              img.src = "";
              img.src = currentSrc;
            }
          });
        }),
      );
      // Additional wait to ensure images are rendered
      await new Promise((resolve) => setTimeout(resolve, 500));
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
      // For base64 images, use allowTaint: false and useCORS: false
      const canvas = await window.html2canvas(container, {
        scale: 2.5,
        useCORS: false, // Base64 images don't need CORS
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: false, // Set to false for base64 images
        width: fullWidth,
        height: fullHeight,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        removeContainer: false,
        imageTimeout: 15000, // Increase timeout for base64 images
      });
      container.style.overflow = originalOverflow;
      container.style.maxHeight = originalMaxHeight;
      container.style.height = "";
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL("image/png", 0.95);
      
      // A4 size: 210mm x 297mm
      const pdf = new jsPDF({
        unit: "mm",
        format: [210, 297],
        orientation: "portrait",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 5;
      const imgWidth = pdfWidth - 2 * margin;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Ensure content fits on single A4 page
      if (imgHeight > pdfHeight - 2 * margin) {
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
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          imgWidth,
          imgHeight,
        );
      }

      const appNumber = application.applicationNumber || application.id || "APP";
      pdf.save(`Application_Slip_${appNumber}.pdf`);
    } catch (err) {
      alert(
        "Failed to generate PDF: " + (err.message || "Unknown error"),
      );
    } finally {
      setDownloadingPDF(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────

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
            <button
              onClick={downloadApplicationPDF}
              disabled={downloadingPDF}
              className="flex items-center gap-1.5 bg-white border border-[#3AB000] text-[#3AB000] hover:bg-[#3AB000] hover:text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              {downloadingPDF ? "Generating..." : "Download PDF"}
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
                    Application Number: {application.applicationNumber || "N/A"}
                  </p>
                </div>
              </div>
              <span
                className={`self-start flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  statusColors[application.status] || statusColors.Inactive
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {application.status}
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

        {/* ── Hidden Application Slip for PDF (New Format) ── */}
        <div
          id="application-slip-pdf"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            background: "#fff",
            fontFamily: "'Times New Roman', Times, serif",
            color: "#111",
            maxWidth: "900px",
            width: "900px",
            margin: "0 auto",
            padding: "14px 60px 22px 60px",
            boxSizing: "border-box",
            fontSize: "13px",
          }}
        >
          {/* Print Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11.5px",
              color: "#444",
              paddingBottom: "6px",
              marginBottom: "14px",
            }}
          >
            <span>
              {new Date().toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            <span>
              Application Slip -{" "}
              {jobPosting?.postTitle?.en || jobPosting?.post?.en || "Recruitment"} 2024
            </span>
          </div>

          {/* Big Logo - Full Width */}
          <div
            style={{
              width: "100%",
              marginBottom: "12px",
            }}
          >
            <img
              src={img0}
              alt="Jan Swasthya Sahayata Abhiyan"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* Post Title Banner */}
          <div
            style={{
              border: "1px solid #555",
              textAlign: "center",
              padding: "5px 0",
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "6px",
            }}
          >
            {jobPosting?.postTitle?.en || jobPosting?.post?.en || "Recruitment"}
          </div>

          {/* Advt / Application Slip / Date Strip */}
          <div
            style={{
              border: "1px solid #555",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 12px",
              marginBottom: "10px",
              fontSize: "13px",
            }}
          >
            <span>
              <strong>Advt. No.:</strong> {jobPosting?.advtNo || ""}
            </span>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Application Slip
            </span>
            <span>
              <strong>Date:</strong>{" "}
              {new Date().toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          {/* Post Applied + Application Number */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            <span>
              <strong>Post Applied for:</strong>{" "}
              {jobPosting?.postTitle?.en || jobPosting?.post?.en || ""}
            </span>
            <span>
              <strong>Application No.:</strong> {application.applicationNumber || "N/A"}
            </span>
          </div>

          {/* Personal Details Heading */}
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            &nbsp;Personal Details
          </div>

          {/* Personal Details Table + Photo Box */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "4px",
              alignItems: "flex-start",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                flex: 1,
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Name:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {(application.candidateName || "").toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Father's Name:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {(application.fatherName || "").toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Mother's Name:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {(application.motherName || "").toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Date of Birth:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.dob
                      ? new Date(application.dob).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Gender:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.gender?.charAt(0).toUpperCase() +
                      application.gender?.slice(1) || ""}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Nationality:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.nationality?.charAt(0).toUpperCase() +
                      application.nationality?.slice(1) || ""}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Category:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {(application.category || "").toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Aadhar Number:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.aadhar || ""}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    PAN Number:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {(application.pan || "").toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Mobile Number:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.mobile || ""}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Email ID:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.email || ""}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    Permanent Address:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {(application.address || "").toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingRight: "16px",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                      width: "190px",
                      fontSize: "13px",
                    }}
                  >
                    State:
                  </td>
                  <td
                    style={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      verticalAlign: "top",
                      fontSize: "13px",
                      lineHeight: "1.45",
                    }}
                  >
                    {application.state || ""}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Photo Box */}
            <div
              style={{
                flexShrink: 0,
                width: "132px",
                height: "158px",
                border: "1px solid #888",
                background: "#ffffff",
              }}
            >
              {application.photo ? (
                <img
                  src={application.photo}
                  alt="Applicant Photo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : null}
            </div>
          </div>

          {/* Pincode Row */}
          <table
            style={{
              borderCollapse: "collapse",
              marginBottom: "14px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    paddingRight: "16px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    width: "190px",
                    fontSize: "13px",
                  }}
                >
                  Pincode:
                </td>
                <td
                  style={{
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    fontSize: "13px",
                    lineHeight: "1.45",
                  }}
                >
                  {application.pincode || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Educational Details Heading */}
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            &nbsp;Educational Details
          </div>

          <table
            style={{
              borderCollapse: "collapse",
              marginBottom: "18px",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    paddingRight: "16px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    width: "190px",
                    fontSize: "13px",
                  }}
                >
                  Higher Education:
                </td>
                <td
                  style={{
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    fontSize: "13px",
                    lineHeight: "1.45",
                  }}
                >
                  {application.higherEducation || ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    paddingRight: "16px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    width: "190px",
                    fontSize: "13px",
                  }}
                >
                  Board/University:
                </td>
                <td
                  style={{
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    fontSize: "13px",
                    lineHeight: "1.45",
                  }}
                >
                  {application.board || ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    paddingRight: "16px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    width: "190px",
                    fontSize: "13px",
                  }}
                >
                  Total Marks:
                </td>
                <td
                  style={{
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    fontSize: "13px",
                    lineHeight: "1.45",
                  }}
                >
                  {application.marks || ""}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    paddingRight: "16px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                    width: "190px",
                    fontSize: "13px",
                  }}
                >
                  Marks in Percentage:
                </td>
                <td
                  style={{
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    verticalAlign: "top",
                    fontSize: "13px",
                    lineHeight: "1.45",
                  }}
                >
                  {application.markPercentage || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Declaration Checkboxes */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              marginBottom: "10px",
              fontSize: "13px",
            }}
          >
            <input
              type="checkbox"
              defaultChecked
              style={{
                marginTop: "2px",
                flexShrink: 0,
                width: "14px",
                height: "14px",
              }}
            />
            <span>I have read and agree to the Terms and Conditions.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              marginBottom: "24px",
              lineHeight: "1.65",
              fontSize: "13px",
            }}
          >
            <input
              type="checkbox"
              defaultChecked
              style={{
                marginTop: "2px",
                flexShrink: 0,
                width: "14px",
                height: "14px",
              }}
            />
            <span>
              I declare that all the information given in this application form is
              correct to the best of my knowledge and belief. If any information
              provided is found false, my candidature may be rejected at any point
              of time. I have read and understood the conditions which I would abide
              by. Thus, I have given the above declaration in my full consciousness
              without any pressure.
            </span>
          </div>

          {/* Signature Box */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  border: "1px solid #aaa",
                  width: "145px",
                  height: "62px",
                  background: "#ffffff",
                  marginBottom: "4px",
                }}
              >
                {application.signature ? (
                  <img
                    src={application.signature}
                    alt="Signature"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : null}
              </div>
              <div
                style={{
                  fontSize: "13px",
                }}
              >
                Candidate's Signature
              </div>
            </div>
          </div>

          {/* Bottom Summary Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            <thead>
              <tr>
                {["Application No.:", "Email:", "Payment Status:", "Date:"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        border: "1px solid #555",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        background: "#fff",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #555",
                    padding: "6px 10px",
                  }}
                >
                  {application.applicationNumber || "N/A"}
                </td>
                <td
                  style={{
                    border: "1px solid #555",
                    padding: "6px 10px",
                  }}
                >
                  {application.email || ""}
                </td>
                <td
                  style={{
                    border: "1px solid #555",
                    padding: "6px 10px",
                  }}
                >
                  {application.paymentStatus === "paid" ? "Complete" : "Pending"}
                </td>
                <td
                  style={{
                    border: "1px solid #555",
                    padding: "6px 10px",
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

          {/* Footer URL */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#555",
              borderTop: "1px solid #ddd",
              paddingTop: "6px",
            }}
          >
            <span>
              https://jssabhiyan.com/fill_application_print?oid={application.id || ""}
            </span>
            <span>1/1</span>
          </div>
        </div>
      </div>

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
      <div className={`text-sm mt-0.5 ${typeof value === 'string' ? 'truncate' : ''} ${valueClass}`}>
        {value || "—"}
      </div>
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
