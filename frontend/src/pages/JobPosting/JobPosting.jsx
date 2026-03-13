import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobPostingForm from "../../components/JonPostings/Jobposting";
import { jobPostingsAPI } from "../../utils/api";
import { useAuth } from "../../auth/AuthProvider";

export const INITIAL_POSTINGS = [
  {
    id: "POST001",
    advtNo: "JSSA/REQ/01/2025/P-III",
    postTitle:
      "Recruitment for the Post of District Manager Advt. No. JSSA/REQ/01/2025/P-III",
    post: "District Manager",
    date: "19/12/2025",
    income: "₹25,500 – ₹35,500",
    incomeMin: "25500",
    incomeMax: "35500",
    education: "Graduation Pass",
    location: "Bihar, Jharkhand, UP",
    locationArr: ["Bihar", "Jharkhand", "Uttar Pradesh"],
    fee: "₹260",
    lastDate: "2026-01-31",
    applicationOpeningDate: "20/12/2025",
    firstMeritListDate: "08/02/2026",
    finalMeritListDate: "15/02/2026",
    ageLimit: "19 – 40 Years",
    ageAsOn: "30/08/2025",
    selectionProcess: "Based on Graduation Mark & Interview",
    status: "Active",
  },
  {
    id: "POST002",
    advtNo: "JSSA/REQ/02/2025/P-II",
    postTitle:
      "Recruitment for the Post of Block Coordinator Advt. No. JSSA/REQ/02/2025/P-II",
    post: "Block Coordinator",
    date: "05/01/2026",
    income: "₹18,000 – ₹24,000",
    incomeMin: "18000",
    incomeMax: "24000",
    education: "12th Pass",
    location: "Bihar, Odisha",
    locationArr: ["Bihar", "Odisha"],
    fee: "₹200",
    lastDate: "2026-02-28",
    applicationOpeningDate: "10/01/2026",
    firstMeritListDate: "10/03/2026",
    finalMeritListDate: "18/03/2026",
    ageLimit: "18 – 35 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Written Test & Interview",
    status: "Active",
  },
  {
    id: "POST003",
    advtNo: "JSSA/REQ/03/2025/P-I",
    postTitle:
      "Recruitment for the Post of Field Officer Advt. No. JSSA/REQ/03/2025/P-I",
    post: "Field Officer",
    date: "10/01/2026",
    income: "₹15,000 – ₹20,000",
    incomeMin: "15000",
    incomeMax: "20000",
    education: "Graduation Pass",
    location: "Jharkhand, Gujarat",
    locationArr: ["Jharkhand", "Gujarat"],
    fee: "₹180",
    lastDate: "2026-03-15",
    applicationOpeningDate: "15/01/2026",
    firstMeritListDate: "25/03/2026",
    finalMeritListDate: "01/04/2026",
    ageLimit: "21 – 38 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Merit Based",
    status: "Inactive",
  },
  {
    id: "POST004",
    advtNo: "JSSA/REQ/04/2025/P-IV",
    postTitle:
      "Recruitment for the Post of Data Entry Operator Advt. No. JSSA/REQ/04/2025/P-IV",
    post: "Data Entry Operator",
    date: "12/01/2026",
    income: "₹12,000 – ₹18,000",
    incomeMin: "12000",
    incomeMax: "18000",
    education: "12th Pass",
    location: "UP, MP",
    locationArr: ["Uttar Pradesh", "Madhya Pradesh"],
    fee: "₹150",
    lastDate: "2026-03-20",
    applicationOpeningDate: "20/01/2026",
    firstMeritListDate: "01/04/2026",
    finalMeritListDate: "08/04/2026",
    ageLimit: "18 – 30 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Based on Graduation Mark & Interview",
    status: "Active",
  },
  {
    id: "POST005",
    advtNo: "JSSA/REQ/05/2025/P-V",
    postTitle:
      "Recruitment for the Post of Cluster Manager Advt. No. JSSA/REQ/05/2025/P-V",
    post: "Cluster Manager",
    date: "15/01/2026",
    income: "₹30,000 – ₹45,000",
    incomeMin: "30000",
    incomeMax: "45000",
    education: "MBA",
    location: "Maharashtra, Rajasthan",
    locationArr: ["Maharashtra", "Rajasthan"],
    fee: "₹300",
    lastDate: "2026-04-10",
    applicationOpeningDate: "20/01/2026",
    firstMeritListDate: "20/04/2026",
    finalMeritListDate: "28/04/2026",
    ageLimit: "25 – 42 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Direct Interview",
    status: "Active",
  },
  {
    id: "POST006",
    advtNo: "JSSA/REQ/06/2025/P-VI",
    postTitle:
      "Recruitment for the Post of Accountant Advt. No. JSSA/REQ/06/2025/P-VI",
    post: "Accountant",
    date: "20/01/2026",
    income: "₹22,000 – ₹32,000",
    incomeMin: "22000",
    incomeMax: "32000",
    education: "B.Com",
    location: "West Bengal, Assam",
    locationArr: ["West Bengal", "Assam"],
    fee: "₹250",
    lastDate: "2026-04-30",
    applicationOpeningDate: "25/01/2026",
    firstMeritListDate: "10/05/2026",
    finalMeritListDate: "18/05/2026",
    ageLimit: "21 – 40 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Written Test & Interview",
    status: "Inactive",
  },
  {
    id: "POST007",
    advtNo: "JSSA/REQ/07/2025/P-VII",
    postTitle:
      "Recruitment for the Post of IT Support Officer Advt. No. JSSA/REQ/07/2025/P-VII",
    post: "IT Support Officer",
    date: "22/01/2026",
    income: "₹20,000 – ₹28,000",
    incomeMin: "20000",
    incomeMax: "28000",
    education: "B.Tech",
    location: "Haryana, Gujarat",
    locationArr: ["Haryana", "Gujarat"],
    fee: "₹220",
    lastDate: "2026-05-05",
    applicationOpeningDate: "01/02/2026",
    firstMeritListDate: "15/05/2026",
    finalMeritListDate: "22/05/2026",
    ageLimit: "21 – 35 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Based on Graduation Mark & Interview",
    status: "Active",
  },
  {
    id: "POST008",
    advtNo: "JSSA/REQ/08/2025/P-VIII",
    postTitle:
      "Recruitment for the Post of Community Mobilizer Advt. No. JSSA/REQ/08/2025/P-VIII",
    post: "Community Mobilizer",
    date: "25/01/2026",
    income: "₹10,000 – ₹15,000",
    incomeMin: "10000",
    incomeMax: "15000",
    education: "10th Pass",
    location: "Bihar, Odisha, MP",
    locationArr: ["Bihar", "Odisha", "Madhya Pradesh"],
    fee: "₹100",
    lastDate: "2026-05-15",
    applicationOpeningDate: "05/02/2026",
    firstMeritListDate: "25/05/2026",
    finalMeritListDate: "02/06/2026",
    ageLimit: "18 – 35 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Merit Based",
    status: "Active",
  },
  {
    id: "POST009",
    advtNo: "JSSA/REQ/09/2025/P-IX",
    postTitle:
      "Recruitment for the Post of Program Officer Advt. No. JSSA/REQ/09/2025/P-IX",
    post: "Program Officer",
    date: "28/01/2026",
    income: "₹35,000 – ₹50,000",
    incomeMin: "35000",
    incomeMax: "50000",
    education: "Post Graduation",
    location: "Delhi, Haryana, UP",
    locationArr: ["Haryana", "Uttar Pradesh"],
    fee: "₹350",
    lastDate: "2026-06-01",
    applicationOpeningDate: "10/02/2026",
    firstMeritListDate: "10/06/2026",
    finalMeritListDate: "18/06/2026",
    ageLimit: "25 – 45 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Direct Interview",
    status: "Active",
  },
  {
    id: "POST010",
    advtNo: "JSSA/REQ/10/2025/P-X",
    postTitle:
      "Recruitment for the Post of MIS Executive Advt. No. JSSA/REQ/10/2025/P-X",
    post: "MIS Executive",
    date: "01/02/2026",
    income: "₹18,000 – ₹25,000",
    incomeMin: "18000",
    incomeMax: "25000",
    education: "B.Tech",
    location: "All States",
    locationArr: [],
    fee: "₹200",
    lastDate: "2026-06-15",
    applicationOpeningDate: "15/02/2026",
    firstMeritListDate: "25/06/2026",
    finalMeritListDate: "02/07/2026",
    ageLimit: "21 – 35 Years",
    ageAsOn: "01/01/2026",
    selectionProcess: "Written Test & Interview",
    status: "Inactive",
  },
];

const JobPostingList = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPosting, setEditingPosting] = useState(null);
  const [postings, setPostings] = useState([]);
  const itemsPerPage = 7;

  const fetchPostings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobPostingsAPI.getAll();
      if (response.success && response.data) {
        // Helper to normalize bilingual fields
        const normalizeBilingual = (field) => {
          if (!field) return { en: "", hi: "" };
          if (typeof field === 'object' && field !== null) {
            return {
              en: field.en || "",
              hi: field.hi || "",
            };
          }
          // If it's a string (old format), convert to bilingual
          return {
            en: field || "",
            hi: field || "",
          };
        };
        
        // Transform API data to match frontend format (handle bilingual)
        const transformed = response.data.postings.map((post) => ({
          id: post._id,
          advtNo: post.advtNo,
          title: normalizeBilingual(post.title),
          postTitle: normalizeBilingual(post.postTitle),
          post: normalizeBilingual(post.post),
          date: post.date,
          income: normalizeBilingual(post.income),
          incomeMin: post.incomeMin,
          incomeMax: post.incomeMax,
          education: normalizeBilingual(post.education),
          location: normalizeBilingual(post.location),
          locationArr: post.locationArr || [],
          fee: normalizeBilingual(post.fee),
          lastDate: post.lastDate,
          applicationOpeningDate: post.applicationOpeningDate,
          firstMeritListDate: post.firstMeritListDate,
          finalMeritListDate: post.finalMeritListDate,
          ageLimit: normalizeBilingual(post.ageLimit),
          ageAsOn: post.ageAsOn,
          selectionProcess: normalizeBilingual(post.selectionProcess),
          status: post.status,
        }));
        setPostings(transformed);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch job postings");
      console.error("Fetch postings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
    const interval = setInterval(fetchPostings, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchPostings();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this posting?")) {
      try {
        await jobPostingsAPI.delete(id);
        setPostings((prev) => prev.filter((p) => p.id !== id));
        alert("Job posting deleted successfully!");
      } catch (err) {
        alert(err.message || "Failed to delete job posting");
        console.error("Delete error:", err);
      }
    }
  };

  const filteredPostings = postings
    .filter((p) => {
      if (activeTab === "active") return p.status === "Active";
      if (activeTab === "inactive") return p.status === "Inactive";
      return true;
    })
    .filter((p) =>
      [p.post, p.advtNo, p.location, p.education]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPostings = filteredPostings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPostings.length / itemsPerPage);

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-gray-100">
          {Array.from({ length: 9 }).map((__, j) => (
            <td key={j} className="px-4 py-4 text-center">
              <div className="bg-gray-200 rounded mx-auto h-4 w-4/5" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="9" className="text-center py-12 text-gray-400 text-sm">
          {error ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-500">Error: {error}</p>
              <button
                onClick={fetchPostings}
                className="bg-[#3AB000] text-white px-4 py-1.5 rounded text-xs hover:bg-[#2d8a00]"
              >
                Retry
              </button>
            </div>
          ) : (
            "No job postings found."
          )}
        </td>
      </tr>
    </tbody>
  );

  const statusColor = (status) =>
    status === "Active"
      ? "text-[#3AB000] font-semibold"
      : "text-gray-500 font-semibold";

  return (
    <DashboardLayout activePath="/job-postings">
      <div className="p-0 ml-6">
        {/* ── Top Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="flex items-center gap-0 border border-gray-300 rounded overflow-hidden flex-shrink-0">
              {["all", "active", "inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2 text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-[#3AB000] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 max-w-[500px]">
              <input
                type="text"
                placeholder="Search by Post, Advt No, Location..."
                className="flex-1 px-4 text-sm text-gray-700 focus:outline-none h-full bg-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="bg-[#3AB000] hover:bg-[#2d8a00] text-white text-sm px-6 h-full font-medium transition-colors">
                Search
              </button>
            </div>
          </div>

          {role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black hover:bg-[#3AB000] text-white text-sm font-medium px-6 py-2.5 rounded-sm transition-colors whitespace-nowrap"
            >
              + Add Job Posting
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#3AB000]">
                {[
                  "S.N",
                  "Advt No.",
                  "Post Name",
                  "Income",
                  "Education",
                  "Location",
                  "Last Date",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-center font-bold text-black text-sm whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton />
            ) : filteredPostings.length === 0 ? (
              <EmptyState />
            ) : (
              <tbody>
                {currentPostings.map((posting, idx) => (
                  <tr
                    key={posting.id}
                    className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                  >
                    <td className="px-4 py-4 text-center text-gray-700">
                      {indexOfFirst + idx + 1}
                    </td>
                    <td className="px-4 py-4 text-center text-[#2d8a00] font-semibold whitespace-nowrap">
                      {posting.advtNo}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 font-medium whitespace-nowrap">
                      {typeof posting.post === 'object' ? posting.post.en : posting.post}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                      {typeof posting.income === 'object' ? posting.income.en : posting.income}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700">
                      {typeof posting.education === 'object' ? posting.education.en : posting.education}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 max-w-[160px] truncate">
                      {typeof posting.location === 'object' ? posting.location.en : posting.location}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                      {posting.lastDate}
                    </td>
                    <td
                      className={`px-4 py-4 text-center ${statusColor(posting.status)}`}
                    >
                      {posting.status}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {role === "admin" && (
                          <>
                            <button
                              onClick={() => {
                                setEditingPosting(posting);
                                setIsEditModalOpen(true);
                              }}
                              className="text-[#3AB000] hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(posting.id)}
                              className="text-[#3AB000] hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {/* ✅ View → navigate to dedicated view page */}
                        <button
                          onClick={() =>
                            navigate(`/job-postings/view/${posting.id}`)
                          }
                          className="text-[#3AB000] hover:text-[#2d8a00] transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && filteredPostings.length > 0 && (
          <div className="flex justify-end items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#3AB000] disabled:opacity-50 text-white px-10 py-2.5 text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm"
            >
              Back
            </button>

            <div className="flex items-center gap-2 text-sm font-medium">
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

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-[#3AB000] disabled:opacity-50 text-white px-10 py-2.5 text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Add Modal ── */}
      <JobPostingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async (newPosting) => {
          try {
            const response = await jobPostingsAPI.create(newPosting);
            if (response.success) {
              const transformed = {
                id: response.data.posting._id,
                ...response.data.posting,
              };
              setPostings((prev) => [transformed, ...prev]);
              setIsModalOpen(false);
            }
          } catch (err) {
            alert(err.message || "Failed to create job posting");
            console.error("Create error:", err);
          }
        }}
      />

      {/* ── Edit Modal ── */}
      <JobPostingForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPosting(null);
        }}
        onSuccess={async (updated) => {
          try {
            const response = await jobPostingsAPI.update(
              editingPosting?.id,
              updated
            );
            if (response.success) {
              setPostings((prev) =>
                prev.map((p) =>
                  p.id === editingPosting?.id
                    ? { ...p, ...response.data.posting, id: p.id }
                    : p
                )
              );
              setIsEditModalOpen(false);
              setEditingPosting(null);
            }
          } catch (err) {
            alert(err.message || "Failed to update job posting");
            console.error("Update error:", err);
          }
        }}
        isEdit={true}
        postingData={editingPosting}
      />
    </DashboardLayout>
  );
};

export default JobPostingList;
