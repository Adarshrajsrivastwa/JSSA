// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { jobPostingsAPI, paymentsAPI } from "../utils/api.js";

// const GREEN = "#3AB000";

// export default function JobDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showApplyForm, setShowApplyForm] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [applying, setApplying] = useState(false);
//   const [calculatingFee, setCalculatingFee] = useState(false);
//   const [feeAmount, setFeeAmount] = useState(0);
//   const [photo, setPhoto] = useState(null);
//   const [signature, setSignature] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [signaturePreview, setSignaturePreview] = useState(null);
//   const [agreed1, setAgreed1] = useState(false);
//   const [agreed2, setAgreed2] = useState(false);
//   const [formData, setFormData] = useState({
//     applicationNumber: "",
//     candidateName: "",
//     fatherName: "",
//     motherName: "",
//     dob: "",
//     gender: "",
//     nationality: "",
//     category: "",
//     aadhar: "",
//     pan: "",
//     mobile: "",
//     email: "",
//     address: "",
//     state: "",
//     district: "",
//     block: "",
//     panchayat: "",
//     pincode: "",
//     higherEducation: "",
//     board: "",
//     marks: "",
//     markPercentage: "",
//   });

//   // Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // Calculate fee when gender/category changes (public endpoint, no token needed)
//   useEffect(() => {
//     if (formData.gender && formData.category && id) {
//       calculateFee();
//     } else {
//       setFeeAmount(0);
//     }
//   }, [formData.gender, formData.category, id]);

//   const calculateFee = async () => {
//     try {
//       setCalculatingFee(true);
//       const response = await paymentsAPI.calculateFee(
//         id,
//         formData.gender,
//         formData.category
//       );
//       if (response.success) {
//         setFeeAmount(response.data.amount || 0);
//       }
//     } catch (err) {
//       console.error("Fee calculation error:", err);
//       setFeeAmount(0);
//     } finally {
//       setCalculatingFee(false);
//     }
//   };

//   // Helper function to get PDF URL from job posting
//   const getPdfUrl = () => {
//     if (!job) return null;
//     // Check various possible PDF field names
//     return job.pdf || job.postingPdf || job.document || job.pdfUrl || job.pdfFile || null;
//   };

//   // Handle PDF download
//   const handlePdfDownload = (pdfUrl) => {
//     if (!pdfUrl) return;

//     // If it's a full URL, open directly
//     if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
//       window.open(pdfUrl, '_blank');
//     } else {
//       // If it's a relative path, construct the full URL using environment variable
//       const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '';
//       if (!apiBaseUrl) {
//         console.error("VITE_API_URL or VITE_BACKEND_URL must be set in .env file");
//         alert("PDF download failed: API URL not configured");
//         return;
//       }
//       // Remove /api suffix if present, as we'll add the path directly
//       const baseUrl = apiBaseUrl.replace(/\/api$/, '');
//       const fullUrl = pdfUrl.startsWith('/')
//         ? `${baseUrl}${pdfUrl}`
//         : `${baseUrl}/${pdfUrl}`;
//       window.open(fullUrl, '_blank');
//     }
//   };

//   useEffect(() => {
//     const fetchJob = async () => {
//       try {
//         setLoading(true);
//         const response = await jobPostingsAPI.getById(id);
//         if (response.success && response.data.posting) {
//           setJob(response.data.posting);
//         } else {
//           setError("Job posting not found");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to load job details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchJob();
//     }
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const updated = { ...prev, [name]: value };

//       // Auto-generate application number when candidate name changes
//       if (name === "candidateName" && value) {
//         const now = new Date();
//         const month = String(now.getMonth() + 1).padStart(2, "0");
//         const year = now.getFullYear();
//         const namePart = value
//           .replace(/\s+/g, "")
//           .substring(0, 4)
//           .toUpperCase()
//           .padEnd(4, "X");
//         updated.applicationNumber = `${namePart}${month}${year}`;
//       }

//       return updated;
//     });
//   };

//   const handleFileChange = (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 3 * 1024 * 1024) {
//         alert("File size must be less than 3MB");
//         return;
//       }
//       if (type === "photo") {
//         setPhoto(file);
//         const reader = new FileReader();
//         reader.onloadend = () => setPhotoPreview(reader.result);
//         reader.readAsDataURL(file);
//       } else if (type === "signature") {
//         setSignature(file);
//         const reader = new FileReader();
//         reader.onloadend = () => setSignaturePreview(reader.result);
//         reader.readAsDataURL(file);
//       }
//     }
//   };

//   const convertFileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handlePreview = (e) => {
//     e.preventDefault();

//     if (!agreed1 || !agreed2) {
//       alert("Please accept the terms and conditions");
//       return;
//     }

//     if (!photo || !signature) {
//       alert("Please upload photo and signature");
//       return;
//     }

//     // Show preview page
//     setShowPreview(true);
//   };

//   const handleApply = async () => {
//     setApplying(true);

//     try {
//       // Convert files to base64
//       const photoBase64 = await convertFileToBase64(photo);
//       const signatureBase64 = await convertFileToBase64(signature);

//       // Get API URL from environment - must be set in .env file
//       const apiUrl =
//         import.meta.env.VITE_API_URL ||
//         import.meta.env.VITE_BACKEND_URL ||
//         "";

//       if (!apiUrl) {
//         throw new Error("VITE_API_URL or VITE_BACKEND_URL must be set in .env file");
//       }

//       // Create application first
//       const applyResponse = await fetch(
//         `${apiUrl}/applications/apply`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             applicationNumber: formData.applicationNumber,
//             candidateName: formData.candidateName,
//             fatherName: formData.fatherName,
//             motherName: formData.motherName,
//             dob: formData.dob,
//             gender: formData.gender,
//             nationality: formData.nationality,
//             category: formData.category,
//             aadhar: formData.aadhar,
//             pan: formData.pan,
//             mobile: formData.mobile,
//             email: formData.email,
//             address: formData.address,
//             state: formData.state,
//             district: formData.district,
//             block: formData.block,
//             panchayat: formData.panchayat,
//             pincode: formData.pincode,
//             higherEducation: formData.higherEducation,
//             board: formData.board,
//             marks: formData.marks,
//             markPercentage: formData.markPercentage,
//             jobPostingId: id,
//             photo: photoBase64,
//             signature: signatureBase64,
//           }),
//         }
//       );

//       const applyData = await applyResponse.json();

//       if (!applyData.success) {
//         throw new Error(applyData.message || "Failed to create application");
//       }

//       const applicationId = applyData.data.application._id;
//       const token = applyData.data.token;

//       // If fee is zero, skip payment
//       if (feeAmount <= 0) {
//         alert(
//           `Application submitted successfully!${
//             applyData.data.defaultPassword
//               ? `\nYour default password is: ${applyData.data.defaultPassword}`
//               : ""
//           }`
//         );
//         setShowApplyForm(false);
//               setShowPreview(false);
//         resetForm();
//         return;
//       }

//       // Create payment order with token
//       const orderResponse = await paymentsAPI.createOrder(
//         id,
//         formData.gender,
//         formData.category,
//         token
//       );

//       if (!orderResponse.success) {
//         throw new Error(orderResponse.error || "Failed to create payment order");
//       }

//       const { orderId, amount, amountInRupees, keyId } = orderResponse.data;

//       // Check if Razorpay is loaded
//       if (!window.Razorpay) {
//         throw new Error("Razorpay payment gateway is not loaded. Please refresh the page.");
//       }

//       // Initialize Razorpay checkout
//       const options = {
//         key: keyId,
//         amount: amount,
//         currency: "INR",
//         name: "JSSA Application Fee",
//         description: `Application Fee - ₹${amountInRupees}`,
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             // Verify payment with token
//             const verifyResponse = await paymentsAPI.verifyPayment(
//               response.razorpay_order_id,
//               response.razorpay_payment_id,
//               response.razorpay_signature,
//               applicationId,
//               token
//             );

//             if (verifyResponse.success) {
//               alert(
//                 `Payment successful! Application submitted.${
//                   applyData.data.defaultPassword
//                     ? `\nYour default password is: ${applyData.data.defaultPassword}`
//                     : ""
//                 }`
//               );
//               setShowApplyForm(false);
//               setShowPreview(false);
//               resetForm();
//             } else {
//               alert("Payment verification failed. Please contact support.");
//             }
//           } catch (err) {
//             console.error("Payment verification error:", err);
//             alert("Payment verification failed. Please contact support.");
//           } finally {
//             setApplying(false);
//           }
//         },
//         prefill: {
//           name: formData.candidateName || "",
//           email: formData.email || "",
//           contact: formData.mobile || "",
//         },
//         theme: {
//           color: GREEN,
//         },
//         modal: {
//           ondismiss: function () {
//             setApplying(false);
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       alert("Error: " + err.message);
//       setApplying(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       applicationNumber: "",
//       candidateName: "",
//       fatherName: "",
//       motherName: "",
//       dob: "",
//       gender: "",
//       nationality: "",
//       category: "",
//       aadhar: "",
//       pan: "",
//       mobile: "",
//       email: "",
//       address: "",
//       state: "",
//       district: "",
//       block: "",
//       panchayat: "",
//       pincode: "",
//       higherEducation: "",
//       board: "",
//       marks: "",
//       markPercentage: "",
//     });
//     setPhoto(null);
//     setSignature(null);
//     setPhotoPreview(null);
//     setSignaturePreview(null);
//     setAgreed1(false);
//     setAgreed2(false);
//     setFeeAmount(0);
//     setShowPreview(false);
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#f5f5f5",
//         }}
//       >
//         <div style={{ fontSize: 18, color: "#666" }}>Loading job details...</div>
//       </div>
//     );
//   }

//   if (error || !job) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           gap: 20,
//           background: "#f5f5f5",
//         }}
//       >
//         <div style={{ fontSize: 18, color: "#e53e3e" }}>
//           {error || "Job posting not found"}
//         </div>
//         <button
//           onClick={() => navigate("/")}
//           style={{
//             padding: "10px 20px",
//             background: GREEN,
//             color: "#fff",
//             border: "none",
//             borderRadius: 4,
//             cursor: "pointer",
//             fontSize: 14,
//             fontWeight: 600,
//           }}
//         >
//           Go Back Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(to bottom, #f0f9ff 0%, #f5f5f5 100%)",
//         fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
//           padding: "16px 24px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           color: "#fff",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         <button
//           onClick={() => navigate("/")}
//           style={{
//             background: "rgba(255,255,255,0.25)",
//             border: "none",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: 14,
//             padding: "10px 18px",
//             borderRadius: 6,
//             cursor: "pointer",
//             transition: "all 0.3s",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.background = "rgba(255,255,255,0.35)";
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.background = "rgba(255,255,255,0.25)";
//           }}
//         >
//           ← Back
//         </button>
//         <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.5px" }}>
//           Job Details / नौकरी विवरण
//         </span>
//         <button
//           onClick={() => setShowApplyForm(!showApplyForm)}
//           style={{
//             background: "#fff",
//             border: "none",
//             color: GREEN,
//             fontWeight: 700,
//             fontSize: 14,
//             padding: "10px 20px",
//             borderRadius: 6,
//             cursor: "pointer",
//             transition: "all 0.3s",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           }}
//           onMouseEnter={(e) => {
//             e.target.style.transform = "translateY(-2px)";
//             e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.transform = "translateY(0)";
//             e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
//           }}
//         >
//           {showApplyForm ? "✕ Cancel" : "✓ Apply Now / अभी आवेदन करें"}
//         </button>
//       </div>

//       {/* Preview Modal */}
//       {showPreview && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0, 0, 0, 0.6)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//             padding: "20px",
//             overflowY: "auto",
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowPreview(false);
//             }
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 800,
//               width: "100%",
//               background: "#fff",
//               padding: 32,
//               borderRadius: 12,
//               boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//               border: "1px solid #e0e0e0",
//               position: "relative",
//               maxHeight: "90vh",
//               overflowY: "auto",
//             }}
//           >
//             <button
//               onClick={() => setShowPreview(false)}
//               style={{
//                 position: "absolute",
//                 top: 16,
//                 right: 16,
//                 background: "#f0f0f0",
//                 border: "none",
//                 borderRadius: "50%",
//                 width: 36,
//                 height: 36,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 20,
//                 color: "#666",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = "#e0e0e0";
//                 e.target.style.transform = "rotate(90deg)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = "#f0f0f0";
//                 e.target.style.transform = "rotate(0deg)";
//               }}
//             >
//               ✕
//             </button>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 marginBottom: 24,
//                 paddingBottom: 16,
//                 borderBottom: `3px solid ${GREEN}`,
//               }}
//             >
//               <div
//                 style={{
//                   width: 48,
//                   height: 48,
//                   background: `${GREEN}20`,
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 24,
//                 }}
//               >
//                 👁️
//               </div>
//               <h2
//                 style={{
//                   margin: 0,
//                   color: "#333",
//                   fontSize: 24,
//                   fontWeight: 700,
//                 }}
//               >
//                 Application Preview / आवेदन पूर्वावलोकन
//               </h2>
//             </div>

//           {/* Personal Details Preview */}
//           <div
//             style={{
//               background: "#f8f9fa",
//               padding: 20,
//               borderRadius: 8,
//               marginBottom: 24,
//               border: `2px solid ${GREEN}`,
//             }}
//           >
//             <h3
//             style={{
//               color: GREEN,
//               marginBottom: 16,
//               fontSize: 18,
//               fontWeight: 700,
//             }}
//             >
//               Personal Details / व्यक्तिगत विवरण
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Application Number</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.applicationNumber || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Candidate Name</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.candidateName || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Father's Name</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.fatherName || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Mother's Name</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.motherName || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Date of Birth</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.dob || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Gender</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                   {formData.gender === "male" ? "Male / पुरुष" : formData.gender === "female" ? "Female / महिला" : formData.gender === "other" ? "Other / अन्य" : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Nationality</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                   {formData.nationality === "indian" ? "Indian / भारतीय" : formData.nationality === "other" ? "Other / अन्य" : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Category</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                   {formData.category === "general" ? "General / सामान्य" :
//                    formData.category === "obc" ? "OBC / अन्य पिछड़ा वर्ग" :
//                    formData.category === "sc" ? "SC / अनुसूचित जाति" :
//                    formData.category === "st" ? "ST / अनुसूचित जनजाति" :
//                    formData.category === "ews" ? "EWS / आर्थिक रूप से कमजोर वर्ग" : "N/A"}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Aadhar Number</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.aadhar || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>PAN Number</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.pan || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Mobile Number</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.mobile || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Email ID</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.email || "N/A"}</div>
//               </div>
//             </div>
//             <div style={{ marginTop: 16 }}>
//               <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Permanent Address</div>
//               <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.address || "N/A"}</div>
//             </div>
//           </div>

//           {/* Address Details Preview */}
//           <div
//             style={{
//               background: "#f8f9fa",
//               padding: 20,
//               borderRadius: 8,
//               marginBottom: 24,
//               border: `2px solid ${GREEN}`,
//             }}
//           >
//             <h3
//               style={{
//                 color: GREEN,
//                 marginBottom: 16,
//                 fontSize: 18,
//                 fontWeight: 700,
//               }}
//             >
//               Address Details / पता विवरण
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>State</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.state || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>District</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.district || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Block</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.block || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Panchayat</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.panchayat || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Pincode</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.pincode || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {/* Education Details Preview */}
//           <div
//             style={{
//               background: "#f8f9fa",
//               padding: 20,
//               borderRadius: 8,
//               marginBottom: 24,
//               border: `2px solid ${GREEN}`,
//             }}
//           >
//             <h3
//               style={{
//                 color: GREEN,
//                 marginBottom: 16,
//                 fontSize: 18,
//                 fontWeight: 700,
//               }}
//             >
//               Education Details / शिक्षा विवरण
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Higher Education</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.higherEducation || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Board / University</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.board || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Marks</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.marks || "N/A"}</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Mark Percentage</div>
//                 <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{formData.markPercentage || "N/A"}%</div>
//               </div>
//             </div>
//           </div>

//           {/* Documents Preview */}
//           <div
//             style={{
//               background: "#f8f9fa",
//               padding: 20,
//               borderRadius: 8,
//               marginBottom: 24,
//               border: `2px solid ${GREEN}`,
//             }}
//           >
//             <h3
//               style={{
//                 color: GREEN,
//                 marginBottom: 16,
//                 fontSize: 18,
//                 fontWeight: 700,
//               }}
//             >
//               Documents / दस्तावेज़
//             </h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//               {photoPreview && (
//                 <div>
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Photograph</div>
//                   <img
//                     src={photoPreview}
//                     alt="Photo preview"
//                     style={{
//                       width: 120,
//                       height: 120,
//                       objectFit: "cover",
//                       borderRadius: 8,
//                       border: `2px solid ${GREEN}`,
//                     }}
//                   />
//                 </div>
//               )}
//               {signaturePreview && (
//                 <div>
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Signature</div>
//                   <img
//                     src={signaturePreview}
//                     alt="Signature preview"
//                     style={{
//                       width: 180,
//                       height: 80,
//                       objectFit: "contain",
//                       borderRadius: 8,
//                       border: `2px solid ${GREEN}`,
//                       background: "#fff",
//                       padding: 4,
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Payment Amount Display */}
//           {formData.gender && formData.category && (
//             <div
//               style={{
//                 background: "#fff3cd",
//                 padding: 24,
//                 borderRadius: 8,
//                 marginBottom: 24,
//                 border: `2px solid #ffc107`,
//                 textAlign: "center",
//               }}
//             >
//               <div style={{ fontSize: 16, color: "#666", marginBottom: 8, fontWeight: 600 }}>
//                 Application Fee / आवेदन शुल्क
//               </div>
//               <div style={{ fontSize: 32, fontWeight: 700, color: "#856404", marginBottom: 8 }}>
//                 ₹{feeAmount || 0}
//               </div>
//               <div style={{ fontSize: 14, color: "#666" }}>
//                 Based on: {formData.gender === "male" ? "Male" : formData.gender === "female" ? "Female" : "Other"} / {formData.category === "general" ? "General" : formData.category === "obc" ? "OBC" : formData.category === "sc" ? "SC" : formData.category === "st" ? "ST" : "EWS"}
//               </div>
//               {calculatingFee && (
//                 <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
//                   Calculating...
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div style={{ display: "flex", gap: 16 }}>
//             <button
//               onClick={() => setShowPreview(false)}
//               style={{
//                 flex: 1,
//                 padding: "16px",
//                 background: "#6c757d",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 10,
//                 fontSize: 16,
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 transition: "all 0.3s",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = "#5a6268";
//                 e.target.style.transform = "translateY(-2px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = "#6c757d";
//                 e.target.style.transform = "translateY(0)";
//               }}
//             >
//               ← Back to Edit / वापस संपादन करें
//             </button>
//             <button
//               onClick={handleApply}
//               disabled={applying}
//               style={{
//                 flex: 1,
//                 padding: "16px",
//                 background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 10,
//                 fontSize: 16,
//                 fontWeight: 700,
//                 cursor: applying ? "not-allowed" : "pointer",
//                 opacity: applying ? 0.7 : 1,
//                 transition: "all 0.3s",
//                 boxShadow: "0 4px 12px rgba(58, 176, 0, 0.3)",
//               }}
//               onMouseEnter={(e) => {
//                 if (!applying) {
//                   e.target.style.transform = "translateY(-2px)";
//                   e.target.style.boxShadow = "0 6px 16px rgba(58, 176, 0, 0.4)";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.transform = "translateY(0)";
//                 e.target.style.boxShadow = "0 4px 12px rgba(58, 176, 0, 0.3)";
//               }}
//             >
//               {applying
//                 ? "⏳ Processing..."
//                 : feeAmount > 0
//                 ? `✓ Submit & Pay ₹${feeAmount}`
//                 : "✓ Submit Application"}
//             </button>
//           </div>
//           </div>
//         </div>
//       )}

//       {/* Apply Form Modal */}
//       {showApplyForm && !showPreview && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0, 0, 0, 0.6)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//             padding: "20px",
//             overflowY: "auto",
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowApplyForm(false);
//             }
//           }}
//         >
//         <div
//           style={{
//             maxWidth: 650,
//               width: "100%",
//             background: "#fff",
//             padding: 32,
//             borderRadius: 12,
//             boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//             border: "1px solid #e0e0e0",
//               position: "relative",
//               maxHeight: "90vh",
//               overflowY: "auto",
//             }}
//           >
//             <button
//               onClick={() => setShowApplyForm(false)}
//               style={{
//                 position: "absolute",
//                 top: 16,
//                 right: 16,
//                 background: "#f0f0f0",
//                 border: "none",
//                 borderRadius: "50%",
//                 width: 36,
//                 height: 36,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 20,
//                 color: "#666",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = "#e0e0e0";
//                 e.target.style.transform = "rotate(90deg)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = "#f0f0f0";
//                 e.target.style.transform = "rotate(0deg)";
//               }}
//             >
//               ✕
//             </button>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//               marginBottom: 24,
//               paddingBottom: 16,
//               borderBottom: `3px solid ${GREEN}`,
//             }}
//           >
//             <div
//               style={{
//                 width: 48,
//                 height: 48,
//                 background: `${GREEN}20`,
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 24,
//               }}
//             >
//               📝
//             </div>
//             <h2
//               style={{
//                 margin: 0,
//                 color: "#333",
//                 fontSize: 24,
//                 fontWeight: 700,
//               }}
//             >
//               Application Form / आवेदन फॉर्म
//             </h2>
//           </div>
//           <form onSubmit={handlePreview}>
//             {/* Personal Details Section */}
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 padding: 20,
//                 borderRadius: 8,
//                 marginBottom: 24,
//                 border: `2px solid ${GREEN}`,
//               }}
//             >
//               <h3
//                 style={{
//                   color: GREEN,
//                   marginBottom: 16,
//                   fontSize: 18,
//                   fontWeight: 700,
//                 }}
//               >
//                 Personal Details / व्यक्तिगत विवरण
//               </h3>

//               <div style={{ marginBottom: 16 }}>
//                 <label
//                   style={{
//                     display: "block",
//                     marginBottom: 8,
//                     fontWeight: 600,
//                     color: "#444",
//                     fontSize: 14,
//                   }}
//                 >
//                   Application Number (Auto-generated) / आवेदन संख्या (स्वचालित)
//                 </label>
//                 <input
//                   type="text"
//                   name="applicationNumber"
//                   value={formData.applicationNumber}
//                   onChange={handleInputChange}
//                   placeholder="Will be auto-generated based on name"
//                   readOnly
//                   style={{
//                     width: "100%",
//                     padding: "12px 16px",
//                     border: "2px solid #e0e0e0",
//                     borderRadius: 8,
//                     fontSize: 15,
//                     transition: "all 0.3s",
//                     boxSizing: "border-box",
//                     background: "#f5f5f5",
//                     color: "#666",
//                     cursor: "not-allowed",
//                   }}
//                 />
//                 <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//                   Format: First 4 letters of name + Month + Year (e.g., RAME012024)
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Candidate Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="candidateName"
//                     value={formData.candidateName}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Full name"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Father's Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="fatherName"
//                     value={formData.fatherName}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Father's full name"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <label
//                   style={{
//                     display: "block",
//                     marginBottom: 8,
//                     fontWeight: 600,
//                     color: "#444",
//                     fontSize: 14,
//                   }}
//                 >
//                   Mother's Name
//                 </label>
//                 <input
//                   type="text"
//                   name="motherName"
//                   value={formData.motherName}
//                   onChange={handleInputChange}
//                   placeholder="Mother's full name"
//                   style={{
//                     width: "100%",
//                     padding: "12px 16px",
//                     border: "2px solid #e0e0e0",
//                     borderRadius: 8,
//                     fontSize: 15,
//                     transition: "all 0.3s",
//                     boxSizing: "border-box",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = GREEN;
//                     e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "#e0e0e0";
//                     e.target.style.boxShadow = "none";
//                   }}
//                 />
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Date of Birth *
//                   </label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Gender *
//                   </label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                       background: "#fff",
//                       cursor: "pointer",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male / पुरुष</option>
//                     <option value="female">Female / महिला</option>
//                     <option value="other">Other / अन्य</option>
//                   </select>
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Nationality *
//                   </label>
//                   <select
//                     name="nationality"
//                     value={formData.nationality}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                       background: "#fff",
//                       cursor: "pointer",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   >
//                     <option value="">Select Nationality</option>
//                     <option value="indian">Indian / भारतीय</option>
//                     <option value="other">Other / अन्य</option>
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                       background: "#fff",
//                       cursor: "pointer",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   >
//                     <option value="">Select Category</option>
//                     <option value="general">General / सामान्य</option>
//                     <option value="obc">OBC / अन्य पिछड़ा वर्ग</option>
//                     <option value="sc">SC / अनुसूचित जाति</option>
//                     <option value="st">ST / अनुसूचित जनजाति</option>
//                     <option value="ews">EWS / आर्थिक रूप से कमजोर वर्ग</option>
//                   </select>
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Aadhar Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="aadhar"
//                     value={formData.aadhar}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="XXXX XXXX XXXX"
//                     maxLength={14}
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     PAN Number
//                   </label>
//                   <input
//                     type="text"
//                     name="pan"
//                     value={formData.pan}
//                     onChange={handleInputChange}
//                     placeholder="ABCDE1234F"
//                     maxLength={10}
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Mobile Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleInputChange}
//                     required
//                     pattern="[0-9]{10}"
//                     maxLength="10"
//                     placeholder="10 digit mobile number"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Email ID *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="example@email.com"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ marginBottom: 16 }}>
//                 <label
//                   style={{
//                     display: "block",
//                     marginBottom: 8,
//                     fontWeight: 600,
//                     color: "#444",
//                     fontSize: 14,
//                   }}
//                 >
//                   Permanent Address *
//                 </label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter complete permanent address"
//                   rows={3}
//                   style={{
//                     width: "100%",
//                     padding: "12px 16px",
//                     border: "2px solid #e0e0e0",
//                     borderRadius: 8,
//                     fontSize: 15,
//                     transition: "all 0.3s",
//                     boxSizing: "border-box",
//                     resize: "vertical",
//                     fontFamily: "inherit",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = GREEN;
//                     e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "#e0e0e0";
//                     e.target.style.boxShadow = "none";
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Address Details Section */}
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 padding: 20,
//                 borderRadius: 8,
//                 marginBottom: 24,
//                 border: `2px solid ${GREEN}`,
//               }}
//             >
//               <h3
//                 style={{
//                   color: GREEN,
//                   marginBottom: 16,
//                   fontSize: 18,
//                   fontWeight: 700,
//                 }}
//               >
//                 Address Details / पता विवरण
//               </h3>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     State *
//                   </label>
//                   <select
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     required
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                       background: "#fff",
//                       cursor: "pointer",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   >
//                     <option value="">Select State</option>
//                     <option value="assam">Assam / असम</option>
//                     <option value="bihar">Bihar / बिहार</option>
//                     <option value="chhattisgarh">Chhattisgarh / छत्तीसगढ़</option>
//                     <option value="delhi">Delhi / दिल्ली</option>
//                     <option value="gujarat">Gujarat / गुजरात</option>
//                     <option value="haryana">Haryana / हरियाणा</option>
//                     <option value="jharkhand">Jharkhand / झारखंड</option>
//                     <option value="madhya_pradesh">Madhya Pradesh / मध्य प्रदेश</option>
//                     <option value="maharashtra">Maharashtra / महाराष्ट्र</option>
//                     <option value="odisha">Odisha / ओडिशा</option>
//                     <option value="rajasthan">Rajasthan / राजस्थान</option>
//                     <option value="uttar_pradesh">Uttar Pradesh / उत्तर प्रदेश</option>
//                     <option value="uttarakhand">Uttarakhand / उत्तराखंड</option>
//                     <option value="west_bengal">West Bengal / पश्चिम बंगाल</option>
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     District *
//                   </label>
//                   <input
//                     type="text"
//                     name="district"
//                     value={formData.district}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="District name"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Block
//                   </label>
//                   <input
//                     type="text"
//                     name="block"
//                     value={formData.block}
//                     onChange={handleInputChange}
//                     placeholder="Block name"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Panchayat
//                   </label>
//                   <input
//                     type="text"
//                     name="panchayat"
//                     value={formData.panchayat}
//                     onChange={handleInputChange}
//                     placeholder="Panchayat name"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Pincode *
//                   </label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="XXXXXX"
//                     maxLength={6}
//                     pattern="[0-9]{6}"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Education Details Section */}
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 padding: 20,
//                 borderRadius: 8,
//                 marginBottom: 24,
//                 border: `2px solid ${GREEN}`,
//               }}
//             >
//               <h3
//                 style={{
//                   color: GREEN,
//                   marginBottom: 16,
//                   fontSize: 18,
//                   fontWeight: 700,
//                 }}
//               >
//                 Education Details / शिक्षा विवरण
//               </h3>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Higher Education *
//                   </label>
//                   <input
//                     type="text"
//                     name="higherEducation"
//                     value={formData.higherEducation}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g. B.Tech, MBA, M.Sc"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Board / University *
//                   </label>
//                   <input
//                     type="text"
//                     name="board"
//                     value={formData.board}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="University or Board name"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Marks *
//                   </label>
//                   <input
//                     type="number"
//                     name="marks"
//                     value={formData.marks}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Total marks obtained"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Mark Percentage *
//                   </label>
//                   <input
//                     type="number"
//                     name="markPercentage"
//                     value={formData.markPercentage}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g. 75.5"
//                     step="0.01"
//                     style={{
//                       width: "100%",
//                       padding: "12px 16px",
//                       border: "2px solid #e0e0e0",
//                       borderRadius: 8,
//                       fontSize: 15,
//                       transition: "all 0.3s",
//                       boxSizing: "border-box",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = GREEN;
//                       e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "#e0e0e0";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Photo and Signature Upload */}
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 padding: 20,
//                 borderRadius: 8,
//                 marginBottom: 24,
//                 border: `2px solid ${GREEN}`,
//               }}
//             >
//               <h3
//                 style={{
//                   color: GREEN,
//                   marginBottom: 16,
//                   fontSize: 18,
//                   fontWeight: 700,
//                 }}
//               >
//                 Documents / दस्तावेज़
//               </h3>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Photograph * (Max 3MB)
//                   </label>
//                   <label
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 12,
//                       padding: "12px 16px",
//                       border: `2px dashed ${GREEN}`,
//                       background: "#e8f5e9",
//                       borderRadius: 8,
//                       cursor: "pointer",
//                       transition: "all 0.3s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = "#d4edda";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = "#e8f5e9";
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: 32,
//                         height: 32,
//                         background: GREEN,
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#fff",
//                         fontSize: 16,
//                       }}
//                     >
//                       📷
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>
//                         {photo ? photo.name : "Choose Photo"}
//                       </div>
//                       <div style={{ fontSize: 12, color: "#666" }}>Max 3MB</div>
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange(e, "photo")}
//                       required
//                       style={{ display: "none" }}
//                     />
//                   </label>
//                   {photoPreview && (
//                     <img
//                       src={photoPreview}
//                       alt="Photo preview"
//                       style={{
//                         marginTop: 12,
//                         width: 100,
//                         height: 100,
//                         objectFit: "cover",
//                         borderRadius: 8,
//                         border: `2px solid ${GREEN}`,
//                       }}
//                     />
//                   )}
//                 </div>

//                 <div style={{ marginBottom: 16 }}>
//                   <label
//                     style={{
//                       display: "block",
//                       marginBottom: 8,
//                       fontWeight: 600,
//                       color: "#444",
//                       fontSize: 14,
//                     }}
//                   >
//                     Signature * (Max 3MB)
//                   </label>
//                   <label
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 12,
//                       padding: "12px 16px",
//                       border: `2px dashed ${GREEN}`,
//                       background: "#e8f5e9",
//                       borderRadius: 8,
//                       cursor: "pointer",
//                       transition: "all 0.3s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = "#d4edda";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = "#e8f5e9";
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: 32,
//                         height: 32,
//                         background: GREEN,
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#fff",
//                         fontSize: 16,
//                       }}
//                     >
//                       ✍️
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>
//                         {signature ? signature.name : "Choose Signature"}
//                       </div>
//                       <div style={{ fontSize: 12, color: "#666" }}>Max 3MB</div>
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange(e, "signature")}
//                       required
//                       style={{ display: "none" }}
//                     />
//                   </label>
//                   {signaturePreview && (
//                     <img
//                       src={signaturePreview}
//                       alt="Signature preview"
//                       style={{
//                         marginTop: 12,
//                         width: 150,
//                         height: 60,
//                         objectFit: "contain",
//                         borderRadius: 8,
//                         border: `2px solid ${GREEN}`,
//                         background: "#fff",
//                         padding: 4,
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Fee Display */}
//             {feeAmount > 0 && (
//               <div
//                 style={{
//                   background: "#fff3cd",
//                   padding: 16,
//                   borderRadius: 8,
//                   marginBottom: 24,
//                   border: `2px solid #ffc107`,
//                   textAlign: "center",
//                 }}
//               >
//                 <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
//                   Application Fee / आवेदन शुल्क
//                 </div>
//                 <div style={{ fontSize: 24, fontWeight: 700, color: "#856404" }}>
//                   ₹{feeAmount}
//                 </div>
//                 {calculatingFee && (
//                   <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//                     Calculating...
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Declaration */}
//             <div
//               style={{
//                 background: "#f8f9fa",
//                 padding: 20,
//                 borderRadius: 8,
//                 marginBottom: 24,
//                 border: `2px solid ${GREEN}`,
//               }}
//             >
//               <h3
//                 style={{
//                   color: GREEN,
//                   marginBottom: 16,
//                   fontSize: 18,
//                   fontWeight: 700,
//                 }}
//               >
//                 Declaration / घोषणा
//               </h3>

//               <label
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: 12,
//                   marginBottom: 12,
//                   cursor: "pointer",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={agreed1}
//                   onChange={(e) => setAgreed1(e.target.checked)}
//                   style={{
//                     width: 18,
//                     height: 18,
//                     marginTop: 2,
//                     cursor: "pointer",
//                     accentColor: GREEN,
//                   }}
//                 />
//                 <span style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
//                   I have read and agree to the{" "}
//                   <span style={{ color: GREEN, fontWeight: 600, textDecoration: "underline" }}>
//                     Terms and Conditions
//                   </span>
//                   .
//                 </span>
//               </label>

//               <label
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: 12,
//                   cursor: "pointer",
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={agreed2}
//                   onChange={(e) => setAgreed2(e.target.checked)}
//                   style={{
//                     width: 18,
//                     height: 18,
//                     marginTop: 2,
//                     cursor: "pointer",
//                     accentColor: GREEN,
//                   }}
//                 />
//                 <span style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
//                   I declare that all the information given in this application form is
//                   correct to the best of my knowledge and belief.
//                 </span>
//               </label>
//             </div>

//             <button
//               type="submit"
//               disabled={!agreed1 || !agreed2 || !photo || !signature}
//               style={{
//                 width: "100%",
//                 padding: "16px",
//                 background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 10,
//                 fontSize: 16,
//                 fontWeight: 700,
//                 cursor: !agreed1 || !agreed2 || !photo || !signature ? "not-allowed" : "pointer",
//                 opacity: !agreed1 || !agreed2 || !photo || !signature ? 0.7 : 1,
//                 transition: "all 0.3s",
//                 boxShadow: "0 4px 12px rgba(58, 176, 0, 0.3)",
//                 marginTop: 8,
//               }}
//               onMouseEnter={(e) => {
//                 if (agreed1 && agreed2 && photo && signature) {
//                   e.target.style.transform = "translateY(-2px)";
//                   e.target.style.boxShadow = "0 6px 16px rgba(58, 176, 0, 0.4)";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.transform = "translateY(0)";
//                 e.target.style.boxShadow = "0 4px 12px rgba(58, 176, 0, 0.3)";
//               }}
//             >
//               ✓ Preview Application / आवेदन पूर्वावलोकन
//             </button>
//           </form>
//           </div>
//         </div>
//       )}

//       {/* Job Details - Hindi Left, English Right */}
//       <div
//         style={{
//           maxWidth: 1400,
//           margin: "32px auto",
//           padding: "0 24px",
//         }}
//       >
//         {/* Advertisement Number Banner */}
//         <div
//           style={{
//             background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
//             color: "#fff",
//             padding: "20px 32px",
//             borderRadius: "12px 12px 0 0",
//             marginBottom: 0,
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               gap: 16,
//             }}
//           >
//             <div>
//               <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>
//                 Advertisement Number / विज्ञप्ति संख्या
//               </div>
//               <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "1px" }}>
//                 {job.advtNo}
//               </div>
//             </div>
//             {job.status && (
//               <div
//                 style={{
//                   background: "rgba(255,255,255,0.25)",
//                   padding: "8px 16px",
//                   borderRadius: 20,
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 {job.status}
//               </div>
//             )}
//           </div>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: 0,
//             background: "#fff",
//             borderRadius: "0 0 12px 12px",
//             overflow: "hidden",
//             boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//             border: "1px solid #e0e0e0",
//           }}
//         >
//           {/* Hindi Section - Left */}
//           <div
//             style={{
//               padding: "32px",
//               borderRight: "3px solid #e8f5e9",
//               background: "linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 marginBottom: 24,
//                 paddingBottom: 16,
//                 borderBottom: `3px solid ${GREEN}`,
//               }}
//             >
//               <div
//                 style={{
//                   width: 40,
//                   height: 40,
//                   background: `${GREEN}20`,
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 20,
//                 }}
//               >
//                 📄
//               </div>
//               <h2
//                 style={{
//                   color: GREEN,
//                   margin: 0,
//                   fontSize: 22,
//                   fontWeight: 700,
//                 }}
//               >
//                 {job.title?.hi || job.postTitle?.hi || "नौकरी विवरण"}
//               </h2>
//             </div>

//             <div style={{ lineHeight: 2, color: "#333" }}>

//               {job.post?.hi && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     पद / Post
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.post.hi}
//                   </div>
//                   {getPdfUrl() && (
//                     <button
//                       onClick={() => handlePdfDownload(getPdfUrl())}
//                       style={{
//                         marginTop: 12,
//                         padding: "8px 16px",
//                         background: GREEN,
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 6,
//                         fontSize: 14,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 8,
//                         transition: "all 0.3s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.background = "#2d8a00";
//                         e.target.style.transform = "translateY(-2px)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.background = GREEN;
//                         e.target.style.transform = "translateY(0)";
//                       }}
//                     >
//                       📥 PDF डाउनलोड करें / Download PDF
//                     </button>
//                   )}
//                 </div>
//               )}

//               {job.location?.hi && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     स्थान / Location
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.location.hi}
//                   </div>
//                 </div>
//               )}

//               {job.education?.hi && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     शिक्षा / Education
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.education.hi}
//                   </div>
//                 </div>
//               )}

//               {job.income?.hi && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     आय / Income
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.income.hi}
//                   </div>
//                 </div>
//               )}

//               {job.ageLimit?.hi && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     आयु सीमा / Age Limit
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.ageLimit.hi}
//                   </div>
//                 </div>
//               )}

//               {/* Fee Structure Table */}
//               {job.feeStructure && Object.keys(job.feeStructure).some(key => job.feeStructure[key]) && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "20px",
//                     background: "#fff9e6",
//                     borderRadius: 8,
//                     border: `2px solid #ffc107`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 16,
//                       fontWeight: 700,
//                       color: "#856404",
//                       marginBottom: 16,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                   >
//                     💰 शुल्क संरचना / Fee Structure
//                   </div>
//                   <div style={{ overflowX: "auto" }}>
//                     <table
//                       style={{
//                         width: "100%",
//                         borderCollapse: "collapse",
//                         fontSize: 14,
//                       }}
//                     >
//                       <thead>
//                         <tr style={{ background: "#ffc107", color: "#333" }}>
//                           <th
//                             style={{
//                               padding: "10px 12px",
//                               textAlign: "left",
//                               border: "1px solid #ffc107",
//                               fontWeight: 700,
//                             }}
//                           >
//                             श्रेणी / Category
//                           </th>
//                           <th
//                             style={{
//                               padding: "10px 12px",
//                               textAlign: "center",
//                               border: "1px solid #ffc107",
//                               fontWeight: 700,
//                             }}
//                           >
//                             पुरुष / Male
//                           </th>
//                           <th
//                             style={{
//                               padding: "10px 12px",
//                               textAlign: "center",
//                               border: "1px solid #ffc107",
//                               fontWeight: 700,
//                             }}
//                           >
//                             महिला / Female
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {[
//                           { key: "general", label: "सामान्य / General" },
//                           { key: "obc", label: "OBC" },
//                           { key: "sc", label: "SC" },
//                           { key: "st", label: "ST" },
//                           { key: "ews", label: "EWS" },
//                         ].map((cat, idx) => {
//                           const maleFee = job.feeStructure[`male_${cat.key}`];
//                           const femaleFee = job.feeStructure[`female_${cat.key}`];
//                           if (!maleFee && !femaleFee) return null;
//                           return (
//                             <tr
//                               key={cat.key}
//                               style={{
//                                 background: idx % 2 === 0 ? "#fff" : "#fffbf0",
//                               }}
//                             >
//                               <td
//                                 style={{
//                                   padding: "10px 12px",
//                                   border: "1px solid #e0e0e0",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {cat.label}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "10px 12px",
//                                   border: "1px solid #e0e0e0",
//                                   textAlign: "center",
//                                   color: "#856404",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {maleFee || "-"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "10px 12px",
//                                   border: "1px solid #e0e0e0",
//                                   textAlign: "center",
//                                   color: "#856404",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {femaleFee || "-"}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 {job.lastDate && (
//                   <div
//                     style={{
//                       marginBottom: 20,
//                       padding: "16px",
//                       background: "#e3f2fd",
//                       borderRadius: 8,
//                       borderLeft: `4px solid #2196f3`,
//                     }}
//                   >
//                     <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                       अंतिम तिथि / Last Date
//                     </div>
//                     <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
//                       {job.lastDate}
//                     </div>
//                   </div>
//                 )}

//                 {job.applicationOpeningDate && (
//                   <div
//                     style={{
//                       marginBottom: 20,
//                       padding: "16px",
//                       background: "#e8f5e9",
//                       borderRadius: 8,
//                       borderLeft: `4px solid ${GREEN}`,
//                     }}
//                   >
//                     <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                       आवेदन शुरू / Opening Date
//                     </div>
//                     <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>
//                       {job.applicationOpeningDate}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {job.selectionProcess?.hi && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "20px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     border: `2px solid ${GREEN}`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 700,
//                       color: GREEN,
//                       marginBottom: 12,
//                     }}
//                   >
//                     चयन प्रक्रिया / Selection Process
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       lineHeight: 1.8,
//                       color: "#333",
//                       whiteSpace: "pre-wrap",
//                     }}
//                   >
//                     {job.selectionProcess.hi}
//                   </div>
//                 </div>
//               )}

//               {job.advertisementFileHi && (
//                 <div
//                   style={{
//                     marginTop: 24,
//                     padding: "16px",
//                     background: `${GREEN}10`,
//                     borderRadius: 8,
//                     border: `2px dashed ${GREEN}`,
//                     textAlign: "center",
//                   }}
//                 >
//                   <a
//                     href={job.advertisementFileHi}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       color: GREEN,
//                       textDecoration: "none",
//                       fontWeight: 700,
//                       fontSize: 16,
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.textDecoration = "underline";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.textDecoration = "none";
//                     }}
//                   >
//                     📥 विज्ञापन डाउनलोड करें (PDF)
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* English Section - Right */}
//           <div style={{ padding: "32px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 marginBottom: 24,
//                 paddingBottom: 16,
//                 borderBottom: `3px solid ${GREEN}`,
//               }}
//             >
//               <div
//                 style={{
//                   width: 40,
//                   height: 40,
//                   background: `${GREEN}20`,
//                   borderRadius: "50%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 20,
//                 }}
//               >
//                 📄
//               </div>
//               <h2
//                 style={{
//                   color: GREEN,
//                   margin: 0,
//                   fontSize: 22,
//                   fontWeight: 700,
//                 }}
//               >
//                 {job.title?.en || job.postTitle?.en || "Job Details"}
//               </h2>
//             </div>

//             <div style={{ lineHeight: 2, color: "#333" }}>
//               {job.post?.en && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     Post / पद
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.post.en}
//                   </div>
//                   {getPdfUrl() && (
//                     <button
//                       onClick={() => handlePdfDownload(getPdfUrl())}
//                       style={{
//                         marginTop: 12,
//                         padding: "8px 16px",
//                         background: GREEN,
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 6,
//                         fontSize: 14,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 8,
//                         transition: "all 0.3s ease",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.background = "#2d8a00";
//                         e.target.style.transform = "translateY(-2px)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.background = GREEN;
//                         e.target.style.transform = "translateY(0)";
//                       }}
//                     >
//                       📥 Download PDF / PDF डाउनलोड करें
//                     </button>
//                   )}
//                 </div>
//               )}

//               {job.location?.en && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     Location / स्थान
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.location.en}
//                   </div>
//                 </div>
//               )}

//               {job.education?.en && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     Education / शिक्षा
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.education.en}
//                   </div>
//                 </div>
//               )}

//               {job.income?.en && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     Income / आय
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.income.en}
//                   </div>
//                 </div>
//               )}

//               {job.ageLimit?.en && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "16px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     borderLeft: `4px solid ${GREEN}`,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                     Age Limit / आयु सीमा
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
//                     {job.ageLimit.en}
//                   </div>
//                 </div>
//               )}

//               {/* Fee Structure Table */}
//               {job.feeStructure && Object.keys(job.feeStructure).some(key => job.feeStructure[key]) && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "20px",
//                     background: "#fff9e6",
//                     borderRadius: 8,
//                     border: `2px solid #ffc107`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 16,
//                       fontWeight: 700,
//                       color: "#856404",
//                       marginBottom: 16,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                   >
//                     💰 Fee Structure / शुल्क संरचना
//                   </div>
//                   <div style={{ overflowX: "auto" }}>
//                     <table
//                       style={{
//                         width: "100%",
//                         borderCollapse: "collapse",
//                         fontSize: 14,
//                       }}
//                     >
//                       <thead>
//                         <tr style={{ background: "#ffc107", color: "#333" }}>
//                           <th
//                             style={{
//                               padding: "10px 12px",
//                               textAlign: "left",
//                               border: "1px solid #ffc107",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Category / श्रेणी
//                           </th>
//                           <th
//                             style={{
//                               padding: "10px 12px",
//                               textAlign: "center",
//                               border: "1px solid #ffc107",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Male / पुरुष
//                           </th>
//                           <th
//                             style={{
//                               padding: "10px 12px",
//                               textAlign: "center",
//                               border: "1px solid #ffc107",
//                               fontWeight: 700,
//                             }}
//                           >
//                             Female / महिला
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {[
//                           { key: "general", label: "General / सामान्य" },
//                           { key: "obc", label: "OBC" },
//                           { key: "sc", label: "SC" },
//                           { key: "st", label: "ST" },
//                           { key: "ews", label: "EWS" },
//                         ].map((cat, idx) => {
//                           const maleFee = job.feeStructure[`male_${cat.key}`];
//                           const femaleFee = job.feeStructure[`female_${cat.key}`];
//                           if (!maleFee && !femaleFee) return null;
//                           return (
//                             <tr
//                               key={cat.key}
//                               style={{
//                                 background: idx % 2 === 0 ? "#fff" : "#fffbf0",
//                               }}
//                             >
//                               <td
//                                 style={{
//                                   padding: "10px 12px",
//                                   border: "1px solid #e0e0e0",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {cat.label}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "10px 12px",
//                                   border: "1px solid #e0e0e0",
//                                   textAlign: "center",
//                                   color: "#856404",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {maleFee || "-"}
//                               </td>
//                               <td
//                                 style={{
//                                   padding: "10px 12px",
//                                   border: "1px solid #e0e0e0",
//                                   textAlign: "center",
//                                   color: "#856404",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 {femaleFee || "-"}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 {job.lastDate && (
//                   <div
//                     style={{
//                       marginBottom: 20,
//                       padding: "16px",
//                       background: "#e3f2fd",
//                       borderRadius: 8,
//                       borderLeft: `4px solid #2196f3`,
//                     }}
//                   >
//                     <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                       Last Date / अंतिम तिथि
//                     </div>
//                     <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
//                       {job.lastDate}
//                     </div>
//                   </div>
//                 )}

//                 {job.applicationOpeningDate && (
//                   <div
//                     style={{
//                       marginBottom: 20,
//                       padding: "16px",
//                       background: "#e8f5e9",
//                       borderRadius: 8,
//                       borderLeft: `4px solid ${GREEN}`,
//                     }}
//                   >
//                     <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
//                       Opening Date / आवेदन शुरू
//                     </div>
//                     <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>
//                       {job.applicationOpeningDate}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {job.selectionProcess?.en && (
//                 <div
//                   style={{
//                     marginBottom: 20,
//                     padding: "20px",
//                     background: "#f8f9fa",
//                     borderRadius: 8,
//                     border: `2px solid ${GREEN}`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 700,
//                       color: GREEN,
//                       marginBottom: 12,
//                     }}
//                   >
//                     Selection Process / चयन प्रक्रिया
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       lineHeight: 1.8,
//                       color: "#333",
//                       whiteSpace: "pre-wrap",
//                     }}
//                   >
//                     {job.selectionProcess.en}
//                   </div>
//                 </div>
//               )}

//               {job.advertisementFile && (
//                 <div
//                   style={{
//                     marginTop: 24,
//                     padding: "16px",
//                     background: `${GREEN}10`,
//                     borderRadius: 8,
//                     border: `2px dashed ${GREEN}`,
//                     textAlign: "center",
//                   }}
//                 >
//                   <a
//                     href={job.advertisementFile}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       color: GREEN,
//                       textDecoration: "none",
//                       fontWeight: 700,
//                       fontSize: 16,
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.textDecoration = "underline";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.textDecoration = "none";
//                     }}
//                   >
//                     📥 Download Advertisement (PDF)
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobPostingsAPI, paymentsAPI } from "../utils/api.js";
import logo from "../assets/img0.png";
import logo1 from "../assets/jss.png";
import swachhBharat from "../assets/Swachh.png";
import brochurePDF from "../assets/broucher.pdf";

const GREEN = "#3AB000";

const indianStates = [
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
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

const jobsCSS = `
  * { box-sizing: border-box; }
  .jobs-back-title { color: #fff; font-weight: 700; font-size: 14px; }
  .jobs-section-heading {
    font-weight: 900; font-size: 15px; color: #1a2a4a;
    margin: 20px 0 12px; letter-spacing: 0.02em;
  }
  .jobs-submit-btn {
    background: ${GREEN}; color: #fff; font-weight: 900;
    font-size: 15px; padding: 12px 40px;
    border: none; cursor: pointer; border-radius: 4px;
  }
  .jobs-vacancy-item {
    padding: 14px 20px; font-size: 15px; color: #1a2a4a;
    line-height: 1.7; cursor: pointer;
    display: flex; align-items: flex-start; gap: 8px;
  }
  .jobs-list-wrap { padding: 32px 40px; }
  .jobs-list-heading { font-weight: 700; font-size: 20px; color: #1a2a4a; margin-bottom: 6px; }
  .jobs-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .jobs-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  .jobs-detail-title-row {
    background: #c2fbd7; padding: 0px 10px; text-align: center;
    border-left: 1px solid green; border-right: 1px solid green;
    font-size: 13px; font-weight: 700; color: #1a2a4a; line-height: 1.6;
  }
  .jobs-detail-download-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 2px solid green; background: #c2fbd7;
  }
  .jobs-detail-download-cell { padding: 14px 16px; background: transparent; text-align: center; }
  .jobs-detail-download-cell .advt-label { font-weight: 900; font-size: 14px; color: #1a2a4a; margin-bottom: 2px; }
  .jobs-detail-download-cell .advt-date { font-weight: 700; font-size: 13px; color: #1a2a4a; margin-bottom: 10px; }
  .jobs-detail-download-cell .dl-link {
    color: #1a56c4 !important; font-weight: 700; font-size: 13px;
    text-decoration: underline !important; background: none; border: none;
    cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 5px;
  }
  .jobs-detail-download-cell .dl-link:disabled { opacity: 0.6; cursor: not-allowed; }
  .jobs-detail-download-cell .new-badge {
    display: inline-block; color: #fff;
    font-size: 9px; font-weight: 900; padding: 1px 5px; border-radius: 3px;
    margin-left: 5px; vertical-align: middle; letter-spacing: 0.05em;
    animation: badge-color 1.5s infinite;
  }
  @keyframes badge-color {
    0%   { background: #ff0000; }
    20%  { background: #ff6600; }
    40%  { background: #ffcc00; color: #333; }
    60%  { background: #00cc44; }
    80%  { background: #0066ff; }
    100% { background: #ff0000; }
  }
  .jobs-detail-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #b8dda0;
  }
  .jobs-detail-row:last-child { border-bottom: none; }
  .jobs-detail-row.row-odd  { background: #c2fbd7; }
  .jobs-detail-row.row-even { background: #c2fbd7; }
  .jobs-detail-lang-cell { display: grid; grid-template-columns: 150px 1fr; padding: 0; }
  .jobs-detail-key {
    padding: 9px 10px; font-weight: 700; font-size: 13px;
    color: #1a2a4a; border-right: 1px solid ${GREEN}33; line-height: 1.5;
  }
  .jobs-detail-val { padding: 9px 10px; font-size: 13px; color: #333; line-height: 1.6; }

  /* review table */
  .review-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .review-table td { padding: 8px 12px; border: 1px solid #e0e0e0; vertical-align: top; }
  .review-table td:first-child { font-weight: 700; color: #1a2a4a; width: 40%; background: #f5f5f5; }

  @media (max-width: 640px) {
    .jobs-list-wrap { padding: 16px 12px; }
    .jobs-list-heading { font-size: 16px; }
    .jobs-vacancy-item { padding: 12px 12px; font-size: 13px; }
    .jobs-back-title { font-size: 12px; }
    .jobs-section-heading { font-size: 13px; margin: 12px 0 8px; }
    .jobs-submit-btn { font-size: 13px; padding: 10px 24px; }
    .jobs-grid-2 { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .jobs-grid-3 { grid-template-columns: 1fr 1fr 1fr !important; gap: 5px !important; }
    .jobs-detail-download-row { grid-template-columns: 1fr 1fr !important; }
    .jobs-detail-download-cell { padding: 8px 6px; }
    .jobs-detail-download-cell .advt-label { font-size: 9px; }
    .jobs-detail-download-cell .advt-date  { font-size: 8px; }
    .jobs-detail-download-cell .dl-link    { font-size: 8px; }
    .jobs-detail-row { grid-template-columns: 1fr 1fr !important; }
    .jobs-detail-lang-cell { grid-template-columns: 70px 1fr; }
    .jobs-detail-key { font-size: 9px; padding: 6px 4px; }
    .jobs-detail-val { font-size: 9px; padding: 6px 4px; }
    .jobs-detail-title-row { font-size: 9px; padding: 7px 8px; }
    .review-table td { font-size: 11px; padding: 6px 8px; }
  }

  @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .marquee-inner { animation: marquee-scroll 30s linear infinite; }
  .marquee-inner:hover { animation-play-state: paused; }
  nav::-webkit-scrollbar { height: 3px; }
  nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }
  .hdr-desktop { display: flex !important; }
  .hdr-mobile  { display: none !important; }
  .tb-left     { display: flex !important; }
  .tb-phone    { display: flex !important; }
  .tb-email    { display: flex !important; }
  .tb-search   { display: flex !important; }
  .nav-list { width: 100%; }
  .nav-item  { flex: 1; }
  .nav-btn   { width: 100%; font-size: 14px; padding: 14px 4px; color: #000 !important; }
  .footer-inner  { flex-direction: row; }
  .ft-heading    { font-size: 15px; }
  .ft-list       { gap: 14px; }
  .ft-link       { font-size: 14px; font-weight: 500; }
  .ft-logo-wrap  { padding: 0 40px; }
  .ft-logo-img   { width: 280px; height: auto; }
  .ft-contact    { gap: 14px; }
  .ft-contact-item { font-size: 14px; font-weight: 500; color: #cbd5e0; }
  .ft-contact-link { font-size: 14px; font-weight: 500; margin-top: 6px; }
  .ft-copyright  { font-size: 12px; padding: 16px 0; margin-top: 40px; }

  @media (max-width: 768px) {
    .hdr-desktop { display: none !important; }
    .hdr-mobile  { display: flex !important; flex-direction: column !important; }
    .tb-topbar { flex-wrap: nowrap !important; padding: 4px 8px !important; gap: 4px !important; justify-content: space-between !important; }
    .tb-left   { display: flex !important; gap: 6px !important; flex-shrink: 1 !important; min-width: 0 !important; align-items: center !important; }
    .tb-phone  { display: flex !important; font-size: 9px !important; gap: 2px !important; white-space: nowrap !important; flex-shrink: 0 !important; }
    .tb-phone svg { width: 9px !important; height: 9px !important; }
    .tb-email  { display: flex !important; font-size: 9px !important; gap: 2px !important; white-space: nowrap !important; flex-shrink: 1 !important; min-width: 0 !important; overflow: hidden !important; }
    .tb-email svg { width: 9px !important; height: 9px !important; flex-shrink: 0 !important; }
    .tb-update-badge { font-size: 13px !important; padding: 4px 10px !important; }
    .tb-search { display: flex !important; flex-shrink: 1 !important; }
    .tb-search input { width: 70px !important; font-size: 9px !important; padding: 3px 18px 3px 5px !important; }
    .tb-search svg { width: 9px !important; height: 9px !important; right: 4px !important; }
    .tb-dl-btn { font-size: 9px !important; padding: 4px 7px !important; white-space: nowrap !important; flex-shrink: 0 !important; }
    .nav-list { width: 100% !important; flex-wrap: nowrap !important; display: flex !important; }
    .nav-item  { flex: 1 1 0 !important; }
    .nav-btn   { font-size: 5.5px !important; padding: 4px 1px !important; width: 100% !important; text-align: center !important; letter-spacing: 0 !important; white-space: nowrap !important; color: #000 !important; }
    footer { padding: 10px 6px 0 !important; }
    .footer-inner   { flex-direction: row !important; gap: 6px !important; align-items: flex-start !important; }
    .ft-heading     { font-size: 8px !important; margin-bottom: 6px !important; letter-spacing: 0.02em !important; }
    .ft-list        { gap: 3px !important; }
    .ft-link        { font-size: 7px !important; font-weight: 500 !important; }
    .ft-logo-wrap   { padding: 0 4px !important; width: auto !important; justify-content: center !important; }
    .ft-logo-img    { width: 60px !important; }
    .ft-contact     { gap: 3px !important; align-items: flex-end !important; }
    .ft-contact-item { font-size: 7px !important; }
    .ft-contact-link { font-size: 7px !important; text-align: left !important; margin-top: 2px !important; }
    .ft-copyright   { font-size: 7px !important; padding: 8px 0 !important; margin-top: 10px !important; }
    .ft-update-badge { font-size: 13px !important; padding: 8px 12px !important; }
  }
`;

const navLinks = [
  { label: "HOME", page: "/" },
  { label: "ABOUT US", page: "/about" },
  { label: "MEMBERSHIPS & BENIFITS", page: "/membership" },
  { label: "SERVICES", page: "/services" },
  { label: "JOBS & CARRIERS", page: "/jobs" },
  { label: "NOTIFICATIONS", page: "/notifications" },
  { label: "GALLERY", page: "/gallery" },
  { label: "Verification", page: "/verification" },
  { label: "CONTACTS", page: "/contacts" },
];

const socialLinks = [
  {
    bg: "#1877f2",
    url: "https://www.facebook.com/",
    content: (
      <span
        style={{ fontWeight: 900, fontSize: 16, color: "#fff", lineHeight: 1 }}
      >
        f
      </span>
    ),
  },
  {
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
    url: "https://www.instagram.com/jssabhiyan8/?hl=en",
    content: (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    bg: "#ff0000",
    url: "https://www.youtube.com/@janswasthyasahayataabhiyan8183",
    content: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
        <polygon points="9.5,7 9.5,17 18,12" />
      </svg>
    ),
  },
  {
    bg: "#0077b5",
    url: "https://www.linkedin.com/in/jss-abhiyan-3872b13b7/",
    content: (
      <span style={{ fontWeight: 900, fontSize: 12, color: "#fff" }}>in</span>
    ),
  },
];

const quickLinks = [
  { label: "About Us", page: "/about" },
  { label: "MemberShip & Benifits", page: "/membership" },
  { label: "View Jobs & Carrier", page: "/jobs" },
  { label: "View Our Services", page: "/services" },
  { label: "Our Privacy Policy", page: "/" },
  { label: "Refund & Cancellation", page: "/" },
  { label: "Terms & Condition", page: "/" },
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function downloadJobPDF(job, lang) {
  const isHi = lang === "hi";
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  );
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  );
  const rowsEn = [
    ["Post", job.post?.en || job.postTitle?.en || ""],
    ["Monthly Income", job.income?.en || ""],
    ["Education Qualification", job.education?.en || ""],
    ["Age Limit", job.ageLimit?.en || ""],
    ["Job Location", job.location?.en || ""],
    ["Selection Process", job.selectionProcess?.en || ""],
    ["Application Opening On", job.applicationOpeningDate || ""],
    ["Last Date of Application", job.lastDate || ""],
    ["Fee Structure", job.fee?.en || ""],
  ].filter((r) => r[1]);
  const rowsHi = [
    ["पद", job.post?.hi || job.postTitle?.hi || ""],
    ["मासिक आय", job.income?.hi || ""],
    ["शैक्षणिक योग्यता", job.education?.hi || ""],
    ["आयु सीमा", job.ageLimit?.hi || ""],
    ["नौकरी करने का स्थान", job.location?.hi || ""],
    ["चयन प्रक्रिया", job.selectionProcess?.hi || ""],
    ["आवेदन खुलने की तिथि", job.applicationOpeningDate || ""],
    ["आवेदन की अंतिम तिथि", job.lastDate || ""],
    ["शुल्क संरचना", job.fee?.hi || ""],
  ].filter((r) => r[1]);
  const rows = isHi ? rowsHi : rowsEn;
  const advt = job.advtNo || "";
  const date = job.date || job.lastDate || "";
  const titleEn = job.postTitle?.en || job.post?.en || "";
  const titleHi = job.postTitle?.hi || job.post?.hi || "";
  const invitationEn =
    job.title?.en ||
    `Invitation for all eligible candidates on vacant posts of ${titleEn} under Jan Swasthya Sahayata Abhiyan by Healthcare Research and Development Board (A Division of NAC India).`;
  const invitationHi =
    job.title?.hi ||
    `हेल्थ केयर रिसर्च एंड डेवलपमेंट बोर्ड (A Division Of NAC INDIA) द्वारा जन स्वास्थ्य सहायता अभियान के तहत ${titleHi} के रिक्त पदों पर सभी पात्र उम्मीदवारों के लिए आमंत्रण।`;
  const tableRowsHTML = rows
    .map(
      (r, i) =>
        `<tr><td style="padding:9px 14px;font-weight:700;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;width:35%;vertical-align:top">${r[0]}</td><td style="padding:9px 8px;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;width:4%;text-align:center;vertical-align:top">:</td><td style="padding:9px 14px;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;vertical-align:top;line-height:1.6">${r[1]}</td></tr>`,
    )
    .join("");
  const container = document.createElement("div");
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:700px;background:#fff;font-family:'Noto Sans Devanagari','Noto Sans',Arial,sans-serif;font-size:13px;color:#000;border:2px solid #888;border-radius:8px;overflow:hidden;`;
  container.innerHTML = `<div style="background:#1e2840;display:flex;align-items:center;gap:16px;padding:14px 20px"><div style="width:64px;height:64px;border-radius:50%;background:${GREEN};border:3px solid #fff;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:14px">JSS</div><div><div style="color:#fff;font-size:${isHi ? "22px" : "19px"};font-weight:900;line-height:1.2">${isHi ? "जन स्वास्थ्य सहायता अभियान" : "JAN SWASTHYA SAHAYATA ABHIYAN"}</div><div style="color:#fff;font-size:13px;font-weight:700;margin-top:4px">A Project of Healthcare Research &amp; Development Board</div><div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:2px">(HRDB is Division Of Social Welfare Organization "NAC India")</div></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:#f5f5f5;border-bottom:2px solid #ddd"><span style="font-weight:700;font-size:13px;color:#1e2840">${isHi ? "विज्ञापन सं0 :" : "Advt. No. :"} ${advt}</span><span style="background:#1e2840;color:#fff;font-weight:900;font-size:12px;padding:7px 18px;border-radius:2px;letter-spacing:0.05em">${isHi ? "भर्ती आमंत्रण" : "RECRUITMENT INVITATION"}</span><span style="font-weight:700;font-size:13px;color:#1e2840">${isHi ? "दिनांक :" : "DATE :"} ${date}</span></div><div style="background:#1e2840;color:#fff;padding:14px 20px;text-align:center;font-size:${isHi ? "15px" : "13px"};font-weight:700;line-height:1.6">${isHi ? invitationHi : invitationEn}</div><div style="padding:16px 20px"><table style="width:100%;border-collapse:collapse;font-size:${isHi ? "14px" : "13px"}"><tbody>${tableRowsHTML}</tbody></table></div><div style="background:#1e2840;color:#fff;padding:12px 20px;text-align:center"><div style="font-size:${isHi ? "16px" : "14px"};font-weight:900;margin-bottom:6px">${isHi ? "अधिक जानकारी के लिए :" : "FOR MORE INFORMATION :"}</div><div style="font-size:12px;display:flex;justify-content:space-around"><span>Website : https://www.jssabhiyan-nac.in</span><span>Email : support@jssabhiyan.com</span></div></div>`;
  document.body.appendChild(container);
  try {
    await new Promise((r) => setTimeout(r, 100));
    const canvas = await window.html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    const pageW = 210,
      pageH = 297,
      imgW = pageW - 20;
    const imgH = (canvas.height * imgW) / canvas.width;
    if (imgH <= pageH - 20) {
      pdf.addImage(imgData, "PNG", 10, 10, imgW, imgH);
    } else {
      const ratio = canvas.width / imgW,
        sliceH = (pageH - 20) * ratio;
      let yOffset = 0,
        page = 0;
      while (yOffset < canvas.height) {
        if (page > 0) pdf.addPage();
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.min(sliceH, canvas.height - yOffset);
        sliceCanvas.getContext("2d").drawImage(canvas, 0, -yOffset);
        const sliceData = sliceCanvas.toDataURL("image/png");
        pdf.addImage(
          sliceData,
          "PNG",
          10,
          10,
          imgW,
          (sliceCanvas.height * imgW) / canvas.width,
        );
        yOffset += sliceH;
        page++;
      }
    }
    pdf.save(
      isHi
        ? `JSSA_${advt.replace(/\//g, "-")}_Hindi.pdf`
        : `JSSA_${advt.replace(/\//g, "-")}_English.pdf`,
    );
  } finally {
    document.body.removeChild(container);
  }
}

function SharedLayout({ children, navigate, activePath = "/jobs" }) {
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "'Segoe UI','Noto Sans Devanagari','Noto Sans',sans-serif",
        minHeight: "100vh",
      }}
    >
      <div style={{ background: "#2a2a2a", height: "3px", width: "100%" }} />
      <div
        className="tb-topbar"
        style={{
          background: GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 16px",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          className="tb-left"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          <span
            className="tb-phone"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            9471987611
          </span>
          <span
            className="tb-email"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
            support@jssabhiyan.com
          </span>
          <span
            className="tb-update-badge"
            style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              background: "rgba(255,255,255,0.2)",
              padding: "4px 10px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            UPDATE
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <div
            className="tb-search"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              style={{
                borderRadius: 4,
                padding: "5px 26px 5px 10px",
                fontSize: 13,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#333",
                width: 180,
              }}
              placeholder="Type and hit enter..."
            />
            <svg
              style={{ position: "absolute", right: 7 }}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <button
            className="tb-dl-btn"
            style={{
              background: "#e53e3e",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Download Document
          </button>
        </div>
      </div>

      <div
        className="hdr-desktop"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <img
            src={logo}
            alt="JSS Logo"
            style={{ height: 130, width: "auto", objectFit: "contain" }}
          />
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <a
              href="https://frontend.jssabhiyan.com/"
              style={{
                background: "#e53e3e",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                padding: "10px 40px",
                borderRadius: 4,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              LOGIN
            </a>
            <a
              href={brochurePDF}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: GREEN,
                color: "#000",
                fontWeight: 900,
                fontSize: 16,
                padding: "10px 40px",
                borderRadius: 4,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              BROUCHERS
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src={swachhBharat}
              alt="Swachh Bharat"
              style={{ height: 55, width: "auto", objectFit: "contain" }}
            />
            <div style={{ display: "flex", gap: 7 }}>
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: s.bg,
                    borderRadius: 7,
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  {s.content}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="hdr-mobile"
        style={{
          display: "none",
          flexDirection: "column",
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "6px 10px",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="JSS Logo"
              style={{
                height: 44,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </button>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            <a
              href="https://frontend.jssabhiyan.com/"
              style={{
                background: "#e53e3e",
                color: "#fff",
                fontWeight: 900,
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 3,
                textDecoration: "none",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              LOGIN
            </a>
            <a
              href={brochurePDF}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: GREEN,
                color: "#000",
                fontWeight: 900,
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 3,
                textDecoration: "none",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              BROUCHERS
            </a>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
          }}
        >
          <img
            src={swachhBharat}
            alt="Swachh Bharat"
            style={{ height: 24, width: "auto", objectFit: "contain" }}
          />
          <div style={{ display: "flex", gap: 3 }}>
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: s.bg,
                  borderRadius: 4,
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                <span style={{ transform: "scale(0.7)", display: "flex" }}>
                  {s.content}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <nav
        style={{
          background: GREEN,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ul
          className="nav-list"
          style={{ display: "flex", margin: 0, padding: 0, listStyle: "none" }}
        >
          {navLinks.map((item, i) => (
            <li key={i} className="nav-item">
              <button
                onClick={() => navigate(item.page)}
                className="nav-btn"
                style={{
                  display: "block",
                  color: "#000",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  background:
                    activePath === item.page
                      ? "rgba(0,0,0,0.25)"
                      : "transparent",
                  border: "none",
                  borderRight:
                    i < navLinks.length - 1
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    activePath === item.page
                      ? "rgba(0,0,0,0.25)"
                      : "transparent")
                }
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {children}

      <div style={{ position: "fixed", left: 20, bottom: 20, zIndex: 1000 }}>
        <a
          href="tel:9471987611"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3AB000 0%, #2d8a00 100%)",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(58,176,0,0.4)",
            textDecoration: "none",
          }}
          title="Call Us"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1000 }}>
        <a
          href="https://wa.me/919471987611"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(37,211,102,0.4)",
            textDecoration: "none",
          }}
          title="WhatsApp"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </div>

      <footer
        style={{ background: "#304865", color: "#fff", padding: "36px 18px 0" }}
      >
        <div
          className="footer-inner"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 14,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <h4
              className="ft-heading"
              style={{
                fontWeight: 900,
                marginBottom: 18,
                color: "#5ecfcf",
                letterSpacing: "0.06em",
              }}
            >
              QUICK LINKS
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
              }}
              className="ft-list"
            >
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(l.page)}
                    className="ft-link"
                    style={{
                      color: "#cbd5e0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "2px 0",
                      display: "block",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#fff")}
                    onMouseLeave={(e) => (e.target.style.color = "#cbd5e0")}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="ft-logo-wrap"
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo1}
              alt="JSS Logo"
              className="ft-logo-img"
              style={{ objectFit: "contain", width: 280, height: "auto" }}
            />
          </div>
          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <h4
              className="ft-heading"
              style={{
                fontWeight: 900,
                marginBottom: 18,
                color: "#5ecfcf",
                letterSpacing: "0.06em",
              }}
            >
              CONTACT INFO
            </h4>
            <div
              className="ft-contact"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div className="ft-contact-item">
                Helpline No. : +91-9471987611
              </div>
              <div className="ft-contact-item">
                Email : support@jssabhiyan.com
              </div>
              <button
                onClick={() => navigate("/contacts")}
                className="ft-contact-link"
                style={{
                  color: "#5ecfcf",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "right",
                  padding: 0,
                  lineHeight: 1.6,
                }}
              >
                To know our all office branch address
                <br />
                click here
              </button>
            </div>
          </div>
        </div>
        <div
          className="ft-copyright"
          style={{
            textAlign: "center",
            color: "#94a3b8",
            borderTop: "1px solid #4a5a6c",
            fontWeight: 500,
            padding: "16px 0",
            marginTop: 40,
          }}
        >
          © 2021 JSS Abhiyan. All Rights Reserved. Trademark &amp; Brands are
          property of their respective owner.
        </div>
      </footer>
      <style>{jobsCSS}</style>
    </div>
  );
}

function FormFields({
  formData,
  handleInputChange,
  handleFileChange,
  photoPreview,
  signaturePreview,
}) {
  const iStyle = {
    width: "100%",
    padding: "9px 11px",
    border: "1px solid #ccc",
    borderRadius: 3,
    fontSize: 13,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    color: "#000",
  };
  const lStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    marginBottom: 5,
  };
  return (
    <>
      <h3 className="jobs-section-heading">
        PERSONAL DETAILS / व्यक्तिगत विवरण
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={lStyle}>Candidate's Name/अभ्यर्थी का नाम :</label>
          <input
            name="candidateName"
            value={formData.candidateName}
            onChange={handleInputChange}
            style={iStyle}
          />
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Father's Name/पिता का नाम :</label>
            <input
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Mother's Name/माता का नाम :</label>
            <input
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Date Of Birth/जन्मतिथि :</label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Gender/लिंग :</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={iStyle}
            >
              <option value="">--Please Select--</option>
              <option value="male">Male / पुरुष</option>
              <option value="female">Female / महिला</option>
              <option value="other">Other / अन्य</option>
            </select>
          </div>
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Nationality/राष्ट्रीयता :</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              style={iStyle}
            >
              <option value="">---Please Select---</option>
              <option value="indian">Indian / भारतीय</option>
              <option value="other">Other / अन्य</option>
            </select>
          </div>
          <div>
            <label style={lStyle}>Category/श्रेणी :</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={iStyle}
            >
              <option value="">---Please Select---</option>
              <option value="general">General / सामान्य</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="ews">EWS</option>
            </select>
          </div>
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Aadhar Number/आधार संख्या :</label>
            <input
              name="aadhar"
              value={formData.aadhar}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Pan Number/पेन संख्या :</label>
            <input
              name="pan"
              value={formData.pan}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Mobile Number/मोबाइल नंबर :</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Email Id/ईमेल आईडी :</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
        <div>
          <label style={lStyle}>Permanenet Address/स्थाई पता :</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            style={iStyle}
          />
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>State/राज्य :</label>
            <select
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              style={iStyle}
            >
              <option value="">Select</option>
              {indianStates.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lStyle}>District/जिला :</label>
            <input
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
        <div className="jobs-grid-3">
          <div>
            <label style={lStyle}>Block/ब्लॉक :</label>
            <input
              name="block"
              value={formData.block}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Panchayat/पंचायत :</label>
            <input
              name="panchayat"
              value={formData.panchayat}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Postal Pin Code/डाक पिन कोड :</label>
            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Attach Photograph/फोटो लगाएं :</label>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "photo")}
              style={{ ...iStyle, padding: "6px 8px" }}
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="photo"
                style={{
                  marginTop: 8,
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  border: `2px solid ${GREEN}`,
                  borderRadius: 4,
                }}
              />
            )}
            <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              Max file size: 3MB
            </p>
          </div>
          <div>
            <label style={lStyle}>Attach Signature/हस्ताक्षर लगाएं :</label>
            <input
              name="signature"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "signature")}
              style={{ ...iStyle, padding: "6px 8px" }}
            />
            {signaturePreview && (
              <img
                src={signaturePreview}
                alt="sig"
                style={{
                  marginTop: 8,
                  width: 140,
                  height: 55,
                  objectFit: "contain",
                  border: `2px solid ${GREEN}`,
                  borderRadius: 4,
                  background: "#fff",
                  padding: 4,
                }}
              />
            )}
            <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              Max file size: 3MB
            </p>
          </div>
        </div>
      </div>
      <h3 className="jobs-section-heading" style={{ marginTop: 22 }}>
        EDUCATION DETAILS / शैक्षणिक विवरण
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Higher Education/उच्च शिक्षा :</label>
            <input
              name="higherEducation"
              value={formData.higherEducation}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Board/University :</label>
            <input
              name="board"
              value={formData.board}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
        <div className="jobs-grid-2">
          <div>
            <label style={lStyle}>Marks/अंक :</label>
            <input
              name="marks"
              value={formData.marks}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
          <div>
            <label style={lStyle}>Percentage/प्रतिशत :</label>
            <input
              name="markPercentage"
              value={formData.markPercentage}
              onChange={handleInputChange}
              style={iStyle}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── INLINE REVIEW SECTION ─────────────────────────────────────────────────────
function InlineReview({
  formData,
  photoPreview,
  signaturePreview,
  feeAmount,
  onEdit,
  onSubmit,
  applying,
}) {
  const reviewRows = [
    ["Candidate's Name / नाम", formData.candidateName],
    ["Application No.", formData.applicationNumber],
    ["Father's Name / पिता का नाम", formData.fatherName],
    ["Mother's Name / माता का नाम", formData.motherName],
    ["Date of Birth / जन्मतिथि", formData.dob],
    ["Gender / लिंग", formData.gender],
    ["Nationality / राष्ट्रीयता", formData.nationality],
    ["Category / श्रेणी", formData.category?.toUpperCase()],
    ["Aadhar / आधार", formData.aadhar],
    ["PAN / पेन", formData.pan],
    ["Mobile / मोबाइल", formData.mobile],
    ["Email / ईमेल", formData.email],
    ["Address / पता", formData.address],
    ["State / राज्य", formData.state],
    ["District / जिला", formData.district],
    ["Block / ब्लॉक", formData.block],
    ["Panchayat / पंचायत", formData.panchayat],
    ["Pin Code / पिन कोड", formData.pincode],
    ["Higher Education / उच्च शिक्षा", formData.higherEducation],
    ["Board/University", formData.board],
    ["Marks / अंक", formData.marks],
    [
      "Percentage / प्रतिशत",
      formData.markPercentage ? `${formData.markPercentage}%` : "",
    ],
  ];

  return (
    <div
      style={{
        marginTop: 16,
        background: "#f0f0f0",
        borderRadius: 4,
        padding: "20px 20px 28px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <h3
          style={{ fontSize: 16, fontWeight: 900, color: "#1a2a4a", margin: 0 }}
        >
          Review Your Application / अपना आवेदन समीक्षा करें
        </h3>
        <button
          onClick={onEdit}
          style={{
            background: "#6c757d",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✏️ Edit / संपादित करें
        </button>
      </div>

      {/* Details table */}
      <table className="review-table" style={{ marginBottom: 16 }}>
        <tbody>
          {reviewRows.map(([label, val], i) => (
            <tr key={i}>
              <td>{label}</td>
              <td>{val || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Photo & Signature */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
          background: "#fff",
          borderRadius: 4,
          padding: 16,
          border: "1px solid #e0e0e0",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1a2a4a",
              marginBottom: 8,
            }}
          >
            Photo / फोटो
          </div>
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Photo"
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                border: `2px solid ${GREEN}`,
                borderRadius: 4,
              }}
            />
          ) : (
            <span style={{ color: "#999", fontSize: 13 }}>Not uploaded</span>
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1a2a4a",
              marginBottom: 8,
            }}
          >
            Signature / हस्ताक्षर
          </div>
          {signaturePreview ? (
            <img
              src={signaturePreview}
              alt="Sig"
              style={{
                width: 160,
                height: 60,
                objectFit: "contain",
                border: `2px solid ${GREEN}`,
                borderRadius: 4,
                background: "#fff",
                padding: 4,
              }}
            />
          ) : (
            <span style={{ color: "#999", fontSize: 13 }}>Not uploaded</span>
          )}
        </div>
      </div>

      {/* Fee */}
      {feeAmount > 0 && (
        <div
          style={{
            background: "#fff3cd",
            padding: 16,
            borderRadius: 4,
            marginBottom: 16,
            border: "2px solid #ffc107",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
            Fee Structure / शुल्क संरचना
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#856404" }}>
            ₹{feeAmount}
          </div>
        </div>
      )}

      {/* Submit button */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button
          onClick={onSubmit}
          disabled={applying}
          style={{
            background: applying ? "#ccc" : GREEN,
            color: "#fff",
            border: "none",
            padding: "12px 40px",
            borderRadius: 4,
            fontSize: 15,
            fontWeight: 900,
            cursor: applying ? "not-allowed" : "pointer",
          }}
        >
          {applying
            ? "Processing..."
            : feeAmount > 0
              ? "Proceed to Payment / भुगतान करें"
              : "Submit Application / आवेदन जमा करें"}
        </button>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  // "form" = filling form, "review" = inline review on same page
  const [formStep, setFormStep] = useState("form");
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [applying, setApplying] = useState(false);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [formData, setFormData] = useState({
    applicationNumber: "",
    candidateName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    nationality: "",
    category: "",
    aadhar: "",
    pan: "",
    mobile: "",
    email: "",
    address: "",
    state: "",
    district: "",
    block: "",
    panchayat: "",
    pincode: "",
    higherEducation: "",
    board: "",
    marks: "",
    markPercentage: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    if (formData.gender && formData.category && id) calculateFee();
    else setFeeAmount(0);
  }, [formData.gender, formData.category, id]);

  const calculateFee = async () => {
    try {
      setCalculatingFee(true);
      const response = await paymentsAPI.calculateFee(
        id,
        formData.gender,
        formData.category,
      );
      if (response.success) setFeeAmount(response.data.amount || 0);
    } catch {
      setFeeAmount(0);
    } finally {
      setCalculatingFee(false);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await jobPostingsAPI.getById(id);
        if (response.success && response.data.posting)
          setJob(response.data.posting);
        else setError("Job posting not found");
      } catch (err) {
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "candidateName" && value) {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const namePart = value
          .replace(/\s+/g, "")
          .substring(0, 4)
          .toUpperCase()
          .padEnd(4, "X");
        updated.applicationNumber = `${namePart}${month}${year}`;
      }
      return updated;
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("File size must be less than 3MB");
      return;
    }
    const reader = new FileReader();
    if (type === "photo") {
      setPhoto(file);
      reader.onloadend = () => setPhotoPreview(reader.result);
    } else {
      setSignature(file);
      reader.onloadend = () => setSignaturePreview(reader.result);
    }
    reader.readAsDataURL(file);
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // "SUBMIT & CONTINUE" click → validate then show inline review
  const handleReview = () => {
    if (!agreed1 || !agreed2) {
      alert("Please accept the terms and conditions");
      return;
    }
    if (!photo || !signature) {
      alert("Please upload photo and signature");
      return;
    }
    setFormStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final submit (from inline review)
  const handleSubmit = async () => {
    setApplying(true);
    try {
      const photoBase64 = await convertFileToBase64(photo);
      const signatureBase64 = await convertFileToBase64(signature);
      const apiUrl =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";
      if (!apiUrl)
        throw new Error("VITE_API_URL or VITE_BACKEND_URL must be set");

      if (!formData.candidateName?.trim())
        throw new Error("Candidate name is required");
      if (!formData.fatherName?.trim())
        throw new Error("Father's name is required");
      const normalizedMobile = formData.mobile.replace(/\D/g, "");
      if (normalizedMobile.length !== 10)
        throw new Error("Mobile number must be exactly 10 digits");
      if (!formData.district?.trim()) throw new Error("District is required");
      if (!formData.higherEducation?.trim())
        throw new Error("Higher education is required");

      const requestBody = {
        ...formData,
        mobile: normalizedMobile,
        jobPostingId: id,
        photo: photoBase64,
        signature: signatureBase64,
      };
      const applyResponse = await fetch(`${apiUrl}/applications/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const applyData = await applyResponse.json();

      if (!applyResponse.ok) {
        if (applyData.errors && Array.isArray(applyData.errors)) {
          throw new Error(
            `Validation failed: ${applyData.errors.map((err) => err.msg || err.message).join(", ")}`,
          );
        }
        throw new Error(
          applyData.message ||
            applyData.error ||
            "Failed to create application",
        );
      }
      if (!applyData.success)
        throw new Error(
          applyData.message ||
            applyData.error ||
            "Failed to create application",
        );

      const applicationId = applyData.data.application._id;
      const token = applyData.data.token;

      if (feeAmount <= 0) {
        setSubmittedApplication({
          ...applyData.data.application,
          defaultPassword: applyData.data.defaultPassword,
          applicationNumber:
            applyData.data.application.applicationNumber ||
            formData.applicationNumber,
        });
        setShowApplyForm(false);
        setShowSuccessPage(true);
        return;
      }

      const orderResponse = await paymentsAPI.createOrder(
        id,
        formData.gender,
        formData.category,
        token,
      );
      if (!orderResponse.success)
        throw new Error(
          orderResponse.error || "Failed to create payment order",
        );
      const { orderId, amount, amountInRupees, keyId } = orderResponse.data;

      let retries = 0;
      while (!window.Razorpay && retries < 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        retries++;
      }
      if (!window.Razorpay)
        throw new Error(
          "Razorpay payment gateway is not loaded. Please refresh and try again.",
        );

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        name: "JSSA Application Fee",
        description: `Application Fee - ₹${amountInRupees}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await paymentsAPI.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              applicationId,
              token,
            );
            if (verifyResponse.success) {
              setSubmittedApplication({
                ...applyData.data.application,
                defaultPassword: applyData.data.defaultPassword,
                applicationNumber:
                  applyData.data.application.applicationNumber ||
                  formData.applicationNumber,
                formData,
                photoPreview,
                signaturePreview,
              });
              setShowApplyForm(false);
              setShowSuccessPage(true);
            } else {
              alert(
                `Payment verification failed: ${verifyResponse.message || "Please contact support."}`,
              );
            }
          } catch (err) {
            alert(`Payment verification failed: ${err.message}`);
          } finally {
            setApplying(false);
          }
        },
        prefill: {
          name: formData.candidateName || "",
          email: formData.email || "",
          contact: formData.mobile || "",
        },
        theme: { color: GREEN },
        modal: {
          ondismiss: () => {
            setApplying(false);
            alert("Payment cancelled. You can try again later.");
          },
        },
        notes: { applicationId, jobPostingId: id },
      });
      razorpay.on("payment.failed", (response) => {
        alert(
          `Payment failed: ${response.error.description || "Please try again."}`,
        );
        setApplying(false);
      });
      razorpay.open();
    } catch (err) {
      alert("Error: " + err.message);
      setApplying(false);
    }
  };

  const resetForm = () => {
    setFormData({
      applicationNumber: "",
      candidateName: "",
      fatherName: "",
      motherName: "",
      dob: "",
      gender: "",
      nationality: "",
      category: "",
      aadhar: "",
      pan: "",
      mobile: "",
      email: "",
      address: "",
      state: "",
      district: "",
      block: "",
      panchayat: "",
      pincode: "",
      higherEducation: "",
      board: "",
      marks: "",
      markPercentage: "",
    });
    setPhoto(null);
    setSignature(null);
    setPhotoPreview(null);
    setSignaturePreview(null);
    setAgreed1(false);
    setAgreed2(false);
    setFeeAmount(0);
    setFormStep("form");
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          fontSize: 16,
          color: "#666",
        }}
      >
        Loading jobs...
      </div>
    );
  if (error || !job)
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 16, color: "#e53e3e", marginBottom: 16 }}>
          {error || "Job posting not found"}
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            background: GREEN,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Go Back
        </button>
      </div>
    );

  // Helper function to format fee structure
  const formatFeeStructure = (feeStructure) => {
    if (!feeStructure || !Object.keys(feeStructure).some(key => feeStructure[key])) {
      return "";
    }
    
    const categories = [
      { key: "general", label: "General" },
      { key: "obc", label: "OBC" },
      { key: "sc", label: "SC" },
      { key: "st", label: "ST" },
      { key: "ews", label: "EWS" },
    ];
    
    const parts = [];
    categories.forEach((cat) => {
      const maleFee = feeStructure[`male_${cat.key}`];
      const femaleFee = feeStructure[`female_${cat.key}`];
      
      if (maleFee || femaleFee) {
        const feeParts = [];
        if (maleFee) feeParts.push(`Male: ${maleFee}`);
        if (femaleFee) feeParts.push(`Female: ${femaleFee}`);
        if (feeParts.length > 0) {
          parts.push(`${cat.label} (${feeParts.join(", ")})`);
        }
      }
    });
    
    return parts.length > 0 ? parts.join("\n") : "";
  };

  const formatFeeStructureHi = (feeStructure) => {
    if (!feeStructure || !Object.keys(feeStructure).some(key => feeStructure[key])) {
      return "";
    }
    
    const categories = [
      { key: "general", label: "सामान्य" },
      { key: "obc", label: "OBC" },
      { key: "sc", label: "SC" },
      { key: "st", label: "ST" },
      { key: "ews", label: "EWS" },
    ];
    
    const parts = [];
    categories.forEach((cat) => {
      const maleFee = feeStructure[`male_${cat.key}`];
      const femaleFee = feeStructure[`female_${cat.key}`];
      
      if (maleFee || femaleFee) {
        const feeParts = [];
        if (maleFee) feeParts.push(`पुरुष: ${maleFee}`);
        if (femaleFee) feeParts.push(`महिला: ${femaleFee}`);
        if (feeParts.length > 0) {
          parts.push(`${cat.label} (${feeParts.join(", ")})`);
        }
      }
    });
    
    return parts.length > 0 ? parts.join("\n") : "";
  };

  const feeStructureText = formatFeeStructure(job.feeStructure) || job.fee?.en || "";
  const feeStructureTextHi = formatFeeStructureHi(job.feeStructure) || job.fee?.hi || "";

  const rowsEn = [
    ["Post", job.post?.en || job.postTitle?.en || ""],
    ["Total Post", job.totalPost || ""],
    ["Monthly Income", job.income?.en || ""],
    ["Education Qualification", job.education?.en || ""],
    [
      "Age Limit",
      `${job.ageLimit?.en || ""}${job.ageAsOn ? ` (As on ${job.ageAsOn})` : ""}`,
    ],
    ["Job Location", job.location?.en || ""],
    ["Selection Process", job.selectionProcess?.en || ""],
    ["Application Opening On", job.applicationOpeningDate || ""],
    ["Last Date of Application", job.lastDate || ""],
    ["1st Merit List Released", job.firstMeritListDate || ""],
    ["Final Merit List Released", job.finalMeritListDate || ""],
    ["Fee Structure", feeStructureText],
  ].filter((r) => r[1]);

  const rowsHi = [
    ["पद", job.post?.hi || job.postTitle?.hi || ""],
    ["कुल पद", job.totalPost || ""],
    ["मासिक आय", job.income?.hi || ""],
    ["शैक्षणिक योग्यता", job.education?.hi || ""],
    [
      "आयु सीमा",
      `${job.ageLimit?.hi || ""}${job.ageAsOn ? ` (${job.ageAsOn} को)` : ""}`,
    ],
    ["नौकरी करने का स्थान", job.location?.hi || ""],
    ["चयन प्रक्रिया", job.selectionProcess?.hi || ""],
    ["आवेदन खुलने की तिथि", job.applicationOpeningDate || ""],
    ["आवेदन की अंतिम तिथि", job.lastDate || ""],
    ["1st मेधा सूची जारी", job.firstMeritListDate || ""],
    ["अंतिम मेधा सूची जारी", job.finalMeritListDate || ""],
    ["शुल्क संरचना", feeStructureTextHi],
  ].filter((r) => r[1]);

  const rows = Math.max(rowsEn.length, rowsHi.length);
  const isActive = job.status === "Active";
  const titleEn = job.postTitle?.en || job.post?.en || "";
  const titleHi = job.postTitle?.hi || job.post?.hi || "";

  return (
    <SharedLayout navigate={navigate} activePath="/jobs">
      <div
        style={{ maxWidth: 1000, margin: "20px auto 40px", padding: "0 8px" }}
      >
        {/* Job Detail Table — hide in review step */}
        {formStep !== "review" && (
          <div
            style={{
              border: `2px solid ${GREEN}`,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div className="jobs-detail-title-row">
              Recruitment for the Post of {titleEn} Advt. No. {job.advtNo} /{" "}
              {titleHi} विज्ञापन संख्या: {job.advtNo}
            </div>
            <div className="jobs-detail-download-row">
              <div
                className="jobs-detail-download-cell"
                style={{ borderRight: `1px solid ${GREEN}55` }}
              >
                <div className="advt-label">Advt No: {job.advtNo}</div>
                {job.date && <div className="advt-date">Date: {job.date}</div>}
                <button
                  className="dl-link"
                  onClick={async () => {
                    setDownloading("en");
                    try {
                      await downloadJobPDF(job, "en");
                    } catch (e) {
                      alert("PDF download failed: " + e.message);
                    } finally {
                      setDownloading(null);
                    }
                  }}
                  disabled={!!downloading}
                >
                  📄{" "}
                  {downloading === "en" ? (
                    "Generating PDF..."
                  ) : (
                    <>
                      <span>
                        Download Advertisement (English Version) Click Here ✤✤
                      </span>
                      <span className="new-badge">NEW</span>
                    </>
                  )}
                </button>
              </div>
              <div className="jobs-detail-download-cell">
                <div className="advt-label">विज्ञापन सं० {job.advtNo}</div>
                {job.date && (
                  <div className="advt-date">दिनांक -{job.date}</div>
                )}
                <button
                  className="dl-link"
                  onClick={async () => {
                    setDownloading("hi");
                    try {
                      await downloadJobPDF(job, "hi");
                    } catch (e) {
                      alert("PDF download failed: " + e.message);
                    } finally {
                      setDownloading(null);
                    }
                  }}
                  disabled={!!downloading}
                >
                  📄{" "}
                  {downloading === "hi" ? (
                    "PDF बन रहा है..."
                  ) : (
                    <>
                      <span>
                        डाउनलोड विज्ञापन (हिंदी संस्करण) यहाँ क्लिक करें ✤✤
                      </span>
                      <span className="new-badge">NEW</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {Array.from({ length: rows }).map((_, i) => {
              const isFeeStructureRow = rowsEn[i]?.[0] === "Fee Structure" || rowsHi[i]?.[0] === "शुल्क संरचना";
              return (
                <div
                  key={i}
                  className={`jobs-detail-row ${i % 2 === 0 ? "row-odd" : "row-even"}`}
                >
                  <div
                    className="jobs-detail-lang-cell"
                    style={{ borderRight: `1px solid ${GREEN}33` }}
                  >
                    <div className="jobs-detail-key">{rowsEn[i]?.[0] || ""}</div>
                    <div 
                      className="jobs-detail-val"
                      style={isFeeStructureRow ? { whiteSpace: "pre-line", lineHeight: "1.6" } : {}}
                    >
                      : {rowsEn[i]?.[1] || ""}
                    </div>
                  </div>
                  <div className="jobs-detail-lang-cell">
                    <div className="jobs-detail-key">{rowsHi[i]?.[0] || ""}</div>
                    <div 
                      className="jobs-detail-val"
                      style={isFeeStructureRow ? { whiteSpace: "pre-line", lineHeight: "1.6" } : {}}
                    >
                      : {rowsHi[i]?.[1] || ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Form / Closed / Review — all inline below the table */}
        {!isActive ? (
          <div
            style={{
              marginTop: 16,
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 6,
              padding: "12px 18px",
              fontSize: 14,
              fontWeight: 700,
              color: "#8B1a1a",
            }}
          >
            ⚠️ This vacancy is closed. / यह भर्ती बंद हो चुकी है।
          </div>
        ) : formStep === "review" ? (
          // ── INLINE REVIEW (no popup) ──
          <InlineReview
            formData={formData}
            photoPreview={photoPreview}
            signaturePreview={signaturePreview}
            feeAmount={feeAmount}
            onEdit={() => {
              setFormStep("form");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSubmit={handleSubmit}
            applying={applying}
          />
        ) : (
          // ── FORM ──
          <>
            <div
              style={{
                marginTop: 16,
                background: "#f0f0f0",
                borderRadius: "4px 4px 0 0",
                padding: "10px 16px",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "#1a2a4a",
              }}
            >
              Recruitment for the Post of {titleEn} Advt. No. {job.advtNo} /{" "}
              {titleHi} {job.advtNo}
            </div>
            <div
              style={{
                background: "#f0f0f0",
                borderRadius: "0 0 4px 4px",
                padding: "20px 20px 28px",
              }}
            >
              <FormFields
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                photoPreview={photoPreview}
                signaturePreview={signaturePreview}
              />

              {feeAmount > 0 && (
                <div
                  style={{
                    background: "#fff3cd",
                    padding: 16,
                    borderRadius: 4,
                    marginTop: 20,
                    border: "2px solid #ffc107",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                    Fee Structure / शुल्क संरचना
                  </div>
                  <div
                    style={{ fontSize: 24, fontWeight: 700, color: "#856404" }}
                  >
                    ₹{feeAmount}
                  </div>
                  {calculatingFee && (
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      Calculating...
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreed1}
                    onChange={(e) => setAgreed1(e.target.checked)}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 2,
                      flexShrink: 0,
                      accentColor: GREEN,
                    }}
                  />
                  I have read and agree to the Terms and Conditions.{" "}
                  <a
                    href="#"
                    style={{
                      color: "#000",
                      fontWeight: 700,
                      textDecoration: "underline",
                      marginLeft: 4,
                    }}
                  >
                    Click here to read
                  </a>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    lineHeight: 1.6,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreed2}
                    onChange={(e) => setAgreed2(e.target.checked)}
                    style={{
                      width: 15,
                      height: 15,
                      marginTop: 2,
                      flexShrink: 0,
                      accentColor: GREEN,
                    }}
                  />
                  I declare that all the information given in this application
                  form is correct to the best of my knowledge and belief.
                </label>
              </div>
              <div style={{ textAlign: "center", marginTop: 22 }}>
                <button onClick={handleReview} className="jobs-submit-btn">
                  SUBMIT &amp; CONTINUE
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </SharedLayout>
  );
}
