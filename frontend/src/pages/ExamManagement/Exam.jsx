import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Clock, Eye, Monitor } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { createPaperAPI } from "../../utils/api";

// ─── Static Mock Data ────────────────────────────────────────────────────────
const MOCK_EXAMS = [
  {
    id: "exam-001",
    title: "Mathematics Final Exam",
    subject: "Mathematics",
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
    subject: "Science",
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
    subject: "English",
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
    subject: "History",
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
};

export default function ExamManagement() {
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

  const screenStreamRef = useRef(null);

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : (selectedExam?.questions || []);
  const answeredCount = Object.keys(answers).length;
  const activeExams = useMemo(
    () => examRows.filter((exam) => exam.windowStatus === "active"),
    [examRows],
  );
  const upcomingExams = useMemo(
    () => examRows.filter((exam) => exam.windowStatus === "upcoming"),
    [examRows],
  );
  const endedExams = useMemo(
    () => examRows.filter((exam) => exam.windowStatus === "ended"),
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
    return `${selectedExam.subject} · ${selectedExam.class} · ${selectedExam.type}`;
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
        <div className="min-h-screen bg-gradient-to-br from-[#f0fce8] via-white to-[#e8f5d8] p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-[#c5edaa] shadow-sm p-5 md:p-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Exam Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Start exams based on their scheduled start and end dates.
              </p>
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            {examRows.length === 0 ? (
              <div className="bg-white border rounded-lg p-4 text-gray-600 shadow-sm">
                No exams available right now.
              </div>
            ) : (
              <div className="space-y-7">
                <div>
                  <h2 className="text-xl font-semibold text-[#2d8a00] mb-3">
                    Active Exams
                  </h2>
                  {activeExams.length === 0 ? (
                    <div className="bg-white border rounded-lg p-4 text-sm text-gray-500 shadow-sm">
                      No active exam in current start/end date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {activeExams.map((exam) => (
                        <div
                          key={exam.id}
                          className="bg-white border border-[#c5edaa] rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8fad8] text-[#2d8a00]">
                              Active
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <p>
                              Questions:{" "}
                              <span className="font-semibold">
                                {exam.questions.length}
                              </span>{" "}
                              · Duration:{" "}
                              <span className="font-semibold">
                                {exam.duration} min
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              Attempts: {exam.attemptsUsed}/{exam.maxAttempts}
                            </p>
                            <p className="text-xs text-gray-500">
                              Start: {exam.startDate || "-"} | End:{" "}
                              {exam.endDate || "-"}
                            </p>
                          </div>
                          <button
                            onClick={() => selectExam(exam)}
                            disabled={!exam.canStart}
                            className={`mt-4 px-5 py-2.5 rounded-md font-medium ${
                              exam.canStart
                                ? "bg-[#3AB000] text-white hover:bg-[#2d8a00]"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {exam.canStart ? "Start Exam" : "Already Attempted"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-3">
                    Upcoming Exams
                  </h2>
                  {upcomingExams.length === 0 ? (
                    <div className="bg-white border rounded-lg p-4 text-sm text-gray-500 shadow-sm">
                      No upcoming exams.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {upcomingExams.map((exam) => (
                        <div
                          key={exam.id}
                          className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                              Upcoming
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <p>
                              Questions:{" "}
                              <span className="font-semibold">
                                {exam.questions.length}
                              </span>{" "}
                              · Duration:{" "}
                              <span className="font-semibold">
                                {exam.duration} min
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              Starts at:{" "}
                              <span className="font-semibold text-blue-600">
                                {exam.startDate || "-"}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-500 mb-3">
                    Ended Exams
                  </h2>
                  {endedExams.length === 0 ? (
                    <div className="bg-white border rounded-lg p-4 text-sm text-gray-500 shadow-sm">
                      No ended exams.
                    </div>
                  ) : (                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {endedExams.map((exam) => (
                        <div
                          key={exam.id}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm opacity-70"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {exam.title}
                            </h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                              Ended
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-700 space-y-1">
                            <p>
                              Questions:{" "}
                              <span className="font-semibold">
                                {exam.questions.length}
                              </span>{" "}
                              · Duration:{" "}
                              <span className="font-semibold">
                                {exam.duration} min
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              Ended on: {exam.endDate || "-"}
                            </p>
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

  if (step === STEP.instructions) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-3xl mx-auto">
          <div className="bg-white border rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedExam?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{summaryText}</p>
            <div className="mt-4 p-4 bg-[#f0fce8] border border-[#b5e08a] rounded-lg">
              <p className="text-sm font-semibold text-[#1a5000] mb-2">
                Instructions
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Total Questions: <strong>{selectedExam?.totalQuestions || questions.length}</strong></li>
                <li>Duration: <strong>{selectedExam?.duration} Minutes</strong></li>
                <li>Ensure a stable internet connection.</li>
                <li>Do not refresh the page during the test.</li>
                <li>Test will auto-submit when time expires.</li>
              </ul>
            </div>
            {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}
            {selectedExam && !selectedExam.canStart ? (
              <p className="text-sm text-[#2d8a00] mt-3">
                You have already attempted this exam once. Re-attempt is not
                allowed.
              </p>
            ) : null}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(STEP.list)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Back
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
                Start Exam
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
        <div className="p-6 max-w-3xl mx-auto text-center">
          <div className="bg-white border rounded-xl shadow-lg p-10">
            <div className="flex justify-center mb-6">
              <CheckCircle2 size={80} className="text-[#3AB000]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Exam Submitted!</h2>
            
            <div className="mt-8 p-6 bg-[#f0fce8] border border-[#b5e08a] rounded-xl inline-block min-w-[300px]">
              {submissionResult?.showInstant ? (
                <>
                  <p className="text-gray-600 text-sm mb-2 uppercase tracking-wider font-semibold">Your Score</p>
                  <p className="text-5xl font-bold text-[#2d8a00] mb-2">{submissionResult.score}</p>
                  <p className="text-gray-500 text-sm">Out of {selectedExam?.totalQuestions || questions.length} marks</p>
                </>
              ) : (
                <p className="text-[#2d8a00] font-medium text-lg">
                  {submissionResult?.resultMessage || "Your attempt has been saved successfully."}
                </p>
              )}
            </div>

            <div className="mt-10">
              <button
                onClick={() => {
                  setStep(STEP.list);
                  setSubmissionResult(null);
                }}
                className="px-8 py-3 bg-[#3AB000] text-white rounded-lg font-bold hover:bg-[#2d8a00] transition-all shadow-md hover:shadow-lg"
              >
                Back To Dashboard
              </button>
            </div>
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
            <p className="font-semibold mb-2">Question Navigator</p>
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
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
                {answers[current.id] !== undefined ? (
                  <span className="text-[#3AB000] text-sm font-semibold flex items-center gap-1">
                    <CheckCircle2 size={16} /> Answered
                  </span>
                ) : null}
              </div>
              <p className="text-base font-medium mb-4">{current.question}</p>
              <div className="space-y-2">
                {current.options.map((option, idx) => (
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
                  Previous
                </button>
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={() => handleSubmitExam(false)}
                    disabled={submittingAttempt}
                    className="px-6 py-2 bg-[#2d8a00] text-white rounded hover:bg-[#1f6000] disabled:opacity-60"
                  >
                    {submittingAttempt ? "Submitting..." : "End & Submit"}
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
                    Next
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              No questions available for this exam.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
