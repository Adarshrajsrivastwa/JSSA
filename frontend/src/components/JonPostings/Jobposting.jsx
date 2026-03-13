import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

// All Indian States - English
const JOB_STATES_EN = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// All Indian States - Hindi
const JOB_STATES_HI = [
  "आंध्र प्रदेश",
  "अरुणाचल प्रदेश",
  "असम",
  "बिहार",
  "छत्तीसगढ़",
  "गोआ",
  "गुजरात",
  "हरियाणा",
  "हिमाचल प्रदेश",
  "झारखंड",
  "कर्नाटक",
  "केरल",
  "मध्य प्रदेश",
  "महाराष्ट्र",
  "मणिपुर",
  "मेघालय",
  "मिजोरम",
  "नागालैंड",
  "ओडिशा",
  "पंजाब",
  "राजस्थान",
  "सिक्किम",
  "तमिलनाडु",
  "तेलंगाना",
  "त्रिपुरा",
  "उत्तर प्रदेश",
  "उत्तराखंड",
  "पश्चिम बंगाल",
  "अंडमान और निकोबार द्वीप समूह",
  "चंडीगढ़",
  "दादरा और नगर हवेली और दमन और दीव",
  "दिल्ली",
  "जम्मू और कश्मीर",
  "लद्दाख",
  "लक्षद्वीप",
  "पुडुचेरी",
];

const EDUCATION_OPTIONS = [
  "Graduation Pass",
  "Post Graduation",
  "12th Pass",
  "10th Pass",
  "Diploma",
  "B.Tech",
  "MBA",
  "M.Sc",
  "B.Com",
  "B.A",
  "M.A",
];

const SELECTION_OPTIONS = [
  "Based on Graduation Marks & Interview / स्नातक अंक और साक्षात्कार के आधार पर",
  "Based on Graduation Mark & Interview",
  "Written Test & Interview",
  "Direct Interview",
  "Merit Based",
];

const emptyForm = {
  advtNo: "",
  date: "",
  title: "",
  titleHi: "",
  postTitle: "",
  postTitleHi: "",
  post: "",
  postHi: "",
  totalPost: [],
  monthlyIncomeMin: "",
  monthlyIncomeMax: "",
  education: "",
  educationHi: "",
  ageLimitMin: "",
  ageLimitMax: "",
  ageAsOn: "",
  jobLocation: [],
  jobLocationHi: [],
  selectionProcess: "",
  selectionProcessHi: "",
  applicationOpeningDate: "",
  lastDateOfApplication: "",
  firstMeritListDate: "",
  finalMeritListDate: "",
  applicationFee: "",
  feeStructure: {
    male_general: "",
    male_obc: "",
    male_sc: "",
    male_st: "",
    male_ews: "",
    female_general: "",
    female_obc: "",
    female_sc: "",
    female_st: "",
    female_ews: "",
  },
  location: "",
  locationHi: "",
  advertisementFile: null,
  advertisementFileHi: null,
};

const JobPostingForm = ({
  isOpen,
  onClose,
  onSuccess,
  isEdit = false,
  postingData = null,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sameForAllAmount, setSameForAllAmount] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (isEdit && postingData) {
        // Helper to get English value from bilingual or string
        const getValue = (field) => {
          if (!field) return "";
          if (typeof field === "object" && field !== null) {
            return field.en || field.hi || "";
          }
          return field || "";
        };
        
        const getHiValue = (field) => {
          if (!field) return "";
          if (typeof field === "object" && field !== null) {
            return field.hi || field.en || "";
          }
          return "";
        };
        
        const jobLocations = postingData.locationArr || [];
        setForm({
          ...emptyForm,
          advtNo: postingData.advtNo || "",
          date: postingData.date || "",
          title: getValue(postingData.title),
          titleHi: getHiValue(postingData.title),
          postTitle: getValue(postingData.postTitle),
          postTitleHi: getHiValue(postingData.postTitle),
          post: getValue(postingData.post),
          postHi: getHiValue(postingData.post),
          monthlyIncomeMin: postingData.incomeMin || "",
          monthlyIncomeMax: postingData.incomeMax || "",
          education: getValue(postingData.education),
          educationHi: getHiValue(postingData.education),
          lastDateOfApplication: postingData.lastDate || "",
          applicationFee: getValue(postingData.fee)?.replace("₹", "") || "",
          feeStructure: postingData.feeStructure || {
            male_general: "",
            male_obc: "",
            male_sc: "",
            male_st: "",
            male_ews: "",
            female_general: "",
            female_obc: "",
            female_sc: "",
            female_st: "",
            female_ews: "",
          },
          jobLocation: jobLocations,
          jobLocationHi: postingData.locationArrHi || [],
          location: getValue(postingData.location) || (jobLocations.length > 0 ? jobLocations.join(", ") : ""),
          locationHi: getHiValue(postingData.location) || (postingData.locationArrHi && postingData.locationArrHi.length > 0 ? postingData.locationArrHi.join(", ") : ""),
          selectionProcess: getValue(postingData.selectionProcess),
          selectionProcessHi: getHiValue(postingData.selectionProcess),
          ageLimitMin: (() => {
            const ageLimitStr = getValue(postingData.ageLimit) || "";
            if (typeof ageLimitStr === "string") {
              const parts = ageLimitStr.split("–");
              return parts[0]?.trim() || "";
            }
            return "";
          })(),
          ageLimitMax: (() => {
            const ageLimitStr = getValue(postingData.ageLimit) || "";
            if (typeof ageLimitStr === "string") {
              const parts = ageLimitStr.split("–");
              return parts[1]?.trim() || "";
            }
            return "";
          })(),
          ageAsOn: postingData.ageAsOn || "",
          applicationOpeningDate: postingData.applicationOpeningDate || "",
          firstMeritListDate: postingData.firstMeritListDate || "",
          finalMeritListDate: postingData.finalMeritListDate || "",
          advertisementFile: postingData.advertisementFile || null,
          advertisementFileHi: postingData.advertisementFileHi || null,
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [isOpen, isEdit, postingData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    setErrors((er) => ({ ...er, [name]: "" }));
  };


  const toggleMulti = (name, val) => {
    setForm((f) => {
      const arr = f[name];
      const updatedArr = arr.includes(val)
        ? arr.filter((x) => x !== val)
        : [...arr, val];
      
      // If jobLocation is being updated, automatically fill the location field
      if (name === "jobLocation") {
        return {
          ...f,
          [name]: updatedArr,
          location: updatedArr.length > 0 ? updatedArr.join(", ") : "",
        };
      }
      
      // If jobLocationHi is being updated, automatically fill the locationHi field
      if (name === "jobLocationHi") {
        return {
          ...f,
          [name]: updatedArr,
          locationHi: updatedArr.length > 0 ? updatedArr.join(", ") : "",
        };
      }
      
      return {
        ...f,
        [name]: updatedArr,
      };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.advtNo.trim()) e.advtNo = "Advertisement No. is required";
    if (!form.date) e.date = "Date is required";
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.postTitle.trim()) e.postTitle = "Post title is required";
    if (!form.post.trim()) e.post = "Post name (English) is required";
    if (!form.postHi.trim()) e.postHi = "Post name (Hindi) is required";
    if (!form.monthlyIncomeMin) e.monthlyIncomeMin = "Required";
    if (!form.monthlyIncomeMax) e.monthlyIncomeMax = "Required";
    if (!form.education) e.education = "Education (English) is required";
    if (!form.educationHi.trim()) e.educationHi = "Education (Hindi) is required";
    if (!form.ageLimitMin) e.ageLimitMin = "Required";
    if (!form.ageLimitMax) e.ageLimitMax = "Required";
    if (!form.applicationOpeningDate) e.applicationOpeningDate = "Application Opening Date is required";
    if (!form.lastDateOfApplication) e.lastDateOfApplication = "Required";
    // Validate fee structure
    const feeKeys = Object.keys(form.feeStructure);
    const hasEmptyFee = feeKeys.some(key => !form.feeStructure[key] || form.feeStructure[key].trim() === "");
    if (hasEmptyFee) e.feeStructure = "Please fill all fee amounts for all gender and category combinations";
    if (!form.location.trim()) e.location = "Location (English) is required";
    if (!form.locationHi.trim()) e.locationHi = "Location (Hindi) is required";
    if (!form.selectionProcess.trim()) e.selectionProcess = "Selection process (English) is required";
    if (!form.selectionProcessHi.trim()) e.selectionProcessHi = "Selection process (Hindi) is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    
    // Prepare single language data
    const locationText = form.jobLocation.length
      ? form.jobLocation.join(", ")
      : form.totalPost.join(", ") || form.location || "—";

    const submissionData = {
      advtNo: form.advtNo,
      title: {
        en: form.title,
        hi: form.titleHi || form.title,
      },
      postTitle: {
        en: form.postTitle,
        hi: form.postTitleHi || form.postTitle,
      },
      post: {
        en: form.post,
        hi: form.postHi || form.post,
      },
      date: form.date,
      incomeMin: Number(form.monthlyIncomeMin),
      incomeMax: Number(form.monthlyIncomeMax),
      income: {
        en: `₹${Number(form.monthlyIncomeMin).toLocaleString()} – ₹${Number(form.monthlyIncomeMax).toLocaleString()}`,
        hi: `₹${Number(form.monthlyIncomeMin).toLocaleString()} – ₹${Number(form.monthlyIncomeMax).toLocaleString()}`,
      },
      education: {
        en: form.education || "",
        hi: form.educationHi || form.education || "",
      },
      location: {
        en: form.location || locationText,
        hi: form.locationHi || (form.jobLocationHi.length > 0 ? form.jobLocationHi.join(", ") : "") || form.location || locationText,
      },
      locationArr: form.jobLocation.length ? form.jobLocation : form.totalPost,
      locationArrHi: form.jobLocationHi.length ? form.jobLocationHi : [],
      fee: {
        en: form.applicationFee ? `₹${form.applicationFee}` : "₹0",
        hi: form.applicationFee ? `₹${form.applicationFee}` : "₹0",
      },
      feeStructure: form.feeStructure || {},
      lastDate: form.lastDateOfApplication || "",
      applicationOpeningDate: form.applicationOpeningDate || "",
      firstMeritListDate: form.firstMeritListDate || "",
      finalMeritListDate: form.finalMeritListDate || "",
      ageLimit: {
        en: form.ageLimitMin && form.ageLimitMax ? `${form.ageLimitMin} – ${form.ageLimitMax} Years` : "18 – 40 Years",
        hi: form.ageLimitMin && form.ageLimitMax ? `${form.ageLimitMin} – ${form.ageLimitMax} Years` : "18 – 40 Years",
      },
      ageAsOn: form.ageAsOn || "",
      selectionProcess: {
        en: form.selectionProcess || "",
        hi: form.selectionProcessHi || form.selectionProcess || "",
      },
      advertisementFile: form.advertisementFile ? (typeof form.advertisementFile === 'string' ? form.advertisementFile : "") : "",
      advertisementFileHi: form.advertisementFileHi ? (typeof form.advertisementFileHi === 'string' ? form.advertisementFileHi : "") : "",
      status: "Active",
    };

    onSuccess?.(submissionData);
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#3AB000] rounded-t-lg">
          <h2 className="text-white font-bold text-base">
            {isEdit ? "✏️ Edit Job Posting" : "+ Add Job Posting"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
          {/* ── Section 1: Advertisement Details ── */}
          <FormSection title="Advertisement Details / विज्ञापन विवरण">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Advertisement No."
                required
                error={errors.advtNo}
              >
                <input
                  name="advtNo"
                  value={form.advtNo}
                  onChange={handleChange}
                  placeholder="Enter advertisement number (e.g. JSSA/REQ/01/2025/P-III)"
                  className={inputCls(errors.advtNo)}
                />
              </FormField>
              <FormField
                label="Advertisement Date"
                required
                error={errors.date}
              >
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputCls(errors.date)}
                />
              </FormField>
            </div>

            {/* Title - English and Hindi */}
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Title (English)" required error={errors.title}>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter job posting title"
                    className={inputCls(errors.title)}
                  />
                </FormField>
                <FormField label="Title (Hindi)" error={errors.titleHi}>
                  <input
                    name="titleHi"
                    value={form.titleHi}
                    onChange={handleChange}
                    placeholder="नौकरी पोस्टिंग शीर्षक दर्ज करें"
                    className={inputCls(errors.titleHi)}
                  />
                </FormField>
              </div>
            </div>

            {/* Post Title - English and Hindi */}
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Post Title (English)" required error={errors.postTitle}>
                  <input
                    name="postTitle"
                    value={form.postTitle}
                    onChange={handleChange}
                    placeholder="Enter post title (e.g. Recruitment for the Post of District Manager)"
                    className={inputCls(errors.postTitle)}
                  />
                </FormField>
                <FormField label="Post Title (Hindi)" error={errors.postTitleHi}>
                  <input
                    name="postTitleHi"
                    value={form.postTitleHi}
                    onChange={handleChange}
                    placeholder="पद शीर्षक दर्ज करें"
                    className={inputCls(errors.postTitleHi)}
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Upload Advertisement (English)"
                  note="PDF/Image"
                >
                  <FileBtn
                    name="advertisementFile"
                    file={form.advertisementFile}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField
                  label="Upload Advertisement (Hindi) / विज्ञापन अपलोड करें"
                  note="PDF/Image"
                >
                  <FileBtn
                    name="advertisementFileHi"
                    file={form.advertisementFileHi}
                    onChange={handleChange}
                  />
                </FormField>
              </div>
            </div>
          </FormSection>

          {/* ── Section 2: Post Info ── */}
          <FormSection title="Post Information / पद की जानकारी">
            {/* Post Name - English and Hindi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Post (English)" required error={errors.post}>
                <input
                  name="post"
                  value={form.post}
                  onChange={handleChange}
                  placeholder="Enter post name (e.g. District Manager)"
                  className={inputCls(errors.post)}
                />
              </FormField>
              <FormField label="Post (Hindi) / पद" required error={errors.postHi}>
                <input
                  name="postHi"
                  value={form.postHi}
                  onChange={handleChange}
                  placeholder="पद का नाम दर्ज करें (जैसे जिला प्रबंधक)"
                  className={inputCls(errors.postHi)}
                />
              </FormField>
            </div>

            {/* Education - English and Hindi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Education Qualification (English)"
                required
                error={errors.education}
              >
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className={inputCls(errors.education)}
                >
                  <option value="">-- Please Select --</option>
                  {EDUCATION_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="Education Qualification (Hindi) / शैक्षणिक योग्यता"
                required
                error={errors.educationHi}
              >
                <input
                  name="educationHi"
                  value={form.educationHi}
                  onChange={handleChange}
                  placeholder="शैक्षणिक योग्यता दर्ज करें (जैसे स्नातक पास)"
                  className={inputCls(errors.educationHi)}
                />
              </FormField>
            </div>
          </FormSection>

          {/* ── Section 3: Salary & Age ── */}
          <FormSection title="Salary & Age / मासिक आय और आयु सीमा">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Monthly Income Min / मासिक आय न्यूनतम (₹)"
                required
                error={errors.monthlyIncomeMin}
              >
                <input
                  type="number"
                  name="monthlyIncomeMin"
                  value={form.monthlyIncomeMin}
                  onChange={handleChange}
                  placeholder="Enter minimum salary (e.g. 25500)"
                  className={inputCls(errors.monthlyIncomeMin)}
                />
              </FormField>
              <FormField
                label="Monthly Income Max / मासिक आय अधिकतम (₹)"
                required
                error={errors.monthlyIncomeMax}
              >
                <input
                  type="number"
                  name="monthlyIncomeMax"
                  value={form.monthlyIncomeMax}
                  onChange={handleChange}
                  placeholder="Enter maximum salary (e.g. 35500)"
                  className={inputCls(errors.monthlyIncomeMax)}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <FormField label="Age Min / आयु न्यूनतम" required error={errors.ageLimitMin}>
                <input
                  type="number"
                  name="ageLimitMin"
                  value={form.ageLimitMin}
                  onChange={handleChange}
                  placeholder="Enter minimum age (e.g. 18)"
                  className={inputCls(errors.ageLimitMin)}
                />
              </FormField>
              <FormField label="Age Max / आयु अधिकतम" required error={errors.ageLimitMax}>
                <input
                  type="number"
                  name="ageLimitMax"
                  value={form.ageLimitMax}
                  onChange={handleChange}
                  placeholder="Enter maximum age (e.g. 40)"
                  className={inputCls(errors.ageLimitMax)}
                />
              </FormField>
              <FormField label="Age As On / आयु की तिथि">
                <input
                  type="date"
                  name="ageAsOn"
                  value={form.ageAsOn}
                  onChange={handleChange}
                  placeholder="e.g. 01/01/2025"
                  className={inputCls()}
                />
              </FormField>
            </div>
          </FormSection>

          {/* ── Section 4: Location & Selection ── */}
          <FormSection title="Location & Selection Process / नौकरी करने का स्थान और चयन प्रक्रिया">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Job Location (English) – Select States">
                <CheckboxGrid
                  items={JOB_STATES_EN}
                  selected={form.jobLocation}
                  onToggle={(v) => toggleMulti("jobLocation", v)}
                />
              </FormField>
              <FormField label="Job Location (Hindi) / नौकरी करने का स्थान – राज्य चुनें">
                <CheckboxGrid
                  items={JOB_STATES_HI}
                  selected={form.jobLocationHi}
                  onToggle={(v) => toggleMulti("jobLocationHi", v)}
                />
              </FormField>
            </div>

            {/* Location - English and Hindi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField label="Location (English)" required error={errors.location}>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter job locations (e.g. Bihar, Jharkhand, Uttar Pradesh)"
                  className={inputCls(errors.location)}
                />
              </FormField>
              <FormField label="Location (Hindi) / नौकरी करने का स्थान" required error={errors.locationHi}>
                <input
                  name="locationHi"
                  value={form.locationHi}
                  onChange={handleChange}
                  placeholder="नौकरी के स्थान दर्ज करें (जैसे बिहार, झारखंड, उत्तर प्रदेश)"
                  className={inputCls(errors.locationHi)}
                />
              </FormField>
            </div>

            {/* Selection Process - English and Hindi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField label="Selection Process (English)" required error={errors.selectionProcess}>
                <input
                  name="selectionProcess"
                  value={form.selectionProcess}
                  onChange={handleChange}
                  placeholder="Enter selection process (e.g. Based on Graduation Marks & Interview)"
                  className={inputCls(errors.selectionProcess)}
                />
              </FormField>
              <FormField label="Selection Process (Hindi) / चयन प्रक्रिया" required error={errors.selectionProcessHi}>
                <input
                  name="selectionProcessHi"
                  value={form.selectionProcessHi}
                  onChange={handleChange}
                  placeholder="चयन प्रक्रिया दर्ज करें (जैसे स्नातक अंक और साक्षात्कार के आधार पर)"
                  className={inputCls(errors.selectionProcessHi)}
                />
              </FormField>
            </div>
          </FormSection>

          {/* ── Section 5: Dates & Fee ── */}
          <FormSection title="Important Dates & Fee / महत्वपूर्ण तिथियां और शुल्क">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Application Opening Date / आवेदन खुलने की तिथि" required error={errors.applicationOpeningDate}>
                <input
                  type="date"
                  name="applicationOpeningDate"
                  value={form.applicationOpeningDate}
                  onChange={handleChange}
                  className={inputCls(errors.applicationOpeningDate)}
                />
              </FormField>
              <FormField
                label="Last Date of Application / आवेदन की अंतिम तिथि"
                required
                error={errors.lastDateOfApplication}
              >
                <input
                  type="date"
                  name="lastDateOfApplication"
                  value={form.lastDateOfApplication}
                  onChange={handleChange}
                  className={inputCls(errors.lastDateOfApplication)}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField label="1st Merit List Release">
                <input
                  type="date"
                  name="firstMeritListDate"
                  value={form.firstMeritListDate}
                  onChange={handleChange}
                  className={inputCls()}
                />
              </FormField>
              <FormField label="Final Merit List Release">
                <input
                  type="date"
                  name="finalMeritListDate"
                  value={form.finalMeritListDate}
                  onChange={handleChange}
                  className={inputCls()}
                />
              </FormField>
            </div>
            {/* Application Fee Structure */}
            <div className="mt-4">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Application Fee / आवेदन शुल्क (₹) – By Gender & Category / लिंग और श्रेणी के अनुसार
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="flex gap-2 mb-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Same for All Amount / सभी के लिए समान राशि (₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={sameForAllAmount}
                        onChange={(e) => setSameForAllAmount(e.target.value)}
                        placeholder="Enter amount (e.g. 260)"
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#3AB000] focus:border-[#3AB000]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (sameForAllAmount && !isNaN(sameForAllAmount) && sameForAllAmount > 0) {
                            setForm((f) => ({
                              ...f,
                              feeStructure: {
                                male_general: sameForAllAmount,
                                male_obc: sameForAllAmount,
                                male_sc: sameForAllAmount,
                                male_st: sameForAllAmount,
                                male_ews: sameForAllAmount,
                                female_general: sameForAllAmount,
                                female_obc: sameForAllAmount,
                                female_sc: sameForAllAmount,
                                female_st: sameForAllAmount,
                                female_ews: sameForAllAmount,
                              },
                            }));
                            setSameForAllAmount("");
                            // Clear any fee structure errors
                            setErrors((e) => ({ ...e, feeStructure: "" }));
                          } else {
                            alert("Please enter a valid amount");
                          }
                        }}
                        className="px-4 py-1.5 text-xs font-semibold bg-[#3AB000] text-white rounded hover:bg-[#2d8a00] transition-colors whitespace-nowrap"
                      >
                        Apply / लागू करें
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Update button - validates and shows message
                      const errs = validate();
                      if (Object.keys(errs).length) {
                        setErrors(errs);
                        alert("Please fill all required fee fields");
                      } else {
                        alert("Fee structure updated successfully!");
                      }
                    }}
                    className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Update / अपडेट
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#3AB000] text-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-xs">Gender / लिंग</th>
                      <th className="px-3 py-2 text-left font-semibold text-xs">General / सामान्य</th>
                      <th className="px-3 py-2 text-left font-semibold text-xs">OBC</th>
                      <th className="px-3 py-2 text-left font-semibold text-xs">SC</th>
                      <th className="px-3 py-2 text-left font-semibold text-xs">ST</th>
                      <th className="px-3 py-2 text-left font-semibold text-xs">EWS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {/* Male Row */}
                    <tr className="border-t border-gray-200">
                      <td className="px-3 py-2 font-medium text-gray-700">Male / पुरुष</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.male_general"
                          value={form.feeStructure.male_general}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, male_general: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.male_obc"
                          value={form.feeStructure.male_obc}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, male_obc: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.male_sc"
                          value={form.feeStructure.male_sc}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, male_sc: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.male_st"
                          value={form.feeStructure.male_st}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, male_st: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.male_ews"
                          value={form.feeStructure.male_ews}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, male_ews: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                    </tr>
                    {/* Female Row */}
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-700">Female / महिला</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.female_general"
                          value={form.feeStructure.female_general}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, female_general: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.female_obc"
                          value={form.feeStructure.female_obc}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, female_obc: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.female_sc"
                          value={form.feeStructure.female_sc}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, female_sc: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.female_st"
                          value={form.feeStructure.female_st}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, female_st: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="feeStructure.female_ews"
                          value={form.feeStructure.female_ews}
                          onChange={(e) => setForm((f) => ({ ...f, feeStructure: { ...f.feeStructure, female_ews: e.target.value } }))}
                          placeholder="₹"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB000]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {errors.feeStructure && (
                <p className="text-red-500 text-xs mt-1">{errors.feeStructure}</p>
              )}
            </div>
          </FormSection>

          {/* ── Footer Buttons ── */}
          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 text-sm font-bold text-white bg-[#3AB000] rounded hover:bg-[#2d8a00] transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "💾 Update Posting"
              ) : (
                "+ Submit Posting"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const FormSection = ({ title, children }) => (
  <div className="px-6 py-4">
    <p className="text-xs font-bold text-[#3AB000] uppercase tracking-wider mb-3 border-b border-green-100 pb-2">
      {title}
    </p>
    {children}
  </div>
);

const FormField = ({
  label,
  children,
  required,
  error,
  note,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {note && <span className="text-gray-400 font-normal ml-1">({note})</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const FileBtn = ({ name, file, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="file"
      name={name}
      onChange={onChange}
      accept=".pdf,.jpg,.jpeg,.png"
      className="hidden"
    />
    <span className="flex items-center gap-1.5 bg-[#e8f5e2] text-[#3AB000] border border-[#3AB000] rounded px-3 py-1.5 text-xs font-semibold hover:bg-[#d4edcc] transition-colors">
      <Upload className="w-3 h-3" />
      Choose File
    </span>
    <span
      className={`text-xs truncate max-w-[140px] ${file ? "text-[#3AB000]" : "text-gray-400"}`}
    >
      {file ? file.name : "No file chosen"}
    </span>
  </label>
);

const CheckboxGrid = ({ items, selected, onToggle }) => (
  <div className="flex flex-wrap gap-x-5 gap-y-2 p-3 bg-[#f9fbe7] border border-[#c5e1a5] rounded">
    {items.map((item) => (
      <label
        key={item}
        className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-700 select-none hover:text-[#3AB000] transition-colors"
      >
        <input
          type="checkbox"
          checked={selected.includes(item)}
          onChange={() => onToggle(item)}
          className="w-3.5 h-3.5 accent-[#3AB000]"
        />
        {item}
      </label>
    ))}
  </div>
);

const inputCls = (err) =>
  `w-full px-3 py-2 text-sm border rounded outline-none transition-colors bg-white text-gray-700 ${
    err
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-[#3AB000]"
  }`;

export default JobPostingForm;
