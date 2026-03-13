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
} from "lucide-react";
import { applicationsAPI } from "../../utils/api";
import AddApplicationModal from "../../components/ApplicationForm/Form";

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
            mobile: app.mobile,
            district: app.district,
            higherEducation: app.higherEducation,
            photo: app.photo,
            signature: app.signature,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            createdBy: app.createdBy,
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
          mobile: app.mobile,
          district: app.district,
          higherEducation: app.higherEducation,
          photo: app.photo,
          signature: app.signature,
          status: app.status,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
          createdBy: app.createdBy,
        });
      }
      setIsEditModalOpen(false);
      alert("Application updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update application");
      console.error("Update error:", err);
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
                    Application ID: {application.id}
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
                    ["Application ID", application.id],
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
