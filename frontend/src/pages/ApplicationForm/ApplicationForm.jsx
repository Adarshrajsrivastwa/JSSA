import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, ArrowLeft, Briefcase, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { applicationsAPI, jobPostingsAPI } from "../../utils/api";
import { useAuth } from "../../auth/AuthProvider";

const ApplicationForm = () => {
  const { role } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 7;

  const [applications, setApplications] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJobPostingId, setSelectedJobPostingId] = useState(null);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [jobPostingsLoading, setJobPostingsLoading] = useState(true);

  // Fetch job postings (only for admin)
  const fetchJobPostings = async () => {
    if (role !== "admin") return;
    setJobPostingsLoading(true);
    try {
      const response = await jobPostingsAPI.getAll({ limit: 1000 });
      if (response.success && response.data) {
        const postings = response.data.postings.map((post) => ({
          id: post._id,
          advtNo: post.advtNo || "N/A",
          post: typeof post.post === 'object' ? post.post.en : post.post,
          postHi: typeof post.post === 'object' ? post.post.hi : post.post,
          location: typeof post.location === 'object' ? post.location.en : post.location,
          status: post.status,
        }));
        
        // Fetch application counts for each job
        const postingsWithCounts = await Promise.all(
          postings.map(async (job) => {
            try {
              const appsResponse = await applicationsAPI.getAll({ 
                jobPostingId: job.id,
                limit: 1 
              });
              return {
                ...job,
                applicationCount: appsResponse.success && appsResponse.data 
                  ? appsResponse.data.pagination?.total || 0 
                  : 0
              };
            } catch {
              return { ...job, applicationCount: 0 };
            }
          })
        );
        setJobPostings(postingsWithCounts);
      }
    } catch (err) {
      console.error("Fetch job postings error:", err);
    } finally {
      setJobPostingsLoading(false);
    }
  };

  // Fetch applications from API - backend automatically filters by role
  // Applicants will only see their own applications, admins see all
  const fetchApplications = async (jobPostingId = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 1000 };
      if (jobPostingId) {
        params.jobPostingId = jobPostingId;
      }
      
      const response = await applicationsAPI.getAll(params);
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
          applicationNumber: app.applicationNumber,
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

  useEffect(() => {
    if (role === "admin") {
      fetchJobPostings();
    } else {
      fetchApplications();
    }
  }, [role]);

  useEffect(() => {
    if (selectedJobPostingId) {
      fetchApplications(selectedJobPostingId);
      // Fetch job posting details
      jobPostingsAPI.getById(selectedJobPostingId).then((response) => {
        if (response.success && response.data) {
          setSelectedJobPosting(response.data.posting);
        }
      });
    } else if (role !== "admin") {
      fetchApplications();
    }
  }, [selectedJobPostingId, role]);

  const statusColors = {
    Active: "text-[#3AB000] font-semibold",
    Inactive: "text-gray-500 font-semibold",
  };

  // Filter + Search
  const filteredApplications = applications.filter((app) =>
    [app.candidateName, app.applicationNumber, app.mobile, app.district]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRows = filteredApplications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
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
        <td colSpan="8" className="text-center py-12 text-gray-400 text-sm">
          {error ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-500">Error: {error}</p>
              <button
                onClick={fetchApplications}
                className="bg-[#3AB000] text-white px-4 py-1.5 rounded text-xs hover:bg-[#2d8a00]"
              >
                Retry
              </button>
            </div>
          ) : (
            "No applications found."
          )}
        </td>
      </tr>
    </tbody>
  );

  // Handle job posting selection
  const handleJobPostingClick = (jobId) => {
    setSelectedJobPostingId(jobId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  // Handle back to job list
  const handleBackToJobs = () => {
    setSelectedJobPostingId(null);
    setSelectedJobPosting(null);
    setApplications([]);
    setCurrentPage(1);
    setSearchQuery("");
  };

  // Show job postings list (only for admin)
  if (role === "admin" && !selectedJobPostingId) {
    return (
      <DashboardLayout>
        <div className="p-0 ml-0 md:ml-6 px-2 md:px-0">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Job Openings</h2>
            <p className="text-gray-600">Select a job to view applications</p>
          </div>

          {jobPostingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : jobPostings.length === 0 ? (
            <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400">
              No job postings found.
            </div>
          ) : (
            <div className="space-y-3">
              {jobPostings.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobPostingClick(job.id)}
                  className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-[#3AB000]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-[#3AB000]" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{job.post}</h3>
                          <p className="text-sm text-gray-600">Advt. No: {job.advtNo}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">{job.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-[#3AB000]">
                          <Users className="w-5 h-5" />
                          <span className="text-lg font-bold">{job.applicationCount || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500">Applications</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-0 ml-0 md:ml-6 px-2 md:px-0">
        {/* ── Top Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          {role === "admin" && selectedJobPostingId && (
            <button
              onClick={handleBackToJobs}
              className="flex items-center gap-2 text-[#3AB000] hover:text-[#2d8a00] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Job List
            </button>
          )}
          {selectedJobPosting && (
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {typeof selectedJobPosting.post === 'object' 
                  ? selectedJobPosting.post.en 
                  : selectedJobPosting.post}
              </h3>
              <p className="text-sm text-gray-600">Advt. No: {selectedJobPosting.advtNo}</p>
            </div>
          )}
          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[500px]">
            <input
              type="text"
              placeholder="Search by Name, Application Number, Mobile, District..."
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

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200">
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="bg-[#3AB000]">
                  <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                    S.N
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap">
                    Application No.
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
                    Action
                  </th>
                </tr>
              </thead>

              {loading ? (
                <TableSkeleton />
              ) : filteredApplications.length === 0 ? (
                <EmptyState />
              ) : (
                <tbody>
                  {currentRows.map((app, idx) => (
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
                      <td className="px-4 py-4 text-center text-gray-700 font-medium">
                        {app.applicationNumber || "N/A"}
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
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/applications/view/${app.id}`);
                          }}
                          className="text-[#3AB000] hover:text-[#2d8a00] transition-colors"
                          title="View Details"
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
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400 text-sm">
              {error ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-red-500">Error: {error}</p>
                  <button
                    onClick={fetchApplications}
                    className="bg-[#3AB000] text-white px-4 py-1.5 rounded text-xs hover:bg-[#2d8a00]"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                "No applications found."
              )}
            </div>
          ) : (
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
                    <div className="text-sm text-gray-600 mb-1">{app.fatherName}</div>
                    <div className="text-xs text-gray-500">App No: {app.applicationNumber || "N/A"}</div>
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
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/applications/view/${app.id}`);
                    }}
                    className="text-[#3AB000] hover:text-[#2d8a00] transition-colors p-2"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && filteredApplications.length > 0 && (
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
    </DashboardLayout>
  );
};

export default ApplicationForm;
