import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
}

/**
 * Send application confirmation email with all details
 */
export async function sendApplicationEmail(applicationData, loginCredentials) {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("Email not configured. Skipping email send.");
      return { success: false, message: "Email not configured" };
    }

    // Check if applicant has email
    if (!applicationData.email) {
      console.warn("Applicant email not provided. Skipping email send.");
      return { success: false, message: "Applicant email not provided" };
    }

    const transporter = createTransporter();

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    // Format category
    const formatCategory = (cat) => {
      const categories = {
        general: "General / सामान्य",
        obc: "OBC / अन्य पिछड़ा वर्ग",
        sc: "SC / अनुसूचित जाति",
        st: "ST / अनुसूचित जनजाति",
        ews: "EWS / आर्थिक रूप से कमजोर वर्ग",
      };
      return categories[cat] || cat || "N/A";
    };

    // Format gender
    const formatGender = (gender) => {
      const genders = {
        male: "Male / पुरुष",
        female: "Female / महिला",
        other: "Other / अन्य",
      };
      return genders[gender] || gender || "N/A";
    };

    // Format nationality
    const formatNationality = (nat) => {
      const nationalities = {
        indian: "Indian / भारतीय",
        other: "Other / अन्य",
      };
      return nationalities[nat] || nat || "N/A";
    };

    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #3AB000 0%, #2d8a00 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .section {
      margin-bottom: 25px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .section-title {
      background-color: #3AB000;
      color: white;
      padding: 12px 20px;
      font-weight: 700;
      font-size: 16px;
      margin: 0;
    }
    .section-content {
      padding: 20px;
      background-color: #fafafa;
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #555;
      width: 200px;
      flex-shrink: 0;
    }
    .detail-value {
      color: #333;
      flex: 1;
    }
    .credentials-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .credentials-box h3 {
      color: #856404;
      margin-top: 0;
    }
    .credentials-item {
      padding: 8px 0;
      font-size: 15px;
    }
    .credentials-item strong {
      color: #856404;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .success-badge {
      display: inline-block;
      background-color: #28a745;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Application Submitted Successfully!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">जन स्वास्थ्य सहायता अभियान (JSSA)</p>
    </div>

    <div style="text-align: center;">
      <span class="success-badge">✓ Application Received</span>
    </div>

    <div class="credentials-box">
      <h3>🔐 Login Credentials / लॉगिन क्रेडेंशियल</h3>
      <div class="credentials-item">
        <strong>Login ID:</strong> ${loginCredentials.identifier}
      </div>
      <div class="credentials-item">
        <strong>Password:</strong> ${loginCredentials.password}
      </div>
      <div class="credentials-item" style="margin-top: 10px; font-size: 13px; color: #856404;">
        ⚠️ Please save these credentials for future login
      </div>
    </div>

    <div class="section">
      <div class="section-title">Application Details / आवेदन विवरण</div>
      <div class="section-content">
        <div class="detail-row">
          <div class="detail-label">Application Number:</div>
          <div class="detail-value"><strong>${applicationData.applicationNumber || "N/A"}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Application Date:</div>
          <div class="detail-value">${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value"><strong style="color: #3AB000;">Pending / लंबित</strong></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Personal Information / व्यक्तिगत जानकारी</div>
      <div class="section-content">
        <div class="detail-row">
          <div class="detail-label">Candidate Name:</div>
          <div class="detail-value"><strong>${applicationData.candidateName}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Father's Name:</div>
          <div class="detail-value">${applicationData.fatherName || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Mother's Name:</div>
          <div class="detail-value">${applicationData.motherName || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Date of Birth:</div>
          <div class="detail-value">${formatDate(applicationData.dob)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Gender:</div>
          <div class="detail-value">${formatGender(applicationData.gender)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Nationality:</div>
          <div class="detail-value">${formatNationality(applicationData.nationality)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Category:</div>
          <div class="detail-value">${formatCategory(applicationData.category)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Aadhar Number:</div>
          <div class="detail-value">${applicationData.aadhar || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">PAN Number:</div>
          <div class="detail-value">${applicationData.pan || "N/A"}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Contact Information / संपर्क जानकारी</div>
      <div class="section-content">
        <div class="detail-row">
          <div class="detail-label">Mobile Number:</div>
          <div class="detail-value"><strong>${applicationData.mobile}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email ID:</div>
          <div class="detail-value">${applicationData.email || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Permanent Address:</div>
          <div class="detail-value">${applicationData.address || "N/A"}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Address Details / पता विवरण</div>
      <div class="section-content">
        <div class="detail-row">
          <div class="detail-label">State:</div>
          <div class="detail-value">${applicationData.state || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">District:</div>
          <div class="detail-value">${applicationData.district || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Block:</div>
          <div class="detail-value">${applicationData.block || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Panchayat:</div>
          <div class="detail-value">${applicationData.panchayat || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Pincode:</div>
          <div class="detail-value">${applicationData.pincode || "N/A"}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Education Details / शिक्षा विवरण</div>
      <div class="section-content">
        <div class="detail-row">
          <div class="detail-label">Higher Education:</div>
          <div class="detail-value"><strong>${applicationData.higherEducation || "N/A"}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Board / University:</div>
          <div class="detail-value">${applicationData.board || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Marks:</div>
          <div class="detail-value">${applicationData.marks || "N/A"}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Mark Percentage:</div>
          <div class="detail-value">${applicationData.markPercentage || "N/A"}%</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Thank you for applying!</strong></p>
      <p>आवेदन करने के लिए धन्यवाद!</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        This is an automated email. Please do not reply to this email.<br>
        यह एक स्वचालित ईमेल है। कृपया इस ईमेल का जवाब न दें।
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
Application Submitted Successfully - JSSA
========================================

LOGIN CREDENTIALS:
------------------
Login ID: ${loginCredentials.identifier}
Password: ${loginCredentials.password}

Please save these credentials for future login.

APPLICATION DETAILS:
-------------------
Application Number: ${applicationData.applicationNumber || "N/A"}
Application Date: ${new Date().toLocaleDateString("en-IN")}
Status: Pending

PERSONAL INFORMATION:
--------------------
Candidate Name: ${applicationData.candidateName}
Father's Name: ${applicationData.fatherName || "N/A"}
Mother's Name: ${applicationData.motherName || "N/A"}
Date of Birth: ${formatDate(applicationData.dob)}
Gender: ${formatGender(applicationData.gender)}
Nationality: ${formatNationality(applicationData.nationality)}
Category: ${formatCategory(applicationData.category)}
Aadhar Number: ${applicationData.aadhar || "N/A"}
PAN Number: ${applicationData.pan || "N/A"}

CONTACT INFORMATION:
-------------------
Mobile Number: ${applicationData.mobile}
Email ID: ${applicationData.email || "N/A"}
Permanent Address: ${applicationData.address || "N/A"}

ADDRESS DETAILS:
---------------
State: ${applicationData.state || "N/A"}
District: ${applicationData.district || "N/A"}
Block: ${applicationData.block || "N/A"}
Panchayat: ${applicationData.panchayat || "N/A"}
Pincode: ${applicationData.pincode || "N/A"}

EDUCATION DETAILS:
------------------
Higher Education: ${applicationData.higherEducation || "N/A"}
Board / University: ${applicationData.board || "N/A"}
Marks: ${applicationData.marks || "N/A"}
Mark Percentage: ${applicationData.markPercentage || "N/A"}%

Thank you for applying!
आवेदन करने के लिए धन्यवाद!
    `;

    // Send email
    const mailOptions = {
      from: `"JSSA" <${process.env.SMTP_USER}>`,
      to: applicationData.email,
      subject: `Application Submitted Successfully - ${applicationData.applicationNumber || "JSSA"}`,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Application email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending application email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send OTP email for password reset
 */
export async function sendOTPEmail(email, otp) {
  try {
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("Email not configured. Skipping email send.");
      return { success: false, message: "Email not configured" };
    }

    const transporter = createTransporter();

    // Email HTML template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #3AB000 0%, #2d8a00 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .otp-box {
      background-color: #f0fdf4;
      border: 2px solid #3AB000;
      border-radius: 8px;
      padding: 30px;
      margin: 20px 0;
      text-align: center;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      color: #3AB000;
      letter-spacing: 8px;
      margin: 15px 0;
      font-family: 'Courier New', monospace;
    }
    .info-text {
      color: #666;
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      color: #856404;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset OTP</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">जन स्वास्थ्य सहायता अभियान (JSSA)</p>
    </div>

    <p style="font-size: 16px; color: #333;">Hello,</p>
    <p style="font-size: 16px; color: #333;">You have requested to reset your password. Please use the following OTP (One-Time Password) to verify your identity:</p>

    <div class="otp-box">
      <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code:</p>
      <div class="otp-code">${otp}</div>
      <p style="margin: 0; color: #666; font-size: 12px;">This OTP is valid for 10 minutes</p>
    </div>

    <div class="warning">
      <strong>⚠️ Security Notice:</strong><br>
      If you did not request this password reset, please ignore this email. Your account remains secure.
    </div>

    <p class="info-text">
      Enter this OTP on the password reset page to continue with resetting your password.
    </p>

    <div class="footer">
      <p style="margin: 0;">This is an automated email. Please do not reply.</p>
      <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} JSSA - जन स्वास्थ्य सहायता अभियान
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
Password Reset OTP - JSSA

Hello,

You have requested to reset your password. Please use the following OTP (One-Time Password) to verify your identity:

OTP Code: ${otp}

This OTP is valid for 10 minutes.

⚠️ Security Notice:
If you did not request this password reset, please ignore this email. Your account remains secure.

Enter this OTP on the password reset page to continue with resetting your password.

This is an automated email. Please do not reply.

© ${new Date().getFullYear()} JSSA - जन स्वास्थ्य सहायता अभियान
    `;

    // Send email
    const mailOptions = {
      from: `"JSSA" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset OTP - JSSA",
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send payment success email with application slip format
 * Matches the PDF design from PaymentSuccess page
 */
export async function sendPaymentSuccessEmail(applicationData, loginCredentials, jobPosting, pdfFilePath = null) {
  try {
    console.log("📧 sendPaymentSuccessEmail called");
    console.log("📧 Application email:", applicationData.email);
    console.log("📧 PDF file path provided:", pdfFilePath || "None (will generate on-the-fly)");
    console.log("📧 SMTP_USER configured:", !!process.env.SMTP_USER);
    console.log("📧 SMTP_PASS configured:", !!process.env.SMTP_PASS);
    
    // Check if email is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ Email not configured. Skipping email send.");
      console.warn("⚠️ SMTP_USER:", process.env.SMTP_USER ? "Set" : "Not set");
      console.warn("⚠️ SMTP_PASS:", process.env.SMTP_PASS ? "Set" : "Not set");
      return { success: false, message: "Email not configured" };
    }

    // Check if applicant has email
    if (!applicationData.email) {
      console.warn("⚠️ Applicant email not provided. Skipping email send.");
      return { success: false, message: "Applicant email not provided" };
    }
    
    console.log("📧 Proceeding with email send to:", applicationData.email);

    const transporter = createTransporter();
    console.log("📧 Transporter created");

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    // Format category
    const formatCategory = (cat) => {
      if (!cat) return "N/A";
      return cat.toUpperCase();
    };

    // Format gender
    const formatGender = (gender) => {
      if (!gender) return "N/A";
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    };

    // Format nationality
    const formatNationality = (nat) => {
      if (!nat) return "N/A";
      return nat.charAt(0).toUpperCase() + nat.slice(1);
    };

    // Get photo and signature as base64 (if available)
    const photoBase64 = applicationData.photo || "";
    const signatureBase64 = applicationData.signature || "";
    const photoSrc = photoBase64 
      ? (photoBase64.startsWith('data:') ? photoBase64 : `data:image/jpeg;base64,${photoBase64}`)
      : "";
    const signatureSrc = signatureBase64
      ? (signatureBase64.startsWith('data:') ? signatureBase64 : `data:image/png;base64,${signatureBase64}`)
      : "";
    
    // Logo URL - use public URL for email, file path for PDF
    const logoUrl = "https://jssabhiyan.com/assets/jss.png";
    const logoPathForPdf = "./landing/src/assets/jss.png"; // For Puppeteer PDF generation

    // Login URL
    const loginUrl = process.env.FRONTEND_URL 
      ? `${process.env.FRONTEND_URL}/login`
      : "https://jssabhiyan.com/login";

    // Email HTML template - Simple format matching text version
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .success-banner {
      background: linear-gradient(135deg, #0aca00 0%, #088a00 100%);
      color: white;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 25px;
      text-align: center;
    }
    .success-title {
      font-size: 28px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 10px;
    }
    .success-subtitle {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 15px;
    }
    .app-number {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 6px;
      display: inline-block;
      margin-top: 10px;
    }
    .credentials-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    .credentials-box h3 {
      color: #856404;
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .credentials-item {
      padding: 8px 0;
      font-size: 15px;
      font-weight: 600;
    }
    .credentials-item strong {
      color: #856404;
    }
    .details-box {
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .details-box h3 {
      color: #0aca00;
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      border-bottom: 2px solid #0aca00;
      padding-bottom: 8px;
    }
    .detail-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #555;
      width: 180px;
      flex-shrink: 0;
    }
    .detail-value {
      color: #333;
      flex: 1;
    }
    .pdf-notice {
      background: #e3f2fd;
      border: 2px solid #2196f3;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    .pdf-notice h3 {
      color: #1976d2;
      margin-top: 0;
      font-size: 20px;
      margin-bottom: 12px;
    }
    .pdf-notice p {
      color: #333;
      font-size: 14px;
      line-height: 1.6;
      margin: 8px 0;
    }
    .email-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 13px;
    }
    .header-section {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      background: #0aca00;
      color: white;
    }
    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 2px solid #fff;
      overflow: hidden;
      padding: 6px;
      box-sizing: border-box;
    }
    .logo-circle img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .header-text {
      flex: 1;
    }
    .header-title {
      font-size: 22px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .header-subtitle {
      font-size: 12px;
      color: #fff;
      margin-bottom: 2px;
      font-weight: 600;
    }
    .header-note {
      font-size: 10px;
      color: #fff;
      margin-bottom: 4px;
    }
    .header-reg {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }
    .recruitment-title {
      background: #fff;
      color: #000;
      padding: 10px 20px;
      text-align: center;
      font-weight: 700;
      font-size: 14px;
      border-bottom: 1px solid #e0e0e0;
    }
    .advt-section {
      background: #000;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .advt-text {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }
    .app-slip-title {
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      flex: 1;
      min-width: 150px;
    }
    .date-text {
      font-size: 13px;
      white-space: nowrap;
    }
    .post-section {
      display: flex;
      justify-content: space-between;
      padding: 12px 20px;
      background: #f9f9f9;
      border-bottom: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: 8px;
    }
    .post-text {
      font-size: 12px;
      font-weight: 600;
    }
    .app-no-text {
      font-size: 12px;
      font-weight: 700;
    }
    .details-section {
      padding: 15px 20px;
      background: #fff;
      position: relative;
    }
    .section-title {
      font-size: 16px;
      font-weight: 900;
      color: #000;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e0e0e0;
    }
    .detail-item {
      font-size: 15px;
      line-height: 2.2;
      margin-bottom: 4px;
    }
    .detail-item strong {
      color: #333;
    }
    .detail-value {
      color: #000;
      font-weight: 700;
    }
    .photo-container {
      position: absolute;
      top: 70px;
      right: 20px;
      width: 110px;
      text-align: center;
      z-index: 10;
    }
    .photo-container img {
      width: 100%;
      height: 130px;
      object-fit: cover;
      border: 2px solid #000;
      border-radius: 4px;
      display: block;
      background: #fff;
    }
    .signature-container {
      position: absolute;
      bottom: 15px;
      right: 20px;
      text-align: right;
      z-index: 10;
    }
    .signature-box {
      display: inline-block;
      border: 1px solid #e0e0e0;
      background: #f0f8ff;
      padding: 10px 16px;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .signature-box img {
      width: 180px;
      height: 70px;
      object-fit: contain;
      display: block;
      margin-bottom: 6px;
      background: #fff;
    }
    .signature-label {
      font-size: 13px;
      font-weight: 600;
      color: #000;
      text-align: center;
    }
    .declarations-section {
      padding: 15px 20px;
      background: #fff;
      border-top: 1px solid #e0e0e0;
    }
    .declaration-item {
      margin-bottom: 12px;
      font-size: 11px;
      line-height: 1.6;
    }
    .payment-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      border: 1px solid #e0e0e0;
      margin-top: 12px;
    }
    .payment-table th {
      padding: 10px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #1a2a4a;
      background: #1a2a4a;
      color: #fff;
      font-size: 13px;
    }
    .payment-table td {
      padding: 10px;
      border: 1px solid #e0e0e0;
      color: #000;
      font-size: 13px;
    }
    .payment-table tr {
      background: #f9f9f9;
    }
    .status-complete {
      color: #0aca00;
      font-weight: 700;
    }
    .footer-section {
      padding: 12px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #666;
      background: #f9f9f9;
      flex-wrap: wrap;
      gap: 8px;
    }
    .footer-url {
      word-break: break-all;
      flex: 1;
      min-width: 200px;
    }
    .footer-page {
      white-space: nowrap;
    }
    .email-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    p {
      margin: 10px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    strong {
      font-weight: 600;
      color: #333;
    }
    a {
      color: #1976d2;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <p>Dear Applicant,</p>
    
    <p>Thank you for submitting your application.</p>
    
    <p>Your application has been successfully received and registered in our system. Please find your application details below:</p>
    
    <p>
      <strong>Application Number:</strong> ${applicationData.applicationNumber || "N/A"}<br>
      <strong>Username / Login ID:</strong> ${loginCredentials.identifier}<br>
      <strong>Password:</strong> ${loginCredentials.password}
    </p>
    
    <p>You can log in to your applicant dashboard using the link below:<br>
    <strong>Login Link:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
    
    <p>Through your dashboard, you will be able to track the status of your application and manage further updates.</p>
    
    <p>You can also download your <strong>Application Form PDF</strong> directly from your dashboard and keep it safe for your records.</p>
    
    <p>If you face any issue while logging in, feel free to contact our support team.</p>
    
    <div class="footer">
      <p><strong>Best Regards,</strong><br>
      Support Team<br>
      Jan Swasthya Sahayata Abhiyan</p>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version - Exact format as requested
    const textContent = `Dear Applicant,

Thank you for submitting your application.

Your application has been successfully received and registered in our system. Please find your application details below:

*Application Number:* ${applicationData.applicationNumber || "N/A"}
*Username / Login ID:* ${loginCredentials.identifier}
*Password:* ${loginCredentials.password}

You can log in to your applicant dashboard using the link below:
*Login Link:* ${loginUrl}

Through your dashboard, you will be able to track the status of your application and manage further updates.

You can also download your *Application Form PDF* directly from your dashboard and keep it safe for your records.

If you face any issue while logging in, feel free to contact our support team.

Best Regards,
Support Team
Jan Swasthya Sahayata Abhiyan
    `;

    // Send email (no PDF attachment - user can download from dashboard)
    const mailOptions = {
      from: `"JSSA" <${process.env.SMTP_USER}>`,
      to: applicationData.email,
      subject: `Application Submitted - ${applicationData.applicationNumber || "JSSA"}`,
      text: textContent,
      html: htmlContent,
    };

    console.log("📧 Sending email via SMTP...");
    console.log("📧 Email to:", applicationData.email);
    console.log("📧 Email from:", process.env.SMTP_USER);
    console.log("📧 SMTP Host:", process.env.SMTP_HOST || "smtp.gmail.com");
    console.log("📧 SMTP Port:", process.env.SMTP_PORT || "587");
    console.log("📧 Email subject:", mailOptions.subject);
    
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("✅ Message ID:", info.messageId);
    console.log("✅ Email sent to:", applicationData.email);
    console.log("✅ Response:", info.response || "No response");
    console.log("✅ Accepted:", JSON.stringify(info.accepted || []));
    console.log("✅ Rejected:", JSON.stringify(info.rejected || []));
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Error sending payment success email:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error command:", error.command);
    console.error("❌ Error responseCode:", error.responseCode);
    console.error("❌ Error response:", error.response);
    console.error("❌ Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate and save application PDF to file system
 * Returns the file path for email attachment
 */
export async function generateAndSaveApplicationPDF(applicationData, jobPosting) {
  console.log("📄 generateAndSaveApplicationPDF called");
  console.log("📄 Application Number:", applicationData.applicationNumber);
  console.log("📄 Job Posting:", jobPosting ? "Found" : "Not found");
  try {
    const uploadsDir = path.resolve(__dirname, '../uploads/pdfs');
    console.log("📄 Uploads directory:", uploadsDir);
    if (!fs.existsSync(uploadsDir)) {
      console.log("📄 Creating uploads directory...");
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("✅ Uploads directory created");
    } else {
      console.log("✅ Uploads directory exists");
    }

    const timestamp = Date.now();
    const fileName = `Application_Slip_${applicationData.applicationNumber || 'JSSA'}_${timestamp}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    const photoSrc = applicationData.photo 
      ? (applicationData.photo.startsWith('data:') ? applicationData.photo : `data:image/jpeg;base64,${applicationData.photo}`)
      : "";
    const signatureSrc = applicationData.signature
      ? (applicationData.signature.startsWith('data:') ? applicationData.signature : `data:image/png;base64,${applicationData.signature}`)
      : "";

    let logoForPdf = "https://jssabhiyan.com/assets/jss.png"; // Default to URL
    try {
      const logoPath = path.resolve(process.cwd(), 'landing/src/assets/jss.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString('base64');
        logoForPdf = `data:image/png;base64,${logoBase64}`;
      }
    } catch (logoErr) {
      console.log("⚠️ Could not load logo file for PDF generation, using URL:", logoErr.message);
    }

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    const formatCategory = (cat) => (cat ? cat.toUpperCase() : "N/A");
    const formatGender = (gender) => (gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "N/A");
    const formatNationality = (nat) => (nat ? nat.charAt(0).toUpperCase() + nat.slice(1) : "N/A");

    const pdfHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0; background-color: #fff; }
    .application-slip { background: #fff; font-size: 14px; line-height: 1.5; }
    .header-section { display: flex; align-items: center; gap: 15px; padding: 15px 20px; background: #0aca00; color: white; }
    .logo-circle { width: 80px; height: 80px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid #fff; overflow: hidden; padding: 6px; box-sizing: border-box; }
    .logo-circle img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .header-text { flex: 1; }
    .header-title { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 4px; line-height: 1.2; }
    .header-subtitle { font-size: 12px; color: #fff; margin-bottom: 2px; font-weight: 600; }
    .header-note { font-size: 10px; color: #fff; margin-bottom: 4px; }
    .header-reg { font-size: 12px; font-weight: 700; color: #fff; }
    .recruitment-title { background: #fff; color: #000; padding: 10px 20px; text-align: center; font-weight: 700; font-size: 14px; border-bottom: 1px solid #e0e0e0; }
    .advt-section { background: #000; color: #fff; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
    .advt-text { font-size: 13px; font-weight: 600; white-space: nowrap; }
    .app-slip-title { font-size: 14px; font-weight: 700; text-align: center; flex: 1; min-width: 150px; }
    .date-text { font-size: 13px; white-space: nowrap; }
    .post-section { display: flex; justify-content: space-between; padding: 12px 20px; background: #f9f9f9; border-bottom: 1px solid #e0e0e0; flex-wrap: wrap; gap: 8px; }
    .post-text { font-size: 12px; font-weight: 600; }
    .app-no-text { font-size: 12px; font-weight: 700; }
    .details-section { padding: 15px 20px; background: #fff; position: relative; }
    .section-title { font-size: 16px; font-weight: 900; color: #000; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e0e0e0; }
    .detail-item { font-size: 15px; line-height: 2.2; margin-bottom: 4px; }
    .detail-item strong { color: #333; }
    .detail-value { color: #000; font-weight: 700; }
    .photo-container { position: absolute; top: 70px; right: 20px; width: 110px; text-align: center; z-index: 10; }
    .photo-container img { width: 100%; height: 130px; object-fit: cover; border: 2px solid #000; border-radius: 4px; display: block; background: #fff; }
    .signature-container { position: absolute; bottom: 15px; right: 20px; text-align: right; z-index: 10; }
    .signature-box { display: inline-block; border: 1px solid #e0e0e0; background: #f0f8ff; padding: 10px 16px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .signature-box img { width: 180px; height: 70px; object-fit: contain; display: block; margin-bottom: 6px; background: #fff; }
    .signature-label { font-size: 13px; font-weight: 600; color: #000; text-align: center; }
    .declarations-section { padding: 15px 20px; background: #fff; border-top: 1px solid #e0e0e0; }
    .declaration-item { margin-bottom: 12px; font-size: 11px; line-height: 1.6; }
    .payment-table { width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #e0e0e0; margin-top: 12px; }
    .payment-table th { padding: 10px; text-align: left; font-weight: 700; border: 1px solid #1a2a4a; background: #1a2a4a; color: #fff; font-size: 13px; }
    .payment-table td { padding: 10px; border: 1px solid #e0e0e0; color: #000; font-size: 13px; }
    .payment-table tr { background: #f9f9f9; }
    .status-complete { color: #0aca00; font-weight: 700; }
    .status-pending { color: #ffc107; font-weight: 700; }
    .footer-section { padding: 12px 20px; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #666; background: #f9f9f9; flex-wrap: wrap; gap: 8px; }
    .footer-url { word-break: break-all; flex: 1; min-width: 200px; }
    .footer-page { white-space: nowrap; }
  </style>
</head>
<body>
  <div style="text-align: center; font-weight: bold; font-size: 14px; margin: 8px 0;">
    Application Slip - ${jobPosting?.postTitle?.en || jobPosting?.post?.en || ""} Recruitment 2024
  </div>
  <div class="application-slip">
    <!-- Header -->
    <div class="header-section">
      <div class="logo-circle">
        <img src="${logoForPdf}" alt="JSSA Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 6px;" />
      </div>
      <div class="header-text">
        <div class="header-title">जन स्वास्थ्य सहायता अभियान</div>
        <div class="header-subtitle">A Project Of Healthcare Research & Development Board</div>
        <div class="header-note">(HRDB is Division of social welfare organization "NAC India")</div>
        <div class="header-reg">Registration No. : 053083</div>
      </div>
    </div>

    <!-- Recruitment Title -->
    <div class="recruitment-title">
      ${jobPosting?.postTitle?.en || jobPosting?.post?.en || ""} Recruitment
    </div>

    <!-- Advertisement Section -->
    <div class="advt-section">
      <div class="advt-text">Advt. No.: ${jobPosting?.advtNo || ""}</div>
      <div class="app-slip-title">Application Slip</div>
      <div class="date-text">
        Date: ${new Date().toLocaleString("en-US", {
          month: "numeric", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
        })}
      </div>
    </div>

    <!-- Post Applied Section -->
    <div class="post-section">
      <div class="post-text">Post Applied for: ${jobPosting?.postTitle?.en || jobPosting?.post?.en || ""}</div>
      <div class="app-no-text">Application No.: ${applicationData.applicationNumber || "N/A"}</div>
    </div>

    <!-- Personal Details -->
    <div class="details-section" style="padding: 15px 20px; background: #fff; position: relative;">
      <h3 style="font-size: 16px; font-weight: 900; color: #000; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e0e0e0;">Personal Details</h3>
      ${photoSrc ? `
      <div style="position: absolute; top: 70px; right: 20px; width: 110px; text-align: center; z-index: 10;">
        <img src="${photoSrc}" alt="Applicant Photo" style="width: 100%; height: 130px; object-fit: cover; border: 2px solid #000; border-radius: 4px; display: block; background: #fff;" />
      </div>
      ` : ''}
      <div style="font-size: 15px; line-height: 2.2; margin-right: ${photoSrc ? '130px' : '0'};">
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Name:</strong> <strong style="color: #000; font-weight: 700;">${(applicationData.candidateName || "").toUpperCase()}</strong>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Application No.:</strong> <span>${applicationData.applicationNumber || "N/A"}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Father's Name:</strong> <span>${(applicationData.fatherName || "").toUpperCase()}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Mother's Name:</strong> <span>${(applicationData.motherName || "").toUpperCase()}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Date of Birth:</strong> <span>${formatDate(applicationData.dob)}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Gender:</strong> <span>${formatGender(applicationData.gender)}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Nationality:</strong> <span>${formatNationality(applicationData.nationality)}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Category:</strong> <span>${formatCategory(applicationData.category)}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Aadhar Number:</strong> <span>${applicationData.aadhar || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">PAN Number:</strong> <span>${(applicationData.pan || "").toUpperCase()}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Mobile Number:</strong> <span>${applicationData.mobile || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Email ID:</strong> <span>${applicationData.email || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Permanent Address:</strong> <span>${(applicationData.address || "").toUpperCase()}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">State:</strong> <span>${applicationData.state || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">District:</strong> <span>${applicationData.district || ""}</span>
        </div>
        ${applicationData.block ? `
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Block:</strong> <span>${applicationData.block}</span>
        </div>
        ` : ''}
        ${applicationData.panchayat ? `
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Panchayat:</strong> <span>${applicationData.panchayat}</span>
        </div>
        ` : ''}
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Pin Code:</strong> <span>${applicationData.pincode || ""}</span>
        </div>
      </div>
    </div>

    <!-- Educational Details -->
    <div class="details-section" style="padding: 15px 20px; padding-bottom: ${signatureSrc ? '100px' : '15px'}; background: #fff; border-top: 1px solid #e0e0e0; position: relative; min-height: ${signatureSrc ? '200px' : 'auto'};">
      <h3 style="font-size: 16px; font-weight: 900; color: #000; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e0e0e0;">Educational Details</h3>
      <div style="font-size: 15px; line-height: 2.2; margin-right: ${signatureSrc ? '220px' : '0'}; padding-bottom: ${signatureSrc ? '10px' : '0'};">
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Higher Education:</strong> <span>${applicationData.higherEducation || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Board/University:</strong> <span>${applicationData.board || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Total Marks:</strong> <span>${applicationData.marks || ""}</span>
        </div>
        <div style="margin-bottom: 4px;">
          <strong style="color: #333;">Marks in Percentage:</strong> <span>${applicationData.markPercentage || ""}</span>
        </div>
      </div>
      ${signatureSrc ? `
      <div style="position: absolute; bottom: 20px; right: 20px; text-align: right; z-index: 10; pointer-events: none;">
        <div style="display: inline-block; border: 1px solid #e0e0e0; background: #f0f8ff; padding: 10px 16px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <img src="${signatureSrc}" alt="Signature" style="width: 180px; height: 70px; object-fit: contain; display: block; margin-bottom: 6px; background: #fff;" />
          <div style="font-size: 13px; font-weight: 600; color: #000; text-align: center;">Candidate's Signature</div>
        </div>
      </div>
      ` : ''}
    </div>

    <!-- Declarations -->
    <div class="declarations-section">
      <div class="declaration-item">
        <input type="checkbox" checked readonly style="margin-right: 8px;" /> I have read and agree to the Terms and Conditions.
      </div>
      <div class="declaration-item">
        <input type="checkbox" checked readonly style="margin-right: 8px;" /> I declare that all the information given in this application form is correct to the best of my knowledge and belief. If any information provided is found false, my candidature may be rejected at any point of time. I have read and understood the conditions which I would abide by. Thus, I have given the above declaration in my full consciousness without any pressure.
      </div>
    </div>

    <!-- Payment Status Table -->
    <div style="margin-top: 12px; padding: 0 20px 15px;">
      <table class="payment-table">
        <thead>
          <tr>
            <th>Application No.</th>
            <th>Email</th>
            <th>Payment Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${applicationData.applicationNumber || "N/A"}</td>
            <td>${applicationData.email || ""}</td>
            <td class="${applicationData.paymentStatus === 'paid' ? 'status-complete' : 'status-pending'}">${applicationData.paymentStatus === 'paid' ? 'Complete' : 'Pending'}</td>
            <td>${new Date().toLocaleString("en-US", {
              month: "numeric", day: "numeric", year: "numeric",
              hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
            })}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <div class="footer-url">https://www.jssabhiyan-nac.in/fill_application_print?oid=${applicationData._id || applicationData.id || ""}</div>
      <div class="footer-page">1/1</div>
    </div>
  </div>
</body>
</html>
    `;

    console.log("📄 Launching Puppeteer browser for PDF generation...");
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
    });
    console.log("✅ Puppeteer browser launched");
    const page = await browser.newPage();
    await page.setContent(pdfHtmlContent, { waitUntil: 'networkidle0' });
    
    // Wait for all images to load (compatible with older Puppeteer versions)
    await page.evaluateHandle(() => {
      return Promise.all(
        Array.from(document.images).map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            // Fallback timeout in case image events don't fire
            setTimeout(resolve, 5000);
          });
        })
      );
    });
    // Small delay without using page.waitForTimeout (not available in older Puppeteer)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
    });

    await browser.close();
    console.log("📄 PDF buffer generated, size:", pdfBuffer.length, "bytes");
    
    // Try to save file, but don't fail if it doesn't work
    let fileSaved = false;
    try {
      console.log("📄 Writing PDF to file:", filePath);
      fs.writeFileSync(filePath, pdfBuffer);
      console.log("✅ PDF generated and saved to:", filePath);
      
      // Verify file was written
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log("✅ PDF file verified, size:", stats.size, "bytes");
        fileSaved = true;
      } else {
        console.error("❌ PDF file was not created at:", filePath);
      }
    } catch (fileErr) {
      console.error("⚠️ Failed to save PDF file (but buffer is available):", fileErr.message);
      // Continue - we still have the buffer
    }
    
    // Return both buffer and file info
    if (fileSaved) {
      return { success: true, filePath, fileName, buffer: pdfBuffer };
    } else {
      // Return buffer even if file save failed
      console.log("📄 Returning PDF buffer (file save failed but buffer available)");
      return { success: true, filePath: null, fileName, buffer: pdfBuffer };
    }
  } catch (error) {
    console.error("❌ Error generating and saving PDF:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    return { success: false, error: error.message };
  }
}