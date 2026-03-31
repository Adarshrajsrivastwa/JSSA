import React, { useEffect, useMemo, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { createPaperAPI, jobPostingsAPI, questionBankAPI, applicationsAPI } from "../../utils/api";
import {
  ClipboardList,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  X,
  Calendar,
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  BookOpen,
  Filter,
  Tag,
  Lock,
  Globe,
  PlayCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Check,
  ArrowRight,
  Monitor,
  HelpCircle,
  Settings,
} from "lucide-react";

// ─── Static Mock Data ─────────────────────────────────────────────────────────
const MOCK_TESTS = [
  {
    id: 1,
    title: "Algebra Basics - Unit Test",
    class: "Class 10A",
    type: "Unit Test",
    difficulty: "Medium",
    totalQuestions: 25,
    totalMarks: 100,
    passingMarks: 40,
    duration: 60,
    status: "published",
    attempts: 128,
    avgScore: 74,
    description:
      "Covers linear equations, quadratic expressions and basic algebra.",
    tags: ["algebra", "unit-test", "class10"],
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    isPublic: true,
    shuffleQuestions: true,
    showResult: true,
    maxAttempts: 2,
    createdDate: "2024-02-20T10:00:00Z",
    pipeline: { currentStage: 2, completedStages: [0, 1] },
    questionConfigs: [],
  },
  {
    id: 2,
    title: "Human Body Systems",
    class: "Class 9B",
    type: "Mid Term",
    difficulty: "Hard",
    totalQuestions: 40,
    totalMarks: 80,
    passingMarks: 32,
    duration: 90,
    status: "published",
    attempts: 95,
    avgScore: 61,
    description:
      "Comprehensive test on digestive, respiratory, and circulatory systems.",
    tags: ["biology", "mid-term", "body-systems"],
    startDate: "2024-03-05",
    endDate: "2024-04-05",
    isPublic: true,
    shuffleQuestions: false,
    showResult: false,
    maxAttempts: 1,
    createdDate: "2024-02-25T09:00:00Z",
    pipeline: { currentStage: 4, completedStages: [0, 1, 2, 3] },
    questionConfigs: [],
  },
];

const MOCK_QUESTION_BANK = [
  {
    id: 1,
    question: "What is the value of x in 2x + 5 = 11?",
    class: "Class 10",
    topic: "Algebra",
    marks: 4,
    difficulty: "Easy",
    options: ["x=2", "x=3", "x=4", "x=5"],
  },
];

const TEST_TITLE_OPTIONS = [
  "Unit Test - Term 1",
  "Unit Test - Term 2",
  "Mid Term Examination",
  "Final Examination",
  "Weekly Quiz",
  "Chapter Assessment",
  "Mock Test",
  "Practice Test",
  "Surprise Quiz",
  "Remedial Test",
];

const DIFF_STYLES = {
  Easy: "bg-[#e8f5e2] text-[#2d8a00]",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-600",
  Mixed: "bg-blue-100 text-blue-700",
};

const EMPTY_FORM = {
  title: "",
  questionConfigs: [],
  duration: "",
  passingMarks: "",
  description: "",
  tags: "",
  startDate: "",
  endDate: "",
  isPublic: true,
  shuffleQuestions: false,
  showResult: true,
  resultDate: "",
  maxAttempts: "1",
  pipelineStageCount: 5,
};

const normalizeTest = (item) => ({
  id: item?._id || item?.id,
  title: String(item?.title || ""),
  type: String(item?.type || ""),
  difficulty: String(item?.difficulty || "Mixed"),
  questionConfigs: Array.isArray(item?.questionConfigs)
    ? item.questionConfigs.map((cfg) => ({
        questionId: String(cfg?.questionId?._id || cfg?.questionId || ""),
        questionText: cfg?.questionId?.question || "",
        options: cfg?.questionId?.options || [],
        marks: Number(cfg?.marks || 0),
        isCompulsory: Boolean(cfg?.isCompulsory),
      }))
    : [],
  totalQuestions: Number(item?.totalQuestions || 0),
  totalMarks: Number(item?.totalMarks || (Array.isArray(item?.questionConfigs) 
    ? item.questionConfigs.reduce((s, c) => s + Number(c.marks || 0), 0) 
    : 0)),
  passingMarks: Number(item?.passingMarks || 0),
  duration: Number(item?.duration || 0),
  status: item?.status === "published" ? "published" : "draft",
  attempts: Number(item?.attempts || 0),
  avgScore: Number(item?.avgScore || 0),
  description: String(item?.description || ""),
  tags: Array.isArray(item?.tags) ? item.tags : [],
  startDate: String(item?.startDate || ""),
  endDate: String(item?.endDate || ""),
  isPublic: item?.isPublic !== false,
  shuffleQuestions: Boolean(item?.shuffleQuestions),
  showResult: item?.showResult !== false,
  resultDate: item?.resultDate || "",
  maxAttempts:
    item?.maxAttempts === 0 ? 0 : Number(item?.maxAttempts ?? 1),
  assignedStudents: Array.isArray(item?.assignedStudents)
    ? item.assignedStudents.map((s) => (typeof s === 'object' ? s : { _id: String(s) }))
    : [],
  createdDate: item?.createdDate || item?.createdAt || new Date().toISOString(),
  rewards: Array.isArray(item?.rewards) ? item.rewards : [],
});

const normalizeQuestion = (item) => ({
  id: item?._id || item?.id,
  question: String(item?.question || ""),
  topic: String(item?.topic || ""),
  marks: Number(item?.marks || 1),
  difficulty: String(item?.difficulty || ""),
  options: Array.isArray(item?.options) ? item.options : [],
});

const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none";

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailsModal({ test, onClose }) {
  const stageCount = test.pipelineStageCount || 5;
  const assigned = Array.isArray(test.assignedStudents) ? test.assignedStudents : [];
  const questions = Array.isArray(test.questionConfigs) ? test.questionConfigs : [];
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3AB000] to-[#2d8a00] text-white px-8 py-6 shrink-0 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight leading-tight">{test.title}</h3>
              <div className="flex items-center gap-4 text-green-50 text-xs font-bold uppercase tracking-widest opacity-90">
                <span className="flex items-center gap-1"><Monitor size={14} /> Test ID: {test.id?.slice(-6)}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Created: {new Date(test.createdDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-100 px-8 shrink-0 flex gap-8">
          {[
            { id: "students", label: "Assigned Students", icon: Users, count: assigned.length },
            { id: "questions", label: "Question Bank", icon: HelpCircle, count: questions.length },
            { id: "config", label: "Configuration", icon: Settings, count: null },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 flex items-center gap-2 border-b-2 font-bold text-sm transition-all relative ${
                  isActive 
                    ? "border-[#3AB000] text-[#3AB000]" 
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.count !== null && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-[#3AB000] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Assigned</p>
                  <p className="text-3xl font-black text-gray-900">{assigned.length === 1 ? assigned[0].candidateName : assigned.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Districts Covered</p>
                  <p className="text-3xl font-black text-gray-900">{[...new Set(assigned.map(s => s.district))].filter(Boolean).length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Rate</p>
                  <p className="text-3xl font-black text-gray-900">{Math.round((assigned.filter(s => s.mobile).length / (assigned.length || 1)) * 100)}%</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {assigned.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Users size={40} className="text-gray-300" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">No students assigned</p>
                      <p className="text-sm text-gray-500">Assign students from the edit menu to see them here.</p>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Details</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact & Location</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Education & Category</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Identifiers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {assigned.map((s, i) => (
                        <tr key={s._id || i} className="hover:bg-[#f0fce8]/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={s.photo || '/placeholder.png'} alt={s.candidateName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"/>
                              <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#3AB000] transition-colors">{s.candidateName || "Unknown"}</p>
                                <p className="text-[10px] text-gray-400 font-medium italic mt-0.5">S/O: {s.fatherName || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Monitor size={12} className="text-gray-400" /> {s.mobile || "N/A"}</p>
                              <p className="text-[10px] text-gray-400 font-medium truncate">{s.email || "N/A"}</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">{s.address}, {s.district}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black border border-blue-100">
                                {s.higherEducation || "N/A"}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black border border-purple-100">
                                {s.category || "GENERAL"}
                              </span>
                            </div>
                          </td>
                           <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 text-[10px] font-mono text-gray-500">
                              <p>Aadhar: {s.aadhar || "N/A"}</p>
                              <p>PAN: {s.pan || "N/A"}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Marks</p>
                  <p className="text-3xl font-black text-[#3AB000]">{test.totalMarks}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pass Marks</p>
                  <p className="text-3xl font-black text-amber-600">{test.passingMarks}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Difficulty</p>
                  <p className="text-xl font-black text-gray-900 uppercase">{test.difficulty || "Mixed"}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg per Q</p>
                  <p className="text-3xl font-black text-gray-900">{Math.round((test.totalMarks / (questions.length || 1)) * 10) / 10}</p>
                </div>
              </div>

              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-20 text-center">
                    <HelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 font-bold">No questions have been added to this paper.</p>
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-[#3AB000] transition-all">
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-8">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start gap-4">
                              <span className="w-8 h-8 rounded-lg bg-[#f0fce8] text-[#3AB000] flex items-center justify-center font-black text-sm shrink-0 border border-[#c5edaa]">
                                {idx + 1}
                              </span>
                              <p className="text-base font-bold text-gray-800 leading-relaxed pt-1">
                                {q.questionText || "Question content is missing or not populated."}
                              </p>
                            </div>
                            
                            {Array.isArray(q.options) && q.options.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 text-sm text-gray-600">
                                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-[#3AB000] text-[10px] font-black border border-gray-200 shadow-sm shrink-0 uppercase">
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="font-medium">{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              q.isCompulsory 
                                ? "bg-amber-50 text-amber-600 border-amber-100" 
                                : "bg-gray-50 text-gray-400 border-gray-100"
                            }`}>
                              {q.isCompulsory ? "Compulsory" : "Optional"}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-[#f0fce8] text-[#3AB000] text-[10px] font-black uppercase tracking-widest border border-[#c5edaa]">
                              {q.marks} Points
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50 overflow-hidden">
                <div className="p-8">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">General Information</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Description</p>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                        "{test.description || "No description provided for this event."}"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Availability</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Start Date</p>
                        <p className="text-sm font-bold text-gray-800">{test.startDate ? new Date(test.startDate).toLocaleString() : "Immediately"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">End Date</p>
                        <p className="text-sm font-bold text-gray-800">{test.endDate ? new Date(test.endDate).toLocaleString() : "Never Expires"}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Exam Logic</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Duration</p>
                        <p className="text-sm font-bold text-gray-800">{test.duration} Minutes</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Attempts Limit</p>
                        <p className="text-sm font-bold text-gray-800">{test.maxAttempts === 0 ? "Unlimited" : `${test.maxAttempts} Attempts`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Settings & Status</h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: "Visibility", val: test.isPublic ? "Public" : "Private", color: test.isPublic ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100" },
                      { label: "Shuffling", val: test.shuffleQuestions ? "Enabled" : "Disabled", color: test.shuffleQuestions ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-gray-50 text-gray-400 border-gray-100" },
                      { label: "Results", val: test.showResult ? "Instant" : "Scheduled", color: "bg-amber-50 text-amber-600 border-amber-100" },
                      { label: "Status", val: test.status, color: test.status === "published" ? "bg-[#3AB000] text-white" : "bg-gray-900 text-white" },
                    ].map((badge, i) => (
                      <div key={i} className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${badge.color}`}>
                        {badge.label}: {badge.val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-8 py-6 bg-white shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Modal ───────────────────────────────────────────────────────
function TestModal({ editingTest, questionBank, titleOptions, postings, onClose, onSave }) {
  const [formData, setFormData] = useState(
    editingTest
      ? {
          title: editingTest.title,
          questionConfigs: editingTest.questionConfigs || [],
          assignedStudents: editingTest.assignedStudents || [],
          duration: editingTest.duration.toString(),
          passingMarks: editingTest.passingMarks.toString(),
          description: editingTest.description,
          tags: editingTest.tags.join(", "),
          startDate: editingTest.startDate,
          endDate: editingTest.endDate,
          isPublic: editingTest.isPublic,
          shuffleQuestions: editingTest.shuffleQuestions,
          showResult: editingTest.showResult,
          resultDate: editingTest.resultDate || "",
          maxAttempts: editingTest.maxAttempts.toString(),
        }
      : { ...EMPTY_FORM, assignedStudents: [], resultDate: "" },
  );
  const [activeTab, setActiveTab] = useState("details");
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [qFilterDifficulty, setQFilterDifficulty] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [applicantError, setApplicantError] = useState("");
  const [studentStartDate, setStudentStartDate] = useState("");
  const [studentEndDate, setStudentEndDate] = useState("");
  const [localStudentSearch, setLocalStudentSearch] = useState("");
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("");
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const titleDropdownRef = useRef(null);

  // Click outside listener for title dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        titleDropdownRef.current &&
        !titleDropdownRef.current.contains(event.target)
      ) {
        setIsTitleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered titles for custom dropdown
  const filteredTitles = useMemo(() => {
    const q = titleSearch.toLowerCase().trim();
    const filtered = (Array.isArray(titleOptions) ? titleOptions : []).filter((opt) =>
      opt.toLowerCase().includes(q),
    );

    // Sort: Active first, Inactive later
    return filtered.sort((a, b) => {
      const getStatusScore = (title) => {
        const posting = postings.find((p) => {
          const titleEn = typeof p.post === 'object' ? p.post.en : p.post;
          const titleHi = typeof p.post === 'object' ? p.post.hi : p.post;
          return titleEn === title || titleHi === title || p.title === title || p.advtNo === title;
        });
        const isOpen = posting ? isVacancyOpen(posting.lastDate) : true;
        const isActive = posting ? (posting.status !== "Inactive" && isOpen) : true;
        return isActive ? 1 : 0;
      };

      return getStatusScore(b) - getStatusScore(a);
    });
  }, [titleOptions, titleSearch, postings]);

  // Debounce student search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStudentSearch(localStudentSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localStudentSearch]);

  const filteredApplicants = applicants; // Filtering is now done on server-side for search

  // Fetch applicants when title, dates or debounced search change
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!formData.title) {
        setApplicants([]);
        return;
      }

      // Find jobPostingId for the selected title
      const posting = postings.find((p) => {
        const title = String(p?.title || "").trim();
        const postEn = String(p?.post?.en || "").trim();
        const postHi = String(p?.post?.hi || "").trim();
        const advtNo = String(p?.advtNo || "").trim();
        const currentTitle = formData.title.trim();

        return (
          title === currentTitle ||
          postEn === currentTitle ||
          postHi === currentTitle ||
          advtNo === currentTitle
        );
      });

      const params = { 
        limit: 0, // Load ALL paid applicants for the selected title
        paymentStatus: "paid",
        search: debouncedStudentSearch // Server-side search
      };

      if (posting?._id) {
        params.jobPostingId = posting._id;
      } else {
        // Fallback: search by title string directly if no ID match
        params.search = params.search ? `${params.search} ${formData.title}` : formData.title;
      }

      if (studentStartDate) params.startDate = studentStartDate;
      if (studentEndDate) params.endDate = studentEndDate;

      setIsLoadingApplicants(true);
      setApplicantError("");
      try {
        const res = await applicationsAPI.getAll(params);
        if (res?.success) {
          setApplicants(res.data?.applications || []);
        } else {
          setApplicants([]);
          setApplicantError(res.error || "No applicants found matching your filters.");
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setApplicantError("Failed to fetch applicants. Database connection timed out.");
        setApplicants([]);
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [formData.title, postings, studentStartDate, studentEndDate, debouncedStudentSearch]);

  const toggleStudent = (studentId) => {
    setFormData((prev) => {
      const selected = prev.assignedStudents || [];
      const exists = selected.includes(studentId);
      return {
        ...prev,
        assignedStudents: exists
          ? selected.filter((id) => id !== studentId)
          : [...selected, studentId],
      };
    });
  };

  const selectedCount = (formData.questionConfigs || []).length;
  const totalMarks = (formData.questionConfigs || []).reduce(
    (s, c) => s + Number(c.marks || 0),
    0,
  );

  // Unique difficulties from question bank
  const qbDifficulties = useMemo(
    () => [...new Set(questionBank.map((q) => q.difficulty).filter(Boolean))],
    [questionBank],
  );

  const filteredQB = useMemo(() => {
    const q = questionSearch.trim().toLowerCase();
    return questionBank.filter((item) => {
      const matchSearch =
        !q ||
        [item.question, item.topic].some((f) =>
          String(f || "")
            .toLowerCase()
            .includes(q),
        );
      const matchDiff =
        qFilterDifficulty === "all" || item.difficulty === qFilterDifficulty;
      return matchSearch && matchDiff;
    });
  }, [questionBank, questionSearch, qFilterDifficulty]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleQ = (q) => {
    const qId = String(q.id);
    setFormData((prev) => {
      const configs = prev.questionConfigs || [];
      const exists = configs.some((c) => String(c.questionId) === qId);
      return {
        ...prev,
        questionConfigs: exists
          ? configs.filter((c) => String(c.questionId) !== qId)
          : [
              ...configs,
              {
                questionId: qId,
                marks: Number(q.marks || 1),
                isCompulsory: false,
              },
            ],
      };
    });
  };

  const updateQConfig = (qId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questionConfigs: (prev.questionConfigs || []).map((c) =>
        String(c.questionId) === String(qId) ? { ...c, [field]: value } : c,
      ),
    }));
  };

  const getQConfig = (qId) =>
    (formData.questionConfigs || []).find(
      (c) => String(c.questionId) === String(qId),
    );

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.duration
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({ ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        {/* Header */}
        <div
          style={{ backgroundColor: "#3AB000" }}
          className="text-white px-6 py-4 flex items-center justify-between shrink-0"
        >
          <h3 className="text-base font-bold">
            {editingTest ? "Edit Event" : "Create New Event"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white shrink-0 overflow-x-auto">
          <div className="flex">
            {[
              { key: "details", label: "Event Details" },
              { key: "applicants", label: "Select Students" },
              { key: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "bg-[#e8f5e2] border-[#3AB000] text-[#3AB000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-4">
          {/* ── Details Tab ── */}
          {activeTab === "details" && (
            <>
              {/* Test Title — Custom Searchable Dropdown */}
              <div className="relative" ref={titleDropdownRef}>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <div
                  className={`${inputCls} flex items-center justify-between cursor-pointer relative ${isTitleDropdownOpen ? "ring-2 ring-[#3AB000] border-[#3AB000]" : ""}`}
                  onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
                >
                  <span className={`truncate flex-1 ${!formData.title ? "text-gray-400" : "text-gray-900 font-medium"}`}>
                    {formData.title || "Select event title"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isTitleDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isTitleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-white border border-gray-200 rounded shadow-xl flex flex-col max-h-[300px] overflow-hidden">
                    <div className="p-2 border-b border-gray-100 bg-gray-50 shrink-0">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          autoFocus
                          value={titleSearch}
                          onChange={(e) => setTitleSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Search title..."
                          className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1 py-1">
                      {filteredTitles.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-gray-400 text-center italic">
                          No titles found.
                        </div>
                      ) : (
                        filteredTitles.map((opt) => {
                          const posting = postings.find((p) => {
                            const titleEn = typeof p.post === 'object' ? p.post.en : p.post;
                            const titleHi = typeof p.post === 'object' ? p.post.hi : p.post;
                            return titleEn === opt || titleHi === opt || p.title === opt || p.advtNo === opt;
                          });
                          const isOpen = posting ? isVacancyOpen(posting.lastDate) : true;
                          const isActive = posting ? (posting.status !== "Inactive" && isOpen) : true;

                          return (
                            <div
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((p) => ({ ...p, title: opt }));
                                setIsTitleDropdownOpen(false);
                                setTitleSearch("");
                              }}
                              className={`px-4 py-2.5 text-xs cursor-pointer hover:bg-[#e8f5e2] transition-colors border-b border-gray-50 last:border-0 ${
                                formData.title === opt
                                  ? "bg-[#e8f5e2] text-[#3AB000] font-bold"
                                  : "text-gray-700"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="leading-normal break-words flex-1">
                                  {opt}
                                </p>
                                <span className={`shrink-0 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider border ${
                                  isActive 
                                    ? "bg-green-50 text-green-600 border-green-100" 
                                    : "bg-red-50 text-red-600 border-red-100"
                                }`}>
                                  {isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Questions
                  </label>
                  <input
                    readOnly
                    value={selectedCount}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm bg-gray-100 font-semibold text-[#3AB000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleInput}
                    placeholder="40"
                    min="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Total Marks
                  </label>
                  <input
                    readOnly
                    value={totalMarks}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm bg-gray-100 font-semibold text-[#3AB000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Assigned Students
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab("applicants")}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm bg-gray-100 font-bold text-[#3AB000] text-left"
                  >
                    {formData.assignedStudents?.length || 0} selected
                  </button>
                </div>
              </div>

              {/* Question selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Select Questions <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => {
                      setShowQuestionPicker(true);
                      setQuestionSearch("");
                      setQFilterDifficulty("all");
                    }}
                    className="inline-flex items-center gap-1 rounded border border-[#3AB000] bg-[#e8f5e2] px-3 py-1 text-xs font-bold text-[#3AB000] hover:bg-[#d0edbc] transition-colors"
                  >
                    <Search size={11} /> Select from Bank
                  </button>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-white space-y-1.5">
                  <p className="text-xs text-gray-500 font-semibold">
                    Selected:{" "}
                    <span className="text-[#3AB000]">{selectedCount}</span> |
                    Marks: <span className="text-[#3AB000]">{totalMarks}</span>
                  </p>
                  {(formData.questionConfigs || []).length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No questions selected yet.
                    </p>
                  ) : (
                    <div className="max-h-32 overflow-auto space-y-1.5">
                      {(formData.questionConfigs || []).map((cfg) => {
                        const q = questionBank.find(
                          (item) =>
                            String(item.id) === String(cfg.questionId),
                        );
                        return (
                          <div
                            key={cfg.questionId}
                            className="rounded border border-gray-200 bg-gray-50 px-3 py-2"
                          >
                            <p className="text-xs font-semibold text-gray-800">
                              {q?.question || `Question #${cfg.questionId}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Marks: {cfg.marks} ·{" "}
                              {cfg.isCompulsory ? "Compulsory" : "Optional"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInput}
                  placeholder="60"
                  min="1"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInput}
                  rows={2}
                  placeholder="Describe this test…"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] resize-none outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Tags{" "}
                  <span className="text-gray-400 font-normal normal-case">
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInput}
                  placeholder="algebra, mid-term, class10"
                  className={inputCls}
                />
              </div>
            </>
          )}

          {/* ── Applicants Tab ── */}
          {activeTab === "applicants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">
                    Selected: {formData.assignedStudents?.length || 0} / Total: {applicants.length}
                  </h4>
                  <p className="text-xs text-gray-500 truncate max-w-md">
                    Showing paid applicants who applied for "{formData.title || "Selected Title"}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        assignedStudents: applicants.map((a) => a._id),
                      }))
                    }
                    className="px-2 py-1 bg-[#e8f5e2] text-[#3AB000] rounded text-[10px] font-bold hover:bg-[#d5eac8] transition-colors"
                  >
                    Select All ({applicants.length})
                  </button>
                  <button
                    onClick={() =>
                      setFormData((p) => ({ ...p, assignedStudents: [] }))
                    }
                    className="px-2 py-1 bg-red-50 text-red-500 rounded text-[10px] font-bold hover:bg-red-100 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              {/* Search & Date Filters Row */}
              <div className="bg-white p-3 rounded border border-gray-200 space-y-3 shadow-sm">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Search Student
                  </label>
                  <div className="relative">
                    <Search
                      size={12}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={localStudentSearch}
                      onChange={(e) => setLocalStudentSearch(e.target.value)}
                      placeholder="Search by Name, Mobile, Father Name, District..."
                      className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Applied From
                    </label>
                    <input
                      type="date"
                      value={studentStartDate}
                      onChange={(e) => setStudentStartDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                      Applied To
                    </label>
                    <input
                      type="date"
                      value={studentEndDate}
                      onChange={(e) => setStudentEndDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
                    />
                  </div>
                </div>
              </div>

              {isLoadingApplicants ? (
                <div className="py-10 text-center text-sm text-gray-400 flex flex-col items-center justify-center">
                  <div className="animate-spin inline-block w-6 h-6 border-4 border-t-[#3AB000] border-gray-200 rounded-full mb-3"></div>
                  <p>Loading applicants...</p>
                </div>
              ) : applicantError ? (
                <div className="py-10 text-center text-sm text-red-500 bg-red-50 border border-dashed border-red-200 rounded p-6">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="font-bold mb-1">Database Connection Error</p>
                  <p className="text-xs text-red-400 max-w-xs mx-auto mb-4">
                    {applicantError}
                  </p>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev }));
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : applicants.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400 bg-white border border-dashed border-gray-300 rounded">
                  {formData.title
                    ? "No applicants found matching your filters."
                    : "Please select a Test Title first."}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2">
                  {applicants.map((app) => {
                    const isSelected = formData.assignedStudents?.includes(app._id);
                    return (
                      <div
                        key={app._id}
                        onClick={() => toggleStudent(app._id)}
                        className={`flex items-center gap-3 p-3 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#3AB000] bg-[#e8f5e2]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-[#3AB000] border-[#3AB000]"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {app.candidateName}
                            </p>
                            <span className="text-[10px] font-semibold text-gray-400">
                              {app.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            Father: {app.fatherName}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">
                            Mobile: {app.mobile} | District: {app.district}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 italic">
                            Applied: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Settings Tab ── */}
          {activeTab === "settings" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInput}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInput}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Max Attempts{" "}
                  <span className="text-gray-400 font-normal normal-case">
                    (0 = unlimited)
                  </span>
                </label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={formData.maxAttempts}
                  onChange={handleInput}
                  placeholder="1"
                  min="0"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                {[
                  [
                    "isPublic",
                    "Public Test",
                    "Visible to all students without invitation",
                  ],
                  [
                    "shuffleQuestions",
                    "Shuffle Questions",
                    "Randomize question order for each attempt",
                  ],
                  [
                    "showResult",
                    "Show Result Instantly",
                    "Students see score immediately after submission",
                  ],
                ].map(([name, label, sub]) => (
                  <div
                    key={name}
                    className="flex items-start justify-between p-3 bg-white rounded border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, [name]: !p[name] }))
                      }
                      className={`ml-4 shrink-0 rounded px-3 py-1 text-xs font-bold ${formData[name] ? "bg-[#e8f5e2] text-[#2d8a00]" : "bg-gray-100 text-gray-600"}`}
                    >
                      {formData[name] ? "Yes" : "No"}
                    </button>
                  </div>
                ))}
              </div>

              {!formData.showResult && (
                <div className="p-3 bg-amber-50 rounded border border-amber-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-amber-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Calendar size={14} /> Result Declaration Date
                  </label>
                  <input
                    type="date"
                    name="resultDate"
                    value={formData.resultDate}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border border-amber-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none bg-white"
                  />
                  <p className="text-[10px] text-amber-600 mt-1.5 italic">
                    Students will see a message with this date after submitting the test.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-4 bg-white flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded text-sm font-semibold hover:bg-gray-50 transition-colors text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-white rounded text-sm font-bold transition-colors"
            style={{ backgroundColor: "#3AB000" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2d8a00")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3AB000")
            }
          >
            {editingTest ? "Update Test" : "Create Test"}
          </button>
        </div>
      </div>

      {/* Question Picker */}
      {showQuestionPicker && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded bg-white shadow-2xl border border-gray-200 flex flex-col max-h-[85vh]">
            <div
              style={{ backgroundColor: "#3AB000" }}
              className="text-white px-6 py-4 flex items-center justify-between shrink-0"
            >
              <div>
                <h3 className="text-base font-bold">Select Questions</h3>
                <p className="text-green-100 text-xs mt-0.5">
                  Selected: {selectedCount} | Total Marks: {totalMarks}
                </p>
              </div>
              <button
                onClick={() => setShowQuestionPicker(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search + Filters */}
            <div className="px-5 py-3 border-b border-gray-200 bg-white shrink-0 space-y-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search question, topic..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
                />
              </div>
              {/* Filters row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={13} className="text-gray-400 flex-shrink-0" />
                {/* Difficulty filter */}
                <select
                  value={qFilterDifficulty}
                  onChange={(e) => setQFilterDifficulty(e.target.value)}
                  className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none"
                >
                  <option value="all">All Difficulties</option>
                  {qbDifficulties.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {/* Difficulty badges */}
                <div className="flex gap-1 ml-auto">
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() =>
                        setQFilterDifficulty(
                          qFilterDifficulty === d ? "all" : d,
                        )
                      }
                      className={`px-2 py-0.5 rounded text-xs font-semibold border transition-colors ${
                        qFilterDifficulty === d
                          ? d === "Easy"
                            ? "bg-[#e8f5e2] border-[#3AB000] text-[#2d8a00]"
                            : d === "Medium"
                              ? "bg-amber-100 border-amber-400 text-amber-700"
                              : "bg-red-100 border-red-400 text-red-600"
                          : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredQB.length}
                </span>{" "}
                of {questionBank.length} questions
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {filteredQB.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">
                  No questions found.
                </p>
              ) : (
                filteredQB.map((q) => {
                  const cfg = getQConfig(q.id);
                  const selected = Boolean(cfg);
                  return (
                    <div
                      key={q.id}
                      className={`rounded border-2 p-3 bg-white ${selected ? "border-[#3AB000]" : "border-gray-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleQ(q)}
                          className={`shrink-0 rounded px-3 py-1.5 text-xs font-bold transition-colors mt-0.5 ${
                            selected
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-[#e8f5e2] text-[#2d8a00] hover:bg-[#d0edbc]"
                          }`}
                        >
                          {selected ? "Remove" : "Add"}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-gray-800">
                              {q.question}
                            </p>
                            {q.difficulty && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${DIFF_STYLES[q.difficulty] || "bg-gray-100 text-gray-600"}`}
                              >
                                {q.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            #{q.id} · Default: {q.marks} marks
                          </p>
                          {Array.isArray(q.options) && q.options.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {q.options.map((opt, idx) => (
                                <span
                                  key={idx}
                                  className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {selected && (
                          <div className="w-40 shrink-0 space-y-2">
                            <label className="block">
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1 block">
                                Marks
                              </span>
                              <input
                                type="number"
                                min="1"
                                value={cfg?.marks ?? 1}
                                onChange={(e) =>
                                  updateQConfig(
                                    q.id,
                                    "marks",
                                    Math.max(1, Number(e.target.value || 1)),
                                  )
                                }
                                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3AB000]"
                              />
                            </label>
                            <button
                              onClick={() =>
                                updateQConfig(
                                  q.id,
                                  "isCompulsory",
                                  !cfg?.isCompulsory,
                                )
                              }
                              className={`rounded px-3 py-1.5 text-xs font-bold w-full transition-colors ${cfg?.isCompulsory ? "bg-[#e8f5e2] text-[#2d8a00]" : "bg-gray-100 text-gray-700"}`}
                            >
                              {cfg?.isCompulsory
                                ? "Compulsory: Yes"
                                : "Compulsory: No"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3 bg-white shrink-0">
              <button
                onClick={() => setShowQuestionPicker(false)}
                className="px-5 py-2 text-white rounded text-sm font-bold transition-colors"
                style={{ backgroundColor: "#3AB000" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d8a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3AB000")
                }
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isVacancyOpen = (lastDate) => {
  if (!lastDate) return true;
  try {
    const parts = lastDate.split(/[-/.]/);
    let date;
    if (parts.length === 3) {
      if (parts[0].length === 4) date = new Date(parts[0], parts[1] - 1, parts[2]);
      else date = new Date(parts[2], parts[1] - 1, parts[0]);
    } else date = new Date(lastDate);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today <= date;
  } catch {
    return true;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);
  const [postings, setPostings] = useState([]); // Store full postings
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [testsError, setTestsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTest, setDetailsTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const loadTests = async () => {
    setIsLoadingTests(true);
    setTestsError("");
    const response = await createPaperAPI.getAll({ page: 1, limit: 0 });
    if (!response?.success) {
      setTestsError(response?.error || "Failed to load events.");
      setIsLoadingTests(false);
      return;
    }

    const rows = Array.isArray(response?.data?.tests) ? response.data.tests : [];
    setTests(rows.map(normalizeTest));
    setIsLoadingTests(false);
  };

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    const loadSavedQuestions = async () => {
      const response = await questionBankAPI.getAll({ page: 1, limit: 0 });
      if (!response?.success) {
        setQuestionBank([]);
        return;
      }
      const rows = Array.isArray(response?.data?.questions)
        ? response.data.questions
        : [];
      setQuestionBank(rows.map(normalizeQuestion));
    };
    loadSavedQuestions();
  }, []);

  useEffect(() => {
    const loadFormTitles = async () => {
      const response = await jobPostingsAPI.getAll({ page: 1, limit: 0 });
      if (!response?.success) {
        setTitleOptions([]);
        return;
      }
      const postingsData = Array.isArray(response?.data?.postings)
        ? response.data.postings
        : [];
      setPostings(postingsData);
      const titles = postingsData
        .sort((a, b) => {
          const aOpen = isVacancyOpen(a.lastDate) && a.status !== "Inactive";
          const bOpen = isVacancyOpen(b.lastDate) && b.status !== "Inactive";
          if (aOpen && !bOpen) return -1;
          if (!aOpen && bOpen) return 1;
          return 0;
        })
        .map((item) =>
          String(item?.title || item?.post?.en || item?.advtNo || "").trim(),
        )
        .filter(Boolean);
      setTitleOptions(Array.from(new Set(titles)));
    };
    loadFormTitles();
  }, []);

  const stats = useMemo(() => {
    const total = tests.length;
    const published = tests.filter((t) => t.status === "published").length;
    const draft = tests.filter((t) => t.status === "draft").length;
    const attempts = tests.reduce((s, t) => s + t.attempts, 0);
    return { total, published, draft, attempts };
  }, [tests]);

  const filtered = useMemo(() => {
    return tests
      .filter((t) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          t.title.toLowerCase().includes(q) ||
          (Array.isArray(t.tags) ? t.tags : []).some((tg) =>
            tg.toLowerCase().includes(q),
          );
        const matchStatus = filterStatus === "all" || t.status === filterStatus;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const aExpired = a.endDate && new Date(a.endDate) < new Date();
        const bExpired = b.endDate && new Date(b.endDate) < new Date();
        const aActive = a.status === "published" && !aExpired;
        const bActive = b.status === "published" && !bExpired;

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
  }, [tests, searchQuery, filterStatus]);

  const isFiltered = searchQuery || filterStatus !== "all";

  const handleSave = async (formData) => {
    const parsed = {
      ...formData,
      difficulty: String(formData.difficulty || "Mixed"),
      duration: parseInt(formData.duration, 10),
      passingMarks: parseInt(formData.passingMarks) || 0,
      maxAttempts:
        formData.maxAttempts === "" || formData.maxAttempts === null
          ? 1
          : Number(formData.maxAttempts),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      questionConfigs: Array.isArray(formData.questionConfigs)
        ? formData.questionConfigs.map((cfg) => ({
            questionId: String(cfg.questionId),
            marks: Number(cfg.marks || 0),
            isCompulsory: Boolean(cfg.isCompulsory),
          }))
        : [],
      totalQuestions: (formData.questionConfigs || []).length,
      totalMarks: (formData.questionConfigs || []).reduce(
        (s, c) => s + Number(c.marks || 0),
        0,
      ),
      assignedStudents: Array.isArray(formData.assignedStudents)
        ? formData.assignedStudents
        : [],
    };

    const response = editingTest
      ? await createPaperAPI.update(editingTest.id, parsed)
      : await createPaperAPI.create({
          ...parsed,
          status: "draft",
          attempts: 0,
          avgScore: 0,
          createdDate: new Date().toISOString(),
          pipeline: { currentStage: 0, completedStages: [] },
        });

    if (!response?.success) {
      alert(response?.error || "Failed to save test.");
      return;
    }

    await loadTests();
    setShowModal(false);
    setEditingTest(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test?")) return;
    const response = await createPaperAPI.delete(id);
    if (!response?.success) {
      alert(response?.error || "Failed to delete test.");
      return;
    }
    setTests((p) => p.filter((t) => t.id !== id));
  };

  const handleDuplicate = async (test) => {
    const payload = {
      ...test,
      title: `${test.title} (Copy)`,
      status: "draft",
      attempts: 0,
      avgScore: 0,
      createdDate: new Date().toISOString(),
      pipeline: { currentStage: 0, completedStages: [] },
    };
    delete payload.id;

    const response = await createPaperAPI.create(payload);
    if (!response?.success) {
      alert(response?.error || "Failed to duplicate event.");
      return;
    }
    await loadTests();
  };

  const toggleStatus = async (id) => {
    const current = tests.find((t) => String(t.id) === String(id));
    if (!current) return;
    const nextStatus = current.status === "published" ? "draft" : "published";

    const response = await createPaperAPI.update(id, { status: nextStatus });
    if (!response?.success) {
      alert(response?.error || "Failed to update status.");
      return;
    }

    setTests((p) =>
      p.map((t) =>
        String(t.id) === String(id) ? { ...t, status: nextStatus } : t,
      ),
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white ml-0 p-0 md:ml-6 px-2 md:px-0">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Events</p>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Published</p>
            <p className="text-2xl font-black text-[#3AB000]">{stats.published}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Drafts</p>
            <p className="text-2xl font-black text-amber-600">{stats.draft}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Attempts</p>
            <p className="text-2xl font-black text-blue-600">{stats.attempts}</p>
          </div>
        </div>

        {/* ── Search & Filter ── */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB000] outline-none"
            />
          </div>
          <div className="flex gap-4 items-center w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB000] outline-none bg-white flex-1 md:flex-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button
              onClick={() => {
                setEditingTest(null);
                setShowModal(true);
              }}
              className="bg-[#3AB000] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2d8a00] transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <Plus size={18} /> Create Event
            </button>
          </div>
        </div>

        {/* ── Tests List ── */}
        <div className="space-y-4">
          {isLoadingTests ? (
            <div className="text-center py-20 text-gray-500">Loading tests...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              No tests found.
            </div>
          ) : (
            filtered.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#3AB000] transition-all group">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#3AB000] transition-colors">{test.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Monitor size={14} /> ID: {test.id?.slice(-6)}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {test.attempts} Attempts</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(test.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDetailsTest(test);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#3AB000] hover:bg-[#e8f5e2] rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTest(test);
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDetailsModal && detailsTest && (
        <DetailsModal test={detailsTest} onClose={() => setShowDetailsModal(false)} />
      )}

      {showModal && (
        <TestModal
          editingTest={editingTest}
          questionBank={questionBank}
          titleOptions={titleOptions}
          postings={postings}
          onClose={() => {
            setShowModal(false);
            setEditingTest(null);
          }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}
