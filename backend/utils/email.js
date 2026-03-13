import nodemailer from "nodemailer";

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
