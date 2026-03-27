import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { createPaperAPI, jobPostingsAPI, questionBankAPI } from "../../utils/api";
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
  Check,
  ArrowRight,
} from "lucide-react";

// ─── Static Mock Data ─────────────────────────────────────────────────────────
const MOCK_TESTS = [
  {
    id: 1,
    title: "Algebra Basics - Unit Test",
    subject: "Mathematics",
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
    subject: "Biology",
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
  {
    id: 3,
    title: "Newton's Laws of Motion",
    subject: "Physics",
    class: "Class 11C",
    type: "Weekly Test",
    difficulty: "Easy",
    totalQuestions: 20,
    totalMarks: 50,
    passingMarks: 20,
    duration: 45,
    status: "draft",
    attempts: 0,
    avgScore: 0,
    description:
      "Weekly assessment covering Newton's three laws and applications.",
    tags: ["physics", "newton", "weekly"],
    startDate: "",
    endDate: "",
    isPublic: false,
    shuffleQuestions: true,
    showResult: true,
    maxAttempts: 3,
    createdDate: "2024-03-10T14:00:00Z",
    pipeline: { currentStage: 0, completedStages: [] },
    questionConfigs: [],
  },
  {
    id: 4,
    title: "Periodic Table & Elements",
    subject: "Chemistry",
    class: "Class 11A",
    type: "Quiz",
    difficulty: "Easy",
    totalQuestions: 15,
    totalMarks: 30,
    passingMarks: 12,
    duration: 20,
    status: "published",
    attempts: 210,
    avgScore: 82,
    description:
      "Quick quiz on periodic table groups, periods and element properties.",
    tags: ["chemistry", "periodic-table", "quiz"],
    startDate: "2024-03-08",
    endDate: "2024-03-22",
    isPublic: true,
    shuffleQuestions: true,
    showResult: true,
    maxAttempts: 0,
    createdDate: "2024-03-07T11:00:00Z",
    pipeline: { currentStage: 3, completedStages: [0, 1, 2] },
    questionConfigs: [],
  },
  {
    id: 5,
    title: "World War II – Causes & Effects",
    subject: "History",
    class: "Class 10B",
    type: "Unit Test",
    difficulty: "Mixed",
    totalQuestions: 30,
    totalMarks: 100,
    passingMarks: 40,
    duration: 60,
    status: "draft",
    attempts: 0,
    avgScore: 0,
    description:
      "In-depth test on the origins, major events and aftermath of World War II.",
    tags: ["history", "wwii", "unit-test"],
    startDate: "",
    endDate: "",
    isPublic: false,
    shuffleQuestions: false,
    showResult: false,
    maxAttempts: 1,
    createdDate: "2024-03-12T08:00:00Z",
    pipeline: { currentStage: 1, completedStages: [0] },
    questionConfigs: [],
  },
  {
    id: 6,
    title: "Computer Networks Basics",
    subject: "Computer Science",
    class: "Class 12A",
    type: "Chapter Test",
    difficulty: "Medium",
    totalQuestions: 22,
    totalMarks: 55,
    passingMarks: 22,
    duration: 50,
    status: "published",
    attempts: 67,
    avgScore: 70,
    description: "Covers OSI model, TCP/IP, network topologies and protocols.",
    tags: ["cs", "networks", "chapter-test"],
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    isPublic: true,
    shuffleQuestions: true,
    showResult: true,
    maxAttempts: 2,
    createdDate: "2024-03-14T10:30:00Z",
    pipeline: { currentStage: 2, completedStages: [0, 1] },
    questionConfigs: [],
  },
];

const MOCK_QUESTION_BANK = [
  {
    id: 1,
    question: "What is the value of x in 2x + 5 = 11?",
    subject: "Mathematics",
    class: "Class 10",
    topic: "Algebra",
    marks: 4,
    difficulty: "Easy",
    options: ["x=2", "x=3", "x=4", "x=5"],
  },
  {
    id: 2,
    question: "Which organelle is called the powerhouse of the cell?",
    subject: "Biology",
    class: "Class 9",
    topic: "Cell Biology",
    marks: 2,
    difficulty: "Easy",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"],
  },
  {
    id: 3,
    question: "State Newton's First Law of Motion.",
    subject: "Physics",
    class: "Class 11",
    topic: "Mechanics",
    marks: 5,
    difficulty: "Medium",
    options: [],
  },
  {
    id: 4,
    question: "What is the atomic number of Carbon?",
    subject: "Chemistry",
    class: "Class 11",
    topic: "Periodic Table",
    marks: 2,
    difficulty: "Easy",
    options: ["6", "8", "12", "14"],
  },
  {
    id: 5,
    question: "When did World War II begin?",
    subject: "History",
    class: "Class 10",
    topic: "Modern History",
    marks: 2,
    difficulty: "Easy",
    options: ["1939", "1941", "1942", "1945"],
  },
  {
    id: 6,
    question: "What does CPU stand for?",
    subject: "Computer Science",
    class: "Class 12",
    topic: "Hardware",
    marks: 1,
    difficulty: "Easy",
    options: [
      "Central Processing Unit",
      "Computer Power Unit",
      "Core Processing Unit",
      "Central Power Unit",
    ],
  },
  {
    id: 7,
    question: "Solve: 3x² - 12 = 0",
    subject: "Mathematics",
    class: "Class 10",
    topic: "Quadratics",
    marks: 4,
    difficulty: "Hard",
    options: ["x=±2", "x=±3", "x=4", "x=±4"],
  },
  {
    id: 8,
    question: "What is the function of the respiratory system?",
    subject: "Biology",
    class: "Class 9",
    topic: "Body Systems",
    marks: 3,
    difficulty: "Medium",
    options: [],
  },
  {
    id: 9,
    question: "Explain the concept of inertia with an example.",
    subject: "Physics",
    class: "Class 11",
    topic: "Mechanics",
    marks: 6,
    difficulty: "Hard",
    options: [],
  },
  {
    id: 10,
    question: "What is Ohm's Law?",
    subject: "Physics",
    class: "Class 11",
    topic: "Electricity",
    marks: 3,
    difficulty: "Medium",
    options: ["V=IR", "V=I/R", "V=I+R", "V=I²R"],
  },
];

// ─── Pipeline Config ──────────────────────────────────────────────────────────
// Default pipeline (5 stages). Users can trim to fewer stages per test.
const ALL_PIPELINE_STAGES = [
  {
    key: "draft",
    label: "Draft Created",
    description: "Test is saved as draft",
    color: "#6b7280",
  },
  {
    key: "review",
    label: "Under Review",
    description: "Content is being reviewed",
    color: "#f59e0b",
  },
  {
    key: "approved",
    label: "Approved",
    description: "Test is approved to publish",
    color: "#3b82f6",
  },
  {
    key: "published",
    label: "Published",
    description: "Test is live for students",
    color: "#3AB000",
  },
  {
    key: "completed",
    label: "Completed",
    description: "Test window has closed",
    color: "#8b5cf6",
  },
];

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "History",
  "Geography",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Mixed"];
const TEST_TYPES = [
  "Practice Test",
  "Mock Exam",
  "Chapter Test",
  "Unit Test",
  "Final Exam",
  "Quiz",
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
  subject: "",
  class: "",
  type: "",
  difficulty: "",
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
  maxAttempts: "1",
  pipelineStageCount: 5,
};

const normalizeTest = (item) => ({
  id: item?._id || item?.id,
  title: String(item?.title || ""),
  subject: String(item?.subject || ""),
  class: String(item?.class || ""),
  type: String(item?.type || ""),
  difficulty: String(item?.difficulty || "Mixed"),
  questionConfigs: Array.isArray(item?.questionConfigs)
    ? item.questionConfigs.map((cfg) => ({
        questionId: String(cfg?.questionId?._id || cfg?.questionId || ""),
        marks: Number(cfg?.marks || 0),
        isCompulsory: Boolean(cfg?.isCompulsory),
      }))
    : [],
  totalQuestions: Number(item?.totalQuestions || 0),
  totalMarks: Number(item?.totalMarks || 0),
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
  maxAttempts:
    item?.maxAttempts === 0 ? 0 : Number(item?.maxAttempts ?? 1),
  createdDate: item?.createdDate || item?.createdAt || new Date().toISOString(),
  rewards: Array.isArray(item?.rewards) ? item.rewards : [],
  pipelineStageCount: Number(item?.pipelineStageCount || 5),
  pipeline: item?.pipeline || { currentStage: 0, completedStages: [] },
});

const normalizeQuestion = (item) => ({
  id: item?._id || item?.id,
  question: String(item?.question || ""),
  subject: String(item?.subject || ""),
  class: String(item?.class || ""),
  topic: String(item?.topic || ""),
  marks: Number(item?.marks || 1),
  difficulty: String(item?.difficulty || ""),
  options: Array.isArray(item?.options) ? item.options : [],
});

const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none";

// ─── Pipeline Badge on Card ───────────────────────────────────────────────────
function PipelineBadge({ pipeline, stageCount = 5 }) {
  const stages = ALL_PIPELINE_STAGES.slice(0, stageCount);
  const current = pipeline?.currentStage ?? 0;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {stages.map((stage, idx) => {
        const done = (pipeline?.completedStages || []).includes(idx);
        const active = idx === current;
        return (
          <React.Fragment key={stage.key}>
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border transition-all ${
                done
                  ? "bg-[#e8f5e2] border-[#3AB000] text-[#2d8a00]"
                  : active
                    ? "border-current text-white"
                    : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
              style={
                active
                  ? { backgroundColor: stage.color, borderColor: stage.color }
                  : {}
              }
              title={stage.description}
            >
              {done ? (
                <Check size={9} />
              ) : active ? (
                <ArrowRight size={9} />
              ) : null}
              {stage.label}
            </div>
            {idx < stages.length - 1 && (
              <ChevronRight size={11} className="text-gray-300 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Pipeline Stage Selector (in modal) ──────────────────────────────────────
function PipelineStageSelector({ stageCount, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Pipeline Stages
        </label>
        <div className="flex items-center gap-2">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`w-8 h-8 rounded text-xs font-bold border transition-colors ${
                stageCount === n
                  ? "bg-[#3AB000] text-white border-[#3AB000]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#3AB000] hover:text-[#3AB000]"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-1">stages</span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-wrap bg-gray-50 border border-gray-200 rounded p-3">
        {ALL_PIPELINE_STAGES.slice(0, stageCount).map((stage, idx) => (
          <React.Fragment key={stage.key}>
            <div
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded border text-xs font-semibold"
              style={{
                backgroundColor: stage.color + "18",
                borderColor: stage.color + "55",
                color: stage.color,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: stage.color }}
              >
                {idx + 1}
              </div>
              <span
                className="text-center leading-tight"
                style={{ fontSize: "10px" }}
              >
                {stage.label}
              </span>
            </div>
            {idx < stageCount - 1 && (
              <ChevronRight
                size={14}
                className="text-gray-300 flex-shrink-0 mb-3"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Pipeline defines how many approval steps this test goes through before
        going live.
      </p>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailsModal({ test, onClose }) {
  const stageCount = test.pipelineStageCount || 5;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        <div
          style={{ backgroundColor: "#3AB000" }}
          className="text-white px-6 py-4 flex items-start justify-between shrink-0"
        >
          <div>
            <h3 className="text-lg font-bold">{test.title}</h3>
            <p className="text-green-100 text-xs mt-0.5">
              {test.subject} · {test.class} · {test.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Pipeline */}
          <div className="bg-white rounded border border-gray-200 px-4 py-3 shadow-sm mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Pipeline Progress
            </p>
            <PipelineBadge pipeline={test.pipeline} stageCount={stageCount} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ["Description", test.description || "—"],
              ["Questions", test.totalQuestions],
              ["Total Marks", test.totalMarks],
              ["Passing Marks", test.passingMarks],
              ["Duration", `${test.duration} min`],
              ["Difficulty", test.difficulty],
              ["Visibility", test.isPublic ? "Public" : "Private"],
              ["Shuffle Questions", test.shuffleQuestions ? "Yes" : "No"],
              ["Show Result", test.showResult ? "Immediately" : "After review"],
              [
                "Max Attempts",
                test.maxAttempts === 0 ? "Unlimited" : test.maxAttempts,
              ],
              ["Status", test.status === "published" ? "Published" : "Draft"],
              [
                "Created",
                new Date(test.createdDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-white rounded border border-gray-200 px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors"
            style={{ backgroundColor: "#3AB000" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2d8a00")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3AB000")
            }
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Modal ───────────────────────────────────────────────────────
function TestModal({ editingTest, questionBank, titleOptions, onClose, onSave }) {
  const [formData, setFormData] = useState(
    editingTest
      ? {
          title: editingTest.title,
          subject: editingTest.subject,
          class: editingTest.class,
          type: editingTest.type,
          difficulty: editingTest.difficulty,
          questionConfigs: editingTest.questionConfigs || [],
          duration: editingTest.duration.toString(),
          passingMarks: editingTest.passingMarks.toString(),
          description: editingTest.description,
          tags: editingTest.tags.join(", "),
          startDate: editingTest.startDate,
          endDate: editingTest.endDate,
          isPublic: editingTest.isPublic,
          shuffleQuestions: editingTest.shuffleQuestions,
          showResult: editingTest.showResult,
          maxAttempts: editingTest.maxAttempts.toString(),
          pipelineStageCount: editingTest.pipelineStageCount || 5,
        }
      : EMPTY_FORM,
  );
  const [activeTab, setActiveTab] = useState("details");
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [qFilterSubject, setQFilterSubject] = useState("all");
  const [qFilterDifficulty, setQFilterDifficulty] = useState("all");

  const selectedCount = (formData.questionConfigs || []).length;
  const totalMarks = (formData.questionConfigs || []).reduce(
    (s, c) => s + Number(c.marks || 0),
    0,
  );

  // Unique subjects/difficulties from question bank
  const qbSubjects = useMemo(
    () => [...new Set(questionBank.map((q) => q.subject))],
    [questionBank],
  );
  const qbDifficulties = useMemo(
    () => [...new Set(questionBank.map((q) => q.difficulty).filter(Boolean))],
    [questionBank],
  );

  const filteredQB = useMemo(() => {
    const q = questionSearch.trim().toLowerCase();
    return questionBank.filter((item) => {
      const matchSearch =
        !q ||
        [item.question, item.subject, item.class, item.topic].some((f) =>
          String(f || "")
            .toLowerCase()
            .includes(q),
        );
      const matchSubject =
        qFilterSubject === "all" || item.subject === qFilterSubject;
      const matchDiff =
        qFilterDifficulty === "all" || item.difficulty === qFilterDifficulty;
      return matchSearch && matchSubject && matchDiff;
    });
  }, [questionBank, questionSearch, qFilterSubject, qFilterDifficulty]);

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
      !formData.subject ||
      !formData.class ||
      !formData.type ||
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
            {editingTest ? "Edit Test" : "Create New Test"}
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
              { key: "details", label: "Test Details" },
              { key: "settings", label: "Settings" },
              { key: "pipeline", label: "Pipeline" },
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
              {/* Test Title — Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Test Title <span className="text-red-500">*</span>
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInput}
                  className={inputCls}
                >
                  <option value="">Select test title</option>
                  {(Array.isArray(titleOptions) ? titleOptions : []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInput}
                    placeholder="e.g. Biology"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInput}
                    placeholder="e.g. Class 10"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Test Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInput}
                    placeholder="e.g. Mock Exam"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Difficulty
                  </label>
                  <input
                    type="text"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInput}
                    placeholder="Easy / Medium / Hard"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
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
                      setQFilterSubject("all");
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
            </>
          )}

          {/* ── Pipeline Tab ── */}
          {activeTab === "pipeline" && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                  <AlertCircle size={15} /> Configure how many stages this test
                  goes through before going live.
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  You can use a short 2–3 stage flow for quick tests or the full
                  5-stage approval pipeline for formal exams.
                </p>
              </div>
              <PipelineStageSelector
                stageCount={formData.pipelineStageCount}
                onChange={(n) =>
                  setFormData((p) => ({ ...p, pipelineStageCount: n }))
                }
              />
              <div className="bg-white border border-gray-200 rounded p-4 space-y-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                  Stage Descriptions
                </p>
                {ALL_PIPELINE_STAGES.slice(0, formData.pipelineStageCount).map(
                  (stage, idx) => (
                    <div
                      key={stage.key}
                      className="flex items-center gap-3 p-2 rounded border border-gray-100 bg-gray-50"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ backgroundColor: stage.color }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {stage.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
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
                  placeholder="Search question, subject, class..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
                />
              </div>
              {/* Filters row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={13} className="text-gray-400 flex-shrink-0" />
                {/* Subject filter */}
                <select
                  value={qFilterSubject}
                  onChange={(e) => setQFilterSubject(e.target.value)}
                  className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none"
                >
                  <option value="all">All Subjects</option>
                  {qbSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                            #{q.id} · {q.subject} · {q.class} · Default:{" "}
                            {q.marks} marks
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [testsError, setTestsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTest, setDetailsTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const loadTests = async () => {
    setIsLoadingTests(true);
    setTestsError("");
    const response = await createPaperAPI.getAll({ page: 1, limit: 500 });
    if (!response?.success) {
      setTestsError(response?.error || "Failed to load tests.");
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
      const response = await questionBankAPI.getAll({ page: 1, limit: 500 });
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
      const response = await jobPostingsAPI.getAll({ page: 1, limit: 500 });
      if (!response?.success) {
        setTitleOptions([]);
        return;
      }
      const postings = Array.isArray(response?.data?.postings)
        ? response.data.postings
        : [];
      const titles = postings
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
    return tests.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        t.title.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (Array.isArray(t.tags) ? t.tags : []).some((tg) =>
          tg.toLowerCase().includes(q),
        );
      const matchSubject =
        filterSubject === "all" || t.subject === filterSubject;
      const matchType = filterType === "all" || t.type === filterType;
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      return matchSearch && matchSubject && matchType && matchStatus;
    });
  }, [tests, searchQuery, filterSubject, filterType, filterStatus]);

  const isFiltered =
    searchQuery ||
    filterSubject !== "all" ||
    filterType !== "all" ||
    filterStatus !== "all";

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
      pipelineStageCount: formData.pipelineStageCount || 5,
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
      alert(response?.error || "Failed to duplicate test.");
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

  // Advance pipeline stage
  const advancePipeline = async (id) => {
    const currentTest = tests.find((t) => String(t.id) === String(id));
    if (!currentTest) return;
    const stageCount = currentTest.pipelineStageCount || 5;
    const current = currentTest.pipeline?.currentStage ?? 0;
    if (current >= stageCount - 1) return;

    const next = current + 1;
    const nextPipeline = {
      currentStage: next,
      completedStages: [...(currentTest.pipeline?.completedStages || []), current],
    };

    const response = await createPaperAPI.update(id, { pipeline: nextPipeline });
    if (!response?.success) {
      alert(response?.error || "Failed to update pipeline.");
      return;
    }

    setTests((p) =>
      p.map((t) =>
        String(t.id) === String(id) ? { ...t, pipeline: nextPipeline } : t,
      ),
    );
  };

  const handleExport = () => {
    const rows = [
      [
        "Title",
        "Subject",
        "Class",
        "Type",
        "Difficulty",
        "Questions",
        "Marks",
        "Duration",
        "Status",
        "Attempts",
        "Avg Score",
      ],
      ...filtered.map((t) => [
        t.title,
        t.subject,
        t.class,
        t.type,
        t.difficulty,
        t.totalQuestions,
        t.totalMarks,
        t.duration,
        t.status,
        t.attempts,
        t.avgScore,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([rows], { type: "text/csv" })),
      download: `tests-${new Date().toISOString().split("T")[0]}.csv`,
    });
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white ml-0 p-0 md:ml-6 px-2 md:px-0">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Tests", value: stats.total, icon: ClipboardList },
            { label: "Published", value: stats.published, icon: CheckCircle },
            { label: "Draft", value: stats.draft, icon: Edit },
            {
              label: "Total Attempts",
              value: stats.attempts.toLocaleString(),
              icon: Users,
            },
          ].map(({ label, value, icon }) => {
            const StatIcon = icon;
            return (
              <div
                key={label}
                className="bg-white rounded border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {value}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded"
                    style={{ backgroundColor: "#e8f5e2" }}
                  >
                    <StatIcon size={22} style={{ color: "#3AB000" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Top Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
            <div className="flex items-center gap-0 border border-gray-300 rounded overflow-hidden flex-shrink-0 w-full sm:w-auto">
              {["all", "published", "draft"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors whitespace-nowrap"
                  style={
                    filterStatus === tab
                      ? { backgroundColor: "#3AB000", color: "#fff" }
                      : { backgroundColor: "#fff", color: "#4b5563" }
                  }
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[420px]">
              <input
                type="text"
                placeholder="Search tests, subjects, tags…"
                className="flex-1 px-3 text-sm text-gray-700 focus:outline-none h-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="text-white text-sm px-4 h-full font-medium transition-colors whitespace-nowrap"
                style={{ backgroundColor: "#3AB000" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d8a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3AB000")
                }
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="bg-black hover:bg-[#3AB000] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={() => {
                setEditingTest(null);
                setShowModal(true);
              }}
              className="text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-sm transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center"
              style={{ backgroundColor: "#3AB000" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2d8a00")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#3AB000")
              }
            >
              <Plus size={16} /> Create Test
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none"
          >
            <option value="all">All Types</option>
            {TEST_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {isFiltered && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterSubject("all");
                setFilterType("all");
                setFilterStatus("all");
              }}
              className="text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: "#3AB000" }}
            >
              <X size={12} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{tests.length}</span>{" "}
            tests
          </span>
        </div>

        {/* ── Test Cards ── */}
        <div className="space-y-4">
          {isLoadingTests ? (
            <div className="bg-white rounded border border-gray-200 p-12 text-center text-gray-600">
              Loading tests...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded border border-gray-200 p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded flex items-center justify-center mx-auto mb-3">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No Tests Found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting your filters or create a new test.
              </p>
              <button
                onClick={() => {
                  setEditingTest(null);
                  setShowModal(true);
                }}
                className="px-5 py-2 text-white rounded text-sm font-bold inline-flex items-center gap-2 transition-colors"
                style={{ backgroundColor: "#3AB000" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d8a00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3AB000")
                }
              >
                <Plus size={15} /> Create Test
              </button>
            </div>
          ) : (
            filtered.map((test) => {
              const stageCount = test.pipelineStageCount || 5;
              const currentStage = test.pipeline?.currentStage ?? 0;
              const currentStageMeta = ALL_PIPELINE_STAGES[currentStage];
              const canAdvance = currentStage < stageCount - 1;
              return (
                <div
                  key={test.id}
                  className="bg-white rounded border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div
                    style={{ backgroundColor: "#3AB000" }}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle
                        className="text-green-200 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h3 className="text-white font-bold text-sm leading-tight">
                          {test.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-green-100 text-xs">
                            {test.subject}
                          </span>
                          <span className="text-green-300 text-xs">·</span>
                          <span className="text-green-100 text-xs">
                            {test.class}
                          </span>
                          <span className="text-green-300 text-xs">·</span>
                          <span className="text-green-100 text-xs">
                            {test.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(test.id)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${test.status === "published" ? "bg-[#e8f5e2] text-[#2d8a00]" : "bg-gray-100 text-gray-600"}`}
                      >
                        {test.status === "published"
                          ? "● Published"
                          : "○ Draft"}
                      </button>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${DIFF_STYLES[test.difficulty] || "bg-gray-100 text-gray-600"}`}
                      >
                        {test.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        {
                          icon: BookOpen,
                          label: "Questions",
                          value: test.totalQuestions,
                        },
                        {
                          icon: BarChart3,
                          label: "Marks",
                          value: test.totalMarks,
                        },
                        {
                          icon: Clock,
                          label: "Duration",
                          value: `${test.duration} min`,
                        },
                        {
                          icon: Users,
                          label: "Attempts",
                          value: test.attempts,
                        },
                      ].map(({ icon, label, value }) => {
                        const StatIcon = icon;
                        return (
                          <div
                            key={label}
                            className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2 border border-gray-100"
                          >
                            <div
                              className="p-1.5 rounded"
                              style={{ backgroundColor: "#e8f5e2" }}
                            >
                              <StatIcon size={14} style={{ color: "#3AB000" }} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                {label}
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {value}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pipeline */}
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                          Pipeline
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold text-white"
                            style={{
                              backgroundColor:
                                currentStageMeta?.color || "#6b7280",
                            }}
                          >
                            {currentStageMeta?.label}
                          </span>
                          {canAdvance && (
                            <button
                              onClick={() => advancePipeline(test.id)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-white hover:border-[#3AB000] hover:text-[#3AB000] transition-colors"
                            >
                              <ArrowRight size={11} /> Advance
                            </button>
                          )}
                        </div>
                      </div>
                      <PipelineBadge
                        pipeline={test.pipeline}
                        stageCount={stageCount}
                      />
                    </div>

                    {/* Avg score bar */}
                    {test.status === "published" && test.attempts > 0 && (
                      <div className="bg-[#e8f5e2] border border-[#c5e8a0] rounded p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#2d8a00] font-semibold uppercase tracking-wide">
                            Average Score
                          </span>
                          <span className="text-sm font-bold text-[#2d8a00]">
                            {test.avgScore}%
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 border border-[#c5e8a0]">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${test.avgScore}%`,
                              backgroundColor: "#3AB000",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tags + meta */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
                      {test.tags.map((tg, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded"
                        >
                          <Tag size={10} />
                          {tg}
                        </span>
                      ))}
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(test.createdDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                      {test.isPublic ? (
                        <span className="flex items-center gap-1 text-[#3AB000]">
                          <Globe size={11} />
                          Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Lock size={11} />
                          Private
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDetailsTest(test);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 px-4 py-2 text-white rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                        style={{ backgroundColor: "#3AB000" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2d8a00")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3AB000")
                        }
                      >
                        <Eye size={15} /> View Details
                      </button>
                      <button
                        onClick={() => {
                          setEditingTest(test);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-[#e8f5e2] rounded transition-colors text-[#3AB000]"
                        title="Edit"
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(test)}
                        className="p-2 hover:bg-blue-50 rounded transition-colors text-blue-600"
                        title="Duplicate"
                      >
                        <Copy size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {testsError && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {testsError}
            </div>
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="mt-6 bg-white rounded border border-gray-200 p-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {tests.length}
              </span>{" "}
              tests
            </span>
            <span className="text-gray-400 text-xs">
              Click status badge to toggle publish state · Click Advance to move
              pipeline
            </span>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && detailsTest && (
        <DetailsModal
          test={detailsTest}
          onClose={() => {
            setShowDetailsModal(false);
            setDetailsTest(null);
          }}
        />
      )}
      {showModal && (
        <TestModal
          editingTest={editingTest}
          questionBank={questionBank}
          titleOptions={titleOptions}
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
