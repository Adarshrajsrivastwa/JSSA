import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

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
export async function sendPaymentSuccessEmail(applicationData, loginCredentials, jobPosting) {
  try {
    console.log("📧 sendPaymentSuccessEmail called");
    console.log("📧 Application email:", applicationData.email);
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
    
    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("✅ SMTP server connection verified successfully");
    } catch (verifyError) {
      console.error("❌ SMTP server connection failed:", verifyError);
      console.error("❌ Verify error message:", verifyError.message);
      return {
        success: false,
        error: `SMTP connection failed: ${verifyError.message}`,
      };
    }

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

    // Email HTML template - matching PDF design
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 10px;
      background-color: #f5f5f5;
    }
    .email-container {
      background: #fff;
      border-radius: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .success-banner {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .success-title {
      font-size: 32px;
      font-weight: 900;
      color: #0aca00;
      margin-bottom: 12px;
    }
    .success-subtitle {
      font-size: 18px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }
    .app-number {
      font-size: 16px;
      font-weight: 600;
      color: #666;
      margin-bottom: 16px;
    }
    .app-number strong {
      color: #0aca00;
      font-size: 18px;
    }
    .credentials-box {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .credentials-box h3 {
      color: #856404;
      margin-top: 0;
      font-size: 18px;
    }
    .credentials-item {
      padding: 8px 0;
      font-size: 15px;
      font-weight: 600;
    }
    .credentials-item strong {
      color: #856404;
    }
    .application-slip {
      background: #fff;
      font-size: 14px;
      line-height: 1.5;
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
    }
    .logo-circle div {
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      color: #0aca00;
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
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Payment Success Banner -->
    <div class="success-banner">
      <div class="success-title">✅ Payment Successful!</div>
      <div class="success-subtitle">Your application has been submitted successfully</div>
      <div class="app-number">
        Application Number: <strong>${applicationData.applicationNumber || "N/A"}</strong>
      </div>
      <div style="font-size: 14px; color: #666; line-height: 1.6;">
        Please find your application slip below. Keep this application number for future reference.
      </div>
    </div>

    <!-- Login Credentials Box -->
    <div class="credentials-box">
      <h3>🔐 Login Credentials / लॉगिन क्रेडेंशियल</h3>
      <div class="credentials-item">
        <strong>Login ID:</strong> ${loginCredentials.identifier}
      </div>
      <div class="credentials-item">
        <strong>Password:</strong> ${loginCredentials.password}
      </div>
      <div style="margin-top: 10px; font-size: 13px; color: #856404;">
        ⚠️ Please save these credentials for future login
      </div>
    </div>

    <!-- Application Slip (PDF Format) -->
    <div class="application-slip">
      <!-- Header -->
      <div class="header-section">
        <div class="logo-circle">
          <div>JSSA</div>
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
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      <!-- Post Applied Section -->
      <div class="post-section">
        <div class="post-text">Post Applied for: ${jobPosting?.postTitle?.en || jobPosting?.post?.en || ""}</div>
        <div class="app-no-text">Application No.: ${applicationData.applicationNumber || "N/A"}</div>
      </div>

      <!-- Personal Details -->
      <div class="details-section" style="margin-right: ${photoSrc ? '130px' : '0'};">
        <div class="section-title">Personal Details</div>
        ${photoSrc ? `
        <div class="photo-container">
          <img src="${photoSrc}" alt="Applicant Photo" />
        </div>
        ` : ''}
        <div class="detail-item">
          <strong>Name:</strong> <span class="detail-value">${(applicationData.candidateName || "").toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <strong>Application No.:</strong> <span>${applicationData.applicationNumber || "N/A"}</span>
        </div>
        <div class="detail-item">
          <strong>Father's Name:</strong> <span>${(applicationData.fatherName || "").toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <strong>Mother's Name:</strong> <span>${(applicationData.motherName || "").toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <strong>Date of Birth:</strong> <span>${formatDate(applicationData.dob)}</span>
        </div>
        <div class="detail-item">
          <strong>Gender:</strong> <span>${formatGender(applicationData.gender)}</span>
        </div>
        <div class="detail-item">
          <strong>Nationality:</strong> <span>${formatNationality(applicationData.nationality)}</span>
        </div>
        <div class="detail-item">
          <strong>Category:</strong> <span>${formatCategory(applicationData.category)}</span>
        </div>
        <div class="detail-item">
          <strong>Aadhar Number:</strong> <span>${applicationData.aadhar || ""}</span>
        </div>
        <div class="detail-item">
          <strong>PAN Number:</strong> <span>${(applicationData.pan || "").toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <strong>Mobile Number:</strong> <span>${applicationData.mobile || ""}</span>
        </div>
        <div class="detail-item">
          <strong>Email ID:</strong> <span>${applicationData.email || ""}</span>
        </div>
        <div class="detail-item">
          <strong>Permanent Address:</strong> <span>${(applicationData.address || "").toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <strong>State:</strong> <span>${applicationData.state || ""}</span>
        </div>
        <div class="detail-item">
          <strong>District:</strong> <span>${applicationData.district || ""}</span>
        </div>
        ${applicationData.block ? `
        <div class="detail-item">
          <strong>Block:</strong> <span>${applicationData.block}</span>
        </div>
        ` : ''}
        ${applicationData.panchayat ? `
        <div class="detail-item">
          <strong>Panchayat:</strong> <span>${applicationData.panchayat}</span>
        </div>
        ` : ''}
        <div class="detail-item">
          <strong>Pin Code:</strong> <span>${applicationData.pincode || ""}</span>
        </div>
      </div>

      <!-- Educational Details -->
      <div class="details-section" style="margin-right: ${signatureSrc ? '220px' : '0'}; position: relative;">
        <div class="section-title">Educational Details</div>
        ${signatureSrc ? `
        <div class="signature-container">
          <div class="signature-box">
            <img src="${signatureSrc}" alt="Signature" />
            <div class="signature-label">Candidate's Signature</div>
          </div>
        </div>
        ` : ''}
        <div class="detail-item">
          <strong>Higher Education:</strong> <span>${applicationData.higherEducation || ""}</span>
        </div>
        <div class="detail-item">
          <strong>Board/University:</strong> <span>${applicationData.board || ""}</span>
        </div>
        <div class="detail-item">
          <strong>Total Marks:</strong> <span>${applicationData.marks || ""}</span>
        </div>
        <div class="detail-item">
          <strong>Marks in Percentage:</strong> <span>${applicationData.markPercentage || ""}</span>
        </div>
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
              <td class="status-complete">Complete</td>
              <td>${new Date().toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
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

    <div class="email-footer">
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
Payment Successful - JSSA
========================

✅ Payment Successful!
Your application has been submitted successfully

Application Number: ${applicationData.applicationNumber || "N/A"}

LOGIN CREDENTIALS:
------------------
Login ID: ${loginCredentials.identifier}
Password: ${loginCredentials.password}

Please save these credentials for future login.

APPLICATION SLIP:
-----------------
Application Number: ${applicationData.applicationNumber || "N/A"}
Post Applied for: ${jobPosting?.postTitle?.en || jobPosting?.post?.en || ""}
Advt. No.: ${jobPosting?.advtNo || ""}

PERSONAL DETAILS:
-----------------
Name: ${(applicationData.candidateName || "").toUpperCase()}
Father's Name: ${(applicationData.fatherName || "").toUpperCase()}
Mother's Name: ${(applicationData.motherName || "").toUpperCase()}
Date of Birth: ${formatDate(applicationData.dob)}
Gender: ${formatGender(applicationData.gender)}
Nationality: ${formatNationality(applicationData.nationality)}
Category: ${formatCategory(applicationData.category)}
Aadhar Number: ${applicationData.aadhar || ""}
PAN Number: ${(applicationData.pan || "").toUpperCase()}
Mobile Number: ${applicationData.mobile || ""}
Email ID: ${applicationData.email || ""}
Permanent Address: ${(applicationData.address || "").toUpperCase()}
State: ${applicationData.state || ""}
District: ${applicationData.district || ""}
${applicationData.block ? `Block: ${applicationData.block}` : ''}
${applicationData.panchayat ? `Panchayat: ${applicationData.panchayat}` : ''}
Pin Code: ${applicationData.pincode || ""}

EDUCATIONAL DETAILS:
--------------------
Higher Education: ${applicationData.higherEducation || ""}
Board/University: ${applicationData.board || ""}
Total Marks: ${applicationData.marks || ""}
Marks in Percentage: ${applicationData.markPercentage || ""}

PAYMENT STATUS:
--------------
Status: Complete
Date: ${new Date().toLocaleString("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
})}

Thank you for applying!
आवेदन करने के लिए धन्यवाद!
    `;

    // Generate PDF from application slip HTML (optional, non-blocking)
    let pdfBuffer = null;
    const pdfGenerationPromise = (async () => {
      try {
        console.log("📧 Starting PDF generation...");
        // Create HTML for PDF (only application slip, no email banner/credentials)
      const pdfHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #fff;
    }
    .application-slip {
      background: #fff;
      font-size: 14px;
      line-height: 1.5;
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
    }
    .logo-circle div {
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      color: #0aca00;
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
  </style>
</head>
<body>
  <div class="application-slip">
    <!-- Header -->
    <div class="header-section">
      <div class="logo-circle">
        <div>JSSA</div>
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
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </div>
    </div>

    <!-- Post Applied Section -->
    <div class="post-section">
      <div class="post-text">Post Applied for: ${jobPosting?.postTitle?.en || jobPosting?.post?.en || ""}</div>
      <div class="app-no-text">Application No.: ${applicationData.applicationNumber || "N/A"}</div>
    </div>

    <!-- Personal Details -->
    <div class="details-section" style="margin-right: ${photoSrc ? '130px' : '0'};">
      <div class="section-title">Personal Details</div>
      ${photoSrc ? `
      <div class="photo-container">
        <img src="${photoSrc}" alt="Applicant Photo" />
      </div>
      ` : ''}
      <div class="detail-item">
        <strong>Name:</strong> <span class="detail-value">${(applicationData.candidateName || "").toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <strong>Application No.:</strong> <span>${applicationData.applicationNumber || "N/A"}</span>
      </div>
      <div class="detail-item">
        <strong>Father's Name:</strong> <span>${(applicationData.fatherName || "").toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <strong>Mother's Name:</strong> <span>${(applicationData.motherName || "").toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <strong>Date of Birth:</strong> <span>${formatDate(applicationData.dob)}</span>
      </div>
      <div class="detail-item">
        <strong>Gender:</strong> <span>${formatGender(applicationData.gender)}</span>
      </div>
      <div class="detail-item">
        <strong>Nationality:</strong> <span>${formatNationality(applicationData.nationality)}</span>
      </div>
      <div class="detail-item">
        <strong>Category:</strong> <span>${formatCategory(applicationData.category)}</span>
      </div>
      <div class="detail-item">
        <strong>Aadhar Number:</strong> <span>${applicationData.aadhar || ""}</span>
      </div>
      <div class="detail-item">
        <strong>PAN Number:</strong> <span>${(applicationData.pan || "").toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <strong>Mobile Number:</strong> <span>${applicationData.mobile || ""}</span>
      </div>
      <div class="detail-item">
        <strong>Email ID:</strong> <span>${applicationData.email || ""}</span>
      </div>
      <div class="detail-item">
        <strong>Permanent Address:</strong> <span>${(applicationData.address || "").toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <strong>State:</strong> <span>${applicationData.state || ""}</span>
      </div>
      <div class="detail-item">
        <strong>District:</strong> <span>${applicationData.district || ""}</span>
      </div>
      ${applicationData.block ? `
      <div class="detail-item">
        <strong>Block:</strong> <span>${applicationData.block}</span>
      </div>
      ` : ''}
      ${applicationData.panchayat ? `
      <div class="detail-item">
        <strong>Panchayat:</strong> <span>${applicationData.panchayat}</span>
      </div>
      ` : ''}
      <div class="detail-item">
        <strong>Pin Code:</strong> <span>${applicationData.pincode || ""}</span>
      </div>
    </div>

    <!-- Educational Details -->
    <div class="details-section" style="margin-right: ${signatureSrc ? '220px' : '0'}; position: relative;">
      <div class="section-title">Educational Details</div>
      ${signatureSrc ? `
      <div class="signature-container">
        <div class="signature-box">
          <img src="${signatureSrc}" alt="Signature" />
          <div class="signature-label">Candidate's Signature</div>
        </div>
      </div>
      ` : ''}
      <div class="detail-item">
        <strong>Higher Education:</strong> <span>${applicationData.higherEducation || ""}</span>
      </div>
      <div class="detail-item">
        <strong>Board/University:</strong> <span>${applicationData.board || ""}</span>
      </div>
      <div class="detail-item">
        <strong>Total Marks:</strong> <span>${applicationData.marks || ""}</span>
      </div>
      <div class="detail-item">
        <strong>Marks in Percentage:</strong> <span>${applicationData.markPercentage || ""}</span>
      </div>
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
            <td class="status-complete">Complete</td>
            <td>${new Date().toLocaleString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
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

      // Generate PDF using puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(pdfHtmlContent, { waitUntil: 'networkidle0' });
      
      // Wait for images to load
      await page.evaluateHandle(() => {
        return Promise.all(
          Array.from(document.images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 2000);
            });
          })
        );
      });

      // Generate PDF
      pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '5mm',
          right: '5mm',
          bottom: '5mm',
          left: '5mm',
        },
      });

        await browser.close();
        console.log("✅ PDF generated successfully");
        return pdfBuffer;
      } catch (pdfError) {
        console.error("⚠️ Error generating PDF:", pdfError);
        console.error("⚠️ PDF error details:", pdfError.message);
        // Continue without PDF if generation fails
        return null;
      }
    })();

    // Wait for PDF with timeout (max 10 seconds), then send email
    try {
      pdfBuffer = await Promise.race([
        pdfGenerationPromise,
        new Promise((resolve) => setTimeout(() => resolve(null), 10000)), // 10 second timeout
      ]);
      if (pdfBuffer) {
        console.log("✅ PDF ready for attachment");
      } else {
        console.log("⚠️ PDF generation timed out or failed, sending email without PDF");
      }
    } catch (pdfTimeoutError) {
      console.error("⚠️ PDF generation timeout:", pdfTimeoutError);
      pdfBuffer = null;
    }

    // Prepare email attachments
    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Application_Slip_${applicationData.applicationNumber || 'JSSA'}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
      console.log("✅ PDF attachment prepared");
    } else {
      console.log("⚠️ No PDF attachment (generation failed or timed out)");
    }

    // Send email (even without PDF)
    const mailOptions = {
      from: `"JSSA" <${process.env.SMTP_USER}>`,
      to: applicationData.email,
      subject: `Payment Successful - Application ${applicationData.applicationNumber || "JSSA"}`,
      text: textContent,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    console.log("📧 Sending email via SMTP...");
    console.log("📧 Email to:", applicationData.email);
    console.log("📧 Email from:", process.env.SMTP_USER);
    console.log("📧 SMTP Host:", process.env.SMTP_HOST || "smtp.gmail.com");
    console.log("📧 SMTP Port:", process.env.SMTP_PORT || "587");
    
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Payment success email sent successfully!");
    console.log("✅ Message ID:", info.messageId);
    console.log("✅ Email sent to:", applicationData.email);
    console.log("✅ PDF attached:", pdfBuffer !== null);
    return {
      success: true,
      messageId: info.messageId,
      pdfAttached: pdfBuffer !== null,
    };
  } catch (error) {
    console.error("❌ Error sending payment success email:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
}