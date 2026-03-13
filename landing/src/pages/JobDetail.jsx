import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobPostingsAPI, paymentsAPI } from "../utils/api.js";

const GREEN = "#3AB000";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate fee when gender/category changes (public endpoint, no token needed)
  useEffect(() => {
    if (formData.gender && formData.category && id) {
      calculateFee();
    } else {
      setFeeAmount(0);
    }
  }, [formData.gender, formData.category, id]);

  const calculateFee = async () => {
    try {
      setCalculatingFee(true);
      const response = await paymentsAPI.calculateFee(
        id,
        formData.gender,
        formData.category
      );
      if (response.success) {
        setFeeAmount(response.data.amount || 0);
      }
    } catch (err) {
      console.error("Fee calculation error:", err);
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
        if (response.success && response.data.posting) {
          setJob(response.data.posting);
        } else {
          setError("Job posting not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate application number when candidate name changes
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
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size must be less than 3MB");
        return;
      }
      if (type === "photo") {
        setPhoto(file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else if (type === "signature") {
        setSignature(file);
        const reader = new FileReader();
        reader.onloadend = () => setSignaturePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!agreed1 || !agreed2) {
      alert("Please accept the terms and conditions");
      return;
    }

    if (!photo || !signature) {
      alert("Please upload photo and signature");
      return;
    }

    setApplying(true);

    try {
      // Convert files to base64
      const photoBase64 = await convertFileToBase64(photo);
      const signatureBase64 = await convertFileToBase64(signature);

      // Get API URL from environment
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
      if (!apiUrl) {
        throw new Error("API base URL is not configured. Please set VITE_API_URL or VITE_BACKEND_URL in your .env file");
      }

      // Create application first
      const applyResponse = await fetch(
        `${apiUrl}/applications/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationNumber: formData.applicationNumber,
            candidateName: formData.candidateName,
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            dob: formData.dob,
            gender: formData.gender,
            nationality: formData.nationality,
            category: formData.category,
            aadhar: formData.aadhar,
            pan: formData.pan,
            mobile: formData.mobile,
            email: formData.email,
            address: formData.address,
            state: formData.state,
            district: formData.district,
            block: formData.block,
            panchayat: formData.panchayat,
            pincode: formData.pincode,
            higherEducation: formData.higherEducation,
            board: formData.board,
            marks: formData.marks,
            markPercentage: formData.markPercentage,
            jobPostingId: id,
            photo: photoBase64,
            signature: signatureBase64,
          }),
        }
      );

      const applyData = await applyResponse.json();

      if (!applyData.success) {
        throw new Error(applyData.message || "Failed to create application");
      }

      const applicationId = applyData.data.application._id;
      const token = applyData.data.token;

      // If fee is zero, skip payment
      if (feeAmount <= 0) {
        alert(
          `Application submitted successfully!${
            applyData.data.defaultPassword
              ? `\nYour default password is: ${applyData.data.defaultPassword}`
              : ""
          }`
        );
        setShowApplyForm(false);
        resetForm();
        return;
      }

      // Create payment order with token
      const orderResponse = await paymentsAPI.createOrder(
        id,
        formData.gender,
        formData.category,
        token
      );

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || "Failed to create payment order");
      }

      const { orderId, amount, amountInRupees, keyId } = orderResponse.data;

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error("Razorpay payment gateway is not loaded. Please refresh the page.");
      }

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
            // Verify payment with token
            const verifyResponse = await paymentsAPI.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              applicationId,
              token
            );

            if (verifyResponse.success) {
              alert(
                `Payment successful! Application submitted.${
                  applyData.data.defaultPassword
                    ? `\nYour default password is: ${applyData.data.defaultPassword}`
                    : ""
                }`
              );
              setShowApplyForm(false);
              resetForm();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setApplying(false);
          }
        },
        prefill: {
          name: formData.candidateName || "",
          email: formData.email || "",
          contact: formData.mobile || "",
        },
        theme: {
          color: GREEN,
        },
        modal: {
          ondismiss: function () {
            setApplying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
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
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={{ fontSize: 18, color: "#666" }}>Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
          background: "#f5f5f5",
        }}
      >
        <div style={{ fontSize: 18, color: "#e53e3e" }}>
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
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0f9ff 0%, #f5f5f5 100%)",
        fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.25)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 18px",
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.25)";
          }}
        >
          ← Back
        </button>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.5px" }}>
          Job Details / नौकरी विवरण
        </span>
        <button
          onClick={() => setShowApplyForm(!showApplyForm)}
          style={{
            background: "#fff",
            border: "none",
            color: GREEN,
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
          }}
        >
          {showApplyForm ? "✕ Cancel" : "✓ Apply Now / अभी आवेदन करें"}
        </button>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <div
          style={{
            maxWidth: 650,
            margin: "24px auto",
            background: "#fff",
            padding: 32,
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: `3px solid ${GREEN}`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: `${GREEN}20`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              📝
            </div>
            <h2
              style={{
                margin: 0,
                color: "#333",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Application Form / आवेदन फॉर्म
            </h2>
          </div>
          <form onSubmit={handleApply}>
            {/* Personal Details Section */}
            <div
              style={{
                background: "#f8f9fa",
                padding: 20,
                borderRadius: 8,
                marginBottom: 24,
                border: `2px solid ${GREEN}`,
              }}
            >
              <h3
                style={{
                  color: GREEN,
                  marginBottom: 16,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Personal Details / व्यक्तिगत विवरण
              </h3>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "#444",
                    fontSize: 14,
                  }}
                >
                  Application Number (Auto-generated) / आवेदन संख्या (स्वचालित)
                </label>
                <input
                  type="text"
                  name="applicationNumber"
                  value={formData.applicationNumber}
                  onChange={handleInputChange}
                  placeholder="Will be auto-generated based on name"
                  readOnly
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 15,
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                    background: "#f5f5f5",
                    color: "#666",
                    cursor: "not-allowed",
                  }}
                />
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  Format: First 4 letters of name + Month + Year (e.g., RAME012024)
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                    placeholder="Father's full name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "#444",
                    fontSize: 14,
                  }}
                >
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Mother's full name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 15,
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = GREEN;
                    e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male / पुरुष</option>
                    <option value="female">Female / महिला</option>
                    <option value="other">Other / अन्य</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Nationality *
                  </label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select Nationality</option>
                    <option value="indian">Indian / भारतीय</option>
                    <option value="other">Other / अन्य</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="general">General / सामान्य</option>
                    <option value="obc">OBC / अन्य पिछड़ा वर्ग</option>
                    <option value="sc">SC / अनुसूचित जाति</option>
                    <option value="st">ST / अनुसूचित जनजाति</option>
                    <option value="ews">EWS / आर्थिक रूप से कमजोर वर्ग</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleInputChange}
                    required
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    placeholder="10 digit mobile number"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Email ID *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "#444",
                    fontSize: 14,
                  }}
                >
                  Permanent Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter complete permanent address"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e0e0e0",
                    borderRadius: 8,
                    fontSize: 15,
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = GREEN;
                    e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Address Details Section */}
            <div
              style={{
                background: "#f8f9fa",
                padding: 20,
                borderRadius: 8,
                marginBottom: 24,
                border: `2px solid ${GREEN}`,
              }}
            >
              <h3
                style={{
                  color: GREEN,
                  marginBottom: 16,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Address Details / पता विवरण
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select State</option>
                    <option value="assam">Assam / असम</option>
                    <option value="bihar">Bihar / बिहार</option>
                    <option value="chhattisgarh">Chhattisgarh / छत्तीसगढ़</option>
                    <option value="delhi">Delhi / दिल्ली</option>
                    <option value="gujarat">Gujarat / गुजरात</option>
                    <option value="haryana">Haryana / हरियाणा</option>
                    <option value="jharkhand">Jharkhand / झारखंड</option>
                    <option value="madhya_pradesh">Madhya Pradesh / मध्य प्रदेश</option>
                    <option value="maharashtra">Maharashtra / महाराष्ट्र</option>
                    <option value="odisha">Odisha / ओडिशा</option>
                    <option value="rajasthan">Rajasthan / राजस्थान</option>
                    <option value="uttar_pradesh">Uttar Pradesh / उत्तर प्रदेश</option>
                    <option value="uttarakhand">Uttarakhand / उत्तराखंड</option>
                    <option value="west_bengal">West Bengal / पश्चिम बंगाल</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    placeholder="District name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Block
                  </label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleInputChange}
                    placeholder="Block name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Panchayat
                  </label>
                  <input
                    type="text"
                    name="panchayat"
                    value={formData.panchayat}
                    onChange={handleInputChange}
                    placeholder="Panchayat name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    placeholder="XXXXXX"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Education Details Section */}
            <div
              style={{
                background: "#f8f9fa",
                padding: 20,
                borderRadius: 8,
                marginBottom: 24,
                border: `2px solid ${GREEN}`,
              }}
            >
              <h3
                style={{
                  color: GREEN,
                  marginBottom: 16,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Education Details / शिक्षा विवरण
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Higher Education *
                  </label>
                  <input
                    type="text"
                    name="higherEducation"
                    value={formData.higherEducation}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. B.Tech, MBA, M.Sc"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Board / University *
                  </label>
                  <input
                    type="text"
                    name="board"
                    value={formData.board}
                    onChange={handleInputChange}
                    required
                    placeholder="University or Board name"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Marks *
                  </label>
                  <input
                    type="number"
                    name="marks"
                    value={formData.marks}
                    onChange={handleInputChange}
                    required
                    placeholder="Total marks obtained"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Mark Percentage *
                  </label>
                  <input
                    type="number"
                    name="markPercentage"
                    value={formData.markPercentage}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 75.5"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e0e0e0",
                      borderRadius: 8,
                      fontSize: 15,
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = GREEN;
                      e.target.style.boxShadow = `0 0 0 3px ${GREEN}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Photo and Signature Upload */}
            <div
              style={{
                background: "#f8f9fa",
                padding: 20,
                borderRadius: 8,
                marginBottom: 24,
                border: `2px solid ${GREEN}`,
              }}
            >
              <h3
                style={{
                  color: GREEN,
                  marginBottom: 16,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Documents / दस्तावेज़
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Photograph * (Max 3MB)
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      border: `2px dashed ${GREEN}`,
                      background: "#e8f5e9",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#d4edda";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#e8f5e9";
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        background: GREEN,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 16,
                      }}
                    >
                      📷
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>
                        {photo ? photo.name : "Choose Photo"}
                      </div>
                      <div style={{ fontSize: 12, color: "#666" }}>Max 3MB</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "photo")}
                      style={{ display: "none" }}
                    />
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Photo preview"
                      style={{
                        marginTop: 12,
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: `2px solid ${GREEN}`,
                      }}
                    />
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontWeight: 600,
                      color: "#444",
                      fontSize: 14,
                    }}
                  >
                    Signature * (Max 3MB)
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      border: `2px dashed ${GREEN}`,
                      background: "#e8f5e9",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#d4edda";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#e8f5e9";
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        background: GREEN,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 16,
                      }}
                    >
                      ✍️
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: GREEN }}>
                        {signature ? signature.name : "Choose Signature"}
                      </div>
                      <div style={{ fontSize: 12, color: "#666" }}>Max 3MB</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "signature")}
                      style={{ display: "none" }}
                    />
                  </label>
                  {signaturePreview && (
                    <img
                      src={signaturePreview}
                      alt="Signature preview"
                      style={{
                        marginTop: 12,
                        width: 150,
                        height: 60,
                        objectFit: "contain",
                        borderRadius: 8,
                        border: `2px solid ${GREEN}`,
                        background: "#fff",
                        padding: 4,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Fee Display */}
            {feeAmount > 0 && (
              <div
                style={{
                  background: "#fff3cd",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 24,
                  border: `2px solid #ffc107`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
                  Application Fee / आवेदन शुल्क
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#856404" }}>
                  ₹{feeAmount}
                </div>
                {calculatingFee && (
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    Calculating...
                  </div>
                )}
              </div>
            )}

            {/* Declaration */}
            <div
              style={{
                background: "#f8f9fa",
                padding: 20,
                borderRadius: 8,
                marginBottom: 24,
                border: `2px solid ${GREEN}`,
              }}
            >
              <h3
                style={{
                  color: GREEN,
                  marginBottom: 16,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Declaration / घोषणा
              </h3>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 12,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed1}
                  onChange={(e) => setAgreed1(e.target.checked)}
                  style={{
                    width: 18,
                    height: 18,
                    marginTop: 2,
                    cursor: "pointer",
                    accentColor: GREEN,
                  }}
                />
                <span style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
                  I have read and agree to the{" "}
                  <span style={{ color: GREEN, fontWeight: 600, textDecoration: "underline" }}>
                    Terms and Conditions
                  </span>
                  .
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed2}
                  onChange={(e) => setAgreed2(e.target.checked)}
                  style={{
                    width: 18,
                    height: 18,
                    marginTop: 2,
                    cursor: "pointer",
                    accentColor: GREEN,
                  }}
                />
                <span style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>
                  I declare that all the information given in this application form is
                  correct to the best of my knowledge and belief.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={applying || !agreed1 || !agreed2 || !photo || !signature}
              style={{
                width: "100%",
                padding: "16px",
                background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: applying || !agreed1 || !agreed2 || !photo || !signature ? "not-allowed" : "pointer",
                opacity: applying || !agreed1 || !agreed2 || !photo || !signature ? 0.7 : 1,
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(58, 176, 0, 0.3)",
                marginTop: 8,
              }}
              onMouseEnter={(e) => {
                if (!applying && agreed1 && agreed2 && photo && signature) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(58, 176, 0, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(58, 176, 0, 0.3)";
              }}
            >
              {applying
                ? "⏳ Processing..."
                : feeAmount > 0
                ? `✓ Submit & Pay ₹${feeAmount}`
                : "✓ Submit Application"}
            </button>
          </form>
        </div>
      )}

      {/* Job Details - Hindi Left, English Right */}
      <div
        style={{
          maxWidth: 1400,
          margin: "32px auto",
          padding: "0 24px",
        }}
      >
        {/* Advertisement Number Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${GREEN} 0%, #2d8a00 100%)`,
            color: "#fff",
            padding: "20px 32px",
            borderRadius: "12px 12px 0 0",
            marginBottom: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>
                Advertisement Number / विज्ञप्ति संख्या
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "1px" }}>
                {job.advtNo}
              </div>
            </div>
            {job.status && (
              <div
                style={{
                  background: "rgba(255,255,255,0.25)",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {job.status}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            background: "#fff",
            borderRadius: "0 0 12px 12px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Hindi Section - Left */}
          <div
            style={{
              padding: "32px",
              borderRight: "3px solid #e8f5e9",
              background: "linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: `3px solid ${GREEN}`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: `${GREEN}20`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                📄
              </div>
              <h2
                style={{
                  color: GREEN,
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {job.title?.hi || job.postTitle?.hi || "नौकरी विवरण"}
              </h2>
            </div>

            <div style={{ lineHeight: 2, color: "#333" }}>

              {job.post?.hi && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    पद / Post
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.post.hi}
                  </div>
                </div>
              )}

              {job.location?.hi && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    स्थान / Location
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.location.hi}
                  </div>
                </div>
              )}

              {job.education?.hi && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    शिक्षा / Education
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.education.hi}
                  </div>
                </div>
              )}

              {job.income?.hi && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    आय / Income
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.income.hi}
                  </div>
                </div>
              )}

              {job.ageLimit?.hi && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    आयु सीमा / Age Limit
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.ageLimit.hi}
                  </div>
                </div>
              )}

              {/* Fee Structure Table */}
              {job.feeStructure && Object.keys(job.feeStructure).some(key => job.feeStructure[key]) && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "20px",
                    background: "#fff9e6",
                    borderRadius: 8,
                    border: `2px solid #ffc107`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#856404",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    💰 शुल्क संरचना / Fee Structure
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 14,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#ffc107", color: "#333" }}>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "left",
                              border: "1px solid #ffc107",
                              fontWeight: 700,
                            }}
                          >
                            श्रेणी / Category
                          </th>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              border: "1px solid #ffc107",
                              fontWeight: 700,
                            }}
                          >
                            पुरुष / Male
                          </th>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              border: "1px solid #ffc107",
                              fontWeight: 700,
                            }}
                          >
                            महिला / Female
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: "general", label: "सामान्य / General" },
                          { key: "obc", label: "OBC" },
                          { key: "sc", label: "SC" },
                          { key: "st", label: "ST" },
                          { key: "ews", label: "EWS" },
                        ].map((cat, idx) => {
                          const maleFee = job.feeStructure[`male_${cat.key}`];
                          const femaleFee = job.feeStructure[`female_${cat.key}`];
                          if (!maleFee && !femaleFee) return null;
                          return (
                            <tr
                              key={cat.key}
                              style={{
                                background: idx % 2 === 0 ? "#fff" : "#fffbf0",
                              }}
                            >
                              <td
                                style={{
                                  padding: "10px 12px",
                                  border: "1px solid #e0e0e0",
                                  fontWeight: 600,
                                }}
                              >
                                {cat.label}
                              </td>
                              <td
                                style={{
                                  padding: "10px 12px",
                                  border: "1px solid #e0e0e0",
                                  textAlign: "center",
                                  color: "#856404",
                                  fontWeight: 600,
                                }}
                              >
                                {maleFee || "-"}
                              </td>
                              <td
                                style={{
                                  padding: "10px 12px",
                                  border: "1px solid #e0e0e0",
                                  textAlign: "center",
                                  color: "#856404",
                                  fontWeight: 600,
                                }}
                              >
                                {femaleFee || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {job.lastDate && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "16px",
                      background: "#e3f2fd",
                      borderRadius: 8,
                      borderLeft: `4px solid #2196f3`,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                      अंतिम तिथि / Last Date
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
                      {job.lastDate}
                    </div>
                  </div>
                )}

                {job.applicationOpeningDate && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "16px",
                      background: "#e8f5e9",
                      borderRadius: 8,
                      borderLeft: `4px solid ${GREEN}`,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                      आवेदन शुरू / Opening Date
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>
                      {job.applicationOpeningDate}
                    </div>
                  </div>
                )}
              </div>

              {job.selectionProcess?.hi && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: `2px solid ${GREEN}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: GREEN,
                      marginBottom: 12,
                    }}
                  >
                    चयन प्रक्रिया / Selection Process
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.8,
                      color: "#333",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {job.selectionProcess.hi}
                  </div>
                </div>
              )}

              {job.advertisementFileHi && (
                <div
                  style={{
                    marginTop: 24,
                    padding: "16px",
                    background: `${GREEN}10`,
                    borderRadius: 8,
                    border: `2px dashed ${GREEN}`,
                    textAlign: "center",
                  }}
                >
                  <a
                    href={job.advertisementFileHi}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: GREEN,
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    📥 विज्ञापन डाउनलोड करें (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* English Section - Right */}
          <div style={{ padding: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: `3px solid ${GREEN}`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: `${GREEN}20`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                📄
              </div>
              <h2
                style={{
                  color: GREEN,
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {job.title?.en || job.postTitle?.en || "Job Details"}
              </h2>
            </div>

            <div style={{ lineHeight: 2, color: "#333" }}>
              {job.post?.en && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Post / पद
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.post.en}
                  </div>
                </div>
              )}

              {job.location?.en && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Location / स्थान
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.location.en}
                  </div>
                </div>
              )}

              {job.education?.en && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Education / शिक्षा
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.education.en}
                  </div>
                </div>
              )}

              {job.income?.en && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Income / आय
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.income.en}
                  </div>
                </div>
              )}

              {job.ageLimit?.en && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    borderLeft: `4px solid ${GREEN}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Age Limit / आयु सीमा
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                    {job.ageLimit.en}
                  </div>
                </div>
              )}

              {/* Fee Structure Table */}
              {job.feeStructure && Object.keys(job.feeStructure).some(key => job.feeStructure[key]) && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "20px",
                    background: "#fff9e6",
                    borderRadius: 8,
                    border: `2px solid #ffc107`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#856404",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    💰 Fee Structure / शुल्क संरचना
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 14,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#ffc107", color: "#333" }}>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "left",
                              border: "1px solid #ffc107",
                              fontWeight: 700,
                            }}
                          >
                            Category / श्रेणी
                          </th>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              border: "1px solid #ffc107",
                              fontWeight: 700,
                            }}
                          >
                            Male / पुरुष
                          </th>
                          <th
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              border: "1px solid #ffc107",
                              fontWeight: 700,
                            }}
                          >
                            Female / महिला
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: "general", label: "General / सामान्य" },
                          { key: "obc", label: "OBC" },
                          { key: "sc", label: "SC" },
                          { key: "st", label: "ST" },
                          { key: "ews", label: "EWS" },
                        ].map((cat, idx) => {
                          const maleFee = job.feeStructure[`male_${cat.key}`];
                          const femaleFee = job.feeStructure[`female_${cat.key}`];
                          if (!maleFee && !femaleFee) return null;
                          return (
                            <tr
                              key={cat.key}
                              style={{
                                background: idx % 2 === 0 ? "#fff" : "#fffbf0",
                              }}
                            >
                              <td
                                style={{
                                  padding: "10px 12px",
                                  border: "1px solid #e0e0e0",
                                  fontWeight: 600,
                                }}
                              >
                                {cat.label}
                              </td>
                              <td
                                style={{
                                  padding: "10px 12px",
                                  border: "1px solid #e0e0e0",
                                  textAlign: "center",
                                  color: "#856404",
                                  fontWeight: 600,
                                }}
                              >
                                {maleFee || "-"}
                              </td>
                              <td
                                style={{
                                  padding: "10px 12px",
                                  border: "1px solid #e0e0e0",
                                  textAlign: "center",
                                  color: "#856404",
                                  fontWeight: 600,
                                }}
                              >
                                {femaleFee || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {job.lastDate && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "16px",
                      background: "#e3f2fd",
                      borderRadius: 8,
                      borderLeft: `4px solid #2196f3`,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                      Last Date / अंतिम तिथि
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1565c0" }}>
                      {job.lastDate}
                    </div>
                  </div>
                )}

                {job.applicationOpeningDate && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "16px",
                      background: "#e8f5e9",
                      borderRadius: 8,
                      borderLeft: `4px solid ${GREEN}`,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                      Opening Date / आवेदन शुरू
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>
                      {job.applicationOpeningDate}
                    </div>
                  </div>
                )}
              </div>

              {job.selectionProcess?.en && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: `2px solid ${GREEN}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: GREEN,
                      marginBottom: 12,
                    }}
                  >
                    Selection Process / चयन प्रक्रिया
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.8,
                      color: "#333",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {job.selectionProcess.en}
                  </div>
                </div>
              )}

              {job.advertisementFile && (
                <div
                  style={{
                    marginTop: 24,
                    padding: "16px",
                    background: `${GREEN}10`,
                    borderRadius: 8,
                    border: `2px dashed ${GREEN}`,
                    textAlign: "center",
                  }}
                >
                  <a
                    href={job.advertisementFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: GREEN,
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    📥 Download Advertisement (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
