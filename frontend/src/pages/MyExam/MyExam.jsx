import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Languages,
  Monitor,
  PlayCircle,
  Trophy,
  XCircle,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { createPaperAPI } from "../../utils/api";

// ─── Static Mock Data ────────────────────────────────────────────────────────
const MOCK_EXAMS = [
  {
    id: "exam-001",
    title: "Mathematics Final Exam",
    class: "Class 10",
    type: "Final",
    duration: 60,
    windowStatus: "active",
    canStart: true,
    attemptsUsed: 0,
    maxAttempts: 1,
    startDate: "2025-03-25",
    endDate: "2025-03-28",
    questions: [
      {
        id: "q1",
        question: "What is the value of √144?",
        options: ["10", "11", "12", "13"],
      },
      {
        id: "q2",
        question: "Solve: 3x + 5 = 20. What is x?",
        options: ["3", "4", "5", "6"],
      },
      {
        id: "q3",
        question: "What is the area of a circle with radius 7 cm? (π = 22/7)",
        options: ["144 cm²", "154 cm²", "164 cm²", "174 cm²"],
      },
      {
        id: "q4",
        question: "Which of the following is a prime number?",
        options: ["21", "27", "29", "33"],
      },
      {
        id: "q5",
        question: "What is the LCM of 12 and 18?",
        options: ["24", "30", "36", "48"],
      },
    ],
  },
  {
    id: "exam-002",
    title: "Science Mid-Term",
    class: "Class 9",
    type: "Mid-Term",
    duration: 45,
    windowStatus: "active",
    canStart: false,
    attemptsUsed: 1,
    maxAttempts: 1,
    startDate: "2025-03-24",
    endDate: "2025-03-27",
    questions: [
      {
        id: "s1",
        question: "What is the chemical formula of water?",
        options: ["H2O", "CO2", "O2", "H2SO4"],
      },
      {
        id: "s2",
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mercury", "Mars"],
      },
    ],
  },
  {
    id: "exam-003",
    title: "English Literature Quiz",
    class: "Class 11",
    type: "Quiz",
    duration: 30,
    windowStatus: "upcoming",
    canStart: false,
    attemptsUsed: 0,
    maxAttempts: 1,
    startDate: "2025-04-01",
    endDate: "2025-04-03",
    questions: [
      {
        id: "e1",
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Mark Twain",
          "Jane Austen",
        ],
      },
    ],
  },
  {
    id: "exam-004",
    title: "History Annual Exam",
    class: "Class 8",
    type: "Annual",
    duration: 90,
    windowStatus: "ended",
    canStart: false,
    attemptsUsed: 1,
    maxAttempts: 1,
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    questions: [
      {
        id: "h1",
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
      },
    ],
  },
];

// ─── Static API Simulators ────────────────────────────────────────────────────
const getStudentRewardAwardExams = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_EXAMS), 500));
};

const submitStudentRewardAwardAttempt = async (examId, payload) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log("Mock submit:", examId, payload);
      resolve({ success: true });
    }, 800),
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const STEP = {
  list: "list",
  instructions: "instructions",
  running: "running",
  submitted: "submitted",
  review: "review",
  result: "result",
};

export default function MyExam() {
  const [step, setStep] = useState(STEP.list);
  const [examRows, setExamRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [submittingAttempt, setSubmittingAttempt] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [examLanguage, setExamLanguage] = useState("en"); // "en" or "hi"

  const translations = {
    en: {
      instructions: "Instructions",
      totalQuestions: "Total Questions",
      duration: "Duration",
      minutes: "Minutes",
      stableInternet: "Ensure a stable internet connection.",
      noRefresh: "Do not refresh the page during the exam.",
      autoSubmit: "Exam will auto-submit when time expires.",
      selectLanguage: "Select Exam Language / परीक्षा की भाषा चुनें",
      defaultLang: "Default language",
      hindiMedium: "Hindi medium",
      back: "Back",
      startExam: "Start Exam",
      alreadyAttempted: "You have already attempted this exam once. Re-attempt is not allowed.",
      questionNavigator: "Question Navigator",
      questionXofY: (x, y) => `Question ${x} of ${y}`,
      answered: "Answered",
      previous: "Previous",
      next: "Next",
      endSubmit: "End & Submit",
      submitting: "Submitting...",
      noQuestions: "No questions available for this exam.",
      myExam: "My Exam",
      manageExams: "Manage your assigned exams, view schedules, and start your assessments.",
      activeExams: "Active Exams",
      upcomingExams: "Upcoming Exams",
      history: "History",
      noActiveExams: "No active exam in current start/end date.",
      noUpcomingExams: "No upcoming exams.",
      noHistory: "No exam history found.",
      questionsCount: "Questions",
      attempts: "Attempts",
      start: "Start",
      end: "End",
      review: "Review",
      result: "Result",
      examClosed: "Exam Closed",
      examPeriodExpired: "Exam Period Expired",
      attempted: "Attempted",
      notAttempted: "Not Attempted",
      startsAt: "Starts at",
      endedOn: "Ended on",
      attemptedOn: "Attempted on",
      score: "Your Score",
      status: "Status",
      pass: "PASS",
      fail: "FAIL",
      resultPending: "Result Pending",
      examResult: "Exam Result",
      scheduledFor: "Scheduled For",
      resultTBA: (date) => `Results will be declared on ${date}.`,
      close: "Close",
      examSubmitted: "Exam Submitted!",
      examRecorded: "Your exam attempt has been successfully recorded. Results will be available soon.",
      backToDashboard: "Back to Dashboard",
      finishedReview: "Finished Review",
      reviewTitle: (title) => `Review: ${title}`,
      reviewSubtitle: "Check your submitted answers. Correct answers are not shown.",
      correct: "Correct",
      incorrect: "Incorrect",
      notAttemptedUpper: "NOT ATTEMPTED",
      backToList: "Back to List",
    },
    hi: {
      instructions: "निर्देश",
      totalQuestions: "कुल प्रश्न",
      duration: "अवधि",
      minutes: "मिनट",
      stableInternet: "एक स्थिर इंटरनेट कनेक्शन सुनिश्चित करें।",
      noRefresh: "परीक्षा के दौरान पेज को रिफ्रेश न करें।",
      autoSubmit: "समय समाप्त होने पर परीक्षा स्वतः सबमिट हो जाएगी।",
      selectLanguage: "परीक्षा की भाषा चुनें / Select Exam Language",
      defaultLang: "डिफ़ॉल्ट भाषा",
      hindiMedium: "हिंदी माध्यम",
      back: "पीछे",
      startExam: "परीक्षा शुरू करें",
      alreadyAttempted: "आप पहले ही इस परीक्षा का प्रयास कर चुके हैं। पुनः प्रयास की अनुमति नहीं है।",
      questionNavigator: "प्रश्न नेविगेटर",
      questionXofY: (x, y) => `प्रश्न ${x} का ${y}`,
      answered: "उत्तर दिया",
      previous: "पिछला",
      next: "अगला",
      endSubmit: "समाप्त और सबमिट करें",
      submitting: "सबमिट हो रहा है...",
      noQuestions: "इस परीक्षा के लिए कोई प्रश्न उपलब्ध नहीं हैं।",
      myExam: "मेरी परीक्षा",
      manageExams: "अपने असाइन किए गए एग्जाम प्रबंधित करें, शेड्यूल देखें और मूल्यांकन शुरू करें।",
      activeExams: "सक्रिय परीक्षाएं",
      upcomingExams: "आगामी परीक्षाएं",
      history: "इतिहास",
      noActiveExams: "वर्तमान तिथि में कोई सक्रिय परीक्षा नहीं है।",
      noUpcomingExams: "कोई आगामी परीक्षा नहीं है।",
      noHistory: "कोई परीक्षा इतिहास नहीं मिला।",
      questionsCount: "प्रश्न",
      attempts: "प्रयास",
      start: "शुरू",
      end: "समाप्त",
      review: "समीक्षा",
      result: "परिणाम",
      examClosed: "परीक्षा बंद",
      examPeriodExpired: "परीक्षा अवधि समाप्त",
      attempted: "प्रयास किया",
      notAttempted: "प्रयास नहीं किया",
      startsAt: "शुरू होता है",
      endedOn: "समाप्त हुआ",
      attemptedOn: "प्रयास किया गया",
      score: "आपका स्कोर",
      status: "स्थिति",
      pass: "उत्तीर्ण",
      fail: "अनुत्तीर्ण",
      resultPending: "परिणाम लंबित",
      examResult: "परीक्षा परिणाम",
      scheduledFor: "निर्धारित तिथि",
      resultTBA: (date) => `परिणाम ${date} को घोषित किए जाएंगे।`,
      close: "बंद करें",
      examSubmitted: "परीक्षा सबमिट हो गई!",
      examRecorded: "आपका परीक्षा प्रयास सफलतापूर्वक रिकॉर्ड कर लिया गया है। परिणाम जल्द ही उपलब्ध होंगे।",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      finishedReview: "समीक्षा समाप्त",
      reviewTitle: (title) => `समीक्षा: ${title}`,
      reviewSubtitle: "अपने सबमिट किए गए उत्तरों की जाँच करें। सही उत्तर नहीं दिखाए गए हैं।",
      correct: "सही",
      incorrect: "गलत",
      notAttemptedUpper: "प्रयास नहीं किया",
      backToList: "सूची पर वापस जाएं",
    }
  };

  const t = translations[examLanguage] || translations.en;

  const screenStreamRef = useRef(null);

  const handleReview = async (exam) => {
    setLoadingReview(true);
    try {
      const res = await createPaperAPI.getReview(exam.id);
      if (res.success) {
        setReviewData(res.data);
        // Step change logic removed to keep user on same list, but we'll use a local modal state
      } else {
        alert(res.error || "Failed to load review");
      }
    } catch (e) {
      alert("Error loading review: " + e.message);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleResult = (exam) => {
    setSelectedExam(exam);
    setStep(STEP.result);
  };

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : (selectedExam?.questions || []);
  const answeredCount = Object.keys(answers).length;

  // Review Modal Component
  const ReviewModal = ({ data, onClose }) => {
    if (!data) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b flex items-center justify-between bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t.reviewTitle(data.testTitle)}</h2>
              <p className="text-sm text-gray-500">{t.reviewSubtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={examLanguage}
                onChange={(e) => setExamLanguage(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#3AB000] outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {data.review.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t.questionXofY(idx + 1, data.review.length)}
                  </span>
                  {q.userAnswerIndex !== undefined ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {q.isCorrect ? t.correct : t.incorrect}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500">
                      {t.notAttemptedUpper}
                    </span>
                  )}
                </div>
                <p className="text-gray-800 font-semibold mb-4 text-sm leading-relaxed">
                  {examLanguage === "hi" && q.questionHi ? q.questionHi : q.question}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(examLanguage === "hi" && q.optionsHi?.length === q.options.length 
                    ? q.optionsHi 
                    : q.options
                  ).map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        q.userAnswerIndex === optIdx
                          ? q.isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-gray-100 bg-gray-50/50 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold opacity-50">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </span>
                      {q.userAnswerIndex === optIdx && (
                        q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <XCircle className="w-3.5 h-3.5 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#3AB000] text-white rounded-lg font-bold hover:bg-[#2d8a00] transition shadow-md text-sm"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const activeExams = useMemo(
    () => examRows.filter((exam) => exam.windowStatus === "active" && exam.attemptsUsed < exam.maxAttempts),
    [examRows],
  );
  const upcomingExams = useMemo(
    () => examRows.filter((exam) => exam.windowStatus === "upcoming"),
    [examRows],
  );
  const historyExams = useMemo(
    () => {
      const filtered = examRows.filter((exam) => exam.windowStatus === "ended" || (exam.windowStatus === "active" && exam.attemptsUsed >= exam.maxAttempts));
      return [...filtered].sort((a, b) => {
        const dateA = a.userAttempt?.createdAt || a.endDate || 0;
        const dateB = b.userAttempt?.createdAt || b.endDate || 0;
        return new Date(dateB) - new Date(dateA);
      });
    },
    [examRows],
  );

  const loadStudentExams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await createPaperAPI.getAssigned();
      if (response.success && response.data) {
        setExamRows(Array.isArray(response.data.tests) ? response.data.tests : []);
      } else {
        setError(response.error || "Failed to load assigned exams");
      }
    } catch (e) {
      setError(e.message || "Failed to load active exams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentExams();
  }, [loadStudentExams]);

  useEffect(() => {
    if (step !== STEP.running) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step !== STEP.running) return;

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Exam is running. You can close this page only after ending exam.";
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [step]);

  useEffect(() => {
    return () => {
      stopMediaAndRecorders();
    };
  }, []);

  const addWarning = (message) => {
    setWarnings((prev) => [
      ...prev,
      { message, time: new Date().toLocaleTimeString() },
    ]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const selectExam = (exam) => {
    if (!exam?.canStart) return;
    setSelectedExam(exam);
    setCurrentQuestion(0);
    setAnswers({});
    setWarnings([]);
    setError("");
    
    // Handle question shuffling if enabled
    if (exam.shuffleQuestions && exam.questions?.length > 0) {
      const shuffled = [...exam.questions].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
    } else {
      setShuffledQuestions([]);
    }
    
    setStep(STEP.instructions);
  };

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(false);
    }
  };

  const stopMediaAndRecorders = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
  };

  const beginExam = async () => {
    if (!selectedExam) return;
    if (!selectedExam.canStart) {
      setError("This exam is already attempted and cannot be started again.");
      setStep(STEP.list);
      return;
    }
    setError("");
    setWarnings([]);

    try {
      // Screen share removed as requested - "normal test or kuch nahi"
      // await requestFullscreen(); // Optional: Keep or remove fullscreen. Keeping it for now as it's standard for tests.
      
      setTimeLeft(Math.max(Number(selectedExam.duration || 60), 1) * 60);
      setStep(STEP.running);
    } catch (e) {
      console.error(e);
      setError("Failed to start the exam. Please try again.");
    }
  };

  const handleSubmitExam = async (auto = false) => {
    if (!selectedExam || submittingAttempt) return;
    setSubmittingAttempt(true);
    try {
      const response = await createPaperAPI.submitAttempt(selectedExam._id || selectedExam.id, {
        answers,
        answeredCount,
        autoSubmitted: auto,
      });

      if (response.success && response.data) {
        setSubmissionResult(response.data);
      }

      stopMediaAndRecorders();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setStep(STEP.submitted);
      await loadStudentExams();
    } catch (e) {
      setError(e.message || "Failed to submit exam attempt.");
    } finally {
      setSubmittingAttempt(false);
    }
  };

  const current = questions[currentQuestion];

  const summaryText = useMemo(() => {
    if (!selectedExam) return "";
    return `${selectedExam.class} · ${selectedExam.type}`;
  }, [selectedExam]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#f0fce8] via-white to-[#e8f5d8] p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-[#c5edaa] shadow-sm p-5 md:p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-[#c5edaa] rounded-xl p-5 shadow-sm animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded mt-4 w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === STEP.list) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {t.myExam}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {t.manageExams}
              </p>
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            {examRows.length === 0 ? (
              <div className="bg-white border rounded-lg p-4 text-gray-600 shadow-sm">
                {t.noQuestions}
              </div>
            ) : (
              <div className="space-y-7">
                {/* Review Modal Rendering */}
                <ReviewModal data={reviewData} onClose={() => setReviewData(null)} />
                
                <div>
                  <h2 className="text-xl font-semibold text-[#2d8a00] mb-3">
                    {t.activeExams}
                  </h2>
                  {activeExams.length === 0 ? (
                    <div className="bg-white border rounded-lg p-4 text-sm text-gray-500 shadow-sm">
                      {t.noActiveExams}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {activeExams.map((exam) => (
                        <div
                          key={exam._id || exam.id}
                          className="bg-white border border-[#c5edaa] rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <p>
                              {t.questionsCount}:{" "}
                              <span className="font-semibold">
                                {exam.questions?.length || 0}
                              </span>{" "}
                              · {t.duration}:{" "}
                              <span className="font-semibold">
                                {exam.duration} {t.minutes}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              {t.attempts}: {exam.attemptsUsed || 0}/{exam.maxAttempts || 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t.start}: {exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "-"} | {t.end}:{" "}
                              {exam.endDate ? new Date(exam.endDate).toLocaleDateString() : "-"}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {exam.canStart ? (
                              <button
                                onClick={() => selectExam(exam)}
                                className="px-5 py-2.5 bg-[#3AB000] text-white rounded-md font-medium hover:bg-[#2d8a00] transition"
                              >
                                {t.startExam}
                              </button>
                            ) : null}
                            
                            {exam.attemptsUsed > 0 && (
                              <>
                                <button
                                  onClick={() => handleReview(exam)}
                                  disabled={loadingReview}
                                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  {loadingReview ? "Loading..." : t.review}
                                </button>
                                <button
                                  onClick={() => handleResult(exam)}
                                  className={`px-5 py-2.5 text-white rounded-md font-medium transition ${
                                    exam.resultDate && new Date() < new Date(exam.resultDate) 
                                      ? "bg-amber-500 hover:bg-amber-600" 
                                      : "bg-purple-600 hover:bg-purple-700"
                                  }`}
                                >
                                  {exam.resultDate && new Date() < new Date(exam.resultDate) ? t.resultPending : t.result}
                                </button>
                              </>
                            )}
                            
                            {!exam.canStart && exam.attemptsUsed === 0 && (
                              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded">
                                {t.examClosed}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-3">
                    {t.upcomingExams}
                  </h2>
                  {upcomingExams.length === 0 ? (
                    <div className="bg-white border rounded-lg p-4 text-sm text-gray-500 shadow-sm">
                      {t.noUpcomingExams}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {upcomingExams.map((exam) => (
                        <div
                          key={exam._id || exam.id}
                          className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                              {t.upcomingExams}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <p>
                              {t.questionsCount}:{" "}
                              <span className="font-semibold">
                                {exam.questions?.length || 0}
                              </span>{" "}
                              · {t.duration}:{" "}
                              <span className="font-semibold">
                                {exam.duration} {t.minutes}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              {t.startsAt}:{" "}
                              <span className="font-semibold text-blue-600">
                                {exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "-"}
                              </span>
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {exam.attemptsUsed > 0 && (
                              <>
                                <button
                                  onClick={() => handleReview(exam)}
                                  disabled={loadingReview}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  {t.review}
                                </button>
                                <button
                                  onClick={() => handleResult(exam)}
                                  className={`px-4 py-2 text-white rounded-md text-sm font-medium transition ${
                                    exam.resultDate && new Date() < new Date(exam.resultDate) 
                                      ? "bg-amber-500 hover:bg-amber-600" 
                                      : "bg-purple-600 hover:bg-purple-700"
                                  }`}
                                >
                                  {exam.resultDate && new Date() < new Date(exam.resultDate) ? t.resultPending : t.result}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-600 mb-3">
                    {t.history}
                  </h2>
                  {historyExams.length === 0 ? (
                    <div className="bg-white border rounded-lg p-4 text-sm text-gray-500 shadow-sm">
                      {t.noHistory}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {historyExams.map((exam) => (
                        <div
                          key={exam._id || exam.id}
                          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              exam.attemptsUsed > 0 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
                            }`}>
                              {exam.attemptsUsed > 0 ? t.attempted : t.notAttempted}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <p>
                              {t.questionsCount}:{" "}
                              <span className="font-semibold">
                                {exam.questions?.length || 0}
                              </span>{" "}
                              · {t.duration}:{" "}
                              <span className="font-semibold">
                                {exam.duration} {t.minutes}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              {exam.windowStatus === "ended" 
                                ? `${t.endedOn}: ${exam.endDate ? new Date(exam.endDate).toLocaleDateString() : "-"}`
                                : `${t.attemptedOn}: ${exam.userAttempt?.createdAt ? new Date(exam.userAttempt.createdAt).toLocaleDateString() : "-"}`
                              }
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {exam.attemptsUsed > 0 ? (
                              <>
                                <button
                                  onClick={() => handleReview(exam)}
                                  disabled={loadingReview}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  {t.review}
                                </button>
                                <button
                                  onClick={() => handleResult(exam)}
                                  className={`px-4 py-2 text-white rounded-md text-sm font-medium transition ${
                                    exam.resultDate && new Date() < new Date(exam.resultDate) 
                                      ? "bg-amber-500 hover:bg-amber-600" 
                                      : "bg-purple-600 hover:bg-purple-700"
                                  }`}
                                >
                                  {exam.resultDate && new Date() < new Date(exam.resultDate) ? t.resultPending : t.result}
                                </button>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded border border-gray-100">
                                {t.examPeriodExpired}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === STEP.review && reviewData) {
    return null; // Logic handled by modal in list view
  }

  if (step === STEP.result && selectedExam) {
    const now = new Date();
    const resultDate = selectedExam.resultDate ? new Date(selectedExam.resultDate) : null;
    const isActuallyAvailable = resultDate ? now >= resultDate : true;

    const resDateStr = resultDate ? resultDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }) : "TBA";

    const score = selectedExam.userAttempt?.score || 0;
    const totalMarks = selectedExam.totalMarks || 100;
    const passingMarks = selectedExam.passingMarks || 0;
    const isPassed = score >= passingMarks;

    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${
              isActuallyAvailable ? (isPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600") : "bg-blue-100 text-blue-600"
            }`}>
              {isActuallyAvailable ? (isPassed ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />) : <Calendar className="w-10 h-10" />}
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {isActuallyAvailable ? t.examResult : t.resultPending}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {selectedExam.title}
            </p>

            {isActuallyAvailable ? (
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.score}</p>
                  <p className="text-4xl font-black text-gray-900">
                    {score}
                    <span className="text-lg text-gray-400 font-bold ml-1">/ {totalMarks}</span>
                  </p>
                </div>
                
                <div className={`rounded-xl p-4 border ${isPassed ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.status}</p>
                  <p className={`text-2xl font-black ${isPassed ? "text-green-600" : "text-red-600"}`}>
                    {isPassed ? t.pass : t.fail}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{t.scheduledFor}</p>
                <p className="text-xl font-black text-blue-900">
                  {resDateStr}
                </p>
                <p className="text-[10px] text-blue-400 mt-2 italic">
                  {t.resultTBA(resDateStr)}
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(STEP.list)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg"
            >
              {t.close}
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === STEP.instructions) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-3xl mx-auto">
          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedExam?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{summaryText}</p>
            
            {selectedExam?.description && (
              <div className="mt-4 text-sm text-gray-600 border-l-4 border-[#3AB000] pl-4 py-1 italic">
                {selectedExam.description}
              </div>
            )}

            <div className="mt-6 p-4 bg-[#f0fce8] border border-[#b5e08a] rounded-lg">
              <p className="text-sm font-semibold text-[#1a5000] mb-2">
                {t.instructions}
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>{t.totalQuestions}: <strong>{selectedExam?.totalQuestions || questions.length}</strong></li>
                <li>{t.duration}: <strong>{selectedExam?.duration} {t.minutes}</strong></li>
                <li>{t.stableInternet}</li>
                <li>{t.noRefresh}</li>
                <li>{t.autoSubmit}</li>
              </ul>
            </div>

            {/* Language Selection */}
            <div className="mt-6">
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Languages size={16} className="text-[#3AB000]" />
                {t.selectLanguage}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setExamLanguage("en")}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    examLanguage === "en"
                      ? "border-[#3AB000] bg-green-50"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl font-black text-gray-900">English</span>
                  <span className="text-xs text-gray-500 font-medium">{t.defaultLang}</span>
                </button>
                <button
                  onClick={() => setExamLanguage("hi")}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    examLanguage === "hi"
                      ? "border-[#3AB000] bg-green-50"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xl font-black text-gray-900">हिंदी</span>
                  <span className="text-xs text-gray-500 font-medium">{t.hindiMedium}</span>
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}
            {selectedExam && !selectedExam.canStart ? (
              <p className="text-sm text-[#2d8a00] mt-3">
                {t.alreadyAttempted}
              </p>
            ) : null}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(STEP.list)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                {t.back}
              </button>
              <button
                onClick={beginExam}
                disabled={!selectedExam?.canStart}
                className={`px-5 py-2 rounded-md ${
                  selectedExam?.canStart
                    ? "bg-[#3AB000] text-white hover:bg-[#2d8a00]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t.startExam}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === STEP.submitted) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-10 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">{t.examSubmitted}</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {t.examRecorded}
            </p>
            <button
              onClick={() => setStep(STEP.list)}
              className="w-full py-4 bg-[#3AB000] text-white rounded-xl font-bold hover:bg-[#2d8a00] transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {t.backToDashboard}
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-[#3AB000] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Monitor size={20} /> {selectedExam?.title}
          </h1>
          <p className="text-sm text-[#d4f5a0]">{summaryText}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-semibold">
            {answeredCount}/{questions.length}
          </div>
          <div className="bg-red-500 px-3 py-2 rounded font-semibold">
            <Clock size={16} className="inline mr-1" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <div className="bg-white text-gray-900 rounded-lg p-3">
            <p className="font-semibold mb-2">{t.questionNavigator}</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`h-9 rounded text-sm font-semibold ${
                    currentQuestion === index
                      ? "bg-[#3AB000] text-white"
                      : answers[q.id] !== undefined
                        ? "bg-[#3AB000] text-white"
                        : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white text-gray-900 rounded-lg p-6">
          {current ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {t.questionXofY(currentQuestion + 1, questions.length)}
                </h2>
                {answers[current.id] !== undefined ? (
                  <span className="text-[#3AB000] text-sm font-semibold flex items-center gap-1">
                    <CheckCircle2 size={16} /> {t.answered}
                  </span>
                ) : null}
              </div>
              <p className="text-base font-medium mb-4">
                {examLanguage === "hi" && current.questionHi ? current.questionHi : current.question}
              </p>
              <div className="space-y-2">
                {(examLanguage === "hi" && current.optionsHi?.length === current.options.length 
                  ? current.optionsHi 
                  : current.options
                ).map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [current.id]: idx }))
                    }
                    className={`w-full text-left p-3 border rounded ${
                      answers[current.id] === idx
                        ? "border-[#3AB000] bg-[#f0fce8]"
                        : "border-gray-200"
                    }`}
                  >
                    <span className="font-semibold mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentQuestion((q) => Math.max(q - 1, 0))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  {t.previous}
                </button>
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={() => handleSubmitExam(false)}
                    disabled={submittingAttempt}
                    className="px-6 py-2 bg-[#2d8a00] text-white rounded hover:bg-[#1f6000] disabled:opacity-60"
                  >
                    {submittingAttempt ? t.submitting : t.endSubmit}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestion((q) =>
                        Math.min(q + 1, questions.length - 1),
                      )
                    }
                    className="px-4 py-2 bg-[#3AB000] text-white rounded hover:bg-[#2d8a00]"
                  >
                    {t.next}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              {t.noQuestions}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
