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

/* ══════════════════════════════════════════════
   CSS — exact match to screenshot design
   ══════════════════════════════════════════════ */
const jobsCSS = `
  * { box-sizing: border-box; }

  .jobs-section-heading {
    font-weight: 900; font-size: 15px; color: #1a2a4a;
    margin: 20px 0 12px; letter-spacing: 0.02em;
  }
  .jobs-submit-btn {
    background: ${GREEN}; color: #fff; font-weight: 900;
    font-size: 15px; padding: 12px 40px;
    border: none; cursor: pointer; border-radius: 4px;
  }
  .jobs-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .jobs-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* ── Title row — light green centered ── */
  .jobs-detail-title-row {
    background: #c2fbd7;
    padding: 10px 14px;
    text-align: center;
    border-bottom: 1px solid #a0d9a0;
    font-size: 13px; font-weight: 700; color: #000000; line-height: 1.6;
  }

  /* ── Download row — #9ddfaf ── */
  .jobs-detail-download-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 2px solid ${GREEN}; background: #9ddfaf;
  }
  .jobs-detail-download-cell {
    padding: 18px 20px; text-align: center;
  }
  .jobs-detail-download-cell .advt-label {
    font-weight: 900; font-size: 16px; color: #000000; margin-bottom: 4px;
  }
  .jobs-detail-download-cell .advt-date {
    font-weight: 700; font-size: 15px; color: #000000; margin-bottom: 12px;
  }
  .jobs-detail-download-cell .dl-link {
    color: #1a56c4 !important; font-weight: 700; font-size: 13px;
    text-decoration: underline !important; background: none; border: none;
    cursor: pointer; padding: 0;
    display: inline-flex; align-items: center; gap: 5px; justify-content: center;
  }
  .jobs-detail-download-cell .dl-link:disabled { opacity: 0.6; cursor: not-allowed; }
  .jobs-detail-download-cell .new-badge {
    display: inline-block; color: #fff; font-size: 9px; font-weight: 900;
    padding: 1px 5px; border-radius: 3px; margin-left: 5px;
    vertical-align: middle; letter-spacing: 0.05em;
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

  /* ── Data rows — all #c2fbd7, colon col #9ddfaf ── */
  .jobs-detail-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #5cb87a;
  }
  .jobs-detail-row:last-child { border-bottom: none; }
  .jobs-detail-row.row-odd  { background: #c2fbd7; }
  .jobs-detail-row.row-even { background: #c2fbd7; }

  /* ── 3-col inner: key | : | value ── */
  .jobs-detail-lang-cell {
    display: grid; grid-template-columns: 160px 28px 1fr; padding: 0;
  }
  .jobs-detail-key {
    padding: 12px 10px 12px 12px;
    font-weight: 400; font-size: 14px; color: #000000;
    line-height: 1.5;
    background: #c2fbd7;
    border-right: 1px solid #5cb87a;
  }
  .jobs-detail-colon {
    padding: 12px 0; font-size: 14px; color: #000000;
    text-align: center;
    background: #9ddfaf;
    border-right: 1px solid #5cb87a;
    display: flex; align-items: flex-start; justify-content: center;
  }
  .jobs-detail-val {
    padding: 12px 12px; font-size: 14px; color: #000000; line-height: 1.6;
    background: #c2fbd7;
  }

  /* review table */
  .review-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .review-table td { padding: 8px 12px; border: 1px solid #e0e0e0; vertical-align: top; }
  .review-table td:first-child { font-weight: 700; color: #1a2a4a; width: 40%; background: #f5f5f5; }

  /* ── Nav/header classes ── */
  @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
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
  .ft-heading    { font-size: 18px; }
  .ft-list       { gap: 14px; }
  .ft-link       { font-size: 16px; font-weight: 500; }
  .ft-logo-wrap  { padding: 0 40px; }
  .ft-logo-img   { width: 280px; height: auto; }
  .ft-contact    { gap: 14px; }
  .ft-contact-item { font-size: 16px; font-weight: 500; color: #ffffff; }
  .ft-contact-link { font-size: 16px; font-weight: 500; margin-top: 6px; }
  .ft-copyright  { font-size: 14px; padding: 16px 0; margin-top: 40px; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .hdr-desktop { display: none !important; }
    .hdr-mobile  { display: flex !important; flex-direction: column !important; padding: 4px 8px !important; }

    .tb-topbar { flex-wrap: nowrap !important; padding: 0 6px !important; gap: 4px !important; justify-content: space-between !important; height: 36px !important; position: relative !important; }
    .tb-left   { display: flex !important; gap: 8px !important; flex-shrink: 0 !important; margin-left: 2% !important; }
    .tb-phone  { font-size: 8px !important; gap: 3px !important; }
    .tb-phone svg { width: 8px !important; height: 8px !important; }
    .tb-email  { font-size: 8px !important; gap: 3px !important; }
    .tb-email svg { width: 8px !important; height: 8px !important; }
    .tb-search { position: absolute !important; left: 55% !important; transform: translateX(-50%) !important; }
    .tb-search input { width: 80px !important; font-size: 8px !important; height: 22px !important; }
    .tb-dl-btn { font-size: 8px !important; height: 22px !important; padding: 0 8px !important; margin-right: 2% !important; }

    .nav-list { flex-wrap: nowrap !important; }
    .nav-item  { flex: 1 1 0 !important; }
    .nav-btn   { font-size: 5.5px !important; padding: 4px 1px !important; }

    /* ── Detail table mobile — EN|HI same row, smaller font ── */
    .jobs-detail-title-row { font-size: 7px; padding: 6px; line-height: 1.4; }
    .jobs-detail-download-row { grid-template-columns: 1fr 1fr !important; }
    .jobs-detail-download-cell { padding: 6px 4px; }
    .jobs-detail-download-cell .advt-label { font-size: 7px; margin-bottom: 2px; }
    .jobs-detail-download-cell .advt-date  { font-size: 6px; margin-bottom: 6px; }
    .jobs-detail-download-cell .dl-link    { font-size: 6px; gap: 2px; }
    .jobs-detail-download-cell .new-badge  { font-size: 6px; padding: 1px 3px; }

    .jobs-detail-row { grid-template-columns: 1fr 1fr !important; }
    .jobs-detail-lang-cell { grid-template-columns: 52px 10px 1fr !important; }
    .jobs-detail-key   { font-size: 7px !important; padding: 4px 3px 4px 4px !important; line-height: 1.4 !important; }
    .jobs-detail-colon { font-size: 7px !important; padding: 4px 0 !important; }
    .jobs-detail-val   { font-size: 7px !important; padding: 4px 3px !important; line-height: 1.4 !important; }

    .jobs-grid-2 { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .jobs-grid-3 { grid-template-columns: 1fr 1fr 1fr !important; gap: 5px !important; }
    .jobs-section-heading { font-size: 11px; margin: 12px 0 8px; }
    .jobs-submit-btn { font-size: 11px; padding: 8px 18px; }
    .review-table td { font-size: 11px; padding: 6px 8px; }

    footer { padding: 10px 6px 0 !important; }
    .footer-inner   { flex-direction: row !important; gap: 6px !important; padding: 0 !important; }
    .ft-heading     { font-size: 8px !important; margin-bottom: 6px !important; }
    .ft-list        { gap: 3px !important; }
    .ft-link        { font-size: 7px !important; }
    .ft-logo-wrap   { padding: 0 4px !important; }
    .ft-logo-img    { width: 60px !important; }
    .ft-contact     { gap: 3px !important; align-items: flex-end !important; }
    .ft-contact-item { font-size: 7px !important; }
    .ft-contact-link { font-size: 7px !important; margin-top: 2px !important; }
    .ft-copyright   { font-size: 7px !important; padding: 8px 0 !important; margin-top: 10px !important; }
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
  { label: "VERIFICATION", page: "/verification" },
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

/* ══════════════════════════════════════════════
   SHARED LAYOUT
   ══════════════════════════════════════════════ */
function SharedLayout({ children, navigate, activePath = "/jobs" }) {
  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "'Segoe UI','Noto Sans Devanagari','Noto Sans',sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Top Bar */}
      <div
        className="tb-topbar"
        style={{
          background: GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 20px",
          gap: 8,
          height: 54,
          flexWrap: "nowrap",
          position: "relative",
        }}
      >
        <div
          className="tb-left"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexShrink: 0,
            marginLeft: "10%",
          }}
        >
          <span
            className="tb-phone"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#000",
              fontSize: 18,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
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
              gap: 6,
              color: "#000",
              fontSize: 18,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
            support@jssabhiyan.com
          </span>
        </div>
        <div
          className="tb-search"
          style={{
            position: "absolute",
            left: "58%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            style={{
              borderRadius: 0,
              padding: "4px 28px 4px 10px",
              fontSize: 15,
              fontWeight: 600,
              border: "0.5px solid #000",
              background: "#fff",
              color: "#333",
              width: 200,
              height: 42,
            }}
            placeholder="Type and hit enter..."
          />
          <svg
            style={{ position: "absolute", right: 8 }}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2.8"
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
            fontWeight: 900,
            padding: "5px 28px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            height: 42,
            marginRight: "12%",
          }}
        >
          Download Document
        </button>
      </div>

      {/* Desktop Header */}
      <div
        className="hdr-desktop"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          background: "#fff",
          borderBottom: "1px solid #eee",
          minHeight: 150,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "8%",
          }}
        >
          <img
            src={logo}
            alt="JSS Logo"
            style={{ height: 155, width: "auto", objectFit: "contain" }}
          />
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 14,
            marginRight: "6%",
          }}
        >
          <div style={{ display: "flex", gap: 14, marginTop: -8 }}>
            <a
              href="https://frontend.jssabhiyan.com/"
              style={{
                background: "#e53e3e",
                color: "#fff",
                fontWeight: 900,
                fontSize: 20,
                padding: "12px 50px",
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
                fontSize: 20,
                padding: "12px 50px",
                borderRadius: 4,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              BROUCHERS
            </a>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: -8,
            }}
          >
            <img
              src={swachhBharat}
              alt="Swachh Bharat"
              style={{ height: 68, width: "auto", objectFit: "contain" }}
            />
            <div style={{ display: "flex", gap: 9 }}>
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: s.bg,
                    borderRadius: 7,
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                  }}
                >
                  {s.content}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className="hdr-mobile"
        style={{
          display: "none",
          flexDirection: "column",
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "1px 8px",
          gap: 1,
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
              marginLeft: "4%",
            }}
          >
            <img
              src={logo}
              alt="JSS Logo"
              style={{ height: 48, width: "auto", objectFit: "contain" }}
            />
          </button>
          <div style={{ display: "flex", gap: 5 }}>
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

      {/* Nav */}
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
                  outline: "none",
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {children}

      {/* Floating buttons */}
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

      {/* Footer */}
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
            padding: "0 80px 0 140px",
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
                      color: "#ffffff",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "2px 0",
                      display: "block",
                      width: "100%",
                    }}
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
              style={{ objectFit: "contain" }}
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
            color: "#ffffff",
            borderTop: "1px solid #4a5a6c",
            fontWeight: 700,
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

/* ── Form Fields ── */
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

/* ── Inline Review ── */
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

/* ══════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════ */
export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [formStep, setFormStep] = useState("form");
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
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
        if (applyData.errors && Array.isArray(applyData.errors))
          throw new Error(
            `Validation failed: ${applyData.errors.map((err) => err.msg || err.message).join(", ")}`,
          );
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
              });
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

  const formatFeeStructure = (feeStructure) => {
    if (
      !feeStructure ||
      !Object.keys(feeStructure).some((key) => feeStructure[key])
    )
      return "";
    const categories = [
      { key: "general", label: "General" },
      { key: "obc", label: "OBC" },
      { key: "sc", label: "SC" },
      { key: "st", label: "ST" },
      { key: "ews", label: "EWS" },
    ];
    
    // Check if all fees are the same
    const allFees = [];
    categories.forEach((cat) => {
      const maleFee = feeStructure[`male_${cat.key}`];
      const femaleFee = feeStructure[`female_${cat.key}`];
      if (maleFee) allFees.push(parseFloat(maleFee));
      if (femaleFee) allFees.push(parseFloat(femaleFee));
    });
    
    const uniqueFees = [...new Set(allFees)];
    const allSame = uniqueFees.length === 1 && allFees.length > 0;
    
    if (allSame) {
      return `₹${uniqueFees[0]} (FOR ALL CATEGORIES)`;
    }
    
    // If not all same, show detailed format
    const parts = [];
    categories.forEach((cat) => {
      const maleFee = feeStructure[`male_${cat.key}`];
      const femaleFee = feeStructure[`female_${cat.key}`];
      if (maleFee || femaleFee) {
        const feeParts = [];
        if (maleFee) feeParts.push(`Male: ${maleFee}`);
        if (femaleFee) feeParts.push(`Female: ${femaleFee}`);
        if (feeParts.length > 0)
          parts.push(`${cat.label} (${feeParts.join(", ")})`);
      }
    });
    return parts.length > 0 ? parts.join("\n") : "";
  };

  const formatFeeStructureHi = (feeStructure) => {
    if (
      !feeStructure ||
      !Object.keys(feeStructure).some((key) => feeStructure[key])
    )
      return "";
    const categories = [
      { key: "general", label: "सामान्य" },
      { key: "obc", label: "OBC" },
      { key: "sc", label: "SC" },
      { key: "st", label: "ST" },
      { key: "ews", label: "EWS" },
    ];
    
    // Check if all fees are the same
    const allFees = [];
    categories.forEach((cat) => {
      const maleFee = feeStructure[`male_${cat.key}`];
      const femaleFee = feeStructure[`female_${cat.key}`];
      if (maleFee) allFees.push(parseFloat(maleFee));
      if (femaleFee) allFees.push(parseFloat(femaleFee));
    });
    
    const uniqueFees = [...new Set(allFees)];
    const allSame = uniqueFees.length === 1 && allFees.length > 0;
    
    if (allSame) {
      return `₹${uniqueFees[0]} (सभी श्रेणियों के लिए)`;
    }
    
    // If not all same, show detailed format
    const parts = [];
    categories.forEach((cat) => {
      const maleFee = feeStructure[`male_${cat.key}`];
      const femaleFee = feeStructure[`female_${cat.key}`];
      if (maleFee || femaleFee) {
        const feeParts = [];
        if (maleFee) feeParts.push(`पुरुष: ${maleFee}`);
        if (femaleFee) feeParts.push(`महिला: ${femaleFee}`);
        if (feeParts.length > 0)
          parts.push(`${cat.label} (${feeParts.join(", ")})`);
      }
    });
    return parts.length > 0 ? parts.join("\n") : "";
  };

  const feeStructureText =
    formatFeeStructure(job.feeStructure) || job.fee?.en || "";
  const feeStructureTextHi =
    formatFeeStructureHi(job.feeStructure) || job.fee?.hi || "";

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
        {formStep !== "review" && (
          <div
            style={{
              border: `2px solid ${GREEN}`,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            {/* ── Title row ── */}
            <div className="jobs-detail-title-row">
              Recruitment for the Post of {titleEn} Advt. No. {job.advtNo}{" "}
              /&nbsp;
              {titleHi} विज्ञापन संख्या: {job.advtNo}
            </div>

            {/* ── Download row ── */}
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

            {/* ── Data rows — key | : | value ── */}
            {Array.from({ length: rows }).map((_, i) => {
              const isFee =
                rowsEn[i]?.[0] === "Fee Structure" ||
                rowsHi[i]?.[0] === "शुल्क संरचना";
              return (
                <div
                  key={i}
                  className={`jobs-detail-row ${i % 2 === 0 ? "row-odd" : "row-even"}`}
                >
                  {/* English half */}
                  <div
                    className="jobs-detail-lang-cell"
                    style={{ borderRight: `1px solid #5cb87a` }}
                  >
                    <div className="jobs-detail-key">
                      {rowsEn[i]?.[0] || ""}
                    </div>
                    <div className="jobs-detail-colon">:</div>
                    <div
                      className="jobs-detail-val"
                      style={isFee ? { whiteSpace: "pre-line" } : {}}
                    >
                      {rowsEn[i]?.[1] || ""}
                    </div>
                  </div>
                  {/* Hindi half */}
                  <div className="jobs-detail-lang-cell">
                    <div className="jobs-detail-key">
                      {rowsHi[i]?.[0] || ""}
                    </div>
                    <div className="jobs-detail-colon">:</div>
                    <div
                      className="jobs-detail-val"
                      style={isFee ? { whiteSpace: "pre-line" } : {}}
                    >
                      {rowsHi[i]?.[1] || ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Form / Closed / Review */}
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
