// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import DashboardLayout from "../../components/DashboardLayout";
// import {
//   createPaperAPI,
//   jobPostingsAPI,
//   questionBankAPI,
//   applicationsAPI,
// } from "../../utils/api";
// import {
//   ClipboardList,
//   Plus,
//   Search,
//   Download,
//   Eye,
//   Edit,
//   Trash2,
//   Copy,
//   X,
//   Calendar,
//   Clock,
//   Users,
//   BarChart3,
//   CheckCircle,
//   BookOpen,
//   Filter,
//   Tag,
//   Lock,
//   Globe,
//   PlayCircle,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   ChevronUp,
//   AlertCircle,
//   AlertTriangle,
//   Check,
//   ArrowRight,
//   Monitor,
//   HelpCircle,
//   Settings,
// } from "lucide-react";

// // ─── Static Mock Data ─────────────────────────────────────────────────────────
// const MOCK_TESTS = [
//   {
//     id: 1,
//     title: "Algebra Basics - Unit Test",
//     class: "Class 10A",
//     type: "Unit Test",
//     difficulty: "Medium",
//     totalQuestions: 25,
//     totalMarks: 100,
//     passingMarks: 40,
//     duration: 60,
//     status: "published",
//     attempts: 128,
//     avgScore: 74,
//     description:
//       "Covers linear equations, quadratic expressions and basic algebra.",
//     tags: ["algebra", "unit-test", "class10"],
//     startDate: "2024-03-01",
//     endDate: "2024-03-31",
//     mouStartDate: "",
//     mouEndDate: "",
//     isPublic: true,
//     shuffleQuestions: true,
//     showResult: true,
//     maxAttempts: 2,
//     createdDate: "2024-02-20T10:00:00Z",
//     pipeline: { currentStage: 2, completedStages: [0, 1] },
//     questionConfigs: [],
//   },
//   {
//     id: 2,
//     title: "Human Body Systems",
//     class: "Class 9B",
//     type: "Mid Term",
//     difficulty: "Hard",
//     totalQuestions: 40,
//     totalMarks: 80,
//     passingMarks: 32,
//     duration: 90,
//     status: "published",
//     attempts: 95,
//     avgScore: 61,
//     description:
//       "Comprehensive test on digestive, respiratory, and circulatory systems.",
//     tags: ["biology", "mid-term", "body-systems"],
//     startDate: "2024-03-05",
//     endDate: "2024-04-05",
//     mouStartDate: "",
//     mouEndDate: "",
//     isPublic: true,
//     shuffleQuestions: false,
//     showResult: false,
//     maxAttempts: 1,
//     createdDate: "2024-02-25T09:00:00Z",
//     pipeline: { currentStage: 4, completedStages: [0, 1, 2, 3] },
//     questionConfigs: [],
//   },
// ];

// const MOCK_QUESTION_BANK = [
//   {
//     id: 1,
//     question: "What is the value of x in 2x + 5 = 11?",
//     class: "Class 10",
//     topic: "Algebra",
//     marks: 4,
//     difficulty: "Easy",
//     options: ["x=2", "x=3", "x=4", "x=5"],
//   },
// ];

// const TEST_TITLE_OPTIONS = [
//   "Unit Test - Term 1",
//   "Unit Test - Term 2",
//   "Mid Term Examination",
//   "Final Examination",
//   "Weekly Quiz",
//   "Chapter Assessment",
//   "Mock Test",
//   "Practice Test",
//   "Surprise Quiz",
//   "Remedial Test",
// ];

// const DIFF_STYLES = {
//   Easy: "bg-[#e8f5e2] text-[#2d8a00]",
//   Medium: "bg-amber-100 text-amber-700",
//   Hard: "bg-red-100 text-red-600",
//   Mixed: "bg-blue-100 text-blue-700",
// };

// const SUBJECT_OPTIONS = [
//   "General Knowledge",
//   "Mathematics",
//   "Health & Nutrition",
//   "Management & Administration",
//   "Basic Computer Knowledge",
//   "Communication Skills",
//   "Other",
// ];

// const EMPTY_FORM = {
//   title: "",
//   questionConfigs: [],
//   totalQuestions: 0,
//   totalMarks: 0,
//   duration: "",
//   passingMarks: "",
//   description: "",
//   tags: "",
//   startDate: "",
//   endDate: "",
//   mouStartDate: "",
//   mouEndDate: "",
//   isPublic: true,
//   shuffleQuestions: false,
//   showResult: true,
//   resultDate: "",
//   maxAttempts: "1",
//   pipelineStageCount: 5,
// };

// // Application Status filter config
// const normalizeTest = (item) => ({
//   id: item?._id || item?.id,
//   title: String(item?.title || ""),
//   type: String(item?.type || ""),
//   difficulty: String(item?.difficulty || "Mixed"),
//   questionConfigs: Array.isArray(item?.questionConfigs)
//     ? item.questionConfigs.map((cfg) => ({
//         questionId: String(cfg?.questionId?._id || cfg?.questionId || ""),
//         questionText: cfg?.questionId?.question || "",
//         subject: cfg?.questionId?.subject || "General Knowledge",
//         options: cfg?.questionId?.options || [],
//         marks: Number(cfg?.marks || 0),
//         isCompulsory: Boolean(cfg?.isCompulsory),
//       }))
//     : [],
//   totalQuestions: Number(
//     item?.totalQuestions ||
//       (Array.isArray(item?.questionConfigs) ? item.questionConfigs.length : 0),
//   ),
//   totalMarks: Number(
//     item?.totalMarks ||
//       (Array.isArray(item?.questionConfigs)
//         ? item.questionConfigs.reduce((s, c) => s + Number(c.marks || 0), 0)
//         : 0),
//   ),
//   passingMarks: Number(item?.passingMarks || 0),
//   duration: Number(item?.duration || 0),
//   status: item?.status === "published" ? "published" : "draft",
//   attempts: Number(item?.attempts || 0),
//   avgScore: Number(item?.avgScore || 0),
//   description: String(item?.description || ""),
//   tags: Array.isArray(item?.tags) ? item.tags : [],
//   startDate: String(item?.startDate || "").split("T")[0],
//   endDate: String(item?.endDate || "").split("T")[0],
//   mouStartDate: String(item?.mouStartDate || "").split("T")[0],
//   mouEndDate: String(item?.mouEndDate || "").split("T")[0],
//   isPublic: item?.isPublic !== false,
//   shuffleQuestions: Boolean(item?.shuffleQuestions),
//   showResult: item?.showResult !== false,
//   resultDate: item?.resultDate || "",
//   maxAttempts: item?.maxAttempts === 0 ? 0 : Number(item?.maxAttempts ?? 1),
//   assignedStudents: Array.isArray(item?.assignedStudents)
//     ? item.assignedStudents.filter(Boolean).map((s) =>
//         typeof s === "object" ? s : { _id: String(s) },
//       )
//     : [],
//   createdDate: item?.createdDate || item?.createdAt || new Date().toISOString(),
//   rewards: Array.isArray(item?.rewards) ? item.rewards : [],
// });

// const normalizeQuestion = (item) => ({
//   id: item?._id || item?.id,
//   question: String(item?.question || ""),
//   topic: String(item?.topic || ""),
//   subject: String(item?.subject || "General Knowledge"),
//   marks: Number(item?.marks || 1),
//   difficulty: String(item?.difficulty || ""),
//   options: Array.isArray(item?.options) ? item.options : [],
// });

// const inputCls =
//   "w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none";

// const isVacancyOpen = (lastDate) => {
//   if (!lastDate) return true;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const lDate = new Date(lastDate);
//   lDate.setHours(0, 0, 0, 0);
//   return today <= lDate;
// };

// // ─── Selection Progress Bar ───────────────────────────────────────────────────
// function SelectionProgressBar({ selected, total }) {
//   const pct = total > 0 ? Math.round((selected / total) * 100) : 0;
//   const barColor =
//     pct === 100
//       ? "#3AB000"
//       : pct >= 60
//         ? "#f59e0b" // Orange
//         : pct >= 30
//           ? "#3b82f6" // Blue
//           : "#e5e7eb"; // Gray

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           <Users size={18} className="text-[#3AB000]" />
//           <span className="text-sm font-black text-gray-800">
//             Selection Progress
//           </span>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex items-baseline gap-1">
//             <span className="text-2xl font-black text-[#3AB000]">{selected}</span>
//             <span className="text-xs text-gray-400 font-bold">
//               / {total} selected
//             </span>
//           </div>
//           <span
//             className="text-[10px] font-black px-3 py-1 rounded-full"
//             style={{ backgroundColor: `${barColor}20`, color: barColor }}
//           >
//             {pct}%
//           </span>
//         </div>
//       </div>
//       <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//         <div
//           className="h-3 rounded-full transition-all duration-700 ease-out"
//           style={{ width: `${pct}%`, backgroundColor: barColor }}
//         />
//       </div>
//     </div>
//   );
// }

// // ─── Detail View (Inline) ────────────────────────────────────────────────────
// function DetailsView({ test, onBack }) {
//   const assigned = Array.isArray(test.assignedStudents)
//     ? test.assignedStudents
//     : [];
//   const questions = Array.isArray(test.questionConfigs)
//     ? test.questionConfigs
//     : [];
//   const [activeTab, setActiveTab] = useState("students");

//   return (
//     <div className="bg-white rounded-2xl w-full min-h-screen overflow-hidden flex flex-col shadow-sm border border-gray-200">
//       <div className="bg-gradient-to-r from-[#3AB000] to-[#2d8a00] text-white px-8 py-6 shrink-0 relative">
//         <div className="flex justify-between items-start">
//           <div className="space-y-1">
//             <h3 className="text-2xl font-black tracking-tight leading-tight">
//               {test.title}
//             </h3>
//           </div>
//           <button
//             onClick={onBack}
//             className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all font-bold text-sm"
//           >
//             <ArrowRight className="rotate-180" size={18} />
//             Back to List
//           </button>
//         </div>
//       </div>

//       <div className="bg-white border-b border-gray-100 px-8 shrink-0 flex gap-8">
//         {[
//           {
//             id: "students",
//             label: "Assigned Students",
//             icon: Users,
//             count: assigned.length,
//           },
//           {
//             id: "questions",
//             label: "Question Bank",
//             icon: HelpCircle,
//             count: questions.length,
//           },
//           {
//             id: "config",
//             label: "Configuration",
//             icon: Settings,
//             count: null,
//           },
//         ].map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-4 flex items-center gap-2 border-b-2 font-bold text-sm transition-all relative ${
//                 isActive
//                   ? "border-[#3AB000] text-[#3AB000]"
//                   : "border-transparent text-gray-400 hover:text-gray-600"
//               }`}
//             >
//               <Icon size={18} />
//               {tab.label}
//               {tab.count !== null && (
//                 <span
//                   className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-[#3AB000] text-white" : "bg-gray-100 text-gray-500"}`}
//                 >
//                   {tab.count}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
//         {activeTab === "students" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Total Assigned
//                 </p>
//                 <p className="text-3xl font-black text-gray-900">
//                   {assigned.length}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Districts Covered
//                 </p>
//                 <p className="text-3xl font-black text-gray-900">
//                   {
//                     [...new Set(assigned.map((s) => s.district))].filter(
//                       Boolean,
//                     ).length
//                   }
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Contact Rate
//                 </p>
//                 <p className="text-3xl font-black text-gray-900">
//                   {Math.round(
//                     (assigned.filter((s) => s.mobile).length /
//                       (assigned.length || 1)) *
//                       100,
//                   )}
//                   %
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//               {assigned.length === 0 ? (
//                 <div className="py-20 text-center space-y-4">
//                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
//                     <Users size={40} className="text-gray-300" />
//                   </div>
//                   <div>
//                     <p className="text-lg font-bold text-gray-900">
//                       No students assigned
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Assign students from the edit menu to see them here.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50/50 border-b border-gray-100">
//                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                         Candidate Details
//                       </th>
//                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                         Contact & Location
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {assigned.map((s, i) => (
//                       <tr
//                         key={s._id || i}
//                         className="hover:bg-[#f0fce8]/30 transition-colors group"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-4">
//                             <img
//                               src={s.photo || "/placeholder.png"}
//                               alt={s.candidateName}
//                               className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
//                             />
//                             <div>
//                               <p className="text-sm font-bold text-gray-900 group-hover:text-[#3AB000] transition-colors">
//                                 {s.candidateName || "Unknown"}
//                               </p>
//                               <p className="text-[10px] text-gray-400 font-medium italic mt-0.5">
//                                 S/O: {s.fatherName || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-col gap-1">
//                             <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
//                               <Monitor size={12} className="text-gray-400" />{" "}
//                               {s.mobile || "N/A"}
//                             </p>
//                             <p className="text-[10px] text-gray-400 font-medium truncate">
//                               {s.email || "N/A"}
//                             </p>
//                             <p className="text-[10px] text-gray-400 font-medium mt-1">
//                               {s.address}, {s.district}
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "questions" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Total Marks
//                 </p>
//                 <p className="text-3xl font-black text-[#3AB000]">
//                   {test.totalMarks}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Pass Marks
//                 </p>
//                 <p className="text-3xl font-black text-amber-600">
//                   {test.passingMarks}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Difficulty
//                 </p>
//                 <p className="text-xl font-black text-gray-900 uppercase">
//                   {test.difficulty || "Mixed"}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Avg per Q
//                 </p>
//                 <p className="text-3xl font-black text-gray-900">
//                   {Math.round(
//                     (test.totalMarks / (questions.length || 1)) * 10,
//                   ) / 10}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {questions.length === 0 ? (
//                 <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-20 text-center">
//                   <HelpCircle
//                     size={48}
//                     className="mx-auto text-gray-200 mb-4"
//                   />
//                   <p className="text-gray-500 font-bold">
//                     No questions have been added to this paper.
//                   </p>
//                 </div>
//               ) : (
//                 questions.map((q, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-[#3AB000] transition-all"
//                   >
//                     <div className="p-6">
//                       <div className="flex items-start justify-between gap-8">
//                         <div className="flex-1 space-y-4">
//                           <div className="flex items-start gap-4">
//                             <span className="w-8 h-8 rounded-lg bg-[#f0fce8] text-[#3AB000] flex items-center justify-center font-black text-sm shrink-0 border border-[#c5edaa]">
//                               {idx + 1}
//                             </span>
//                             <p className="text-base font-bold text-gray-800 leading-relaxed pt-1">
//                               {q.questionText ||
//                                 "Question content is missing or not populated."}
//                             </p>
//                           </div>
//                           {Array.isArray(q.options) &&
//                             q.options.length > 0 && (
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
//                                 {q.options.map((opt, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 text-sm text-gray-600"
//                                   >
//                                     <span className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-[#3AB000] text-[10px] font-black border border-gray-200 shadow-sm shrink-0 uppercase">
//                                       {String.fromCharCode(65 + i)}
//                                     </span>
//                                     <span className="font-medium">{opt}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                         </div>
//                         <div className="shrink-0 flex flex-col items-end gap-2">
//                           <span
//                             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${q.isCompulsory ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}
//                           >
//                             {q.isCompulsory ? "Compulsory" : "Optional"}
//                           </span>
//                           <span className="px-3 py-1 rounded-full bg-[#f0fce8] text-[#3AB000] text-[10px] font-black uppercase tracking-widest border border-[#c5edaa]">
//                             {q.marks} Points
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === "config" && (
//           <div className="max-w-3xl mx-auto space-y-8">
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50 overflow-hidden">
//               <div className="p-8">
//                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
//                   General Information
//                 </h4>
//                 <div>
//                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
//                     Description
//                   </p>
//                   <p className="text-sm font-bold text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
//                     "
//                     {test.description ||
//                       "No description provided for this event."}
//                     "
//                   </p>
//                 </div>
//               </div>
//               <div className="p-8 grid grid-cols-2 gap-8">
//                 <div>
//                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
//                     Availability
//                   </h4>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
//                         Start Date
//                       </p>
//                       <p className="text-sm font-bold text-gray-800">
//                         {test.startDate
//                           ? new Date(test.startDate).toLocaleString()
//                           : "Immediately"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
//                         End Date
//                       </p>
//                       <p className="text-sm font-bold text-gray-800">
//                         {test.endDate
//                           ? new Date(test.endDate).toLocaleString()
//                           : "Never Expires"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
//                         MOU Start Date
//                       </p>
//                       <p className="text-sm font-bold text-blue-700">
//                         {test.mouStartDate
//                           ? new Date(test.mouStartDate).toLocaleDateString()
//                           : "Not Set"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
//                         MOU End Date
//                       </p>
//                       <p className="text-sm font-bold text-blue-700">
//                         {test.mouEndDate
//                           ? new Date(test.mouEndDate).toLocaleDateString()
//                           : "Not Set"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
//                     Exam Logic
//                   </h4>
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
//                         Duration
//                       </p>
//                       <p className="text-sm font-bold text-gray-800">
//                         {test.duration} Minutes
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
//                         Attempts Limit
//                       </p>
//                       <p className="text-sm font-bold text-gray-800">
//                         {test.maxAttempts === 0
//                           ? "Unlimited"
//                           : `${test.maxAttempts} Attempts`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-8">
//                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
//                   Settings & Status
//                 </h4>
//                 <div className="flex flex-wrap gap-3">
//                   {[
//                     {
//                       label: "Visibility",
//                       val: test.isPublic ? "Public" : "Private",
//                       color: test.isPublic
//                         ? "bg-green-50 text-green-600 border-green-100"
//                         : "bg-blue-50 text-blue-600 border-blue-100",
//                     },
//                     {
//                       label: "Shuffling",
//                       val: test.shuffleQuestions ? "Enabled" : "Disabled",
//                       color: test.shuffleQuestions
//                         ? "bg-purple-50 text-purple-600 border-purple-100"
//                         : "bg-gray-50 text-gray-400 border-gray-100",
//                     },
//                     {
//                       label: "Results",
//                       val: test.showResult ? "Instant" : "Scheduled",
//                       color: "bg-amber-50 text-amber-600 border-amber-100",
//                     },
//                     {
//                       label: "Status",
//                       val: test.status,
//                       color:
//                         test.status === "published"
//                           ? "bg-[#3AB000] text-white"
//                           : "bg-gray-900 text-white",
//                     },
//                   ].map((badge, i) => (
//                     <div
//                       key={i}
//                       className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${badge.color}`}
//                     >
//                       {badge.label}: {badge.val}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="border-t border-gray-100 px-8 py-6 bg-white shrink-0 flex justify-end">
//         <button
//           onClick={onBack}
//           className="px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
//         >
//           Back to List
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Create / Edit View (Inline) ───────────────────────────────────────────────
// function CreateEditView({
//   editingTest,
//   questionBank,
//   titleOptions,
//   postings,
//   onClose,
//   onSave,
// }) {
//   const [formData, setFormData] = useState(() => {
//     if (editingTest) {
//       return {
//         ...EMPTY_FORM,
//         title: editingTest.title || "",
//         questionConfigs: editingTest.questionConfigs || [],
//         assignedStudents: editingTest.assignedStudents || [],
//         duration: (editingTest.duration || "").toString(),
//         passingMarks: (editingTest.passingMarks || "").toString(),
//         description: editingTest.description || "",
//         tags: (editingTest.tags || []).join(", "),
//         startDate: editingTest.startDate || "",
//         endDate: editingTest.endDate || "",
//         mouStartDate: editingTest.mouStartDate || "",
//         mouEndDate: editingTest.mouEndDate || "",
//         isPublic: editingTest.isPublic !== false,
//         shuffleQuestions: Boolean(editingTest.shuffleQuestions),
//         showResult: editingTest.showResult !== false,
//         resultDate: editingTest.resultDate || "",
//         maxAttempts: (editingTest.maxAttempts ?? "1").toString(),
//         totalQuestions: (editingTest.questionConfigs || []).length,
//         totalMarks: (editingTest.questionConfigs || []).reduce(
//           (s, c) => s + Number(c.marks || 0),
//           0,
//         ),
//       };
//     }
//     return { ...EMPTY_FORM, assignedStudents: [], resultDate: "" };
//   });

//   // Keep formData in sync if editingTest changes while modal is open
//   useEffect(() => {
//     if (editingTest) {
//       setFormData((prev) => ({
//         ...prev,
//         title: editingTest.title || prev.title,
//         questionConfigs: editingTest.questionConfigs || prev.questionConfigs,
//         assignedStudents: editingTest.assignedStudents || prev.assignedStudents,
//         duration: (editingTest.duration || prev.duration || "").toString(),
//         passingMarks: (editingTest.passingMarks || prev.passingMarks || "").toString(),
//         description: editingTest.description || prev.description || "",
//         tags: Array.isArray(editingTest.tags) ? editingTest.tags.join(", ") : prev.tags,
//         startDate: editingTest.startDate || prev.startDate || "",
//         endDate: editingTest.endDate || prev.endDate || "",
//         mouStartDate: editingTest.mouStartDate || prev.mouStartDate || "",
//         mouEndDate: editingTest.mouEndDate || prev.mouEndDate || "",
//         isPublic: editingTest.isPublic !== undefined ? editingTest.isPublic : prev.isPublic,
//         shuffleQuestions: editingTest.shuffleQuestions !== undefined ? editingTest.shuffleQuestions : prev.shuffleQuestions,
//         showResult: editingTest.showResult !== undefined ? editingTest.showResult : prev.showResult,
//         resultDate: editingTest.resultDate || prev.resultDate || "",
//         maxAttempts: (editingTest.maxAttempts ?? prev.maxAttempts ?? "1").toString(),
//       }));
//     }
//   }, [editingTest]);
//   const [activeTab, setActiveTab] = useState("details");
//   const [showQuestionPicker, setShowQuestionPicker] = useState(false);
//   const [questionSearch, setQuestionSearch] = useState("");
//   const [qFilterDifficulty, setQFilterDifficulty] = useState("all");
//   const [qFilterSubject, setQFilterSubject] = useState("all");
//   const [applicants, setApplicants] = useState([]);
//   const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
//   const [isSelectingAll, setIsSelectingAll] = useState(false);
//   const [applicantError, setApplicantError] = useState("");
//   const [studentStartDate, setStudentStartDate] = useState("");
//   const [studentEndDate, setStudentEndDate] = useState("");
//   const [localStudentSearch, setLocalStudentSearch] = useState("");
//   const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("");
//   const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
//   const [titleSearch, setTitleSearch] = useState("");
//   const titleDropdownRef = useRef(null);

//   const [qCurrentPage, setQCurrentPage] = useState(1);
//   const Q_PAGE_SIZE = 10;

//   const [sCurrentPage, setSCurrentPage] = useState(1);
//   const [sTotalPages, setSTotalPages] = useState(1);
//   const [sTotalItems, setSTotalItems] = useState(0);
//   const S_PAGE_SIZE = 15;

//   useEffect(() => {
//     setQCurrentPage(1);
//   }, [questionSearch, qFilterDifficulty, qFilterSubject]);
//   useEffect(() => {
//     setSCurrentPage(1);
//   }, [localStudentSearch, studentStartDate, studentEndDate]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         titleDropdownRef.current &&
//         !titleDropdownRef.current.contains(event.target)
//       ) {
//         setIsTitleDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filteredTitles = useMemo(() => {
//     const q = titleSearch.toLowerCase().trim();
//     const filtered = (Array.isArray(titleOptions) ? titleOptions : []).filter(
//       (opt) => opt.toLowerCase().includes(q),
//     );
//     return filtered.sort((a, b) => {
//       const getStatusScore = (title) => {
//         const posting = postings.find((p) => {
//           const titleEn = typeof p.post === "object" ? p.post.en : p.post;
//           const titleHi = typeof p.post === "object" ? p.post.hi : p.post;
//           return (
//             titleEn === title ||
//             titleHi === title ||
//             p.title === title ||
//             p.advtNo === title
//           );
//         });
//         const isOpen = posting ? isVacancyOpen(posting.lastDate) : true;
//         const isActive = posting
//           ? posting.status !== "Inactive" && isOpen
//           : true;
//         return isActive ? 1 : 0;
//       };
//       return getStatusScore(b) - getStatusScore(a);
//     });
//   }, [titleOptions, titleSearch, postings]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedStudentSearch(localStudentSearch);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [localStudentSearch]);

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       if (!formData.title) {
//         setApplicants([]);
//         return;
//       }

//       const posting = postings.find((p) => {
//         const title = String(p?.title || "").trim().toLowerCase();
//         const postEn = String(p?.post?.en || "").trim().toLowerCase();
//         const postHi = String(p?.post?.hi || "").trim().toLowerCase();
//         const advtNo = String(p?.advtNo || "").trim().toLowerCase();
//         let currentTitle = formData.title.trim().toLowerCase();

//         // Handle "Re-Exam: " prefix by stripping it for matching
//         if (currentTitle.startsWith("re-exam: ")) {
//           currentTitle = currentTitle.replace("re-exam: ", "").trim();
//         }

//         return (
//           title === currentTitle ||
//           postEn === currentTitle ||
//           postHi === currentTitle ||
//           advtNo === currentTitle
//         );
//       });

//       const params = {
//         limit: S_PAGE_SIZE,
//         page: sCurrentPage,
//         paymentStatus: "paid",
//         minimal: "true",
//       };

//       if (posting?._id) {
//         params.jobPostingId = posting._id;
//       } else if (formData.title) {
//         // Only search by title if it's NOT in the postings list (manual title)
//         params.search = formData.title;
//       }

//       if (debouncedStudentSearch) {
//         params.search = params.search
//           ? `${params.search} ${debouncedStudentSearch}`
//           : debouncedStudentSearch;
//       }

//       if (studentStartDate) params.startDate = studentStartDate;
//       if (studentEndDate) params.endDate = studentEndDate;

//       setIsLoadingApplicants(true);
//       setApplicantError("");
//       try {
//         console.log("Fetching applicants with params:", params);
//         const res = await applicationsAPI.getAll(params);
//         console.log("Fetch applicants response:", res);
//         if (res?.success) {
//           setApplicants(res.data?.applications || []);
//           setSTotalPages(res.data?.pagination?.pages || 1);
//           setSTotalItems(res.data?.pagination?.total || 0);
//         } else {
//           setApplicants([]);
//           setSTotalPages(1);
//           setSTotalItems(0);
//           setApplicantError(
//             res.error || "No applicants found matching your filters.",
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching applicants:", err);
//         setApplicantError(
//           "Failed to fetch applicants. Database connection timed out.",
//         );
//         setApplicants([]);
//       } finally {
//         setIsLoadingApplicants(false);
//       }
//     };

//     fetchApplicants();
//   }, [
//     formData.title,
//     postings,
//     studentStartDate,
//     studentEndDate,
//     debouncedStudentSearch,
//     sCurrentPage,
//   ]);

//   const toggleStudent = (student) => {
//     const studentId = typeof student === "object" ? student._id : student;
//     setFormData((prev) => {
//       const selected = prev.assignedStudents || [];
//       const exists = selected.some(
//         (s) => (typeof s === "object" ? s._id : s) === studentId,
//       );
//       return {
//         ...prev,
//         assignedStudents: exists
//           ? selected.filter(
//               (s) => (typeof s === "object" ? s._id : s) !== studentId,
//             )
//           : [...selected, student], // Store the whole object if possible for detail display
//       };
//     });
//   };

//   const selectAllAcrossPages = async () => {
//     if (!formData.title) return;
//     setIsSelectingAll(true);
//     try {
//       const posting = postings.find((p) => {
//         const title = String(p?.title || "").trim();
//         const postEn = String(p?.post?.en || "").trim();
//         const postHi = String(p?.post?.hi || "").trim();
//         const advtNo = String(p?.advtNo || "").trim();
//         const currentTitle = formData.title.trim();
//         return (
//           title === currentTitle ||
//           postEn === currentTitle ||
//           postHi === currentTitle ||
//           advtNo === currentTitle
//         );
//       });

//       const params = {
//         limit: 0,
//         paymentStatus: "paid",
//         minimal: "true",
//         search: debouncedStudentSearch,
//       };
//       if (posting?._id) params.jobPostingId = posting._id;
//       if (studentStartDate) params.startDate = studentStartDate;
//       if (studentEndDate) params.endDate = studentEndDate;

//       const res = await applicationsAPI.getAll(params);
//       if (res?.success) {
//         const allIds = (res.data?.applications || []).map((a) => a._id);
//         setFormData((p) => ({ ...p, assignedStudents: allIds }));
//       }
//     } catch (err) {
//       console.error("Select all error:", err);
//     } finally {
//       setIsSelectingAll(false);
//     }
//   };

//   const qbDifficulties = useMemo(
//     () => [...new Set(questionBank.map((q) => q.difficulty).filter(Boolean))],
//     [questionBank],
//   );

//   const filteredQB = useMemo(() => {
//     const q = questionSearch.trim().toLowerCase();
//     return questionBank.filter((item) => {
//       const matchSearch =
//         !q ||
//         [item.question, item.topic].some((f) =>
//           String(f || "")
//             .toLowerCase()
//             .includes(q),
//         );
//       const matchDiff =
//         qFilterDifficulty === "all" || item.difficulty === qFilterDifficulty;
//       const matchSubj =
//         qFilterSubject === "all" || item.subject === qFilterSubject;
//       return matchSearch && matchDiff && matchSubj;
//     });
//   }, [questionBank, questionSearch, qFilterDifficulty, qFilterSubject]);

//   const paginatedQB = useMemo(() => {
//     const startIndex = (qCurrentPage - 1) * Q_PAGE_SIZE;
//     return filteredQB.slice(startIndex, startIndex + Q_PAGE_SIZE);
//   }, [filteredQB, qCurrentPage]);

//   const qTotalPages = Math.ceil(filteredQB.length / Q_PAGE_SIZE);

//   const handleInput = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((p) => ({
//       ...p,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const toggleQ = (q) => {
//     const qId = String(q.id);
//     setFormData((prev) => {
//       const configs = prev.questionConfigs || [];
//       const exists = configs.some((c) => String(c.questionId) === qId);
//       const newConfigs = exists
//         ? configs.filter((c) => String(c.questionId) !== qId)
//         : [
//             ...configs,
//             {
//               questionId: qId,
//               questionText: q.question,
//               subject: q.subject,
//               marks: Number(q.marks || 1),
//               isCompulsory: false,
//             },
//           ];
//       return {
//         ...prev,
//         questionConfigs: newConfigs,
//         totalQuestions: newConfigs.length,
//         totalMarks: newConfigs.reduce((s, c) => s + Number(c.marks || 0), 0),
//       };
//     });
//   };

//   const updateQConfig = (qId, field, value) => {
//     setFormData((prev) => {
//       const newConfigs = (prev.questionConfigs || []).map((c) =>
//         String(c.questionId) === String(qId) ? { ...c, [field]: value } : c,
//       );
//       return {
//         ...prev,
//         questionConfigs: newConfigs,
//         totalQuestions: newConfigs.length,
//         totalMarks: newConfigs.reduce((s, c) => s + Number(c.marks || 0), 0),
//       };
//     });
//   };

//   const getQConfig = (qId) =>
//     (formData.questionConfigs || []).find(
//       (c) => String(c.questionId) === String(qId),
//     );

//   const handleSubmit = () => {
//     if (!formData.title || !formData.duration) {
//       alert("Please fill in all required fields.");
//       return;
//     }
//     onSave({ ...formData });
//   };

//   return (
//     <div className="bg-white rounded-2xl w-full min-h-screen overflow-hidden flex flex-col shadow-sm border border-gray-200">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#3AB000] to-[#2d8a00] text-white px-8 py-6 shrink-0 relative">
//         <div className="flex justify-between items-start">
//           <div className="space-y-1">
//             <h3 className="text-2xl font-black tracking-tight leading-tight">
//               {editingTest?.id ? "Edit Event" : "Create New Event"}
//             </h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all font-bold text-sm"
//           >
//             <X size={18} />
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white border-b border-gray-100 px-8 shrink-0 flex gap-8">
//         {[
//           { key: "details", label: "Event Details", icon: ClipboardList },
//           { key: "applicants", label: "Select Students", icon: Users },
//           { key: "settings", label: "Settings", icon: Settings },
//         ].filter(tab => {
//           // Hide Select Students tab when creating a re-exam (cloning)
//           if (tab.key === "applicants" && editingTest && !editingTest.id) return false;
//           return true;
//         }).map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.key;
//           return (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`py-4 flex items-center gap-2 border-b-2 font-bold text-sm transition-all relative ${
//                 isActive
//                   ? "border-[#3AB000] text-[#3AB000]"
//                   : "border-transparent text-gray-400 hover:text-gray-600"
//               }`}
//             >
//               <Icon size={18} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* Scrollable body */}
//       <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* ── Details Tab ── */}
//           {activeTab === "details" && (
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
//               <div className="relative" ref={titleDropdownRef}>
//                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
//                   Event Title <span className="text-red-500">*</span>
//                 </label>
//                 <div
//                   className={`${inputCls} flex items-center justify-between cursor-pointer relative ${isTitleDropdownOpen ? "ring-2 ring-[#3AB000] border-[#3AB000]" : ""}`}
//                   onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
//                 >
//                   <span
//                     className={`truncate flex-1 ${!formData.title ? "text-gray-400" : "text-gray-900 font-bold"}`}
//                   >
//                     {formData.title || "Select event title"}
//                   </span>
//                   <ChevronDown
//                     size={18}
//                     className={`text-gray-400 transition-transform ${isTitleDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </div>

//                 {isTitleDropdownOpen && (
//                   <div className="absolute top-full left-0 right-0 z-[100] mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col max-h-[350px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
//                     <div className="p-3 border-b border-gray-100 bg-gray-50 shrink-0">
//                       <div className="relative">
//                         <Search
//                           size={16}
//                           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                         />
//                         <input
//                           type="text"
//                           autoFocus
//                           value={titleSearch}
//                           onChange={(e) => setTitleSearch(e.target.value)}
//                           onClick={(e) => e.stopPropagation()}
//                           placeholder="Search titles..."
//                           className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] outline-none"
//                         />
//                       </div>
//                     </div>
//                     <div className="overflow-y-auto flex-1 py-2">
//                       {filteredTitles.length === 0 ? (
//                         <div className="px-6 py-8 text-sm text-gray-400 text-center italic">
//                           No titles found.
//                         </div>
//                       ) : (
//                         filteredTitles.map((opt) => {
//                           const posting = postings.find((p) => {
//                             const titleEn =
//                               typeof p.post === "object" ? p.post.en : p.post;
//                             const titleHi =
//                               typeof p.post === "object" ? p.post.hi : p.post;
//                             return (
//                               titleEn === opt ||
//                               titleHi === opt ||
//                               p.title === opt ||
//                               p.advtNo === opt
//                             );
//                           });
//                           const isOpen = posting
//                             ? isVacancyOpen(posting.lastDate)
//                             : true;
//                           const isActive = posting
//                             ? posting.status !== "Inactive" && isOpen
//                             : true;
//                           return (
//                             <div
//                               key={opt}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setFormData((p) => ({ ...p, title: opt }));
//                                 setIsTitleDropdownOpen(false);
//                                 setTitleSearch("");
//                               }}
//                               className={`px-6 py-3 text-sm cursor-pointer hover:bg-[#f0fce8] transition-colors ${formData.title === opt ? "bg-[#f0fce8] text-[#3AB000] font-black" : "text-gray-700"}`}
//                             >
//                               <div className="flex items-center justify-between gap-4">
//                                 <p className="truncate flex-1">{opt}</p>
//                                 <span
//                                   className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}
//                                 >
//                                   {isActive ? "Active" : "Inactive"}
//                                 </span>
//                               </div>
//                             </div>
//                           );
//                         })
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
//                     Questions
//                   </label>
//                   <p className="text-2xl font-black text-[#3AB000]">
//                     {formData.totalQuestions}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
//                     Total Marks
//                   </label>
//                   <p className="text-2xl font-black text-[#3AB000]">
//                     {formData.totalMarks}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                     Duration (Min)
//                   </label>
//                   <input
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleInput}
//                     placeholder="60"
//                     min="1"
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                     Pass Marks
//                   </label>
//                   <input
//                     type="number"
//                     name="passingMarks"
//                     value={formData.passingMarks}
//                     onChange={handleInput}
//                     placeholder="40"
//                     min="0"
//                     className={inputCls}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     Question Selection <span className="text-red-500">*</span>
//                   </label>
//                   <button
//                     onClick={() => {
//                       setShowQuestionPicker(true);
//                       setQuestionSearch("");
//                       setQFilterDifficulty("all");
//                     }}
//                     className="inline-flex items-center gap-2 rounded-lg border border-[#3AB000] bg-[#f0fce8] px-4 py-2 text-xs font-black text-[#3AB000] hover:bg-[#d0edbc] transition-all active:scale-95"
//                   >
//                     <Search size={14} /> Browse Question Bank
//                   </button>
//                 </div>
//                 <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
//                   {formData.questionConfigs.length === 0 ? (
//                     <div className="py-12 text-center bg-gray-50/50">
//                       <HelpCircle
//                         size={32}
//                         className="mx-auto text-gray-300 mb-2"
//                       />
//                       <p className="text-sm font-bold text-gray-400">
//                         No questions selected yet.
//                       </p>
//                     </div>
//                   ) : (
//                     <table className="w-full text-left text-sm border-collapse">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 font-black text-[10px] text-gray-400 uppercase tracking-widest">
//                             Question
//                           </th>
//                           <th className="px-4 py-3 font-black text-[10px] text-gray-400 uppercase tracking-widest w-24">
//                             Marks
//                           </th>
//                           <th className="px-4 py-3 font-black text-[10px] text-gray-400 uppercase tracking-widest w-32 text-center">
//                             Compulsory
//                           </th>
//                           <th className="px-4 py-3 w-16"></th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-100">
//                         {formData.questionConfigs.map((q) => (
//                           <tr key={q.questionId} className="hover:bg-gray-50/50">
//                             <td className="px-4 py-3 font-bold text-gray-700 max-w-xs truncate">
//                               {q.questionText}
//                             </td>
//                             <td className="px-4 py-3">
//                               <input
//                                 type="number"
//                                 value={q.marks}
//                                 onChange={(e) =>
//                                   updateQConfig(
//                                     q.questionId,
//                                     "marks",
//                                     e.target.value,
//                                   )
//                                 }
//                                 className="w-16 px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-[#3AB000] outline-none"
//                               />
//                             </td>
//                             <td className="px-4 py-3 text-center">
//                               <button
//                                 onClick={() =>
//                                   updateQConfig(
//                                     q.questionId,
//                                     "isCompulsory",
//                                     !q.isCompulsory,
//                                   )
//                                 }
//                                 className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${q.isCompulsory ? "bg-[#3AB000] text-white" : "bg-gray-100 text-gray-400"}`}
//                               >
//                                 {q.isCompulsory ? "Yes" : "No"}
//                               </button>
//                             </td>
//                             <td className="px-4 py-3 text-right">
//                               <button
//                                 onClick={() => toggleQ({ id: q.questionId })}
//                                 className="text-red-400 hover:text-red-600 transition-colors"
//                               >
//                                 <Trash2 size={16} />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                   Event Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInput}
//                   rows="3"
//                   className={`${inputCls} resize-none`}
//                   placeholder="Enter event details, instructions, etc."
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                   Tags (Comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInput}
//                   placeholder="e.g. math, unit-test, class-10"
//                   className={inputCls}
//                 />
//               </div>
//             </div>
//           )}

//           {/* ── Applicants Tab ── */}
//           {activeTab === "applicants" && (
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
//               <SelectionProgressBar
//                 selected={formData.assignedStudents?.length || 0}
//                 total={sTotalItems}
//               />

//               <div className="flex flex-col md:flex-row gap-4 items-end">
//                 <div className="flex-1 space-y-2">
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     Search Candidates
//                   </label>
//                   <div className="relative">
//                     <Search
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                       size={16}
//                     />
//                     <input
//                       type="text"
//                       placeholder="Search by name, mobile, district..."
//                       value={localStudentSearch}
//                       onChange={(e) => setLocalStudentSearch(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB000] outline-none"
//                     />
//                   </div>
//                 </div>
//                 <div className="shrink-0 flex gap-2">
//                   <button
//                     onClick={selectAllAcrossPages}
//                     disabled={isSelectingAll || !formData.title}
//                     className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50"
//                   >
//                     {isSelectingAll ? "Processing..." : "Select All Paid"}
//                   </button>
//                   <button
//                     onClick={() =>
//                       setFormData((p) => ({ ...p, assignedStudents: [] }))
//                     }
//                     className="px-6 py-2.5 border border-red-200 text-red-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all"
//                   >
//                     Clear All
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                     Applied From
//                   </label>
//                   <input
//                     type="date"
//                     value={studentStartDate}
//                     onChange={(e) => setStudentStartDate(e.target.value)}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                     Applied To
//                   </label>
//                   <input
//                     type="date"
//                     value={studentEndDate}
//                     onChange={(e) => setStudentEndDate(e.target.value)}
//                     className={inputCls}
//                   />
//                 </div>
//               </div>

//               <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
//                 {isLoadingApplicants ? (
//                   <div className="py-20 text-center">
//                     <div className="w-10 h-10 border-4 border-[#3AB000]/20 border-t-[#3AB000] rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-sm font-bold text-gray-400">
//                       Loading candidates...
//                     </p>
//                   </div>
//                 ) : applicantError ? (
//                   <div className="py-20 text-center space-y-3">
//                     <AlertCircle size={32} className="mx-auto text-red-300" />
//                     <p className="text-sm font-bold text-red-400">
//                       {applicantError}
//                     </p>
//                   </div>
//                 ) : applicants.length === 0 ? (
//                   <div className="py-20 text-center space-y-3">
//                     <Users size={32} className="mx-auto text-gray-300" />
//                     <p className="text-sm font-bold text-gray-400">
//                       No matching candidates found.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {applicants.map((app) => {
//                       const isSelected = formData.assignedStudents?.some(
//                         (s) => (typeof s === "object" ? s._id : s) === app._id,
//                       );
//                       return (
//                         <div
//                           key={app._id}
//                           onClick={() => toggleStudent(app)}
//                           className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                             isSelected
//                               ? "border-[#3AB000] bg-white shadow-md shadow-[#3AB000]/5"
//                               : "border-transparent bg-white hover:border-gray-200 shadow-sm"
//                           }`}
//                         >
//                           <div
//                             className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-[#3AB000] border-[#3AB000]" : "bg-gray-50 border-gray-200"}`}
//                           >
//                             {isSelected && (
//                               <Check size={14} className="text-white" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-black text-gray-900 truncate">
//                               {app.candidateName}
//                             </p>
//                             <p className="text-[11px] text-gray-500 font-bold mt-0.5">
//                               {app.mobile} · {app.district}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {sTotalPages > 1 && (
//                 <div className="flex items-center justify-between py-4">
//                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     Page {sCurrentPage} of {sTotalPages}
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       disabled={sCurrentPage === 1}
//                       onClick={() => setSCurrentPage((p) => Math.max(1, p - 1))}
//                       className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
//                     >
//                       <ChevronRight size={18} className="rotate-180" />
//                     </button>
//                     <button
//                       disabled={sCurrentPage === sTotalPages}
//                       onClick={() =>
//                         setSCurrentPage((p) => Math.min(sTotalPages, p + 1))
//                       }
//                       className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── Settings Tab ── */}
//           {activeTab === "settings" && (
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-6">
//                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     Exam Schedule
//                   </h4>
//                   <div className="grid grid-cols-1 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={formData.startDate}
//                         onChange={handleInput}
//                         className={inputCls}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         name="endDate"
//                         value={formData.endDate}
//                         onChange={handleInput}
//                         className={inputCls}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6">
//                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                     Exam Logic
//                   </h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-xs font-bold text-gray-700 mb-1.5">
//                         Max Attempts (0 = unlimited)
//                       </label>
//                       <input
//                         type="number"
//                         name="maxAttempts"
//                         value={formData.maxAttempts}
//                         onChange={handleInput}
//                         placeholder="1"
//                         min="0"
//                         className={inputCls}
//                       />
//                     </div>
//                     <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4">
//                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
//                         <BookOpen size={12} /> MOU Details
//                       </p>
//                       <div className="grid grid-cols-1 gap-3">
//                         <div>
//                           <label className="block text-[10px] font-bold text-blue-700 mb-1">
//                             MOU Start
//                           </label>
//                           <input
//                             type="date"
//                             name="mouStartDate"
//                             value={formData.mouStartDate}
//                             onChange={handleInput}
//                             className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-blue-700 mb-1">
//                             MOU End
//                           </label>
//                           <input
//                             type="date"
//                             name="mouEndDate"
//                             value={formData.mouEndDate}
//                             onChange={handleInput}
//                             className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 pt-6 border-t border-gray-100">
//                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                   Preferences
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     [
//                       "isPublic",
//                       "Public Visibility",
//                       "Allow all students to join",
//                     ],
//                     [
//                       "shuffleQuestions",
//                       "Shuffle Questions",
//                       "Randomize for every attempt",
//                     ],
//                     [
//                       "showResult",
//                       "Instant Results",
//                       "Show score after submission",
//                     ],
//                   ].map(([name, label, sub]) => (
//                     <div
//                       key={name}
//                       onClick={() =>
//                         setFormData((p) => ({ ...p, [name]: !p[name] }))
//                       }
//                       className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData[name] ? "border-[#3AB000] bg-[#f0fce8]/30" : "border-gray-100 bg-white hover:border-gray-200"}`}
//                     >
//                       <div>
//                         <p className="text-sm font-black text-gray-900">
//                           {label}
//                         </p>
//                         <p className="text-[10px] text-gray-500 font-bold">
//                           {sub}
//                         </p>
//                       </div>
//                       <div
//                         className={`w-10 h-6 rounded-full relative transition-all ${formData[name] ? "bg-[#3AB000]" : "bg-gray-200"}`}
//                       >
//                         <div
//                           className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData[name] ? "left-5" : "left-1"}`}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {!formData.showResult && (
//                 <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
//                   <label className="block text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
//                     <Calendar size={14} /> Result Declaration Date
//                   </label>
//                   <input
//                     type="date"
//                     name="resultDate"
//                     value={formData.resultDate}
//                     onChange={handleInput}
//                     className="w-full px-4 py-2.5 border border-amber-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[#3AB000]"
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t border-gray-100 px-8 py-6 bg-white shrink-0 flex justify-end gap-4">
//         <button
//           onClick={onClose}
//           className="px-10 py-3 border border-gray-300 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-400 active:scale-95"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="px-12 py-3 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-[#3AB000]/20 active:scale-95 bg-gray-900 hover:bg-black"
//         >
//           {editingTest ? "Update Event" : "Create Event"}
//         </button>
//       </div>

//       {/* Question Picker (Modal because it's a sub-selection tool) */}
//       {showQuestionPicker && (
//         <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
//             <div className="bg-gray-900 text-white px-8 py-6 flex justify-between items-center">
//               <div>
//                 <h4 className="text-xl font-black tracking-tight">
//                   Question Bank
//                 </h4>
//                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
//                   Selected: {formData.totalQuestions} · Total Marks:{" "}
//                   {formData.totalMarks}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowQuestionPicker(false)}
//                 className="p-2 hover:bg-white/10 rounded-lg transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 bg-white border-b border-gray-100 space-y-4">
//               <div className="relative">
//                 <Search
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search questions by content or topic..."
//                   value={questionSearch}
//                   onChange={(e) => setQuestionSearch(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#3AB000] outline-none"
//                 />
//               </div>
//               <div className="flex gap-4">
//                 <select
//                   value={qFilterSubject}
//                   onChange={(e) => setQFilterSubject(e.target.value)}
//                   className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none"
//                 >
//                   <option value="all">All Subjects</option>
//                   {SUBJECT_OPTIONS.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={qFilterDifficulty}
//                   onChange={(e) => setQFilterDifficulty(e.target.value)}
//                   className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none"
//                 >
//                   <option value="all">All Difficulties</option>
//                   {qbDifficulties.map((d) => (
//                     <option key={d} value={d}>
//                       {d}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
//               {paginatedQB.map((q) => {
//                 const isSelected = getQConfig(q.id);
//                 return (
//                   <div
//                     key={q.id}
//                     className={`bg-white p-6 rounded-xl border-2 transition-all ${isSelected ? "border-[#3AB000] shadow-md shadow-[#3AB000]/5" : "border-transparent hover:border-gray-200"}`}
//                   >
//                     <div className="flex items-start justify-between gap-6">
//                       <div className="flex-1 space-y-3">
//                         <div className="flex items-center gap-2">
//                           <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
//                             {q.subject}
//                           </span>
//                           <span
//                             className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${q.difficulty === "Easy" ? "bg-green-50 text-green-600" : q.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}
//                           >
//                             {q.difficulty}
//                           </span>
//                         </div>
//                         <p className="text-sm font-bold text-gray-800 leading-relaxed">
//                           {q.question}
//                         </p>
//                         {q.options?.length > 0 && (
//                           <div className="flex flex-wrap gap-2">
//                             {q.options.map((opt, i) => (
//                               <span
//                                 key={i}
//                                 className="px-3 py-1 bg-gray-50 rounded-lg text-[11px] text-gray-500 border border-gray-100"
//                               >
//                                 {opt}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex flex-col items-end gap-3">
//                         <div className="flex items-center gap-2">
//                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                             Marks:
//                           </span>
//                           {isSelected ? (
//                             <input
//                               type="number"
//                               min="0"
//                               value={isSelected.marks}
//                               onChange={(e) => updateQConfig(q.id, "marks", Number(e.target.value))}
//                               className="w-16 px-2 py-1 bg-white border border-[#3AB000] rounded-lg text-xs font-bold focus:ring-2 focus:ring-[#3AB000] outline-none shadow-sm shadow-[#3AB000]/10"
//                             />
//                           ) : (
//                             <span className="text-xs font-black text-gray-900">
//                               {q.marks || 1}
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => toggleQ(q)}
//                           className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${isSelected ? "bg-red-50 text-red-600 border border-red-100" : "bg-[#f0fce8] text-[#3AB000] border border-[#c5edaa]"}`}
//                         >
//                           {isSelected ? "Remove" : "Add"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="p-6 bg-white border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="flex items-center gap-4">
//                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                   Showing {paginatedQB.length} of {filteredQB.length} results
//                 </p>
//                 {qTotalPages > 1 && (
//                   <div className="flex items-center gap-2">
//                     <button
//                       disabled={qCurrentPage === 1}
//                       onClick={() => setQCurrentPage((p) => p - 1)}
//                       className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
//                     >
//                       <ChevronLeft size={16} className="text-gray-600" />
//                     </button>
//                     <span className="text-xs font-black text-gray-900">
//                       Page {qCurrentPage} of {qTotalPages}
//                     </span>
//                     <button
//                       disabled={qCurrentPage === qTotalPages}
//                       onClick={() => setQCurrentPage((p) => p + 1)}
//                       className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
//                     >
//                       <ChevronRight size={16} className="text-gray-600" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={() => setShowQuestionPicker(false)}
//                 className="w-full md:w-auto px-10 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────
// export default function TestManagement() {
//   const location = useLocation();
//   const [tests, setTests] = useState([]);
//   const [questionBank, setQuestionBank] = useState([]);
//   const [titleOptions, setTitleOptions] = useState([]);
//   const [postings, setPostings] = useState([]);
//   const [isLoadingTests, setIsLoadingTests] = useState(false);
//   const [testsError, setTestsError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [detailsTest, setDetailsTest] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [editingTest, setEditingTest] = useState(null);

//   useEffect(() => {
//     if (location.state?.reExamData) {
//       setEditingTest(normalizeTest(location.state.reExamData));
//       setShowModal(true);
//       // Optional: Clear state to avoid reopening on refresh
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   const loadTests = async () => {
//     setIsLoadingTests(true);
//     setTestsError("");
//     const response = await createPaperAPI.getAll({ page: 1, limit: 0, minimal: "true" });
//     if (!response?.success) {
//       setTestsError(response?.error || "Failed to load events.");
//       setIsLoadingTests(false);
//       return;
//     }
//     const rows = Array.isArray(response?.data?.tests)
//       ? response.data.tests
//       : [];
//     setTests(rows.map(normalizeTest));
//     setIsLoadingTests(false);
//   };

//   useEffect(() => {
//     loadTests();
//   }, []);

//   useEffect(() => {
//     const loadSavedQuestions = async () => {
//       const response = await questionBankAPI.getAll({ page: 1, limit: 0 });
//       if (!response?.success) {
//         setQuestionBank([]);
//         return;
//       }
//       const rows = Array.isArray(response?.data?.questions)
//         ? response.data.questions
//         : [];
//       setQuestionBank(rows.map(normalizeQuestion));
//     };
//     loadSavedQuestions();
//   }, []);

//   useEffect(() => {
//     const loadFormTitles = async () => {
//       const response = await jobPostingsAPI.getAll({ page: 1, limit: 0 });
//       if (!response?.success) {
//         setTitleOptions([]);
//         return;
//       }
//       const postingsData = Array.isArray(response?.data?.postings)
//         ? response.data.postings
//         : [];
//       setPostings(postingsData);
//       const titles = postingsData
//         .sort((a, b) => {
//           const aOpen = isVacancyOpen(a.lastDate) && a.status !== "Inactive";
//           const bOpen = isVacancyOpen(b.lastDate) && b.status !== "Inactive";
//           if (aOpen && !bOpen) return -1;
//           if (!aOpen && bOpen) return 1;
//           return 0;
//         })
//         .map((item) =>
//           String(item?.title || item?.post?.en || item?.advtNo || "").trim(),
//         )
//         .filter(Boolean);
//       setTitleOptions(Array.from(new Set(titles)));
//     };
//     loadFormTitles();
//   }, []);

//   const stats = useMemo(() => {
//     const total = tests.length;
//     const published = tests.filter((t) => t.status === "published").length;
//     const draft = tests.filter((t) => t.status === "draft").length;
//     return { total, published, draft };
//   }, [tests]);

//   const filtered = useMemo(() => {
//     return tests
//       .filter((t) => {
//         const q = searchQuery.toLowerCase();
//         const matchSearch =
//           t.title.toLowerCase().includes(q) ||
//           (Array.isArray(t.tags) ? t.tags : []).some((tg) =>
//             tg.toLowerCase().includes(q),
//           );
//         const matchStatus = filterStatus === "all" || t.status === filterStatus;
//         return matchSearch && matchStatus;
//       })
//       .sort((a, b) => {
//         const aExpired = a.endDate && new Date(a.endDate) < new Date();
//         const bExpired = b.endDate && new Date(b.endDate) < new Date();
//         const aActive = a.status === "published" && !aExpired;
//         const bActive = b.status === "published" && !bExpired;
//         if (aActive && !bActive) return -1;
//         if (!aActive && bActive) return 1;
//         return new Date(b.createdDate) - new Date(a.createdDate);
//       });
//   }, [tests, searchQuery, filterStatus]);

//   const handleSave = async (formData) => {
//     console.log("Saving paper with formData:", formData);
//     const parsed = {
//       ...formData,
//       difficulty: String(formData.difficulty || "Mixed"),
//       duration: parseInt(formData.duration, 10),
//       passingMarks: parseInt(formData.passingMarks) || 0,
//       maxAttempts:
//         formData.maxAttempts === "" || formData.maxAttempts === null
//           ? 1
//           : Number(formData.maxAttempts),
//       tags: formData.tags
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean),
//       mouStartDate: formData.mouStartDate || "",
//       mouEndDate: formData.mouEndDate || "",
//       questionConfigs: Array.isArray(formData.questionConfigs)
//         ? formData.questionConfigs.map((cfg) => ({
//             questionId: String(cfg.questionId),
//             marks: Number(cfg.marks || 0),
//             isCompulsory: Boolean(cfg.isCompulsory),
//           }))
//         : [],
//       totalQuestions: (formData.questionConfigs || []).length,
//       totalMarks: (formData.questionConfigs || []).reduce(
//         (s, c) => s + Number(c.marks || 0),
//         0,
//       ),
//       assignedStudents: Array.isArray(formData.assignedStudents)
//         ? formData.assignedStudents.map((s) =>
//             typeof s === "object" ? s._id || s.id : s,
//           )
//         : [],
//     };
//     console.log("Parsed payload for save:", parsed);

//     const response = editingTest?.id
//       ? await createPaperAPI.update(editingTest.id, parsed)
//       : await createPaperAPI.create({
//           ...parsed,
//           status: "draft",
//           attempts: 0,
//           avgScore: 0,
//           createdDate: new Date().toISOString(),
//           pipeline: { currentStage: 0, completedStages: [] },
//         });

//     console.log("Save response:", response);

//     if (!response?.success) {
//       alert(response?.error || "Failed to save test.");
//       return;
//     }
//     await loadTests();
//     setShowModal(false);
//     setEditingTest(null);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this test?")) return;
//     const response = await createPaperAPI.delete(id);
//     if (!response?.success) {
//       alert(response?.error || "Failed to delete test.");
//       return;
//     }
//     setTests((p) => p.filter((t) => t.id !== id));
//   };

//   const toggleStatus = async (id) => {
//     const current = tests.find((t) => String(t.id) === String(id));
//     if (!current) return;
//     const nextStatus = current.status === "published" ? "draft" : "published";
//     const response = await createPaperAPI.update(id, { status: nextStatus });
//     if (!response?.success) {
//       alert(response?.error || "Failed to update status.");
//       return;
//     }
//     setTests((p) =>
//       p.map((t) =>
//         String(t.id) === String(id) ? { ...t, status: nextStatus } : t,
//       ),
//     );
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-white ml-0 p-0 md:ml-6 px-2 md:px-0">
//         {showDetailsModal && detailsTest ? (
//           <DetailsView
//             test={detailsTest}
//             onBack={() => {
//               setShowDetailsModal(false);
//               setDetailsTest(null);
//             }}
//           />
//         ) : showModal ? (
//           <CreateEditView
//             editingTest={editingTest}
//             questionBank={questionBank}
//             titleOptions={titleOptions}
//             postings={postings}
//             onClose={() => {
//               setShowModal(false);
//               setEditingTest(null);
//             }}
//             onSave={handleSave}
//           />
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Total Events
//                 </p>
//                 <p className="text-2xl font-black text-gray-900">
//                   {stats.total}
//                 </p>
//               </div>
//               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Published
//                 </p>
//                 <p className="text-2xl font-black text-[#3AB000]">
//                   {stats.published}
//                 </p>
//               </div>
//               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
//                   Drafts
//                 </p>
//                 <p className="text-2xl font-black text-amber-600">
//                   {stats.draft}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
//               <div className="relative w-full md:w-96">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   size={16}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search events..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB000] outline-none"
//                 />
//               </div>
//               <div className="flex gap-4 items-center w-full md:w-auto">
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB000] outline-none bg-white flex-1 md:flex-none"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="published">Published</option>
//                   <option value="draft">Draft</option>
//                 </select>
//                 <button
//                   onClick={() => {
//                     setEditingTest(null);
//                     setShowModal(true);
//                   }}
//                   className="bg-[#3AB000] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2d8a00] transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
//                 >
//                   <Plus size={18} /> Create Event
//                 </button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {isLoadingTests ? (
//                 <div className="text-center py-20 text-gray-500">
//                   <div className="w-10 h-10 border-4 border-[#3AB000]/20 border-t-[#3AB000] rounded-full animate-spin mx-auto mb-4"></div>
//                   Loading events...
//                 </div>
//               ) : filtered.length === 0 ? (
//                 <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
//                   No events found.
//                 </div>
//               ) : (
//                 filtered.map((test) => (
//                   <div
//                     key={test.id}
//                     className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#3AB000] transition-all group"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-3">
//                           <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#3AB000] transition-colors">
//                             {test.title}
//                           </h3>
//                           <span
//                             className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${test.status === "published" ? "bg-[#3AB000] text-white" : "bg-gray-100 text-gray-400"}`}
//                           >
//                             {test.status}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
//                           <span className="flex items-center gap-1">
//                             <HelpCircle size={14} /> {test.totalQuestions} Questions
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Users size={14} /> {test.assignedStudents?.length || 0} Students
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Clock size={14} /> {test.duration} Min
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={async () => {
//                             console.log("Fetching details for test ID:", test.id);
//                             const response = await createPaperAPI.getDetails(
//                               test.id,
//                             );
//                             console.log("GetDetails response:", response);
//                             if (response?.success) {
//                               const normalized = normalizeTest(response.data.test);
//                               console.log("Normalized details:", normalized);
//                               setDetailsTest(normalized);
//                               setShowDetailsModal(true);
//                             } else {
//                               alert("Failed to load test details.");
//                             }
//                           }}
//                           className="p-2 text-gray-400 hover:text-[#3AB000] hover:bg-[#f0fce8] rounded-lg transition-all"
//                           title="View Details"
//                         >
//                           <Eye size={18} />
//                         </button>
//                         <button
//                           onClick={async () => {
//                             const response = await createPaperAPI.getDetails(
//                               test.id,
//                             );
//                             if (response?.success) {
//                               setEditingTest(normalizeTest(response.data.test));
//                               setShowModal(true);
//                             } else {
//                               alert("Failed to load test for editing.");
//                             }
//                           }}
//                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                           title="Edit"
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button
//                           onClick={() => toggleStatus(test.id)}
//                           className={`p-2 rounded-lg transition-all ${test.status === "published" ? "text-amber-600 hover:bg-amber-50" : "text-[#3AB000] hover:bg-[#f0fce8]"}`}
//                           title={test.status === "published" ? "Move to Draft" : "Publish"}
//                         >
//                           {test.status === "published" ? <Lock size={18} /> : <Globe size={18} />}
//                         </button>
//                         <button
//                           onClick={() => handleDelete(test.id)}
//                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  createPaperAPI,
  jobPostingsAPI,
  questionBankAPI,
  applicationsAPI,
} from "../../utils/api";
import {
  ClipboardList,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  BookOpen,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Check,
  ArrowRight,
  Monitor,
  HelpCircle,
  Settings,
} from "lucide-react";

// ─── Static Data ───────────────────────────────────────────────────────────────
const SUBJECT_OPTIONS = [
  "General Knowledge",
  "Mathematics",
  "Health & Nutrition",
  "Management & Administration",
  "Basic Computer Knowledge",
  "Communication Skills",
  "Other",
];

const EMPTY_FORM = {
  title: "",
  questionConfigs: [],
  totalQuestions: 0,
  totalMarks: 0,
  duration: "",
  passingMarks: "",
  description: "",
  tags: "",
  startDate: "",
  endDate: "",
  mouStartDate: "",
  mouEndDate: "",
  isPublic: true,
  shuffleQuestions: false,
  showResult: true,
  resultDate: "",
  maxAttempts: "1",
  pipelineStageCount: 5,
};

const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB000] focus:border-[#3AB000] bg-white outline-none";

const isVacancyOpen = (lastDate) => {
  if (!lastDate) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lDate = new Date(lastDate);
  lDate.setHours(0, 0, 0, 0);
  return today <= lDate;
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
        subject: cfg?.questionId?.subject || "General Knowledge",
        options: cfg?.questionId?.options || [],
        marks: Number(cfg?.marks || 0),
        isCompulsory: Boolean(cfg?.isCompulsory),
      }))
    : [],
  totalQuestions: Number(
    item?.totalQuestions ||
      (Array.isArray(item?.questionConfigs) ? item.questionConfigs.length : 0),
  ),
  totalMarks: Number(
    item?.totalMarks ||
      (Array.isArray(item?.questionConfigs)
        ? item.questionConfigs.reduce((s, c) => s + Number(c.marks || 0), 0)
        : 0),
  ),
  passingMarks: Number(item?.passingMarks || 0),
  duration: Number(item?.duration || 0),
  status: item?.status === "published" ? "published" : "draft",
  attempts: Number(item?.attempts || 0),
  avgScore: Number(item?.avgScore || 0),
  description: String(item?.description || ""),
  tags: Array.isArray(item?.tags) ? item.tags : [],
  startDate: String(item?.startDate || "").split("T")[0],
  endDate: String(item?.endDate || "").split("T")[0],
  mouStartDate: String(item?.mouStartDate || "").split("T")[0],
  mouEndDate: String(item?.mouEndDate || "").split("T")[0],
  isPublic: item?.isPublic !== false,
  shuffleQuestions: Boolean(item?.shuffleQuestions),
  showResult: item?.showResult !== false,
  resultDate: item?.resultDate || "",
  maxAttempts: item?.maxAttempts === 0 ? 0 : Number(item?.maxAttempts ?? 1),
  assignedStudents: Array.isArray(item?.assignedStudents)
    ? item.assignedStudents
        .filter(Boolean)
        .map((s) => (typeof s === "object" ? s : { _id: String(s) }))
    : [],
  createdDate: item?.createdDate || item?.createdAt || new Date().toISOString(),
  rewards: Array.isArray(item?.rewards) ? item.rewards : [],
});

const normalizeQuestion = (item) => ({
  id: item?._id || item?.id,
  question: String(item?.question || ""),
  topic: String(item?.topic || ""),
  subject: String(item?.subject || "General Knowledge"),
  marks: Number(item?.marks || 1),
  difficulty: String(item?.difficulty || ""),
  options: Array.isArray(item?.options) ? item.options : [],
});

// ─── Selection Progress Bar ────────────────────────────────────────────────────
function SelectionProgressBar({ selected, total }) {
  const pct = total > 0 ? Math.round((selected / total) * 100) : 0;
  const barColor =
    pct === 100
      ? "#3AB000"
      : pct >= 60
        ? "#f59e0b"
        : pct >= 30
          ? "#3b82f6"
          : "#e5e7eb";
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#3AB000]" />
          <span className="text-sm font-semibold text-gray-700">
            Selection Progress
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#3AB000]">{selected}</span>
          <span className="text-xs text-gray-400">/ {total} selected</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: `${barColor}20`, color: barColor }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

// ─── Details View ──────────────────────────────────────────────────────────────
function DetailsView({ test, onBack }) {
  const assigned = Array.isArray(test.assignedStudents)
    ? test.assignedStudents
    : [];
  const questions = Array.isArray(test.questionConfigs)
    ? test.questionConfigs
    : [];
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    {
      id: "students",
      label: "Assigned Students",
      icon: Users,
      count: assigned.length,
    },
    {
      id: "questions",
      label: "Question Bank",
      icon: HelpCircle,
      count: questions.length,
    },
    { id: "config", label: "Configuration", icon: Settings, count: null },
  ];

  return (
    <div className="bg-white w-full min-h-screen flex flex-col border border-gray-200 rounded overflow-hidden">
      {/* Header */}
      <div className="bg-[#3AB000] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-green-100 mb-0.5">
            Event Details
          </p>
          <h3 className="text-lg font-bold leading-tight">{test.title}</h3>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
        >
          <ArrowRight className="rotate-180" size={16} /> Back to List
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 flex items-center gap-2 border-b-2 text-sm font-medium transition-colors ${isActive ? "border-[#3AB000] text-[#3AB000]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.count !== null && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-[#3AB000] text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Assigned", value: assigned.length },
                {
                  label: "Districts Covered",
                  value: [...new Set(assigned.map((s) => s.district))].filter(
                    Boolean,
                  ).length,
                },
                {
                  label: "Contact Rate",
                  value: `${Math.round((assigned.filter((s) => s.mobile).length / (assigned.length || 1)) * 100)}%`,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded p-4"
                >
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              {assigned.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  No students assigned.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#3AB000]">
                      <th className="px-4 py-3 text-left font-bold text-black">
                        Candidate Details
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-black">
                        Contact & Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assigned.map((s, i) => (
                      <tr
                        key={s._id || i}
                        className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={s.photo || "/placeholder.png"}
                              alt={s.candidateName}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <p className="font-semibold text-[#2d8a00]">
                                {s.candidateName || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400">
                                S/O: {s.fatherName || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <p className="text-xs">{s.mobile || "N/A"}</p>
                          <p className="text-xs text-gray-400">
                            {s.email || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">{s.district}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  label: "Total Marks",
                  value: test.totalMarks,
                  color: "text-[#3AB000]",
                },
                {
                  label: "Pass Marks",
                  value: test.passingMarks,
                  color: "text-amber-600",
                },
                {
                  label: "Difficulty",
                  value: test.difficulty || "Mixed",
                  color: "text-gray-800",
                },
                {
                  label: "Avg per Q",
                  value:
                    Math.round(
                      (test.totalMarks / (questions.length || 1)) * 10,
                    ) / 10,
                  color: "text-gray-800",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded p-4"
                >
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    {s.label}
                  </p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              {questions.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  No questions added.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#3AB000]">
                      <th className="px-4 py-3 text-left font-bold text-black">
                        #
                      </th>
                      <th className="px-4 py-3 text-left font-bold text-black">
                        Question
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-center font-bold text-black">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-700 font-medium max-w-xs">
                          <p>{q.questionText || "Question content missing."}</p>
                          {Array.isArray(q.options) && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {q.options.map((opt, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500"
                                >
                                  {String.fromCharCode(65 + i)}. {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-[#3AB000] font-semibold">
                          {q.marks}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-xs font-semibold ${q.isCompulsory ? "text-amber-600" : "text-gray-400"}`}
                          >
                            {q.isCompulsory ? "Compulsory" : "Optional"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Config Tab */}
        {activeTab === "config" && (
          <div className="max-w-3xl space-y-4">
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#3AB000]">
                    <th className="px-4 py-3 text-left font-bold text-black w-40">
                      Setting
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-black">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Description", test.description || "N/A"],
                    [
                      "Start Date",
                      test.startDate
                        ? new Date(test.startDate).toLocaleDateString()
                        : "Immediately",
                    ],
                    [
                      "End Date",
                      test.endDate
                        ? new Date(test.endDate).toLocaleDateString()
                        : "Never",
                    ],
                    [
                      "MOU Start",
                      test.mouStartDate
                        ? new Date(test.mouStartDate).toLocaleDateString()
                        : "Not Set",
                    ],
                    [
                      "MOU End",
                      test.mouEndDate
                        ? new Date(test.mouEndDate).toLocaleDateString()
                        : "Not Set",
                    ],
                    ["Duration", `${test.duration} Minutes`],
                    [
                      "Max Attempts",
                      test.maxAttempts === 0
                        ? "Unlimited"
                        : `${test.maxAttempts}`,
                    ],
                    ["Visibility", test.isPublic ? "Public" : "Private"],
                    [
                      "Shuffle Questions",
                      test.shuffleQuestions ? "Enabled" : "Disabled",
                    ],
                    ["Results", test.showResult ? "Instant" : "Scheduled"],
                    ["Status", test.status],
                  ].map(([label, value]) => (
                    <tr
                      key={label}
                      className="hover:bg-[#e8f5e2] transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">
                        {label}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white flex justify-end">
        <button
          onClick={onBack}
          className="bg-black hover:bg-[#3AB000] text-white px-8 py-2 text-sm font-medium rounded-sm transition-colors"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}

// ─── Create / Edit View ────────────────────────────────────────────────────────
function CreateEditView({
  editingTest,
  questionBank,
  titleOptions,
  postings,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(() => {
    if (editingTest) {
      return {
        ...EMPTY_FORM,
        title: editingTest.title || "",
        questionConfigs: editingTest.questionConfigs || [],
        assignedStudents: editingTest.assignedStudents || [],
        duration: (editingTest.duration || "").toString(),
        passingMarks: (editingTest.passingMarks || "").toString(),
        description: editingTest.description || "",
        tags: (editingTest.tags || []).join(", "),
        startDate: editingTest.startDate || "",
        endDate: editingTest.endDate || "",
        mouStartDate: editingTest.mouStartDate || "",
        mouEndDate: editingTest.mouEndDate || "",
        isPublic: editingTest.isPublic !== false,
        shuffleQuestions: Boolean(editingTest.shuffleQuestions),
        showResult: editingTest.showResult !== false,
        resultDate: editingTest.resultDate || "",
        maxAttempts: (editingTest.maxAttempts ?? "1").toString(),
        totalQuestions: (editingTest.questionConfigs || []).length,
        totalMarks: (editingTest.questionConfigs || []).reduce(
          (s, c) => s + Number(c.marks || 0),
          0,
        ),
      };
    }
    return { ...EMPTY_FORM, assignedStudents: [], resultDate: "" };
  });

  const [activeTab, setActiveTab] = useState("details");
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [qFilterDifficulty, setQFilterDifficulty] = useState("all");
  const [qFilterSubject, setQFilterSubject] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false);
  const [applicantError, setApplicantError] = useState("");
  const [studentStartDate, setStudentStartDate] = useState("");
  const [studentEndDate, setStudentEndDate] = useState("");
  const [localStudentSearch, setLocalStudentSearch] = useState("");
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("");
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const titleDropdownRef = useRef(null);
  const [qCurrentPage, setQCurrentPage] = useState(1);
  const Q_PAGE_SIZE = 10;
  const [sCurrentPage, setSCurrentPage] = useState(1);
  const [sTotalPages, setSTotalPages] = useState(1);
  const [sTotalItems, setSTotalItems] = useState(0);
  const S_PAGE_SIZE = 15;

  useEffect(() => {
    setQCurrentPage(1);
  }, [questionSearch, qFilterDifficulty, qFilterSubject]);
  useEffect(() => {
    setSCurrentPage(1);
  }, [localStudentSearch, studentStartDate, studentEndDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        titleDropdownRef.current &&
        !titleDropdownRef.current.contains(e.target)
      )
        setIsTitleDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTitles = useMemo(() => {
    const q = titleSearch.toLowerCase().trim();
    return (Array.isArray(titleOptions) ? titleOptions : [])
      .filter((opt) => opt.toLowerCase().includes(q))
      .sort((a, b) => {
        const score = (title) => {
          const posting = postings.find((p) => {
            const en = typeof p.post === "object" ? p.post.en : p.post;
            return en === title || p.title === title || p.advtNo === title;
          });
          return posting
            ? posting.status !== "Inactive" && isVacancyOpen(posting.lastDate)
              ? 1
              : 0
            : 1;
        };
        return score(b) - score(a);
      });
  }, [titleOptions, titleSearch, postings]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedStudentSearch(localStudentSearch),
      500,
    );
    return () => clearTimeout(timer);
  }, [localStudentSearch]);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!formData.title) {
        setApplicants([]);
        return;
      }
      const posting = postings.find((p) => {
        const en = String(p?.post?.en || "")
          .trim()
          .toLowerCase();
        let cur = formData.title.trim().toLowerCase();
        if (cur.startsWith("re-exam: "))
          cur = cur.replace("re-exam: ", "").trim();
        return (
          en === cur ||
          String(p?.title || "")
            .trim()
            .toLowerCase() === cur ||
          String(p?.advtNo || "")
            .trim()
            .toLowerCase() === cur
        );
      });
      const params = {
        limit: S_PAGE_SIZE,
        page: sCurrentPage,
        paymentStatus: "paid",
        minimal: "true",
      };
      if (posting?._id) params.jobPostingId = posting._id;
      else if (formData.title) params.search = formData.title;
      if (debouncedStudentSearch) params.search = debouncedStudentSearch;
      if (studentStartDate) params.startDate = studentStartDate;
      if (studentEndDate) params.endDate = studentEndDate;
      setIsLoadingApplicants(true);
      setApplicantError("");
      try {
        const res = await applicationsAPI.getAll(params);
        if (res?.success) {
          setApplicants(res.data?.applications || []);
          setSTotalPages(res.data?.pagination?.pages || 1);
          setSTotalItems(res.data?.pagination?.total || 0);
        } else {
          setApplicants([]);
          setSTotalPages(1);
          setSTotalItems(0);
          setApplicantError(res.error || "No applicants found.");
        }
      } catch {
        setApplicantError("Failed to fetch applicants.");
        setApplicants([]);
      } finally {
        setIsLoadingApplicants(false);
      }
    };
    fetchApplicants();
  }, [
    formData.title,
    postings,
    studentStartDate,
    studentEndDate,
    debouncedStudentSearch,
    sCurrentPage,
  ]);

  const toggleStudent = (student) => {
    const studentId = typeof student === "object" ? student._id : student;
    setFormData((prev) => {
      const selected = prev.assignedStudents || [];
      const exists = selected.some(
        (s) => (typeof s === "object" ? s._id : s) === studentId,
      );
      return {
        ...prev,
        assignedStudents: exists
          ? selected.filter(
              (s) => (typeof s === "object" ? s._id : s) !== studentId,
            )
          : [...selected, student],
      };
    });
  };

  const selectAllAcrossPages = async () => {
    if (!formData.title) return;
    setIsSelectingAll(true);
    try {
      const posting = postings.find((p) => {
        const en = String(p?.post?.en || "").trim();
        return (
          en === formData.title.trim() ||
          String(p?.title || "").trim() === formData.title.trim()
        );
      });
      const params = {
        limit: 0,
        paymentStatus: "paid",
        minimal: "true",
        search: debouncedStudentSearch,
      };
      if (posting?._id) params.jobPostingId = posting._id;
      if (studentStartDate) params.startDate = studentStartDate;
      if (studentEndDate) params.endDate = studentEndDate;
      const res = await applicationsAPI.getAll(params);
      if (res?.success) {
        const allIds = (res.data?.applications || []).map((a) => a._id);
        setFormData((p) => ({ ...p, assignedStudents: allIds }));
      }
    } catch {
      /* ignore */
    } finally {
      setIsSelectingAll(false);
    }
  };

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
      const matchSubj =
        qFilterSubject === "all" || item.subject === qFilterSubject;
      return matchSearch && matchDiff && matchSubj;
    });
  }, [questionBank, questionSearch, qFilterDifficulty, qFilterSubject]);

  const paginatedQB = useMemo(
    () =>
      filteredQB.slice(
        (qCurrentPage - 1) * Q_PAGE_SIZE,
        qCurrentPage * Q_PAGE_SIZE,
      ),
    [filteredQB, qCurrentPage],
  );
  const qTotalPages = Math.ceil(filteredQB.length / Q_PAGE_SIZE);

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
      const newConfigs = exists
        ? configs.filter((c) => String(c.questionId) !== qId)
        : [
            ...configs,
            {
              questionId: qId,
              questionText: q.question,
              subject: q.subject,
              marks: Number(q.marks || 1),
              isCompulsory: false,
            },
          ];
      return {
        ...prev,
        questionConfigs: newConfigs,
        totalQuestions: newConfigs.length,
        totalMarks: newConfigs.reduce((s, c) => s + Number(c.marks || 0), 0),
      };
    });
  };

  const updateQConfig = (qId, field, value) => {
    setFormData((prev) => {
      const newConfigs = (prev.questionConfigs || []).map((c) =>
        String(c.questionId) === String(qId) ? { ...c, [field]: value } : c,
      );
      return {
        ...prev,
        questionConfigs: newConfigs,
        totalMarks: newConfigs.reduce((s, c) => s + Number(c.marks || 0), 0),
      };
    });
  };

  const getQConfig = (qId) =>
    (formData.questionConfigs || []).find(
      (c) => String(c.questionId) === String(qId),
    );

  const handleSubmit = () => {
    if (!formData.title || !formData.duration) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({ ...formData });
  };

  const tabs = [
    { key: "details", label: "Event Details", icon: ClipboardList },
    { key: "applicants", label: "Select Students", icon: Users },
    { key: "settings", label: "Settings", icon: Settings },
  ].filter(
    (tab) => !(tab.key === "applicants" && editingTest && !editingTest.id),
  );

  return (
    <div className="bg-white w-full min-h-screen flex flex-col border border-gray-200 rounded overflow-hidden">
      {/* Header */}
      <div className="bg-[#3AB000] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-green-100 mb-0.5">
            Test Management
          </p>
          <h3 className="text-lg font-bold">
            {editingTest?.id ? "Edit Event" : "Create New Event"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
        >
          <X size={16} /> Cancel
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 flex items-center gap-2 border-b-2 text-sm font-medium transition-colors ${isActive ? "border-[#3AB000] text-[#3AB000]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* ── Details Tab ── */}
          {activeTab === "details" && (
            <div className="bg-white border border-gray-200 rounded p-6 space-y-5">
              {/* Title Dropdown */}
              <div className="relative" ref={titleDropdownRef}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
                  className={`${inputCls} flex items-center justify-between cursor-pointer ${isTitleDropdownOpen ? "ring-2 ring-[#3AB000] border-[#3AB000]" : ""}`}
                >
                  <span
                    className={`truncate flex-1 ${!formData.title ? "text-gray-400" : "text-gray-800 font-semibold"}`}
                  >
                    {formData.title || "Select event title"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isTitleDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {isTitleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-white border border-gray-200 rounded shadow-xl flex flex-col max-h-72 overflow-hidden">
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          autoFocus
                          value={titleSearch}
                          onChange={(e) => setTitleSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Search titles..."
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#3AB000] outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {filteredTitles.length === 0 ? (
                        <div className="px-4 py-6 text-sm text-gray-400 text-center">
                          No titles found.
                        </div>
                      ) : (
                        filteredTitles.map((opt) => {
                          const posting = postings.find((p) => {
                            const en =
                              typeof p.post === "object" ? p.post.en : p.post;
                            return (
                              en === opt || p.title === opt || p.advtNo === opt
                            );
                          });
                          const isActive = posting
                            ? posting.status !== "Inactive" &&
                              isVacancyOpen(posting.lastDate)
                            : true;
                          return (
                            <div
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((p) => ({ ...p, title: opt }));
                                setIsTitleDropdownOpen(false);
                                setTitleSearch("");
                              }}
                              className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#e8f5e2] transition-colors flex items-center justify-between gap-3 ${formData.title === opt ? "bg-[#e8f5e2] text-[#3AB000] font-semibold" : "text-gray-700"}`}
                            >
                              <span className="truncate flex-1">{opt}</span>
                              <span
                                className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${isActive ? "text-[#3AB000]" : "text-red-500"}`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded p-3">
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    Questions
                  </p>
                  <p className="text-2xl font-bold text-[#3AB000]">
                    {formData.totalQuestions}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded p-3">
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    Total Marks
                  </p>
                  <p className="text-2xl font-bold text-[#3AB000]">
                    {formData.totalMarks}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Duration (Min)
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Pass Marks
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
              </div>

              {/* Question Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Question Selection <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => {
                      setShowQuestionPicker(true);
                      setQuestionSearch("");
                      setQFilterDifficulty("all");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#3AB000] text-[#3AB000] text-xs font-medium rounded hover:bg-[#e8f5e2] transition-colors"
                  >
                    <Search size={13} /> Browse Question Bank
                  </button>
                </div>
                <div className="border border-gray-200 rounded overflow-hidden">
                  {formData.questionConfigs.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm bg-gray-50">
                      No questions selected yet.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#3AB000]">
                          <th className="px-4 py-2.5 text-left font-bold text-black">
                            Question
                          </th>
                          <th className="px-4 py-2.5 font-bold text-black w-20 text-center">
                            Marks
                          </th>
                          <th className="px-4 py-2.5 font-bold text-black w-28 text-center">
                            Compulsory
                          </th>
                          <th className="px-4 py-2.5 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.questionConfigs.map((q) => (
                          <tr
                            key={q.questionId}
                            className="hover:bg-[#e8f5e2] transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                              {q.questionText}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={q.marks}
                                onChange={(e) =>
                                  updateQConfig(
                                    q.questionId,
                                    "marks",
                                    e.target.value,
                                  )
                                }
                                className="w-14 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-[#3AB000] outline-none"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() =>
                                  updateQConfig(
                                    q.questionId,
                                    "isCompulsory",
                                    !q.isCompulsory,
                                  )
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${q.isCompulsory ? "bg-[#3AB000] text-white" : "bg-gray-100 text-gray-400"}`}
                              >
                                {q.isCompulsory ? "Yes" : "No"}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => toggleQ({ id: q.questionId })}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInput}
                  rows="3"
                  className={`${inputCls} resize-none`}
                  placeholder="Enter event details, instructions, etc."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInput}
                  placeholder="e.g. math, unit-test, class-10"
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* ── Applicants Tab ── */}
          {activeTab === "applicants" && (
            <div className="bg-white border border-gray-200 rounded p-6 space-y-4">
              <SelectionProgressBar
                selected={formData.assignedStudents?.length || 0}
                total={sTotalItems}
              />

              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Search Candidates
                  </label>
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10">
                    <input
                      type="text"
                      placeholder="Search by name, mobile, district..."
                      value={localStudentSearch}
                      onChange={(e) => setLocalStudentSearch(e.target.value)}
                      className="flex-1 px-3 text-sm text-gray-700 focus:outline-none h-full bg-white"
                    />
                    <button className="bg-[#3AB000] hover:bg-[#2d8a00] text-white px-4 h-full text-sm font-medium transition-colors">
                      Search
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllAcrossPages}
                    disabled={isSelectingAll || !formData.title}
                    className="px-4 py-2 bg-black hover:bg-[#3AB000] text-white rounded-sm text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSelectingAll ? "Processing..." : "Select All Paid"}
                  </button>
                  <button
                    onClick={() =>
                      setFormData((p) => ({ ...p, assignedStudents: [] }))
                    }
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-sm text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Applied From
                  </label>
                  <input
                    type="date"
                    value={studentStartDate}
                    onChange={(e) => setStudentStartDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Applied To
                  </label>
                  <input
                    type="date"
                    value={studentEndDate}
                    onChange={(e) => setStudentEndDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded overflow-hidden">
                {isLoadingApplicants ? (
                  <div className="py-16 text-center">
                    <div className="w-8 h-8 border-4 border-[#3AB000]/20 border-t-[#3AB000] rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                      Loading candidates...
                    </p>
                  </div>
                ) : applicantError ? (
                  <div className="py-16 text-center text-red-400 text-sm">
                    {applicantError}
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-sm">
                    No matching candidates found.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#3AB000]">
                        <th className="px-4 py-2.5 w-10 text-center font-bold text-black">
                          ✓
                        </th>
                        <th className="px-4 py-2.5 text-left font-bold text-black">
                          Candidate
                        </th>
                        <th className="px-4 py-2.5 text-left font-bold text-black">
                          Mobile
                        </th>
                        <th className="px-4 py-2.5 text-left font-bold text-black">
                          District
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applicants.map((app) => {
                        const isSelected = formData.assignedStudents?.some(
                          (s) =>
                            (typeof s === "object" ? s._id : s) === app._id,
                        );
                        return (
                          <tr
                            key={app._id}
                            onClick={() => toggleStudent(app)}
                            className={`cursor-pointer transition-colors ${isSelected ? "bg-[#e8f5e2]" : "hover:bg-gray-50"}`}
                          >
                            <td className="px-4 py-3 text-center">
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center mx-auto transition-colors ${isSelected ? "bg-[#3AB000] border-[#3AB000]" : "border-gray-300"}`}
                              >
                                {isSelected && (
                                  <Check size={10} className="text-white" />
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-[#2d8a00]">
                              {app.candidateName}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {app.mobile}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {app.district}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {sTotalPages > 1 && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-400">
                    Page {sCurrentPage} of {sTotalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={sCurrentPage === 1}
                      onClick={() => setSCurrentPage((p) => Math.max(1, p - 1))}
                      className="bg-[#3AB000] disabled:opacity-50 text-white px-6 py-1.5 text-xs font-medium hover:bg-[#2d8a00] transition-colors rounded-sm"
                    >
                      Back
                    </button>
                    <button
                      disabled={sCurrentPage === sTotalPages}
                      onClick={() =>
                        setSCurrentPage((p) => Math.min(sTotalPages, p + 1))
                      }
                      className="bg-[#3AB000] disabled:opacity-50 text-white px-6 py-1.5 text-xs font-medium hover:bg-[#2d8a00] transition-colors rounded-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Settings Tab ── */}
          {activeTab === "settings" && (
            <div className="bg-white border border-gray-200 rounded p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2">
                    Exam Schedule
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
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
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2">
                    Exam Logic
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Max Attempts (0 = unlimited)
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
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-3">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1.5">
                      <BookOpen size={12} /> MOU Details
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        MOU Start
                      </label>
                      <input
                        type="date"
                        name="mouStartDate"
                        value={formData.mouStartDate}
                        onChange={handleInput}
                        className="w-full px-3 py-2 border border-blue-200 rounded text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        MOU End
                      </label>
                      <input
                        type="date"
                        name="mouEndDate"
                        value={formData.mouEndDate}
                        onChange={handleInput}
                        className="w-full px-3 py-2 border border-blue-200 rounded text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2">
                  Preferences
                </p>
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#3AB000]">
                        <th className="px-4 py-2.5 text-left font-bold text-black">
                          Setting
                        </th>
                        <th className="px-4 py-2.5 text-left font-bold text-black">
                          Description
                        </th>
                        <th className="px-4 py-2.5 text-center font-bold text-black w-24">
                          Toggle
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        [
                          "isPublic",
                          "Public Visibility",
                          "Allow all students to join",
                        ],
                        [
                          "shuffleQuestions",
                          "Shuffle Questions",
                          "Randomize for every attempt",
                        ],
                        [
                          "showResult",
                          "Instant Results",
                          "Show score after submission",
                        ],
                      ].map(([name, label, sub]) => (
                        <tr
                          key={name}
                          onClick={() =>
                            setFormData((p) => ({ ...p, [name]: !p[name] }))
                          }
                          className="cursor-pointer hover:bg-[#e8f5e2] transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-gray-700">
                            {label}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {sub}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div
                              className={`w-9 h-5 rounded-full relative transition-colors mx-auto ${formData[name] ? "bg-[#3AB000]" : "bg-gray-200"}`}
                            >
                              <div
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow ${formData[name] ? "left-4" : "left-0.5"}`}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {!formData.showResult && (
                <div className="bg-amber-50 border border-amber-200 rounded p-4">
                  <label className="block text-xs font-bold text-amber-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Calendar size={12} /> Result Declaration Date
                  </label>
                  <input
                    type="date"
                    name="resultDate"
                    value={formData.resultDate}
                    onChange={handleInput}
                    className="w-full px-3 py-2 border border-amber-200 rounded text-sm bg-white outline-none focus:ring-2 focus:ring-[#3AB000]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-black hover:bg-[#3AB000] text-white rounded-sm text-sm font-medium transition-colors"
        >
          {editingTest?.id ? "Update Event" : "Create Event"}
        </button>
      </div>

      {/* Question Picker Modal */}
      {showQuestionPicker && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#3AB000] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold">Question Bank</h4>
                <p className="text-xs text-green-100">
                  Selected: {formData.totalQuestions} · Total Marks:{" "}
                  {formData.totalMarks}
                </p>
              </div>
              <button
                onClick={() => setShowQuestionPicker(false)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 bg-white border-b border-gray-200 space-y-3">
              <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10">
                <input
                  type="text"
                  placeholder="Search questions by content or topic..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="flex-1 px-3 text-sm text-gray-700 focus:outline-none h-full"
                />
                <button className="bg-[#3AB000] hover:bg-[#2d8a00] text-white px-4 h-full text-sm font-medium transition-colors">
                  Search
                </button>
              </div>
              <div className="flex gap-3">
                <select
                  value={qFilterSubject}
                  onChange={(e) => setQFilterSubject(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-[#3AB000]"
                >
                  <option value="all">All Subjects</option>
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={qFilterDifficulty}
                  onChange={(e) => setQFilterDifficulty(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-[#3AB000]"
                >
                  <option value="all">All Difficulties</option>
                  {qbDifficulties.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question List */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="bg-[#3AB000]">
                    <th className="px-4 py-2.5 text-center font-bold text-black w-10">
                      ✓
                    </th>
                    <th className="px-4 py-2.5 text-left font-bold text-black">
                      Question
                    </th>
                    <th className="px-4 py-2.5 text-center font-bold text-black w-24">
                      Difficulty
                    </th>
                    <th className="px-4 py-2.5 text-center font-bold text-black w-20">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedQB.map((q) => {
                    const isSelected = getQConfig(q.id);
                    return (
                      <tr
                        key={q.id}
                        onClick={() => toggleQ(q)}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-[#e8f5e2]" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-4 py-3 text-center">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center mx-auto transition-colors ${isSelected ? "bg-[#3AB000] border-[#3AB000]" : "border-gray-300"}`}
                          >
                            {isSelected && (
                              <Check size={10} className="text-white" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-700">
                            {q.question}
                          </p>
                          {q.options?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {q.options.map((opt, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500"
                                >
                                  {String.fromCharCode(65 + i)}. {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-xs font-semibold ${q.difficulty === "Easy" ? "text-[#3AB000]" : q.difficulty === "Medium" ? "text-amber-600" : "text-red-500"}`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isSelected ? (
                            <input
                              type="number"
                              min="0"
                              value={isSelected.marks}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                updateQConfig(
                                  q.id,
                                  "marks",
                                  Number(e.target.value),
                                );
                              }}
                              className="w-14 px-2 py-1 border border-[#3AB000] rounded text-xs text-center focus:ring-2 focus:ring-[#3AB000] outline-none"
                            />
                          ) : (
                            <span className="text-gray-600 font-semibold">
                              {q.marks || 1}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  Showing {paginatedQB.length} of {filteredQB.length}
                </span>
                {qTotalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={qCurrentPage === 1}
                      onClick={() => setQCurrentPage((p) => p - 1)}
                      className="bg-[#3AB000] disabled:opacity-50 text-white px-4 py-1 text-xs font-medium hover:bg-[#2d8a00] transition-colors rounded-sm"
                    >
                      Back
                    </button>
                    <span className="text-xs text-gray-600">
                      {qCurrentPage} / {qTotalPages}
                    </span>
                    <button
                      disabled={qCurrentPage === qTotalPages}
                      onClick={() => setQCurrentPage((p) => p + 1)}
                      className="bg-[#3AB000] disabled:opacity-50 text-white px-4 py-1 text-xs font-medium hover:bg-[#2d8a00] transition-colors rounded-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowQuestionPicker(false)}
                className="px-6 py-2 bg-black hover:bg-[#3AB000] text-white rounded-sm text-sm font-medium transition-colors"
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

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function TestManagement() {
  const location = useLocation();
  const [tests, setTests] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);
  const [postings, setPostings] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [testsError, setTestsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTest, setDetailsTest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    if (location.state?.reExamData) {
      setEditingTest(normalizeTest(location.state.reExamData));
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadTests = async () => {
    setIsLoadingTests(true);
    setTestsError("");
    const response = await createPaperAPI.getAll({
      page: 1,
      limit: 0,
      minimal: "true",
    });
    if (!response?.success) {
      setTestsError(response?.error || "Failed to load events.");
      setIsLoadingTests(false);
      return;
    }
    const rows = Array.isArray(response?.data?.tests)
      ? response.data.tests
      : [];
    setTests(rows.map(normalizeTest));
    setIsLoadingTests(false);
  };

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await questionBankAPI.getAll({ page: 1, limit: 0 });
      if (res?.success)
        setQuestionBank((res.data?.questions || []).map(normalizeQuestion));
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await jobPostingsAPI.getAll({ page: 1, limit: 0 });
      if (!res?.success) return;
      const pd = Array.isArray(res?.data?.postings) ? res.data.postings : [];
      setPostings(pd);
      const titles = pd
        .sort((a, b) => {
          const ao = isVacancyOpen(a.lastDate) && a.status !== "Inactive";
          const bo = isVacancyOpen(b.lastDate) && b.status !== "Inactive";
          return ao === bo ? 0 : ao ? -1 : 1;
        })
        .map((item) =>
          String(item?.title || item?.post?.en || item?.advtNo || "").trim(),
        )
        .filter(Boolean);
      setTitleOptions(Array.from(new Set(titles)));
    };
    load();
  }, []);

  const stats = useMemo(
    () => ({
      total: tests.length,
      published: tests.filter((t) => t.status === "published").length,
      draft: tests.filter((t) => t.status === "draft").length,
    }),
    [tests],
  );

  const filtered = useMemo(
    () =>
      tests
        .filter((t) => {
          const q = searchQuery.toLowerCase();
          const matchSearch =
            t.title.toLowerCase().includes(q) ||
            (Array.isArray(t.tags) ? t.tags : []).some((tg) =>
              tg.toLowerCase().includes(q),
            );
          const matchStatus =
            filterStatus === "all" || t.status === filterStatus;
          return matchSearch && matchStatus;
        })
        .sort((a, b) => {
          const aA =
            a.status === "published" &&
            !(a.endDate && new Date(a.endDate) < new Date());
          const bA =
            b.status === "published" &&
            !(b.endDate && new Date(b.endDate) < new Date());
          if (aA !== bA) return aA ? -1 : 1;
          return new Date(b.createdDate) - new Date(a.createdDate);
        }),
    [tests, searchQuery, filterStatus],
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pagedTests = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
      mouStartDate: formData.mouStartDate || "",
      mouEndDate: formData.mouEndDate || "",
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
        ? formData.assignedStudents.map((s) =>
            typeof s === "object" ? s._id || s.id : s,
          )
        : [],
    };
    const response = editingTest?.id
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

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-4">
              <div className="bg-gray-200 rounded h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white ml-0 p-0 md:ml-6 px-2 md:px-0 pb-10">
        {showDetailsModal && detailsTest ? (
          <DetailsView
            test={detailsTest}
            onBack={() => {
              setShowDetailsModal(false);
              setDetailsTest(null);
            }}
          />
        ) : showModal ? (
          <CreateEditView
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
        ) : (
          <>
            {/* Stats */}
            <div className="hidden md:grid grid-cols-3 gap-4 mb-5">
              {[
                {
                  label: "Total Events",
                  value: stats.total,
                  color: "text-gray-800",
                },
                {
                  label: "Published",
                  value: stats.published,
                  color: "text-[#3AB000]",
                },
                {
                  label: "Drafts",
                  value: stats.draft,
                  color: "text-amber-600",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded p-4"
                >
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    {s.label}
                  </p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Top Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 w-full">
                {/* Status Tabs */}
                <div className="flex items-center gap-0 border border-gray-300 rounded overflow-hidden flex-shrink-0 w-full sm:w-auto">
                  {["all", "published", "draft"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setFilterStatus(tab);
                        setCurrentPage(1);
                      }}
                      className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium border-r border-gray-300 last:border-r-0 transition-colors whitespace-nowrap ${filterStatus === tab ? "bg-[#3AB000] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="flex items-center border border-gray-300 rounded overflow-hidden h-10 flex-1 w-full sm:max-w-[400px]">
                  <input
                    type="text"
                    placeholder="Search by title, tags..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1 px-3 text-sm text-gray-700 focus:outline-none h-full bg-white"
                  />
                  <button className="bg-[#3AB000] hover:bg-[#2d8a00] text-white px-4 h-full text-sm font-medium transition-colors whitespace-nowrap">
                    Search
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingTest(null);
                  setShowModal(true);
                }}
                className="bg-black hover:bg-[#3AB000] text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2.5 rounded-sm transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                + Create Event
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead>
                    <tr className="bg-[#3AB000]">
                      {[
                        "S.N",
                        "Event Title",
                        "Questions",
                        "Students",
                        "Duration",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-center font-bold text-black whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {isLoadingTests ? (
                    <TableSkeleton />
                  ) : filtered.length === 0 ? (
                    <tbody>
                      <tr>
                        <td
                          colSpan="7"
                          className="py-16 text-center text-gray-400 text-sm"
                        >
                          {testsError ? (
                            <div className="flex flex-col items-center gap-2">
                              <p className="text-red-500">{testsError}</p>
                              <button
                                onClick={loadTests}
                                className="bg-[#3AB000] text-white px-4 py-1.5 rounded text-xs hover:bg-[#2d8a00]"
                              >
                                Retry
                              </button>
                            </div>
                          ) : (
                            "No events found."
                          )}
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {pagedTests.map((test, idx) => (
                        <tr
                          key={test.id}
                          className="border-b border-gray-100 hover:bg-[#e8f5e2] transition-colors"
                        >
                          <td className="px-4 py-4 text-center text-gray-600">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td className="px-4 py-4 text-center text-[#2d8a00] font-semibold">
                            {test.title}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-600">
                            {test.totalQuestions}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-600">
                            {test.assignedStudents?.length || 0}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-600 whitespace-nowrap">
                            {test.duration} Min
                          </td>
                          <td
                            className={`px-4 py-4 text-center text-xs font-semibold ${test.status === "published" ? "text-[#3AB000]" : "text-gray-400"}`}
                          >
                            {test.status === "published"
                              ? "Published"
                              : "Draft"}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={async () => {
                                  const res = await createPaperAPI.getDetails(
                                    test.id,
                                  );
                                  if (res?.success) {
                                    setDetailsTest(
                                      normalizeTest(res.data.test),
                                    );
                                    setShowDetailsModal(true);
                                  } else alert("Failed to load test details.");
                                }}
                                className="text-[#3AB000] hover:text-[#2d8a00] transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  const res = await createPaperAPI.getDetails(
                                    test.id,
                                  );
                                  if (res?.success) {
                                    setEditingTest(
                                      normalizeTest(res.data.test),
                                    );
                                    setShowModal(true);
                                  } else
                                    alert("Failed to load test for editing.");
                                }}
                                className="text-[#3AB000] hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleStatus(test.id)}
                                className={`transition-colors ${test.status === "published" ? "text-[#3AB000] hover:text-amber-600" : "text-[#3AB000] hover:text-[#2d8a00]"}`}
                                title={
                                  test.status === "published"
                                    ? "Move to Draft"
                                    : "Publish"
                                }
                              >
                                {test.status === "published" ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Globe className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(test.id)}
                                className="text-[#3AB000] hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {isLoadingTests ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded border border-gray-200 p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-400 text-sm">
                  No events found.
                </div>
              ) : (
                pagedTests.map((test, idx) => (
                  <div
                    key={test.id}
                    className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">
                          S.N: {(currentPage - 1) * itemsPerPage + idx + 1}
                        </div>
                        <div className="text-sm font-semibold text-[#2d8a00]">
                          {test.title}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 ${test.status === "published" ? "text-[#3AB000]" : "text-gray-400"}`}
                      >
                        {test.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex">
                        <span className="font-medium w-24 flex-shrink-0">
                          Questions:
                        </span>
                        <span>{test.totalQuestions}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-24 flex-shrink-0">
                          Students:
                        </span>
                        <span>{test.assignedStudents?.length || 0}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-24 flex-shrink-0">
                          Duration:
                        </span>
                        <span>{test.duration} Min</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={async () => {
                          const res = await createPaperAPI.getDetails(test.id);
                          if (res?.success) {
                            setDetailsTest(normalizeTest(res.data.test));
                            setShowDetailsModal(true);
                          }
                        }}
                        className="text-[#3AB000] hover:text-[#2d8a00] p-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          const res = await createPaperAPI.getDetails(test.id);
                          if (res?.success) {
                            setEditingTest(normalizeTest(res.data.test));
                            setShowModal(true);
                          }
                        }}
                        className="text-[#3AB000] hover:text-blue-600 p-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(test.id)}
                        className="text-[#3AB000] hover:text-amber-600 p-2 transition-colors"
                      >
                        {test.status === "published" ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="text-[#3AB000] hover:text-red-600 p-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoadingTests && filtered.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-[#3AB000] disabled:opacity-50 text-white px-8 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
                  >
                    Back
                  </button>
                  <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                    {(() => {
                      const pages = [];
                      const visible = new Set([
                        1,
                        2,
                        totalPages - 1,
                        totalPages,
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                      ]);
                      for (let i = 1; i <= totalPages; i++) {
                        if (visible.has(i)) pages.push(i);
                        else if (pages[pages.length - 1] !== "...")
                          pages.push("...");
                      }
                      return pages.map((page, i) =>
                        page === "..." ? (
                          <span key={i} className="px-1 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${currentPage === page ? "text-[#3AB000] font-bold" : "text-gray-600 hover:text-[#3AB000]"}`}
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
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="bg-[#3AB000] disabled:opacity-50 text-white px-8 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-[#2d8a00] transition-colors rounded-sm flex-1 sm:flex-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
