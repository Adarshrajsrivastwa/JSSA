import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  GraduationCap,
  IndianRupee,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Briefcase,
  Users,
  Send,
} from "lucide-react";
import { jobPostingsAPI, applicationsAPI, paymentsAPI } from "../../utils/api";
import { useAuth } from "../../auth/AuthProvider";

const JobPostingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [posting, setPosting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null); // { applicationId, paymentStatus, gender, category }
  const [language, setLanguage] = useState("en"); // 'en' or 'hi'

  useEffect(() => {
    const fetchPosting = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await jobPostingsAPI.getById(id);
        if (response.success && response.data) {
          const post = response.data.posting;
          
          // Check if user has already applied (only for applicants)
          if (role === "applicant") {
            try {
              const checkResponse = await applicationsAPI.checkApplication(id);
              if (checkResponse.success && checkResponse.data) {
                setHasApplied(checkResponse.data.hasApplied);
                setApplicationStatus({
                  applicationId: checkResponse.data.applicationId,
                  paymentStatus: checkResponse.data.paymentStatus,
                  gender: checkResponse.data.gender,
                  category: checkResponse.data.category,
                });
              }
            } catch (err) {
              console.error("Check application error:", err);
              // Don't block the page if check fails
            }
          }
          
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
          
          // Transform to handle bilingual
          setPosting({
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
            locationArrHi: post.locationArrHi || [],
            fee: normalizeBilingual(post.fee),
            feeStructure: post.feeStructure || {},
            advertisementFile: post.advertisementFile || "",
            advertisementFileHi: post.advertisementFileHi || "",
            lastDate: post.lastDate,
            applicationOpeningDate: post.applicationOpeningDate,
            firstMeritListDate: post.firstMeritListDate,
            finalMeritListDate: post.finalMeritListDate,
            ageLimit: normalizeBilingual(post.ageLimit),
            ageAsOn: post.ageAsOn,
            selectionProcess: normalizeBilingual(post.selectionProcess),
            status: post.status,
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load job posting");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosting();
  }, [id, role]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const [processingPayment, setProcessingPayment] = useState(false);

  const handlePayNow = async () => {
    if (!applicationStatus?.applicationId || !applicationStatus?.gender || !applicationStatus?.category) {
      alert("Application details not found. Please apply again.");
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      // Create Razorpay order
      const orderResponse = await paymentsAPI.createOrder(
        id,
        applicationStatus.gender,
        applicationStatus.category
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
              applicationStatus.applicationId
            );

            if (verifyResponse.success) {
              alert("Payment successful! Application submitted.");
              // Refresh application status
              const checkResponse = await applicationsAPI.checkApplication(id);
              if (checkResponse.success && checkResponse.data) {
                setApplicationStatus({
                  applicationId: checkResponse.data.applicationId,
                  paymentStatus: checkResponse.data.paymentStatus,
                  gender: checkResponse.data.gender,
                  category: checkResponse.data.category,
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
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to initiate payment");
      setProcessingPayment(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this posting?")) {
      try {
        await jobPostingsAPI.delete(id);
        alert("Posting deleted successfully!");
        navigate("/job-postings");
      } catch (err) {
        alert(err.message || "Failed to delete posting");
        console.error("Delete error:", err);
      }
    }
  };

  // Helper to get bilingual value
  const getValue = (field) => {
    if (!posting || !field) return "";
    if (typeof field === 'object' && field !== null) {
      // Return the selected language, fallback to English if not available
      const value = field[language];
      if (value && value.trim()) return value;
      // If selected language is empty, return English as fallback
      return field.en || "";
    }
    // If it's a string (shouldn't happen after normalization, but handle it)
    return field || "";
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout activePath="/job-postings">
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
      <DashboardLayout activePath="/job-postings">
        <div className="ml-6 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-500 font-medium mb-4">
            {error}
          </p>
          <button
            onClick={() => navigate("/job-postings")}
            className="bg-[#3AB000] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#2d8a00] transition-colors"
          >
            ← Back to List
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  if (!posting) {
    return (
      <DashboardLayout activePath="/job-postings">
        <div className="ml-6 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-500 font-medium mb-4">
            Job posting not found.
          </p>
          <button
            onClick={() => navigate("/job-postings")}
            className="bg-[#3AB000] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#2d8a00] transition-colors"
          >
            ← Back to List
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const isActive = posting.status === "Active";

  return (
    <DashboardLayout activePath="/job-postings">
      <div className="ml-6 space-y-4 pb-8">
        {/* ── Breadcrumb + Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/job-postings")}
              className="flex items-center gap-1.5 text-[#3AB000] font-medium hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Job Postings
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500 truncate max-w-xs">
              {getValue(posting.post)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/job-postings/edit/${posting.id}`)}
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

        {/* ── Bilingual Display Notice ── */}
        <div className="flex justify-end mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-xs text-blue-700 font-medium">
              Displaying in English and Hindi / अंग्रेजी और हिंदी में प्रदर्शित
            </p>
          </div>
        </div>

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Green Header */}
          <div className="bg-[#3AB000] px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-green-100 text-xs font-semibold tracking-wider uppercase mb-1">
                  {posting.advtNo} · Date: {posting.date}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h1 className="text-white font-bold text-lg sm:text-xl leading-snug">
                      {posting.title?.en || posting.postTitle?.en || 
                        (posting.post?.en 
                          ? `Recruitment for the Post of ${posting.post.en}`
                          : "Job Posting")}
                    </h1>
                  </div>
                  {(posting.title?.hi || posting.postTitle?.hi || posting.post?.hi) && (
                    <div>
                      <h2 className="text-white font-bold text-lg sm:text-xl leading-snug">
                        {posting.title?.hi || posting.postTitle?.hi || 
                          (posting.post?.hi 
                            ? `पद के लिए भर्ती: ${posting.post.hi}`
                            : "")}
                      </h2>
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`self-start flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isActive
                    ? "bg-white/20 text-white border-white/40"
                    : "bg-black/20 text-white/70 border-white/20"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {posting.status}
              </span>
            </div>
          </div>

          {/* Download Bar + Apply Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-[#f0fae8] border-b border-[#d4edcc]">
            <div className="flex flex-wrap items-center gap-4">
              {posting.advertisementFile && (
                <>
                  <a 
                    href={posting.advertisementFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#3AB000] text-xs font-semibold hover:underline transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Advertisement (English)
                  </a>
                  {posting.advertisementFileHi && <span className="text-gray-300 hidden sm:block">|</span>}
                </>
              )}
              {posting.advertisementFileHi && (
                <a 
                  href={posting.advertisementFileHi} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#3AB000] text-xs font-semibold hover:underline transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  विज्ञापन डाउनलोड करें (हिंदी)
                </a>
              )}
            </div>
            {/* Apply Now Button - Only show for applicants who haven't applied yet */}
            {role === "applicant" && isActive && !hasApplied && (
              <button
                onClick={() => navigate(`/application-form?new=true&jobId=${id}`)}
                className="flex items-center gap-2 bg-[#3AB000] hover:bg-[#2d8a00] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                Apply Now
              </button>
            )}
            {/* Pay Now Button - Show if form filled but payment pending */}
            {role === "applicant" && isActive && hasApplied && applicationStatus?.paymentStatus === "pending" && (
              <button
                onClick={handlePayNow}
                disabled={processingPayment}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {processingPayment ? "Processing..." : "Pay Now"}
              </button>
            )}
            {/* Show message if already submitted (form + payment done) */}
            {role === "applicant" && isActive && hasApplied && applicationStatus?.paymentStatus === "paid" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Already Submitted</span>
              </div>
            )}
            {/* Show message if applied but payment status unknown */}
            {role === "applicant" && isActive && hasApplied && applicationStatus?.paymentStatus !== "pending" && applicationStatus?.paymentStatus !== "paid" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Already Applied</span>
              </div>
            )}
          </div>

          {/* Quick Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
            <QuickInfo
              icon={<Briefcase className="w-4 h-4" />}
              label="Post / पद"
              value={posting.post?.en || ""}
              valueHi={posting.post?.hi || ""}
            />
            <QuickInfo
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education / शैक्षणिक योग्यता"
              value={posting.education?.en || ""}
              valueHi={posting.education?.hi || ""}
            />
            <QuickInfo
              icon={<IndianRupee className="w-4 h-4" />}
              label="Monthly Income / मासिक आय"
              value={posting.income?.en || ""}
              valueHi={posting.income?.hi || ""}
            />
            <QuickInfo
              icon={<Users className="w-4 h-4" />}
              label="Application Fee / आवेदन शुल्क"
              value={posting.fee?.en || ""}
              valueHi={posting.fee?.hi || ""}
              valueClass="text-[#3AB000] font-bold"
            />
          </div>
        </div>

        {/* ── Body Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Job Location */}
            <DetailCard
              icon={<MapPin className="w-4 h-4 text-[#3AB000]" />}
              title="Job Location / नौकरी करने का स्थान"
            >
              <div className="mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* English States */}
                  <div>
                    {posting.locationArr?.length > 0 ? (
                      <>
                        <p className="text-xs text-gray-500 font-medium mb-2">English:</p>
                        <div className="flex flex-wrap gap-2">
                          {posting.locationArr.map((loc) => (
                            <span
                              key={loc}
                              className="bg-[#e8f5e2] text-[#2d8a00] text-xs font-medium px-3 py-1 rounded-full border border-[#c8e6c9]"
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : posting.location?.en ? (
                      <>
                        <p className="text-xs text-gray-500 font-medium mb-1">English:</p>
                        <p className="text-sm text-gray-700">{posting.location.en}</p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">All India</p>
                    )}
                  </div>
                  {/* Hindi States */}
                  <div>
                    {posting.locationArrHi?.length > 0 ? (
                      <>
                        <p className="text-xs text-gray-500 font-medium mb-2">हिंदी:</p>
                        <div className="flex flex-wrap gap-2">
                          {posting.locationArrHi.map((loc) => (
                            <span
                              key={loc}
                              className="bg-[#e8f5e2] text-[#2d8a00] text-xs font-medium px-3 py-1 rounded-full border border-[#c8e6c9]"
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : posting.location?.hi ? (
                      <>
                        <p className="text-xs text-gray-500 font-medium mb-1">हिंदी:</p>
                        <p className="text-sm text-gray-700">{posting.location.hi}</p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">पूरे भारत में</p>
                    )}
                  </div>
                </div>
              </div>
            </DetailCard>

            {/* Selection Process */}
            <DetailCard
              icon={<CheckCircle2 className="w-4 h-4 text-[#3AB000]" />}
              title="Selection Process / चयन प्रक्रिया"
            >
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {posting.selectionProcess?.en && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">English:</p>
                    <p className="text-sm text-gray-700">{posting.selectionProcess.en}</p>
                  </div>
                )}
                {posting.selectionProcess?.hi && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">हिंदी:</p>
                    <p className="text-sm text-gray-700">{posting.selectionProcess.hi}</p>
                  </div>
                )}
              </div>
            </DetailCard>

            {/* Full Detail Table */}
            <DetailCard
              icon={<FileText className="w-4 h-4 text-[#3AB000]" />}
              title="Full Posting Details / पूर्ण पोस्टिंग विवरण"
            >
              <table className="w-full text-sm mt-2">
                <tbody>
                  {[
                    ["Advertisement No. / विज्ञापन संख्या", posting.advtNo, null],
                    ["Post Name / पद का नाम", posting.post?.en || "", posting.post?.hi || ""],
                    ["Education Qualification / शैक्षणिक योग्यता", posting.education?.en || "", posting.education?.hi || ""],
                    ["Monthly Income / मासिक आय", posting.income?.en || "", posting.income?.hi || ""],
                    ["Age Limit / आयु सीमा", posting.ageLimit?.en || "19 – 40 Years", posting.ageLimit?.hi || "19 – 40 वर्ष"],
                    ["Age As On / आयु की तिथि", posting.ageAsOn || "—", null],
                    ["Application Fee / आवेदन शुल्क", posting.fee?.en || "", posting.fee?.hi || ""],
                    ["Selection Process / चयन प्रक्रिया", posting.selectionProcess?.en || "—", posting.selectionProcess?.hi || "—"],
                    ["Status / स्थिति", posting.status, null],
                  ].map(([key, valEn, valHi]) => (
                    <tr
                      key={key}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-gray-500 font-medium w-2/5">
                        {key}
                      </td>
                      <td className="py-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {valEn && (
                            <p className={`font-semibold ${
                              key.includes("Status")
                                ? isActive
                                  ? "text-[#3AB000]"
                                  : "text-gray-500"
                                : key.includes("Application Fee")
                                  ? "text-[#3AB000]"
                                  : "text-gray-800"
                            }`}>
                              {valEn}
                            </p>
                          )}
                          {valHi && (
                            <p className={`text-sm ${
                              key.includes("Status")
                                ? isActive
                                  ? "text-[#3AB000]"
                                  : "text-gray-500"
                                : key.includes("Application Fee")
                                  ? "text-[#3AB000]"
                                  : "text-gray-600"
                            }`}>
                              {valHi}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DetailCard>
          </div>

          {/* Right column – Dates */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-bold text-[#3AB000] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Important Dates
              </p>

              {/* Timeline */}
              <div className="relative pl-5">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gray-200" />
                {[
                  {
                    label: "Application Opens",
                    value: posting.applicationOpeningDate || "—",
                    color: "bg-[#3AB000]",
                    textClass: "text-gray-700",
                  },
                  {
                    label: "Last Date to Apply",
                    value: posting.lastDate,
                    color: "bg-red-400",
                    textClass: "text-red-500 font-semibold",
                  },
                  {
                    label: "1st Merit List Released",
                    value: posting.firstMeritListDate || "—",
                    color: "bg-blue-400",
                    textClass: "text-gray-700",
                  },
                  {
                    label: "Final Merit List Released",
                    value: posting.finalMeritListDate || "—",
                    color: "bg-purple-400",
                    textClass: "text-gray-700",
                  },
                ].map((item, i) => (
                  <div key={i} className="relative mb-4 last:mb-0">
                    <div
                      className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-white ${item.color}`}
                    />
                    <p className="text-xs text-gray-400 font-medium">
                      {item.label}
                    </p>
                    <p className={`text-sm mt-0.5 ${item.textClass}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-bold text-[#3AB000] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                Eligibility / योग्यता
              </p>
              <div className="space-y-2.5">
                <Row
                  label="Age Limit / आयु सीमा"
                  value={posting.ageLimit?.en || "19 – 40 Years"}
                  valueHi={posting.ageLimit?.hi || "19 – 40 वर्ष"}
                />
                <Row 
                  label="Age As On / आयु की तिथि" 
                  value={posting.ageAsOn || "—"} 
                />
                <Row 
                  label="Education / शिक्षा" 
                  value={posting.education?.en || ""}
                  valueHi={posting.education?.hi || ""}
                />
                <Row
                  label="Application Fee / आवेदन शुल्क"
                  value={posting.fee?.en || ""}
                  valueHi={posting.fee?.hi || ""}
                  valueClass="text-[#3AB000] font-bold text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Back Button ── */}
        <div>
          <button
            onClick={() => navigate("/job-postings")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#3AB000] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Postings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const QuickInfo = ({
  icon,
  label,
  value,
  valueHi,
  valueClass = "text-gray-800 font-semibold",
}) => (
  <div className="flex items-start gap-3 px-5 py-4">
    <div className="w-8 h-8 rounded-lg bg-[#e8f5e2] flex items-center justify-center flex-shrink-0 text-[#3AB000] mt-0.5">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-2 mt-0.5">
        {value && (
          <p className={`text-sm truncate ${valueClass}`}>{value}</p>
        )}
        {valueHi && (
          <p className={`text-sm truncate ${valueClass} text-gray-600`}>{valueHi}</p>
        )}
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
  valueHi,
  valueClass = "text-gray-800 font-medium text-sm",
}) => (
  <div className="flex justify-between items-start text-sm">
    <span className="text-gray-500">{label}</span>
    <div className="text-right">
      {value && <span className={valueClass}>{value}</span>}
      {valueHi && (
        <p className="text-xs text-gray-600 mt-0.5">{valueHi}</p>
      )}
    </div>
  </div>
);

export default JobPostingView;
