import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  GraduationCap,
  Eye,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";
import { applicationsAPI, jobPostingsAPI } from "../../utils/api";

const JobPostingApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobPosting, setJobPosting] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch job posting details
        const postingResponse = await jobPostingsAPI.getById(id);
        if (postingResponse.success && postingResponse.data) {
          setJobPosting(postingResponse.data.posting);
        }

        // Fetch all applications for this job posting
        const applicationsResponse = await applicationsAPI.getAll({ 
          limit: 1000,
          jobPostingId: id 
        });
        if (applicationsResponse.success && applicationsResponse.data) {
          const transformed = applicationsResponse.data.applications.map((app) => ({
            id: app._id,
            photo: app.photo,
            candidateName: app.candidateName,
            fatherName: app.fatherName,
            mobile: app.mobile,
            district: app.district,
            higherEducation: app.higherEducation,
            status: app.status,
            createdAt: app.createdAt,
          }));
          setApplicants(transformed);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter applicants by search query
  const filteredApplicants = applicants.filter((app) =>
    [app.candidateName, app.mobile, app.district, app.fatherName]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-gray-50 text-gray-700 border-gray-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Approved: "bg-blue-50 text-blue-700 border-blue-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
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
  if (!jobPosting) {
    return (
      <DashboardLayout activePath="/application-form">
        <div className="ml-6 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-500 font-medium mb-4">
            Job posting not found.
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

  const getValue = (field) => {
    if (!field) return "—";
    if (typeof field === "object" && field !== null) {
      return field.en || field.hi || "";
    }
    return field || "—";
  };

  return (
    <DashboardLayout activePath="/application-form">
      <div className="ml-6 space-y-4 pb-8">
        {/* ── Breadcrumb ── */}
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
            {getValue(jobPosting.post)} - Applicants
          </span>
        </div>

        {/* ── Job Posting Info Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-[#3AB000] px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Users className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-1">
                  {getValue(jobPosting.post)}
                </h1>
                <p className="text-green-100 text-sm">
                  Advertisement No: {jobPosting.advtNo || "—"}
                </p>
                <p className="text-green-100 text-xs mt-1">
                  Total Applicants: {filteredApplicants.length}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
            <QuickInfo
              icon={<MapPin className="w-4 h-4" />}
              label="Location"
              value={getValue(jobPosting.location)}
            />
            <QuickInfo
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education"
              value={getValue(jobPosting.education)}
            />
            <QuickInfo
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Status"
              value={jobPosting.status || "—"}
            />
            <QuickInfo
              icon={<Users className="w-4 h-4" />}
              label="Applicants"
              value={filteredApplicants.length}
            />
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, mobile, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3AB000] focus:border-transparent"
            />
            <div className="text-sm text-gray-500">
              {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* ── Applicants Table ── */}
        <div className="bg-white rounded overflow-hidden border border-gray-200">
          {filteredApplicants.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {searchQuery ? "No applicants found matching your search." : "No applicants have applied for this job posting yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#3AB000]">
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    S.N
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Candidate Name
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Father's Name
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    District
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Education
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Applied On
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((app, idx) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                  >
                    <td className="px-4 py-4 text-center text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {app.photo ? (
                        <img
                          src={app.photo}
                          alt={app.candidateName}
                          className="h-9 w-9 rounded-full object-cover mx-auto"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-[#e8f5e2] flex items-center justify-center mx-auto text-[#3AB000] font-bold text-sm">
                          {app.candidateName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 font-medium">
                      {app.candidateName}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {app.fatherName}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {app.mobile}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {app.district}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {app.higherEducation}
                    </td>
                    <td
                      className={`px-4 py-4 text-center ${statusColors[app.status] || statusColors.Inactive}`}
                    >
                      {app.status || "Pending"}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 text-xs">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => navigate(`/applications/view/${app.id}`)}
                        className="text-[#3AB000] hover:text-[#2d8a00] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Back Button ── */}
        <div>
          <button
            onClick={() => navigate("/application-form")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#3AB000] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Application Form
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ── Helper Components ─────────────────────────────────────────────────────────────

const QuickInfo = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 px-5 py-4">
    <div className="w-8 h-8 rounded-lg bg-[#e8f5e2] flex items-center justify-center flex-shrink-0 text-[#3AB000] mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm mt-0.5 text-gray-800 font-semibold truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

export default JobPostingApplicants;
