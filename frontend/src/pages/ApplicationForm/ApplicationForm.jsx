import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddApplicationModal from "../../components/ApplicationForm/Form";
import { applicationsAPI, jobPostingsAPI } from "../../utils/api";

const ApplicationForm = () => {
  const [viewMode, setViewMode] = useState("postings"); // applications | postings - default to postings

  const [appStatusTab, setAppStatusTab] = useState("all");
  const [postingStatusTab, setPostingStatusTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedJobPostingId, setSelectedJobPostingId] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  const [applications, setApplications] = useState([]);
  const [postings, setPostings] = useState([]);

  // Fetch applications from API - get all applications
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all applications by setting a high limit (1000 should be enough)
      const response = await applicationsAPI.getAll({ limit: 1000 });
      if (response.success && response.data) {
        // Transform API data to match frontend format
        const transformed = response.data.applications.map((app) => ({
          id: app._id,
          photo: app.photo,
          candidateName: app.candidateName,
          fatherName: app.fatherName,
          mobile: app.mobile,
          district: app.district,
          higherEducation: app.higherEducation,
          status: app.status,
          paymentStatus: app.paymentStatus || null,
          jobPostingId: app.jobPostingId || null,
        }));
        setApplications(transformed);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch applications");
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to normalize bilingual fields
  const normalizeBilingual = (field) => {
    if (!field) return "";
    if (typeof field === "object" && field !== null) {
      // Return English version for display, fallback to Hindi if English not available
      return field.en || field.hi || "";
    }
    // If it's a string (old format), return as is
    return field || "";
  };

  // Fetch job postings from API - get all postings
  const fetchPostings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobPostingsAPI.getAll({ limit: 1000 });
      if (response.success && response.data) {
        // Transform API data to match frontend format (handle bilingual)
        const transformed = response.data.postings.map((post) => ({
          id: post._id,
          advtNo: post.advtNo || "",
          post: normalizeBilingual(post.post),
          postObj: post.post, // Keep original for search
          location: normalizeBilingual(post.location),
          locationObj: post.location, // Keep original for search
          locationArr: post.locationArr || [],
          lastDate: post.lastDate || "",
          date: post.date || "",
          education: normalizeBilingual(post.education),
          income: normalizeBilingual(post.income),
          fee: normalizeBilingual(post.fee),
          status: post.status || "Pending",
        }));
        setPostings(transformed);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch job postings");
      console.error("Fetch job postings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Preload both lists once (so switching tabs feels instant)
    fetchApplications();
    fetchPostings();

    const interval = setInterval(() => {
      if (viewMode === "applications") fetchApplications();
      else fetchPostings();
    }, 30000);
    return () => clearInterval(interval);
  }, [viewMode]);

  // Auto-open modal if coming from dashboard or job posting
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setViewMode('applications'); // Switch to applications view
      setIsModalOpen(true);
      // Capture job posting ID if present
      const jobId = urlParams.get('jobId');
      if (jobId) {
        setSelectedJobPostingId(jobId);
      }
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (viewMode === "applications") fetchApplications();
      else fetchPostings();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [viewMode]);

  const statusColors = {
    Active: "text-[#3AB000] font-semibold",
    Inactive: "text-gray-500 font-semibold",
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await applicationsAPI.delete(id);
        setApplications((prev) => prev.filter((a) => a.id !== id));
        alert("Application deleted successfully!");
      } catch (err) {
        alert(err.message || "Failed to delete application");
        console.error("Delete error:", err);
      }
    }
  };

  // Filter + Search
  const filteredApplications = applications
    .filter((app) => {
      if (appStatusTab === "active") return app.status === "Active";
      if (appStatusTab === "inactive") return app.status === "Inactive";
      return true;
    })
    .filter((app) =>
      [app.candidateName, app.id, app.mobile, app.district]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  const filteredPostings = postings
    .filter((p) => {
      if (postingStatusTab === "active") return p.status === "Active";
      if (postingStatusTab === "inactive") return p.status === "Inactive";
      return true;
    })
    .filter((p) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        p.advtNo?.toLowerCase().includes(searchLower) ||
        p.post?.toLowerCase().includes(searchLower) ||
        p.location?.toLowerCase().includes(searchLower) ||
        (p.locationArr && p.locationArr.some(loc => 
          typeof loc === "string" ? loc.toLowerCase().includes(searchLower) : false
        )) ||
        p.lastDate?.toLowerCase().includes(searchLower) ||
        p.id?.toLowerCase().includes(searchLower)
      );
    });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRows =
    viewMode === "applications"
      ? filteredApplications.slice(indexOfFirst, indexOfLast)
      : filteredPostings.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(
    (viewMode === "applications"
      ? filteredApplications.length
      : filteredPostings.length) / itemsPerPage,
  );

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-4 text-center">
              <div
                className={`bg-gray-200 rounded mx-auto ${j === 1 ? "h-9 w-9 rounded-full" : "h-4 w-4/5"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Empty State
  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="9" className="text-center py-12 text-gray-400 text-sm">
          {error ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-500">Error: {error}</p>
              <button
                onClick={viewMode === "applications" ? fetchApplications : fetchPostings}
                className="bg-[#3AB000] text-white px-4 py-1.5 rounded text-xs hover:bg-[#2d8a00]"
              >
                Retry
              </button>
            </div>
          ) : (
            viewMode === "applications"
              ? "No applications found."
              : "No job postings found."
          )}
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <div className="p-0 ml-0 md:ml-6 px-2 md:px-0">
        {/* ── Top Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          {/* Left: Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
            {/* Status Tabs */}
            <div className="flex items-center gap-0 border border-gray-300 rounded overflow-hidden flex-shrink-0 w-full sm:w-auto">
              {["all", "active", "inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (viewMode === "applications") setAppStatusTab(tab);
                    else setPostingStatusTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors whitespace-nowrap ${
                    (viewMode === "applications"
                      ? appStatusTab
                      : postingStatusTab) === tab
                      ? "bg-[#3AB000] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[500px]">
              <input
                type="text"
                placeholder={
                  viewMode === "applications"
                    ? "Search by Name, Mobile, District..."
                    : "Search by Advt No, Post, Location..."
                }
                className="flex-1 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 focus:outline-none h-full bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="bg-[#3AB000] hover:bg-[#2d8a00] text-white text-xs sm:text-sm px-4 sm:px-6 h-full font-medium transition-colors whitespace-nowrap">
                Search
              </button>
            </div>
          </div>

          {/* Right: Add Button */}
          {viewMode === "applications" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black hover:bg-[#3AB000] text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2.5 rounded-sm transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              + Add Application
            </button>
          )}
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200">
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="bg-[#3AB000]">
                  {viewMode === "applications" ? (
                    <>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        S.N
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Photo
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Candidate Name
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Father's Name
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Mobile
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        District
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Education
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Action
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        S.N
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Advt No
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Post
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Last Date
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                        Action
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : (viewMode === "applications"
                  ? filteredApplications.length === 0
                  : filteredPostings.length === 0) ? (
                <EmptyState />
              ) : (
                <tbody>
                  {viewMode === "applications"
                    ? currentRows.map((app, idx) => (
                        <tr
                          key={app.id}
                          onClick={() => navigate(`/applications/view/${app.id}`)}
                          className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-4 text-center text-gray-700">
                            {indexOfFirst + idx + 1}
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
                          <td className="px-4 py-4 text-center text-gray-700">
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
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={statusColors[app.status] || "text-gray-700 font-semibold"}>
                                {app.status}
                              </span>
                              {app.paymentStatus === "pending" && app.jobPostingId && (
                                <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-semibold">
                                  Payment Pending
                                </span>
                              )}
                              {app.paymentStatus === "paid" && app.jobPostingId && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-semibold">
                                  Payment Done
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            className="px-4 py-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  setEditingId(app.id);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-[#3AB000] hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(app.id)}
                                className="text-[#3AB000] hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/applications/view/${app.id}`)
                                }
                                className="text-[#3AB000] hover:text-[#3AB000] transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : currentRows.map((p, idx) => (
                        <tr
                          key={p.id}
                          className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                        >
                          <td className="px-4 py-4 text-center text-gray-700">
                            {indexOfFirst + idx + 1}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-700 font-medium">
                            {p.advtNo || "—"}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-700">
                            {p.post || "—"}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-700">
                            {p.locationArr && p.locationArr.length > 0
                              ? p.locationArr.slice(0, 2).join(", ") + (p.locationArr.length > 2 ? "..." : "")
                              : p.location || "—"}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-700">
                            {p.lastDate
                              ? new Date(p.lastDate).toLocaleDateString("en-GB")
                              : "—"}
                          </td>
                          <td
                            className={`px-4 py-4 text-center ${statusColors[p.status] || "text-gray-700 font-semibold"}`}
                          >
                            {p.status || "Pending"}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => navigate(`/job-postings/${p.id}/applicants`)}
                              className="text-[#3AB000] hover:text-[#2d8a00] transition-colors"
                              title="View Applicants"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              )}
            </table>
          </div>
        </div>

        {/* ── Mobile Card View ── */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (viewMode === "applications"
              ? filteredApplications.length === 0
              : filteredPostings.length === 0) ? (
            <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400 text-sm">
              {error ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-red-500">Error: {error}</p>
                  <button
                    onClick={viewMode === "applications" ? fetchApplications : fetchPostings}
                    className="bg-[#3AB000] text-white px-4 py-1.5 rounded text-xs hover:bg-[#2d8a00]"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                viewMode === "applications"
                  ? "No applications found."
                  : "No job postings found."
              )}
            </div>
          ) : viewMode === "applications" ? (
            // Applications Mobile Cards
            currentRows.map((app, idx) => (
              <div
                key={app.id}
                onClick={() => navigate(`/applications/view/${app.id}`)}
                className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {app.photo ? (
                      <img
                        src={app.photo}
                        alt={app.candidateName}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-[#e8f5e2] flex items-center justify-center text-[#3AB000] font-bold text-base">
                        {app.candidateName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">S.N: {indexOfFirst + idx + 1}</div>
                    <div className="text-base font-semibold text-gray-800 mb-1">
                      {app.candidateName}
                    </div>
                    <div className="text-sm text-gray-600">{app.fatherName}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[app.status] || "text-gray-700"}`}>
                    {app.status}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 mb-3">
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">Mobile:</span>
                    <span className="flex-1">{app.mobile}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">District:</span>
                    <span className="flex-1">{app.district}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">Education:</span>
                    <span className="flex-1">{app.higherEducation}</span>
                  </div>
                  {(app.paymentStatus === "pending" || app.paymentStatus === "paid") && app.jobPostingId && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        app.paymentStatus === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {app.paymentStatus === "pending" ? "Payment Pending" : "Payment Done"}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setEditingId(app.id);
                      setIsEditModalOpen(true);
                    }}
                    className="text-[#3AB000] hover:text-blue-600 transition-colors p-2"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-[#3AB000] hover:text-red-600 transition-colors p-2"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/applications/view/${app.id}`)}
                    className="text-[#3AB000] hover:text-[#2d8a00] transition-colors p-2"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Postings Mobile Cards
            currentRows.map((p, idx) => (
              <div
                key={p.id}
                className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">S.N: {indexOfFirst + idx + 1}</div>
                    <div className="text-sm font-semibold text-[#2d8a00] mb-1">
                      {p.advtNo || "—"}
                    </div>
                    <div className="text-base font-medium text-gray-800">
                      {p.post || "—"}
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[p.status] || "text-gray-700"}`}>
                    {p.status || "Pending"}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 mb-3">
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">Location:</span>
                    <span className="flex-1">
                      {p.locationArr && p.locationArr.length > 0
                        ? p.locationArr.join(", ")
                        : p.location || "—"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-20 flex-shrink-0">Last Date:</span>
                    <span className="flex-1">
                      {p.lastDate
                        ? new Date(p.lastDate).toLocaleDateString("en-GB")
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/job-postings/${p.id}/applicants`)}
                    className="text-[#3AB000] hover:text-[#2d8a00] transition-colors p-2"
                    title="View Applicants"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading &&
          (viewMode === "applications"
            ? filteredApplications.length > 0
            : filteredPostings.length > 0) && (
          <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3 sm:gap-4 mt-6">
            <div className="text-xs sm:text-sm text-gray-600 sm:hidden">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-[#3AB000] disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
              >
                Back
              </button>

              <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                {(() => {
                  const pages = [];
                  const visiblePages = new Set([
                    1,
                    2,
                    totalPages - 1,
                    totalPages,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                  ]);
                  for (let i = 1; i <= totalPages; i++) {
                    if (visiblePages.has(i)) pages.push(i);
                    else if (pages[pages.length - 1] !== "...") pages.push("...");
                  }
                  return pages.map((page, idx) =>
                    page === "..." ? (
                      <span key={idx} className="px-1 text-gray-500 select-none">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${
                          currentPage === page
                            ? "text-[#3AB000] font-bold"
                            : "text-gray-600 hover:text-[#3AB000]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  );
                })()}
              </div>

              <div className="sm:hidden text-sm font-medium text-gray-700 px-2">
                {currentPage}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-[#3AB000] disabled:opacity-50 text-white px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Application Modal ── */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJobPostingId(null);
        }}
        onSuccess={async (applicationData) => {
          try {
            // Application is already created in Form component
            // If payment was successful, applicationData will have paymentStatus
            fetchApplications();
            setIsModalOpen(false);
            setSelectedJobPostingId(null);
            if (applicationData.paymentStatus === "paid") {
              alert("Application submitted and payment successful!");
            } else {
              alert("Application submitted successfully!");
            }
          } catch (err) {
            alert(err.message || "Failed to process application");
            console.error("Create error:", err);
          }
        }}
        jobPostingId={selectedJobPostingId}
      />

      {/* ── Edit Application Modal ── */}
      <AddApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingId(null);
        }}
        onSuccess={async (applicationData) => {
          try {
            await applicationsAPI.update(editingId, applicationData);
            fetchApplications();
            setIsEditModalOpen(false);
            setEditingId(null);
          } catch (err) {
            alert(err.message || "Failed to update application");
            console.error("Update error:", err);
          }
        }}
        isEdit={true}
        applicationId={editingId}
      />
    </DashboardLayout>
  );
};

export default ApplicationForm;
