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
import { applicationsAPI, jobPostingsAPI } from "../../utils/api";
import AddApplicationModal from "../../components/ApplicationForm/Form";
import logo1 from "../../assets/jss.png";

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [jobPosting, setJobPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            paymentStatus: app.paymentStatus || "pending",
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
        scale: 2.5,
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

        {/* ── Hidden Application Slip for PDF (PaymentSuccess format) ── */}
        <div
          id="application-slip-pdf"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            background: "#fff",
            borderRadius: 0,
            maxWidth: "900px",
            width: "900px",
            margin: "0 auto",
            padding: 0,
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: "15px 20px",
              background: "#0aca00",
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
            {jobPosting?.postTitle?.en || jobPosting?.post?.en || "Recruitment"} Recruitment
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
              Advt. No.: {jobPosting?.advtNo || ""}
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
              Post Applied for: {jobPosting?.postTitle?.en || jobPosting?.post?.en || ""}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>
              Application No.: {application.applicationNumber || "N/A"}
            </div>
          </div>
          <div style={{ padding: "15px 20px", background: "#fff", position: "relative" }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#000",
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Personal Details
            </h3>
            {application.photo ? (
              <div
                style={{
                  position: "absolute",
                  top: "70px",
                  right: "20px",
                  width: 110,
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                <img
                  src={application.photo}
                  alt="Applicant Photo"
                  style={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    border: "2px solid #000",
                    borderRadius: 4,
                    display: "block",
                    background: "#fff",
                  }}
                />
              </div>
            ) : null}
            <div
              style={{
                fontSize: 15,
                lineHeight: 2.2,
                marginRight: application.photo ? "130px" : "0",
              }}
            >
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Name:</strong>{" "}
                <strong style={{ color: "#000", fontWeight: 700 }}>
                  {(application.candidateName || "").toUpperCase()}
                </strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Application No.:</strong>{" "}
                <span>{application.applicationNumber || "N/A"}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Father's Name:</strong>{" "}
                <span>{(application.fatherName || "").toUpperCase()}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Mother's Name:</strong>{" "}
                <span>{(application.motherName || "").toUpperCase()}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Date of Birth:</strong>{" "}
                <span>
                  {application.dob
                    ? new Date(application.dob).toLocaleDateString("en-GB", {
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
                  {application.gender?.charAt(0).toUpperCase() +
                    application.gender?.slice(1) || ""}
                </span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Nationality:</strong>{" "}
                <span>
                  {application.nationality?.charAt(0).toUpperCase() +
                    application.nationality?.slice(1) || ""}
                </span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Category:</strong>{" "}
                <span>{(application.category || "").toUpperCase()}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Aadhar Number:</strong>{" "}
                <span>{application.aadhar || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>PAN Number:</strong>{" "}
                <span>{(application.pan || "").toUpperCase()}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Mobile Number:</strong>{" "}
                <span>{application.mobile || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Email ID:</strong>{" "}
                <span>{application.email || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Permanent Address:</strong>{" "}
                <span>{(application.address || "").toUpperCase()}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>State:</strong>{" "}
                <span>{application.state || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>District:</strong>{" "}
                <span>{application.district || ""}</span>
              </div>
              {application.block && (
                <div style={{ marginBottom: 4 }}>
                  <strong style={{ color: "#333" }}>Block:</strong>{" "}
                  <span>{application.block}</span>
                </div>
              )}
              {application.panchayat && (
                <div style={{ marginBottom: 4 }}>
                  <strong style={{ color: "#333" }}>Panchayat:</strong>{" "}
                  <span>{application.panchayat}</span>
                </div>
              )}
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Pin Code:</strong>{" "}
                <span>{application.pincode || ""}</span>
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
            <h3
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#000",
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              Educational Details
            </h3>
            <div
              style={{
                fontSize: 15,
                lineHeight: 2.2,
                marginRight: application.signature ? "220px" : "0",
              }}
            >
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Higher Education:</strong>{" "}
                <span>{application.higherEducation || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Board/University:</strong>{" "}
                <span>{application.board || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Total Marks:</strong>{" "}
                <span>{application.marks || ""}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong style={{ color: "#333" }}>Marks in Percentage:</strong>{" "}
                <span>{application.markPercentage || ""}</span>
              </div>
            </div>
            {application.signature ? (
              <div
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "20px",
                  textAlign: "right",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    border: "1px solid #e0e0e0",
                    background: "#f0f8ff",
                    padding: "10px 16px",
                    borderRadius: 4,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={application.signature}
                    alt="Signature"
                    style={{
                      width: 180,
                      height: 70,
                      objectFit: "contain",
                      display: "block",
                      marginBottom: 6,
                      background: "#fff",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#000",
                      textAlign: "center",
                    }}
                  >
                    Candidate's Signature
                  </div>
                </div>
              </div>
            ) : null}
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
          </div>
          <div style={{ marginTop: 12, padding: "0 20px 15px" }}>
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
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: 700,
                      border: "1px solid #1a2a4a",
                      fontSize: 13,
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
                    }}
                  >
                    {application.applicationNumber || "N/A"}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      color: "#000",
                      fontSize: 13,
                    }}
                  >
                    {application.email || ""}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      color: "#0aca00",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {application.paymentStatus === "paid" ? "Complete" : "Pending"}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      color: "#000",
                      fontSize: 13,
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
              {application.id || ""}
            </div>
            <div>1/1</div>
          </div>
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
