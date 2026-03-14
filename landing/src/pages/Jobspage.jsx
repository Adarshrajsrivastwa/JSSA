// import { useState, useEffect } from "react";
// import { jobPostingsAPI } from "../utils/api.js";

// const GREEN = "#3AB000";

// const indianStates = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Delhi",
//   "Jammu & Kashmir",
//   "Ladakh",
// ];

// const districtsByState = {
//   Bihar: [
//     "Patna",
//     "Gaya",
//     "Muzaffarpur",
//     "Bhagalpur",
//     "Darbhanga",
//     "Purnia",
//     "Samastipur",
//     "Begusarai",
//     "Nalanda",
//     "Rohtas",
//     "Araria",
//     "Aurangabad",
//     "Banka",
//     "Buxar",
//     "Gopalganj",
//     "Jamui",
//     "Katihar",
//     "Khagaria",
//     "Kishanganj",
//     "Madhepura",
//     "Madhubani",
//     "Munger",
//     "Nawada",
//     "Saran",
//     "Sitamarhi",
//     "Siwan",
//     "Supaul",
//     "Vaishali",
//     "West Champaran",
//     "East Champaran",
//   ],
//   Jharkhand: [
//     "Ranchi",
//     "Dhanbad",
//     "Jamshedpur",
//     "Bokaro",
//     "Hazaribagh",
//     "Giridih",
//     "Deoghar",
//     "Dumka",
//     "Pakur",
//     "Garhwa",
//     "Chatra",
//     "Gumla",
//     "Khunti",
//     "Koderma",
//     "Latehar",
//     "Lohardaga",
//     "Palamu",
//     "Ramgarh",
//     "Sahibganj",
//     "Seraikela",
//     "Simdega",
//   ],
//   "Uttar Pradesh": [
//     "Lucknow",
//     "Kanpur",
//     "Agra",
//     "Varanasi",
//     "Allahabad",
//     "Meerut",
//     "Noida",
//     "Ghaziabad",
//     "Bareilly",
//     "Aligarh",
//     "Gorakhpur",
//     "Moradabad",
//     "Saharanpur",
//     "Faizabad",
//     "Jhansi",
//     "Mathura",
//   ],
//   "Madhya Pradesh": [
//     "Bhopal",
//     "Indore",
//     "Gwalior",
//     "Jabalpur",
//     "Ujjain",
//     "Sagar",
//     "Dewas",
//     "Satna",
//     "Ratlam",
//     "Rewa",
//   ],
//   Maharashtra: [
//     "Mumbai",
//     "Pune",
//     "Nagpur",
//     "Thane",
//     "Nashik",
//     "Aurangabad",
//     "Solapur",
//     "Kolhapur",
//     "Amravati",
//     "Nanded",
//   ],
//   Rajasthan: [
//     "Jaipur",
//     "Jodhpur",
//     "Kota",
//     "Bikaner",
//     "Ajmer",
//     "Udaipur",
//     "Bhilwara",
//     "Alwar",
//     "Bharatpur",
//     "Sikar",
//   ],
//   Gujarat: [
//     "Ahmedabad",
//     "Surat",
//     "Vadodara",
//     "Rajkot",
//     "Gandhinagar",
//     "Bhavnagar",
//     "Jamnagar",
//     "Junagadh",
//   ],
//   "West Bengal": [
//     "Kolkata",
//     "Howrah",
//     "Darjeeling",
//     "Jalpaiguri",
//     "Murshidabad",
//     "Bardhaman",
//     "Nadia",
//     "North 24 Parganas",
//     "South 24 Parganas",
//   ],
//   Delhi: [
//     "Central Delhi",
//     "East Delhi",
//     "New Delhi",
//     "North Delhi",
//     "North East Delhi",
//     "South Delhi",
//     "West Delhi",
//   ],
//   Assam: [
//     "Guwahati",
//     "Dibrugarh",
//     "Silchar",
//     "Jorhat",
//     "Nagaon",
//     "Tinsukia",
//     "Kamrup",
//     "Barpeta",
//   ],
//   Odisha: [
//     "Bhubaneswar",
//     "Cuttack",
//     "Rourkela",
//     "Berhampur",
//     "Sambalpur",
//     "Puri",
//     "Balasore",
//     "Bhadrak",
//   ],
//   Uttarakhand: [
//     "Dehradun",
//     "Haridwar",
//     "Roorkee",
//     "Haldwani",
//     "Rudrapur",
//     "Kashipur",
//     "Rishikesh",
//     "Nainital",
//   ],
// };

// const jobsData = {
//   latest: [
//     {
//       id: 1,
//       advt: "JSSA/REQ/01/2025/P-III",
//       isNew: true,
//       title: "Recruitment for the Post of District Manager",
//       titleHi: "जिला प्रबंधक पद हेतु भर्ती विज्ञप्ति संख्या:",
//       date: "19/12/2025",
//       invitationEn:
//         "Invitation for all eligible candidates on vacant posts of District Manager under Jan Swasthya Sahayata Abhiyan by Healthcare Research and Development Board (A Division of NAC India).",
//       invitationHi:
//         "हेल्थ केयर रिसर्च एंड डेवलपमेंट बोर्ड (A Division Of NAC INDIA) द्वारा जन स्वास्थ्य सहायता अभियान के तहत जिला प्रबंधक के रिक्त पदों पर सभी पात्र उम्मीदवारों के लिए आमंत्रण",
//       rows: {
//         en: [
//           ["Post", "District Manager"],
//           [
//             "Total Post",
//             "In All District (Bihar, Chhattisgarh, Gujarat, Haryana, Assam, Jharkhand, Madhya Pradesh, Maharashtra, Rajasthan, Uttar Pradesh, West Bengal, Odisha, Uttarakhand)",
//           ],
//           ["Monthly Income", "Rs 25,500 to Rs 35,500"],
//           ["Education Qualification", "Graduation Pass"],
//           ["Age Limit", "19 years to 40 years (As on 30/08/2025)"],
//           [
//             "Job Location",
//             "Bihar, Chhattisgarh, Gujarat, Haryana, Jharkhand, Madhya Pradesh, Maharashtra, Rajasthan, Uttar Pradesh, Assam, West Bengal, Odisha, Uttarakhand",
//           ],
//           ["Selection Process", "Based on Graduation Mark & Interview"],
//           ["Application Opening On", "20/12/2025"],
//           ["Last Date of Application", "31/01/2026"],
//           ["1st Merit List Released", "08/02/2026"],
//           ["Final Merit List Released", "15/02/2026"],
//           ["Application Fee", "Rs 260/- Only (For All Categories)"],
//         ],
//         hi: [
//           ["पद", "जिला प्रबंधक"],
//           [
//             "कुल पद",
//             "सभी जिलों में (बिहार, छत्तीसगढ़, गुजरात, हरियाणा, आसाम, झारखण्ड, मध्यप्रदेश, महाराष्ट्र, राजस्थान, उत्तर प्रदेश, पश्चिम बंगाल, ओडिशा, उत्तराखंड)",
//           ],
//           ["मासिक आय", "₹ 25,500 से ₹ 35,500"],
//           ["शैक्षणिक योग्यता", "स्नातक पास"],
//           ["आयु सीमा", "19 वर्ष से 40 वर्ष ( 30/08/2025 को )"],
//           [
//             "नौकरी करने का स्थान",
//             "बिहार, छत्तीसगढ़, गुजरात, हरियाणा, झारखण्ड, मध्यप्रदेश, महाराष्ट्र, राजस्थान, उत्तर प्रदेश, पश्चिम बंगाल, ओडिशा, उत्तराखंड",
//           ],
//           ["चयन प्रक्रिया", "स्नातक अंक और साक्षात्कार के आधार पर"],
//           ["आवेदन खुलने की तिथि", "20/12/2025"],
//           ["आवेदन की अंतिम तिथि", "31/01/2026"],
//           ["मेधा सूची जारी", "08/02/2026"],
//           ["अंतिम मेधा सूची जारी", "15/02/2026"],
//           ["आवेदन शुल्क", "₹ 260 केवल (सभी श्रेणियों के लिए)"],
//         ],
//       },
//     },
//     {
//       id: 2,
//       advt: "JSSA/REQ/02/2025/P-III",
//       isNew: true,
//       title:
//         "Recruitment for the Posts of Block Supervisor cum Panchayat Executive",
//       titleHi:
//         "प्रखंड पर्यवेक्षक सह पंचायत कार्यपालक के रिक्त पदों पर भर्ती विज्ञप्ति संख्या:",
//       date: "19/12/2025",
//       invitationEn:
//         "Invitation for all eligible candidates on vacant posts of Block Supervisor cum Panchayat Executive under Jan Swasthya Sahayata Abhiyan by Healthcare Research and Development Board (A Division of NAC India).",
//       invitationHi:
//         "हेल्थ केयर रिसर्च एंड डेवलपमेंट बोर्ड (A Division Of NAC INDIA) द्वारा जन स्वास्थ्य सहायता अभियान के तहत प्रखंड पर्यवेक्षक सह पंचायत कार्यपालक के रिक्त पदों पर सभी पात्र उम्मीदवारों के लिए आमंत्रण",
//       rows: {
//         en: [
//           ["Post", "Block Supervisor cum Panchayat Executive"],
//           [
//             "Total Post",
//             "In All Districts (Bihar, Chhattisgarh, Gujarat, Haryana, Assam, Jharkhand, Madhya Pradesh, Maharashtra, Rajasthan, Uttar Pradesh, West Bengal, Odisha, Uttarakhand)",
//           ],
//           ["Monthly Income", "Rs 15,500 to Rs 25,500"],
//           ["Education Qualification", "Intermediate / 12th Pass"],
//           ["Age Limit", "18 years to 40 years (As on 30/08/2025)"],
//           ["Job Location", "Bihar, Jharkhand, Uttar Pradesh and other states"],
//           ["Selection Process", "Based on 12th Marks & Interview"],
//           ["Application Opening On", "20/12/2025"],
//           ["Last Date of Application", "31/01/2026"],
//           ["1st Merit List Released", "08/02/2026"],
//           ["Final Merit List Released", "15/02/2026"],
//           ["Application Fee", "Rs 200/- Only (For All Categories)"],
//         ],
//         hi: [
//           ["पद", "प्रखंड पर्यवेक्षक सह पंचायत कार्यपालक"],
//           [
//             "कुल पद",
//             "सभी जिलों में (बिहार, छत्तीसगढ़, गुजरात, हरियाणा, आसाम, झारखण्ड, मध्यप्रदेश, महाराष्ट्र, राजस्थान, उत्तर प्रदेश, पश्चिम बंगाल, ओडिशा, उत्तराखंड)",
//           ],
//           ["मासिक आय", "₹ 15,500 से ₹ 25,500"],
//           ["शैक्षणिक योग्यता", "इंटरमीडिएट / 12वीं पास"],
//           ["आयु सीमा", "18 वर्ष से 40 वर्ष ( 30/08/2025 को )"],
//           ["नौकरी करने का स्थान", "बिहार, झारखण्ड, उत्तर प्रदेश और अन्य राज्य"],
//           ["चयन प्रक्रिया", "12वीं अंक और साक्षात्कार के आधार पर"],
//           ["आवेदन खुलने की तिथि", "20/12/2025"],
//           ["आवेदन की अंतिम तिथि", "31/01/2026"],
//           ["मेधा सूची जारी", "08/02/2026"],
//           ["अंतिम मेधा सूची जारी", "15/02/2026"],
//           ["आवेदन शुल्क", "₹ 200 केवल (सभी श्रेणियों के लिए)"],
//         ],
//       },
//     },
//     {
//       id: 3,
//       advt: "JSSA/REQ/03/2025/P-III",
//       isNew: true,
//       title: "Recruitment for the Posts of Panchayat Executive",
//       titleHi: "पंचायत कार्यपालक के पदों विज्ञप्ति संख्या –",
//       date: "19/12/2025",
//       invitationEn:
//         "Invitation for all eligible candidates on vacant posts of Panchayat Executive under Jan Swasthya Sahayata Abhiyan by Healthcare Research and Development Board (A Division of NAC India).",
//       invitationHi:
//         "हेल्थ केयर रिसर्च एंड डेवलपमेंट बोर्ड (A Division Of NAC INDIA) द्वारा जन स्वास्थ्य सहायता अभियान के तहत पंचायत कार्यपालक के रिक्त पदों पर सभी पात्र उम्मीदवारों के लिए आमंत्रण",
//       rows: {
//         en: [
//           ["Post", "Panchayat Executive"],
//           [
//             "Total Post",
//             "All Panchayats (Bihar, Chhattisgarh, Gujarat, Haryana, Assam, Jharkhand, Madhya Pradesh, Maharashtra, Rajasthan, Uttar Pradesh, West Bengal, Odisha, Uttarakhand)",
//           ],
//           ["Monthly Income", "Rs 8,500 to Rs 15,000"],
//           ["Education Qualification", "Matriculation / 10th Pass"],
//           ["Age Limit", "18 years to 40 years (As on 30/08/2025)"],
//           ["Job Location", "Bihar, Jharkhand, Uttar Pradesh and other states"],
//           ["Selection Process", "Based on 10th Marks"],
//           ["Application Opening On", "20/12/2025"],
//           ["Last Date of Application", "31/01/2026"],
//           ["1st Merit List Released", "08/02/2026"],
//           ["Final Merit List Released", "15/02/2026"],
//           ["Application Fee", "Rs 150/- Only (For All Categories)"],
//         ],
//         hi: [
//           ["पद", "पंचायत कार्यपालक"],
//           [
//             "कुल पद",
//             "सभी पंचायतें (बिहार, छत्तीसगढ़, गुजरात, हरियाणा, आसाम, झारखण्ड, मध्यप्रदेश, महाराष्ट्र, राजस्थान, उत्तर प्रदेश, पश्चिम बंगाल, ओडिशा, उत्तराखंड)",
//           ],
//           ["मासिक आय", "₹ 8,500 से ₹ 15,000"],
//           ["शैक्षणिक योग्यता", "मैट्रिक / 10वीं पास"],
//           ["आयु सीमा", "18 वर्ष से 40 वर्ष ( 30/08/2025 को )"],
//           ["नौकरी करने का स्थान", "बिहार, झारखण्ड, उत्तर प्रदेश और अन्य राज्य"],
//           ["चयन प्रक्रिया", "10वीं अंक के आधार पर"],
//           ["आवेदन खुलने की तिथि", "20/12/2025"],
//           ["आवेदन की अंतिम तिथि", "31/01/2026"],
//           ["मेधा सूची जारी", "08/02/2026"],
//           ["अंतिम मेधा सूची जारी", "15/02/2026"],
//           ["आवेदन शुल्क", "₹ 150 केवल (सभी श्रेणियों के लिए)"],
//         ],
//       },
//     },
//   ],
//   old: [
//     {
//       id: 4,
//       advt: "JSSA/REQ/01/2025/P-II",
//       isNew: false,
//       title: "Recruitment for the Post of District Manager",
//       titleHi: "जिला प्रबंधक पद हेतु भर्ती विज्ञप्ति संख्या:",
//       date: "01/06/2025",
//       invitationEn: "Invitation for District Manager posts (Phase II).",
//       invitationHi: "जिला प्रबंधक पदों के लिए आमंत्रण (चरण II)।",
//       rows: {
//         en: [
//           ["Post", "District Manager"],
//           ["Total Post", "All Districts"],
//           ["Monthly Income", "Rs 25,500 to Rs 35,500"],
//           ["Education Qualification", "Graduation Pass"],
//           ["Age Limit", "18-40 years"],
//           ["Last Date of Application", "Closed"],
//           ["Application Fee", "Rs 260/-"],
//         ],
//         hi: [
//           ["पद", "जिला प्रबंधक"],
//           ["कुल पद", "सभी जिले"],
//           ["मासिक आय", "₹ 25,500 से ₹ 35,500"],
//           ["शैक्षणिक योग्यता", "स्नातक पास"],
//           ["आयु सीमा", "18-40 वर्ष"],
//           ["आवेदन की अंतिम तिथि", "बंद"],
//           ["आवेदन शुल्क", "₹ 260"],
//         ],
//       },
//     },
//     {
//       id: 5,
//       advt: "JSSA/REQ/02/2025/P-II",
//       isNew: false,
//       title:
//         "Recruitment for the Posts of Block Supervisor cum Panchayat Executive",
//       titleHi:
//         "प्रखंड पर्यवेक्षक सह पंचायत कार्यपालक के रिक्त पदों पर भर्ती विज्ञप्ति संख्या:",
//       date: "01/06/2025",
//       invitationEn: "Invitation for Block Supervisor posts (Phase II).",
//       invitationHi:
//         "प्रखंड पर्यवेक्षक सह पंचायत कार्यपालक पदों के लिए आमंत्रण (चरण II)।",
//       rows: {
//         en: [
//           ["Post", "Block Supervisor cum Panchayat Executive"],
//           ["Total Post", "All Blocks"],
//           ["Monthly Income", "Rs 15,500 to Rs 25,500"],
//           ["Education Qualification", "12th Pass"],
//           ["Age Limit", "18-40 years"],
//           ["Last Date of Application", "Closed"],
//           ["Application Fee", "Rs 200/-"],
//         ],
//         hi: [
//           ["पद", "प्रखंड पर्यवेक्षक सह पंचायत कार्यपालक"],
//           ["कुल पद", "सभी प्रखंड"],
//           ["मासिक आय", "₹ 15,500 से ₹ 25,500"],
//           ["शैक्षणिक योग्यता", "12वीं पास"],
//           ["आयु सीमा", "18-40 वर्ष"],
//           ["आवेदन की अंतिम तिथि", "बंद"],
//           ["आवेदन शुल्क", "₹ 200"],
//         ],
//       },
//     },
//     {
//       id: 6,
//       advt: "JSSA/REQ/03/2025/P-II",
//       isNew: false,
//       title: "Recruitment for the Posts of Panchayat Executive",
//       titleHi: "पंचायत कार्यपालक के पदों विज्ञप्ति संख्या –",
//       date: "01/06/2025",
//       invitationEn: "Invitation for Panchayat Executive posts (Phase II).",
//       invitationHi: "पंचायत कार्यपालक पदों के लिए आमंत्रण (चरण II)।",
//       rows: {
//         en: [
//           ["Post", "Panchayat Executive"],
//           ["Total Post", "All Panchayats"],
//           ["Monthly Income", "Rs 8,500 to Rs 15,000"],
//           ["Education Qualification", "10th Pass"],
//           ["Age Limit", "18-40 years"],
//           ["Last Date of Application", "Closed"],
//           ["Application Fee", "Rs 150/-"],
//         ],
//         hi: [
//           ["पद", "पंचायत कार्यपालक"],
//           ["कुल पद", "सभी पंचायतें"],
//           ["मासिक आय", "₹ 8,500 से ₹ 15,000"],
//           ["शैक्षणिक योग्यता", "10वीं पास"],
//           ["आयु सीमा", "18-40 वर्ष"],
//           ["आवेदन की अंतिम तिथि", "बंद"],
//           ["आवेदन शुल्क", "₹ 150"],
//         ],
//       },
//     },
//   ],
// };

// // ── LOAD SCRIPTS ──────────────────────────────────────────────
// function loadScript(src) {
//   return new Promise((resolve, reject) => {
//     if (document.querySelector(`script[src="${src}"]`)) {
//       resolve();
//       return;
//     }
//     const s = document.createElement("script");
//     s.src = src;
//     s.onload = resolve;
//     s.onerror = reject;
//     document.head.appendChild(s);
//   });
// }

// // ── GENERATE & AUTO-DOWNLOAD PDF ─────────────────────────────
// async function downloadPDF(job, lang) {
//   const isHi = lang === "hi";

//   // Load libraries
//   await loadScript(
//     "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
//   );
//   await loadScript(
//     "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
//   );

//   const rows = isHi ? job.rows.hi : job.rows.en;

//   // Build hidden render div with inline styles (no external CSS needed)
//   const container = document.createElement("div");
//   container.style.cssText = `
//     position:fixed; left:-9999px; top:0;
//     width:700px; background:#fff;
//     font-family:'Noto Sans Devanagari','Noto Sans',Arial,sans-serif;
//     font-size:13px; color:#000;
//     border:2px solid #888; border-radius:8px; overflow:hidden;
//   `;

//   const tableRowsHTML = rows
//     .map(
//       (r, i) => `
//     <tr>
//       <td style="padding:9px 14px;font-weight:700;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;width:35%;vertical-align:top">${r[0]}</td>
//       <td style="padding:9px 8px;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;width:4%;text-align:center;vertical-align:top">:</td>
//       <td style="padding:9px 14px;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;vertical-align:top;line-height:1.6">${r[1]}</td>
//     </tr>`,
//     )
//     .join("");

//   container.innerHTML = `
//     <!-- HEADER -->
//     <div style="background:#1e2840;display:flex;align-items:center;gap:16px;padding:14px 20px">
//       <div style="width:64px;height:64px;border-radius:50%;background:${GREEN};border:3px solid #fff;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:14px">JSS</div>
//       <div>
//         <div style="color:#fff;font-size:${isHi ? "22px" : "19px"};font-weight:900;line-height:1.2">${isHi ? "जन स्वास्थ्य सहायता अभियान" : "JAN SWASTHYA SAHAYATA ABHIYAN"}</div>
//         <div style="color:#fff;font-size:13px;font-weight:700;margin-top:4px">A Project of Healthcare Research &amp; Development Board</div>
//         <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:2px">(HRDB is Division Of Social Welfare Organization "NAC India")</div>
//       </div>
//     </div>

//     <!-- ADVT BAR -->
//     <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:#f5f5f5;border-bottom:2px solid #ddd">
//       <span style="font-weight:700;font-size:13px;color:#1e2840">${isHi ? "विज्ञापन सं0 :" : "Advt. No. :"} ${job.advt}</span>
//       <span style="background:#1e2840;color:#fff;font-weight:900;font-size:12px;padding:7px 18px;border-radius:2px;letter-spacing:0.05em">${isHi ? "भर्ती आमंत्रण" : "RECRUITMENT INVITATION"}</span>
//       <span style="font-weight:700;font-size:13px;color:#1e2840">${isHi ? "दिनांक :" : "DATE :"} ${job.date}</span>
//     </div>

//     <!-- INVITATION -->
//     <div style="background:#1e2840;color:#fff;padding:14px 20px;text-align:center;font-size:${isHi ? "15px" : "13px"};font-weight:700;line-height:1.6">
//       ${isHi ? job.invitationHi : job.invitationEn}
//     </div>

//     <!-- TABLE -->
//     <div style="padding:16px 20px">
//       <table style="width:100%;border-collapse:collapse;font-size:${isHi ? "14px" : "13px"}">
//         <tbody>${tableRowsHTML}</tbody>
//       </table>
//     </div>

//     <!-- FOOTER -->
//     <div style="background:#1e2840;color:#fff;padding:12px 20px;text-align:center">
//       <div style="font-size:${isHi ? "16px" : "14px"};font-weight:900;margin-bottom:6px">${isHi ? "अधिक जानकारी के लिए :" : "FOR MORE INFORMATION :"}</div>
//       <div style="font-size:12px;display:flex;justify-content:space-around">
//         <span>Website : https://www.jssabhiyan-nac.in</span>
//         <span>Email : ${isHi ? "info@jssabhiyan-nac.in" : "support@jssabhiyan-nac.in"}</span>
//       </div>
//     </div>
//   `;

//   document.body.appendChild(container);

//   try {
//     // Wait a tick for layout
//     await new Promise((r) => setTimeout(r, 100));

//     const canvas = await window.html2canvas(container, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//       logging: false,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF({
//       unit: "mm",
//       format: "a4",
//       orientation: "portrait",
//     });

//     const pageW = 210;
//     const pageH = 297;
//     const imgW = pageW - 20; // 10mm margin each side
//     const imgH = (canvas.height * imgW) / canvas.width;

//     // If content fits in one page
//     if (imgH <= pageH - 20) {
//       pdf.addImage(imgData, "PNG", 10, 10, imgW, imgH);
//     } else {
//       // Multi-page: slice canvas
//       const ratio = canvas.width / imgW;
//       const sliceH = (pageH - 20) * ratio;
//       let yOffset = 0;
//       let page = 0;
//       while (yOffset < canvas.height) {
//         if (page > 0) pdf.addPage();
//         const sliceCanvas = document.createElement("canvas");
//         sliceCanvas.width = canvas.width;
//         sliceCanvas.height = Math.min(sliceH, canvas.height - yOffset);
//         const ctx = sliceCanvas.getContext("2d");
//         ctx.drawImage(canvas, 0, -yOffset);
//         const sliceData = sliceCanvas.toDataURL("image/png");
//         const sliceImgH = (sliceCanvas.height * imgW) / canvas.width;
//         pdf.addImage(sliceData, "PNG", 10, 10, imgW, sliceImgH);
//         yOffset += sliceH;
//         page++;
//       }
//     }

//     const fileName = isHi
//       ? `JSSA_${job.advt.replace(/\//g, "-")}_Hindi.pdf`
//       : `JSSA_${job.advt.replace(/\//g, "-")}_English.pdf`;
//     pdf.save(fileName);
//   } finally {
//     document.body.removeChild(container);
//   }
// }

// // ── INPUT STYLES ──────────────────────────────────────────────
// const inputStyle = {
//   width: "100%",
//   padding: "10px 12px",
//   border: "1px solid #ccc",
//   borderRadius: 4,
//   fontSize: 14,
//   background: "#fff",
//   outline: "none",
//   boxSizing: "border-box",
//   color: "#000",
// };
// const labelStyle = {
//   display: "block",
//   fontSize: 14,
//   fontWeight: 600,
//   color: "#333",
//   marginBottom: 6,
// };

// // ── APPLICATION FORM ──────────────────────────────────────────
// function ApplicationForm({ job, onBack }) {
//   const [stateVal, setStateVal] = useState("");
//   const [form, setForm] = useState({
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
//     district: "",
//     block: "",
//     panchayat: "",
//     pincode: "",
//     photo: null,
//     signature: null,
//     higherEdu: "",
//     board: "",
//     marks: "",
//     markPct: "",
//     agree1: false,
//     agree2: false,
//   });
//   const handle = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "file") setForm((p) => ({ ...p, [name]: files[0] }));
//     else if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
//     else setForm((p) => ({ ...p, [name]: value }));
//     if (name === "state") {
//       setStateVal(value);
//       setForm((p) => ({ ...p, state: value, district: "" }));
//     }
//   };
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#fff",
//         fontFamily: "'Segoe UI','Noto Sans',sans-serif",
//       }}
//     >
//       <div
//         style={{
//           background: GREEN,
//           padding: "10px 24px",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//         }}
//       >
//         <button
//           onClick={onBack}
//           style={{
//             background: "rgba(255,255,255,0.2)",
//             border: "none",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: 13,
//             padding: "7px 16px",
//             borderRadius: 4,
//             cursor: "pointer",
//           }}
//         >
//           ← Back
//         </button>
//         <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
//           {job.title} Advt. No. {job.advt}
//         </span>
//       </div>
//       <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 40px" }}>
//         <div
//           style={{
//             background: "#f0f0f0",
//             borderRadius: 6,
//             padding: "28px 32px",
//             marginTop: 24,
//           }}
//         >
//           <p
//             style={{
//               textAlign: "center",
//               fontSize: 13,
//               color: "#555",
//               marginBottom: 20,
//             }}
//           >
//             {job.title} Advt. No. {job.advt} / {job.titleHi} {job.advt}
//           </p>
//           <h3
//             style={{
//               fontWeight: 900,
//               fontSize: 15,
//               color: "#1a2a4a",
//               marginBottom: 20,
//             }}
//           >
//             PERSONAL DETAILS
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//             <div>
//               <label style={labelStyle}>
//                 Candidate's Name/अभ्यर्थी का नाम :
//               </label>
//               <input
//                 name="candidateName"
//                 value={form.candidateName}
//                 onChange={handle}
//                 style={inputStyle}
//               />
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Father's Name/पिता का नाम :</label>
//                 <input
//                   name="fatherName"
//                   value={form.fatherName}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Mother's Name/माता का नाम :</label>
//                 <input
//                   name="motherName"
//                   value={form.motherName}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Date Of Birth/जन्मतिथि :</label>
//                 <input
//                   name="dob"
//                   type="date"
//                   value={form.dob}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Gender/लिंग :</label>
//                 <select
//                   name="gender"
//                   value={form.gender}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value="">--Please Select---</option>
//                   <option>Male / पुरुष</option>
//                   <option>Female / महिला</option>
//                   <option>Other / अन्य</option>
//                 </select>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Nationality/राष्ट्रीयता :</label>
//                 <select
//                   name="nationality"
//                   value={form.nationality}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value="">--Please Select---</option>
//                   <option>Indian / भारतीय</option>
//                   <option>Other / अन्य</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>Category/श्रेणी :</label>
//                 <select
//                   name="category"
//                   value={form.category}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value="">--Please Select---</option>
//                   <option>General / सामान्य</option>
//                   <option>OBC</option>
//                   <option>SC</option>
//                   <option>ST</option>
//                   <option>EWS</option>
//                 </select>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Aadhar Number/आधार संख्या :</label>
//                 <input
//                   name="aadhar"
//                   value={form.aadhar}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Pan Number/पेन संख्या :</label>
//                 <input
//                   name="pan"
//                   value={form.pan}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Mobile Number/मोबाइल नंबर :</label>
//                 <input
//                   name="mobile"
//                   value={form.mobile}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Email Id/ईमेल आईडी :</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>
//             <div>
//               <label style={labelStyle}>Permanenet Address/स्थाई पता :</label>
//               <input
//                 name="address"
//                 value={form.address}
//                 onChange={handle}
//                 style={inputStyle}
//               />
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>State/राज्य :</label>
//                 <select
//                   name="state"
//                   value={form.state || ""}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value="">Select</option>
//                   {indianStates.map((s) => (
//                     <option key={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>District/जिला :</label>
//                 <select
//                   name="district"
//                   value={form.district}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value=""></option>
//                   {(districtsByState[stateVal] || []).map((d) => (
//                     <option key={d}>{d}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Block/ब्लॉक :</label>
//                 <select
//                   name="block"
//                   value={form.block}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value=""></option>
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>Panchayat/पंचायत :</label>
//                 <select
//                   name="panchayat"
//                   value={form.panchayat}
//                   onChange={handle}
//                   style={inputStyle}
//                 >
//                   <option value=""></option>
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>Postal Pin Code/डाक पिन कोड :</label>
//                 <input
//                   name="pincode"
//                   value={form.pincode}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>
//                   Attach Photograph/फोटो संलग्न करें :
//                 </label>
//                 <input
//                   name="photo"
//                   type="file"
//                   accept="image/*"
//                   onChange={handle}
//                   style={{ ...inputStyle, padding: "6px 8px" }}
//                 />
//                 <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
//                   Max file size: 3MB
//                 </p>
//               </div>
//               <div>
//                 <label style={labelStyle}>
//                   Attach Signature/हस्ताक्षर संलग्न करें :
//                 </label>
//                 <input
//                   name="signature"
//                   type="file"
//                   accept="image/*"
//                   onChange={handle}
//                   style={{ ...inputStyle, padding: "6px 8px" }}
//                 />
//                 <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
//                   Max file size: 3MB
//                 </p>
//               </div>
//             </div>
//           </div>
//           <h3
//             style={{
//               fontWeight: 900,
//               fontSize: 15,
//               color: "#1a2a4a",
//               margin: "28px 0 16px",
//             }}
//           >
//             EDUCATION DETAILS
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Higher Education/उच्च शिक्षा :</label>
//                 <input
//                   name="higherEdu"
//                   value={form.higherEdu}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>
//                   Board/बोर्ड/University/विश्विद्यालय :
//                 </label>
//                 <input
//                   name="board"
//                   value={form.board}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 20,
//               }}
//             >
//               <div>
//                 <label style={labelStyle}>Mark/अंक :</label>
//                 <input
//                   name="marks"
//                   value={form.marks}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//               <div>
//                 <label style={labelStyle}>Mark Percentage/अंक प्रतिशत :</label>
//                 <input
//                   name="markPct"
//                   value={form.markPct}
//                   onChange={handle}
//                   style={inputStyle}
//                 />
//               </div>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: 10,
//               marginTop: 24,
//             }}
//           >
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 8,
//                 fontSize: 14,
//                 cursor: "pointer",
//               }}
//             >
//               <input
//                 type="checkbox"
//                 name="agree1"
//                 checked={form.agree1}
//                 onChange={handle}
//                 style={{
//                   width: 16,
//                   height: 16,
//                   marginTop: 2,
//                   flexShrink: 0,
//                   accentColor: GREEN,
//                 }}
//               />
//               I have read and agree to the Terms and Conditions.{" "}
//               <a
//                 href="#"
//                 style={{
//                   color: "#000",
//                   fontWeight: 700,
//                   textDecoration: "underline",
//                   marginLeft: 4,
//                 }}
//               >
//                 Click here to read
//               </a>
//             </label>
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 8,
//                 fontSize: 14,
//                 cursor: "pointer",
//                 lineHeight: 1.6,
//               }}
//             >
//               <input
//                 type="checkbox"
//                 name="agree2"
//                 checked={form.agree2}
//                 onChange={handle}
//                 style={{
//                   width: 16,
//                   height: 16,
//                   marginTop: 2,
//                   flexShrink: 0,
//                   accentColor: GREEN,
//                 }}
//               />
//               I declare that all the information given in this application form
//               is correct to the best of my knowledge and belief.
//             </label>
//           </div>
//           <div style={{ textAlign: "center", marginTop: 24 }}>
//             <button
//               onClick={() => alert("Application submitted!")}
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 fontSize: 15,
//                 padding: "12px 40px",
//                 borderRadius: 4,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               SUBMIT &amp; CONTINUE
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── JOB DETAIL PAGE ───────────────────────────────────────────
// function JobDetailPage({ job, onBack, onApply }) {
//   const [downloading, setDownloading] = useState(null);
//   const d = job.rows;
//   const rows = d.en.length;

//   const handleDownload = async (lang) => {
//     setDownloading(lang);
//     try {
//       await downloadPDF(job, lang);
//     } catch (e) {
//       alert("PDF download failed: " + e.message);
//     }
//     setDownloading(null);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#fff",
//         fontFamily: "'Segoe UI','Noto Sans',sans-serif",
//       }}
//     >
//       <div
//         style={{
//           background: GREEN,
//           padding: "10px 24px",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//         }}
//       >
//         <button
//           onClick={onBack}
//           style={{
//             background: "rgba(255,255,255,0.2)",
//             border: "none",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: 13,
//             padding: "7px 16px",
//             borderRadius: 4,
//             cursor: "pointer",
//           }}
//         >
//           ← Back
//         </button>
//         <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
//           Job Detail / नौकरी विवरण
//         </span>
//       </div>
//       <div
//         style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 40px" }}
//       >
//         <div
//           style={{
//             border: `2px solid ${GREEN}`,
//             borderRadius: 4,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               background: `${GREEN}22`,
//               padding: "10px 16px",
//               textAlign: "center",
//               borderBottom: `1px solid ${GREEN}`,
//               fontSize: 13,
//               fontWeight: 600,
//               color: "#1a2a4a",
//             }}
//           >
//             {job.title} Advt. No. {job.advt} / {job.titleHi} {job.advt}
//           </div>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               borderBottom: `1px solid ${GREEN}`,
//             }}
//           >
//             <div
//               style={{
//                 padding: "16px 20px",
//                 borderRight: `1px solid ${GREEN}`,
//                 background: `${GREEN}0d`,
//               }}
//             >
//               <div
//                 style={{
//                   fontWeight: 900,
//                   fontSize: 14,
//                   color: "#1a2a4a",
//                   marginBottom: 4,
//                 }}
//               >
//                 Advt No: {job.advt}
//               </div>
//               <div
//                 style={{
//                   fontWeight: 700,
//                   fontSize: 13,
//                   color: "#1a2a4a",
//                   marginBottom: 12,
//                 }}
//               >
//                 Date: {job.date}
//               </div>
//               <button
//                 onClick={() => handleDownload("en")}
//                 disabled={downloading === "en"}
//                 style={{
//                   color: "#1a56c4",
//                   fontWeight: 700,
//                   fontSize: 13,
//                   textDecoration: "underline",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                   opacity: downloading === "en" ? 0.6 : 1,
//                 }}
//               >
//                 📄{" "}
//                 {downloading === "en"
//                   ? "Generating PDF..."
//                   : "Download Advertisement (English Version) Click Here"}{" "}
//                 🌱
//               </button>
//             </div>
//             <div
//               style={{
//                 padding: "16px 20px",
//                 background: `${GREEN}0d`,
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   fontWeight: 900,
//                   fontSize: 14,
//                   color: "#1a2a4a",
//                   marginBottom: 4,
//                 }}
//               >
//                 विज्ञापन सं० {job.advt}
//               </div>
//               <div
//                 style={{
//                   fontWeight: 700,
//                   fontSize: 13,
//                   color: "#1a2a4a",
//                   marginBottom: 12,
//                 }}
//               >
//                 दिनांक -{job.date}
//               </div>
//               <button
//                 onClick={() => handleDownload("hi")}
//                 disabled={downloading === "hi"}
//                 style={{
//                   color: "#1a56c4",
//                   fontWeight: 700,
//                   fontSize: 13,
//                   textDecoration: "underline",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 4,
//                   opacity: downloading === "hi" ? 0.6 : 1,
//                 }}
//               >
//                 📄{" "}
//                 {downloading === "hi"
//                   ? "PDF बन रहा है..."
//                   : "डाउनलोड विज्ञापन (हिंदी संस्करण) यहां क्लिक करें"}{" "}
//                 🌱
//               </button>
//             </div>
//           </div>
//           {Array.from({ length: rows }).map((_, i) => (
//             <div
//               key={i}
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 borderBottom: i < rows - 1 ? `1px solid ${GREEN}` : "none",
//                 background: i % 2 === 0 ? `${GREEN}08` : "#fff",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "160px 1fr",
//                   borderRight: `1px solid ${GREEN}`,
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: "10px 14px",
//                     fontWeight: 700,
//                     fontSize: 13,
//                     color: "#333",
//                     borderRight: `1px solid ${GREEN}33`,
//                   }}
//                 >
//                   {d.en[i][0]}
//                 </div>
//                 <div
//                   style={{
//                     padding: "10px 14px",
//                     fontSize: 13,
//                     color: "#333",
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   : {d.en[i][1]}
//                 </div>
//               </div>
//               <div
//                 style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}
//               >
//                 <div
//                   style={{
//                     padding: "10px 14px",
//                     fontWeight: 700,
//                     fontSize: 13,
//                     color: "#333",
//                     borderRight: `1px solid ${GREEN}33`,
//                   }}
//                 >
//                   {d.hi[i][0]}
//                 </div>
//                 <div
//                   style={{
//                     padding: "10px 14px",
//                     fontSize: 13,
//                     color: "#333",
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   : {d.hi[i][1]}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div
//           style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}
//         >
//           {job.isNew ? (
//             <button
//               onClick={onApply}
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 fontSize: 15,
//                 padding: "12px 40px",
//                 borderRadius: 4,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Apply Now / अभी आवेदन करें
//             </button>
//           ) : (
//             <div
//               style={{
//                 background: "#fee2e2",
//                 border: "1px solid #fca5a5",
//                 borderRadius: 6,
//                 padding: "14px 20px",
//                 fontSize: 14,
//                 fontWeight: 700,
//                 color: "#8B1a1a",
//               }}
//             >
//               ⚠️ This vacancy is closed. / यह भर्ती बंद हो चुकी है।
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── VACANCY ITEM ──────────────────────────────────────────────
// function VacancyItem({ job, onClick }) {
//   return (
//     <div>
//       <div
//         onClick={() => onClick(job)}
//         style={{
//           padding: "14px 20px",
//           fontSize: 14,
//           color: "#1a2a4a",
//           lineHeight: 1.7,
//           cursor: "pointer",
//           display: "flex",
//           alignItems: "flex-start",
//           gap: 8,
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fae8")}
//         onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//       >
//         <span style={{ fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
//           &gt;&gt;
//         </span>
//         <span>
//           {job.title} Advt. No. {job.advt} / {job.titleHi} {job.advt}{" "}
//           <strong>{job.advt}</strong>
//           {job.isNew && (
//             <span
//               style={{
//                 display: "inline-block",
//                 background: "#e53e3e",
//                 color: "#fff",
//                 fontSize: 10,
//                 fontWeight: 900,
//                 padding: "1px 6px",
//                 borderRadius: 3,
//                 marginLeft: 6,
//                 verticalAlign: "middle",
//               }}
//             >
//               NEW
//             </span>
//           )}
//         </span>
//       </div>
//       <div style={{ borderBottom: "1px dashed #aaa", margin: "0 8px" }} />
//     </div>
//   );
// }

// // ── HELPER: Convert API job to component format ─────────────
// function convertJobToComponentFormat(posting) {
//   const isActive = posting.status === "Active";
//   const lastDate = new Date(posting.lastDate);
//   const today = new Date();
//   const isClosed = lastDate < today;

//   // Build rows data
//   const rowsEn = [
//     ["Post", posting.post?.en || posting.postTitle?.en || ""],
//     ["Total Post", posting.location?.en || ""],
//     ["Monthly Income", posting.income?.en || ""],
//     ["Education Qualification", posting.education?.en || ""],
//     [
//       "Age Limit",
//       `${posting.ageLimit?.en || ""} (As on ${posting.ageAsOn || ""})`,
//     ],
//     ["Job Location", posting.location?.en || ""],
//     ["Selection Process", posting.selectionProcess?.en || ""],
//     ["Application Opening On", posting.applicationOpeningDate || ""],
//     ["Last Date of Application", posting.lastDate || ""],
//     ["1st Merit List Released", posting.firstMeritListDate || ""],
//     ["Final Merit List Released", posting.finalMeritListDate || ""],
//     ["Fee Structure", posting.fee?.en || ""],
//   ];

//   const rowsHi = [
//     ["पद", posting.post?.hi || posting.postTitle?.hi || ""],
//     ["कुल पद", posting.location?.hi || ""],
//     ["मासिक आय", posting.income?.hi || ""],
//     ["शैक्षणिक योग्यता", posting.education?.hi || ""],
//     ["आयु सीमा", `${posting.ageLimit?.hi || ""} (${posting.ageAsOn || ""} को)`],
//     ["नौकरी करने का स्थान", posting.location?.hi || ""],
//     ["चयन प्रक्रिया", posting.selectionProcess?.hi || ""],
//     ["आवेदन खुलने की तिथि", posting.applicationOpeningDate || ""],
//     ["आवेदन की अंतिम तिथि", posting.lastDate || ""],
//     ["मेधा सूची जारी", posting.firstMeritListDate || ""],
//     ["अंतिम मेधा सूची जारी", posting.finalMeritListDate || ""],
//     ["शुल्क संरचना", posting.fee?.hi || ""],
//   ];

//   return {
//     id: posting._id,
//     advt: posting.advtNo,
//     isNew: isActive && !isClosed,
//     title: posting.postTitle?.en || posting.post?.en || "",
//     titleHi: posting.postTitle?.hi || posting.post?.hi || "",
//     date: posting.date || "",
//     invitationEn:
//       posting.title?.en ||
//       `Invitation for all eligible candidates on vacant posts of ${posting.postTitle?.en || posting.post?.en || ""} under Jan Swasthya Sahayata Abhiyan by Healthcare Research and Development Board (A Division of NAC India).`,
//     invitationHi:
//       posting.title?.hi ||
//       `हेल्थ केयर रिसर्च एंड डेवलपमेंट बोर्ड (A Division Of NAC INDIA) द्वारा जन स्वास्थ्य सहायता अभियान के तहत ${posting.postTitle?.hi || posting.post?.hi || ""} के रिक्त पदों पर सभी पात्र उम्मीदवारों के लिए आमंत्रण`,
//     rows: {
//       en: rowsEn,
//       hi: rowsHi,
//     },
//   };
// }

// // ── MAIN ──────────────────────────────────────────────────────
// export default function JobsPage() {
//   const [view, setView] = useState("list");
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [latestJobs, setLatestJobs] = useState([]);
//   const [oldJobs, setOldJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch jobs from API
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         setLoading(true);
//         const response = await jobPostingsAPI.getAll({
//           status: "all",
//           limit: 100,
//         });

//         if (response.success && response.data.postings) {
//           const allJobs = response.data.postings.map(
//             convertJobToComponentFormat,
//           );

//           // Separate active (latest) and inactive (old) jobs
//           const active = allJobs.filter((job) => job.isNew);
//           const inactive = allJobs.filter((job) => !job.isNew);

//           // Sort active jobs by createdAt (newest first)
//           active.sort((a, b) => {
//             const jobA = response.data.postings.find((p) => p._id === a.id);
//             const jobB = response.data.postings.find((p) => p._id === b.id);
//             return new Date(jobB.createdAt) - new Date(jobA.createdAt);
//           });

//           setLatestJobs(active);
//           setOldJobs(inactive);
//         } else {
//           setLatestJobs([]);
//           setOldJobs([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch jobs:", error);
//         setLatestJobs([]);
//         setOldJobs([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const openDetail = (job) => {
//     setSelectedJob(job);
//     setView("detail");
//   };
//   const openApply = () => setView("apply");
//   const backToList = () => {
//     setView("list");
//     setSelectedJob(null);
//   };
//   const backToDetail = () => setView("detail");

//   if (view === "apply" && selectedJob)
//     return <ApplicationForm job={selectedJob} onBack={backToDetail} />;
//   if (view === "detail" && selectedJob)
//     return (
//       <JobDetailPage
//         job={selectedJob}
//         onBack={backToList}
//         onApply={openApply}
//       />
//     );

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#fff",
//         fontFamily: "'Segoe UI','Noto Sans',sans-serif",
//         padding: "32px 40px",
//       }}
//     >
//       {loading ? (
//         <div
//           style={{
//             textAlign: "center",
//             padding: "40px",
//             fontSize: 16,
//             color: "#666",
//           }}
//         >
//           Loading jobs...
//         </div>
//       ) : (
//         <>
//           <div style={{ marginBottom: 40 }}>
//             <h2
//               style={{
//                 fontWeight: 700,
//                 fontSize: 20,
//                 color: "#1a2a4a",
//                 marginBottom: 6,
//               }}
//             >
//               List Of Latest Vacancies
//             </h2>
//             <div style={{ borderBottom: `2px solid ${GREEN}` }} />
//             {latestJobs.length > 0 ? (
//               latestJobs.map((job) => (
//                 <VacancyItem key={job.id} job={job} onClick={openDetail} />
//               ))
//             ) : (
//               <div
//                 style={{ padding: "20px", textAlign: "center", color: "#666" }}
//               >
//                 No active vacancies at the moment.
//               </div>
//             )}
//           </div>
//           <div>
//             <h2
//               style={{
//                 fontWeight: 700,
//                 fontSize: 20,
//                 color: "#1a2a4a",
//                 marginBottom: 6,
//               }}
//             >
//               List of Old Vacancies
//             </h2>
//             <div style={{ borderBottom: `2px solid ${GREEN}` }} />
//             {oldJobs.length > 0 ? (
//               oldJobs.map((job) => (
//                 <VacancyItem key={job.id} job={job} onClick={openDetail} />
//               ))
//             ) : (
//               <div
//                 style={{ padding: "20px", textAlign: "center", color: "#666" }}
//               >
//                 No old vacancies to display.
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobPostingsAPI } from "../utils/api.js";

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

const districtsByState = {
  Bihar: [
    "Patna",
    "Gaya",
    "Muzaffarpur",
    "Bhagalpur",
    "Darbhanga",
    "Purnia",
    "Samastipur",
    "Begusarai",
    "Nalanda",
    "Rohtas",
    "Araria",
    "Aurangabad",
    "Banka",
    "Buxar",
    "Gopalganj",
    "Jamui",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Nawada",
    "Saran",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
    "East Champaran",
  ],
  Jharkhand: [
    "Ranchi",
    "Dhanbad",
    "Jamshedpur",
    "Bokaro",
    "Hazaribagh",
    "Giridih",
    "Deoghar",
    "Dumka",
    "Pakur",
    "Garhwa",
    "Chatra",
    "Gumla",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Palamu",
    "Ramgarh",
    "Sahibganj",
    "Seraikela",
    "Simdega",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Allahabad",
    "Meerut",
    "Noida",
    "Ghaziabad",
    "Bareilly",
    "Aligarh",
    "Gorakhpur",
    "Moradabad",
    "Saharanpur",
    "Faizabad",
    "Jhansi",
    "Mathura",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Amravati",
    "Nanded",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Bharatpur",
    "Sikar",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Gandhinagar",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Darjeeling",
    "Jalpaiguri",
    "Murshidabad",
    "Bardhaman",
    "Nadia",
    "North 24 Parganas",
    "South 24 Parganas",
  ],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "South Delhi",
    "West Delhi",
  ],
  Assam: [
    "Guwahati",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
    "Kamrup",
    "Barpeta",
  ],
  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Berhampur",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Bhadrak",
  ],
  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Haldwani",
    "Rudrapur",
    "Kashipur",
    "Rishikesh",
    "Nainital",
  ],
};

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

async function downloadPDF(job, lang) {
  const isHi = lang === "hi";
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  );
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  );
  const rows = isHi ? job.rows.hi : job.rows.en;
  const container = document.createElement("div");
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:700px;background:#fff;font-family:'Noto Sans Devanagari','Noto Sans',Arial,sans-serif;font-size:13px;color:#000;border:2px solid #888;border-radius:8px;overflow:hidden;`;
  const tableRowsHTML = rows
    .map(
      (r, i) =>
        `<tr><td style="padding:9px 14px;font-weight:700;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;width:35%;vertical-align:top">${r[0]}</td><td style="padding:9px 8px;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;width:4%;text-align:center;vertical-align:top">:</td><td style="padding:9px 14px;background:${i % 2 === 0 ? "#efefef" : "#fff"};border:1px solid #ccc;vertical-align:top;line-height:1.6">${r[1]}</td></tr>`,
    )
    .join("");
  container.innerHTML = `<div style="background:#1e2840;display:flex;align-items:center;gap:16px;padding:14px 20px"><div style="width:64px;height:64px;border-radius:50%;background:${GREEN};border:3px solid #fff;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:14px">JSS</div><div><div style="color:#fff;font-size:${isHi ? "22px" : "19px"};font-weight:900;line-height:1.2">${isHi ? "जन स्वास्थ्य सहायता अभियान" : "JAN SWASTHYA SAHAYATA ABHIYAN"}</div><div style="color:#fff;font-size:13px;font-weight:700;margin-top:4px">A Project of Healthcare Research &amp; Development Board</div><div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:2px">(HRDB is Division Of Social Welfare Organization "NAC India")</div></div></div><div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:#f5f5f5;border-bottom:2px solid #ddd"><span style="font-weight:700;font-size:13px;color:#1e2840">${isHi ? "विज्ञापन सं0 :" : "Advt. No. :"} ${job.advt}</span><span style="background:#1e2840;color:#fff;font-weight:900;font-size:12px;padding:7px 18px;border-radius:2px;letter-spacing:0.05em">${isHi ? "भर्ती आमंत्रण" : "RECRUITMENT INVITATION"}</span><span style="font-weight:700;font-size:13px;color:#1e2840">${isHi ? "दिनांक :" : "DATE :"} ${job.date}</span></div><div style="background:#1e2840;color:#fff;padding:14px 20px;text-align:center;font-size:${isHi ? "15px" : "13px"};font-weight:700;line-height:1.6">${isHi ? job.invitationHi : job.invitationEn}</div><div style="padding:16px 20px"><table style="width:100%;border-collapse:collapse;font-size:${isHi ? "14px" : "13px"}"><tbody>${tableRowsHTML}</tbody></table></div><div style="background:#1e2840;color:#fff;padding:12px 20px;text-align:center"><div style="font-size:${isHi ? "16px" : "14px"};font-weight:900;margin-bottom:6px">${isHi ? "अधिक जानकारी के लिए :" : "FOR MORE INFORMATION :"}</div><div style="font-size:12px;display:flex;justify-content:space-around"><span>Website : https://www.jssabhiyan-nac.in</span><span>Email : ${isHi ? "info@jssabhiyan-nac.in" : "support@jssabhiyan-nac.in"}</span></div></div>`;
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
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, -yOffset);
        const sliceData = sliceCanvas.toDataURL("image/png");
        const sliceImgH = (sliceCanvas.height * imgW) / canvas.width;
        pdf.addImage(sliceData, "PNG", 10, 10, imgW, sliceImgH);
        yOffset += sliceH;
        page++;
      }
    }
    pdf.save(
      isHi
        ? `JSSA_${job.advt.replace(/\//g, "-")}_Hindi.pdf`
        : `JSSA_${job.advt.replace(/\//g, "-")}_English.pdf`,
    );
  } finally {
    document.body.removeChild(container);
  }
}

function ApplicationForm({ job, onBack }) {
  const [stateVal, setStateVal] = useState("");
  const [form, setForm] = useState({
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
    district: "",
    block: "",
    panchayat: "",
    pincode: "",
    photo: null,
    signature: null,
    higherEdu: "",
    board: "",
    marks: "",
    markPct: "",
    agree1: false,
    agree2: false,
  });

  const handle = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setForm((p) => ({ ...p, [name]: files[0] }));
    else if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
    else setForm((p) => ({ ...p, [name]: value }));
    if (name === "state") {
      setStateVal(value);
      setForm((p) => ({ ...p, state: value, district: "" }));
    }
  };

  const iStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 14,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    color: "#000",
  };
  const lStyle = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "'Segoe UI','Noto Sans',sans-serif",
      }}
    >
      <div
        style={{
          background: GREEN,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            padding: "7px 14px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <span className="jobs-back-title">
          {job.title} — Advt. No. {job.advt}
        </span>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 14px 40px" }}>
        <div
          style={{
            background: "#f0f0f0",
            borderRadius: 6,
            padding: "20px 18px",
            marginTop: 20,
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#555",
              marginBottom: 16,
            }}
          >
            {job.title} Advt. No. {job.advt} / {job.titleHi} {job.advt}
          </p>
          <h3 className="jobs-section-heading">PERSONAL DETAILS</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={lStyle}>Candidate's Name / अभ्यर्थी का नाम :</label>
              <input
                name="candidateName"
                value={form.candidateName}
                onChange={handle}
                style={iStyle}
              />
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Father's Name / पिता का नाम :</label>
                <input
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
              <div>
                <label style={lStyle}>Mother's Name / माता का नाम :</label>
                <input
                  name="motherName"
                  value={form.motherName}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Date Of Birth / जन्मतिथि :</label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
              <div>
                <label style={lStyle}>Gender / लिंग :</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value="">--Select--</option>
                  <option>Male / पुरुष</option>
                  <option>Female / महिला</option>
                  <option>Other / अन्य</option>
                </select>
              </div>
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Nationality / राष्ट्रीयता :</label>
                <select
                  name="nationality"
                  value={form.nationality}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value="">--Select--</option>
                  <option>Indian / भारतीय</option>
                  <option>Other / अन्य</option>
                </select>
              </div>
              <div>
                <label style={lStyle}>Category / श्रेणी :</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value="">--Select--</option>
                  <option>General / सामान्य</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                </select>
              </div>
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Aadhar Number / आधार संख्या :</label>
                <input
                  name="aadhar"
                  value={form.aadhar}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
              <div>
                <label style={lStyle}>Pan Number / पेन संख्या :</label>
                <input
                  name="pan"
                  value={form.pan}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Mobile Number / मोबाइल नंबर :</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
              <div>
                <label style={lStyle}>Email Id / ईमेल आईडी :</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
            </div>
            <div>
              <label style={lStyle}>Permanent Address / स्थाई पता :</label>
              <input
                name="address"
                value={form.address}
                onChange={handle}
                style={iStyle}
              />
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>State / राज्य :</label>
                <select
                  name="state"
                  value={form.state || ""}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value="">Select</option>
                  {indianStates.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lStyle}>District / जिला :</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value=""></option>
                  {(districtsByState[stateVal] || []).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="jobs-grid-3">
              <div>
                <label style={lStyle}>Block / ब्लॉक :</label>
                <select
                  name="block"
                  value={form.block}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label style={lStyle}>Panchayat / पंचायत :</label>
                <select
                  name="panchayat"
                  value={form.panchayat}
                  onChange={handle}
                  style={iStyle}
                >
                  <option value=""></option>
                </select>
              </div>
              <div>
                <label style={lStyle}>Pin Code / पिन कोड :</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Photograph / फोटो :</label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handle}
                  style={{ ...iStyle, padding: "6px 8px" }}
                />
                <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  Max file size: 3MB
                </p>
              </div>
              <div>
                <label style={lStyle}>Signature / हस्ताक्षर :</label>
                <input
                  name="signature"
                  type="file"
                  accept="image/*"
                  onChange={handle}
                  style={{ ...iStyle, padding: "6px 8px" }}
                />
                <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  Max file size: 3MB
                </p>
              </div>
            </div>
          </div>
          <h3 className="jobs-section-heading" style={{ marginTop: 24 }}>
            EDUCATION DETAILS
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Higher Education / उच्च शिक्षा :</label>
                <input
                  name="higherEdu"
                  value={form.higherEdu}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
              <div>
                <label style={lStyle}>Board / University :</label>
                <input
                  name="board"
                  value={form.board}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
            </div>
            <div className="jobs-grid-2">
              <div>
                <label style={lStyle}>Marks / अंक :</label>
                <input
                  name="marks"
                  value={form.marks}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
              <div>
                <label style={lStyle}>Percentage / प्रतिशत :</label>
                <input
                  name="markPct"
                  value={form.markPct}
                  onChange={handle}
                  style={iStyle}
                />
              </div>
            </div>
          </div>
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
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="agree1"
                checked={form.agree1}
                onChange={handle}
                style={{
                  width: 16,
                  height: 16,
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
                fontSize: 14,
                cursor: "pointer",
                lineHeight: 1.6,
              }}
            >
              <input
                type="checkbox"
                name="agree2"
                checked={form.agree2}
                onChange={handle}
                style={{
                  width: 16,
                  height: 16,
                  marginTop: 2,
                  flexShrink: 0,
                  accentColor: GREEN,
                }}
              />
              I declare that all the information given in this application form
              is correct to the best of my knowledge and belief.
            </label>
          </div>
          <div style={{ textAlign: "center", marginTop: 22 }}>
            <button
              onClick={() => alert("Application submitted!")}
              className="jobs-submit-btn"
            >
              SUBMIT &amp; CONTINUE
            </button>
          </div>
        </div>
      </div>
      <style>{jobsCSS}</style>
    </div>
  );
}

function JobDetailPage({ job, onBack, onApply }) {
  const [downloading, setDownloading] = useState(null);
  const d = job.rows;
  const rows = d.en.length;

  return (
    <div
      style={{
        background: "#fff",
        fontFamily: "'Segoe UI','Noto Sans',sans-serif",
      }}
    >
      <div
        style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px 40px" }}
      >
        <div
          style={{
            border: `2px solid ${GREEN}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: `${GREEN}22`,
              padding: "10px 14px",
              textAlign: "center",
              borderBottom: `1px solid ${GREEN}`,
              fontSize: 13,
              fontWeight: 600,
              color: "#1a2a4a",
            }}
          >
            {job.title} Advt. No. {job.advt} / {job.titleHi} {job.advt}
          </div>
          <div className="jobs-detail-download-row">
            <div
              className="jobs-detail-download-cell"
              style={{ borderRight: `1px solid ${GREEN}` }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 14,
                  color: "#1a2a4a",
                  marginBottom: 4,
                }}
              >
                Advt No: {job.advt}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#1a2a4a",
                  marginBottom: 10,
                }}
              >
                Date: {job.date}
              </div>
              <button
                onClick={async () => {
                  setDownloading("en");
                  try {
                    await downloadPDF(job, "en");
                  } catch (e) {
                    alert("PDF download failed: " + e.message);
                  }
                  setDownloading(null);
                }}
                disabled={downloading === "en"}
                style={{
                  color: "#1a56c4",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  opacity: downloading === "en" ? 0.6 : 1,
                }}
              >
                📄{" "}
                {downloading === "en"
                  ? "Generating PDF..."
                  : "Download Advertisement (English) 🌱"}
              </button>
            </div>
            <div className="jobs-detail-download-cell">
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 14,
                  color: "#1a2a4a",
                  marginBottom: 4,
                }}
              >
                विज्ञापन सं० {job.advt}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#1a2a4a",
                  marginBottom: 10,
                }}
              >
                दिनांक - {job.date}
              </div>
              <button
                onClick={async () => {
                  setDownloading("hi");
                  try {
                    await downloadPDF(job, "hi");
                  } catch (e) {
                    alert("PDF download failed: " + e.message);
                  }
                  setDownloading(null);
                }}
                disabled={downloading === "hi"}
                style={{
                  color: "#1a56c4",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  opacity: downloading === "hi" ? 0.6 : 1,
                }}
              >
                📄{" "}
                {downloading === "hi"
                  ? "PDF बन रहा है..."
                  : "डाउनलोड विज्ञापन (हिंदी) 🌱"}
              </button>
            </div>
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="jobs-detail-row"
              style={{ background: i % 2 === 0 ? `${GREEN}08` : "#fff" }}
            >
              <div
                className="jobs-detail-lang-cell"
                style={{ borderRight: `1px solid ${GREEN}` }}
              >
                <div className="jobs-detail-key">{d.en[i][0]}</div>
                <div className="jobs-detail-val">: {d.en[i][1]}</div>
              </div>
              <div className="jobs-detail-lang-cell">
                <div className="jobs-detail-key">{d.hi[i][0]}</div>
                <div className="jobs-detail-val">: {d.hi[i][1]}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          {job.isNew ? (
            <button onClick={onApply} className="jobs-submit-btn">
              Apply Now / अभी आवेदन करें
            </button>
          ) : (
            <div
              style={{
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
          )}
        </div>
      </div>
      <style>{jobsCSS}</style>
    </div>
  );
}

function VacancyItem({ job, onClick }) {
  return (
    <div>
      <div onClick={() => onClick(job)} className="jobs-vacancy-item">
        <span style={{ fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
          &gt;&gt;
        </span>
        <span>
          {job.title} Advt. No. {job.advt} / {job.titleHi} {job.advt}{" "}
          <strong>{job.advt}</strong>
          {job.isNew && (
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 900,
                padding: "1px 6px",
                borderRadius: 3,
                marginLeft: 6,
                verticalAlign: "middle",
                color: "#fff",
                animation: "newBadgeJob 1.5s infinite",
              }}
            >
              NEW
            </span>
          )}
        </span>
      </div>
      <div style={{ borderBottom: "1px dashed #aaa", margin: "0 8px" }} />
    </div>
  );
}

function convertJobToComponentFormat(posting) {
  const isActive = posting.status === "Active";
  const lastDate = new Date(posting.lastDate);
  const today = new Date();
  const isClosed = lastDate < today;
  const rowsEn = [
    ["Post", posting.post?.en || posting.postTitle?.en || ""],
    ["Total Post", posting.totalPost || ""],
    ["Monthly Income", posting.income?.en || ""],
    ["Education Qualification", posting.education?.en || ""],
    [
      "Age Limit",
      `${posting.ageLimit?.en || ""} (As on ${posting.ageAsOn || ""})`,
    ],
    ["Job Location", posting.location?.en || ""],
    ["Selection Process", posting.selectionProcess?.en || ""],
    ["Application Opening On", posting.applicationOpeningDate || ""],
    ["Last Date of Application", posting.lastDate || ""],
    ["1st Merit List Released", posting.firstMeritListDate || ""],
    ["Final Merit List Released", posting.finalMeritListDate || ""],
    ["Fee Structure", posting.fee?.en || ""],
  ];
  const rowsHi = [
    ["पद", posting.post?.hi || posting.postTitle?.hi || ""],
    ["कुल पद", posting.totalPost || ""],
    ["मासिक आय", posting.income?.hi || ""],
    ["शैक्षणिक योग्यता", posting.education?.hi || ""],
    ["आयु सीमा", `${posting.ageLimit?.hi || ""} (${posting.ageAsOn || ""} को)`],
    ["नौकरी करने का स्थान", posting.location?.hi || ""],
    ["चयन प्रक्रिया", posting.selectionProcess?.hi || ""],
    ["आवेदन खुलने की तिथि", posting.applicationOpeningDate || ""],
    ["आवेदन की अंतिम तिथि", posting.lastDate || ""],
    ["मेधा सूची जारी", posting.firstMeritListDate || ""],
    ["अंतिम मेधा सूची जारी", posting.finalMeritListDate || ""],
    ["शुल्क संरचना", posting.fee?.hi || ""],
  ];
  return {
    id: posting._id,
    advt: posting.advtNo,
    isNew: isActive && !isClosed,
    title: posting.postTitle?.en || posting.post?.en || "",
    titleHi: posting.postTitle?.hi || posting.post?.hi || "",
    date: posting.date || "",
    invitationEn:
      posting.title?.en ||
      `Invitation for all eligible candidates on vacant posts of ${posting.postTitle?.en || posting.post?.en || ""} under Jan Swasthya Sahayata Abhiyan by Healthcare Research and Development Board (A Division of NAC India).`,
    invitationHi:
      posting.title?.hi ||
      `हेल्थ केयर रिसर्च एंड डेवलपमेंट बोर्ड (A Division Of NAC INDIA) द्वारा जन स्वास्थ्य सहायता अभियान के तहत ${posting.postTitle?.hi || posting.post?.hi || ""} के रिक्त पदों पर सभी पात्र उम्मीदवारों के लिए आमंत्रण`,
    rows: { en: rowsEn, hi: rowsHi },
  };
}

const jobsCSS = `
  * { box-sizing: border-box; }

  @keyframes newBadgeJob {
    0%   { background: #e53e3e; }
    25%  { background: #d97706; }
    50%  { background: #7c3aed; }
    75%  { background: #0369a1; }
    100% { background: #e53e3e; }
  }

  .jobs-back-title { color: #fff; font-weight: 700; font-size: 14px; }

  .jobs-section-heading {
    font-weight: 900; font-size: 16px; color: #1a2a4a; margin: 20px 0 14px;
  }

  .jobs-submit-btn {
    background: ${GREEN}; color: #fff; font-weight: 900;
    font-size: 15px; padding: 12px 40px;
    border: none; cursor: pointer; border-radius: 4px;
  }

  /* ── Vacancy list item ── */
  .jobs-vacancy-item {
    padding: 14px 20px; font-size: 15px; color: #1a2a4a;
    line-height: 1.7; cursor: pointer;
    display: flex; align-items: flex-start; gap: 8px;
  }

  /* ── Job list page — CENTERED with side gaps ── */
  .jobs-list-wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 40px;
  }

  .jobs-list-heading {
    font-weight: 700; font-size: 20px; color: #1a2a4a; margin-bottom: 6px;
  }

  .jobs-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .jobs-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* ── Detail download row ── */
  .jobs-detail-download-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid ${GREEN};
  }
  .jobs-detail-download-cell {
    padding: 16px 18px; background: ${GREEN}0d;
  }

  /* ── Detail bilingual rows ── */
  .jobs-detail-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid ${GREEN}44;
  }
  .jobs-detail-row:last-child { border-bottom: none; }

  .jobs-detail-lang-cell {
    display: grid; grid-template-columns: 150px 1fr; padding: 0;
  }
  .jobs-detail-key {
    padding: 10px 12px; font-weight: 700; font-size: 13px;
    color: #333; border-right: 1px solid ${GREEN}33;
  }
  .jobs-detail-val {
    padding: 10px 12px; font-size: 13px; color: #333; line-height: 1.6;
  }

  @media (max-width: 768px) {
    .jobs-list-wrap { padding: 16px 12px; }
    .jobs-list-heading { font-size: 14px; }
    .jobs-vacancy-item { padding: 8px 10px; font-size: 10px; }
    .jobs-back-title { font-size: 10px; }
    .jobs-section-heading { font-size: 11px; }
    .jobs-submit-btn { font-size: 11px; padding: 8px 18px; }
    .jobs-grid-2 { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
    .jobs-grid-3 { grid-template-columns: 1fr 1fr 1fr !important; gap: 6px !important; }

    /* download row — keep 2 cols, just smaller */
    .jobs-detail-download-row { grid-template-columns: 1fr 1fr !important; }
    .jobs-detail-download-cell { padding: 8px 6px; }

    /* detail rows — keep 2 cols (EN | HI) side by side */
    .jobs-detail-row { grid-template-columns: 1fr 1fr !important; }
    .jobs-detail-lang-cell { grid-template-columns: 60px 1fr; }
    .jobs-detail-key { font-size: 7px; padding: 5px 4px; }
    .jobs-detail-val { font-size: 7px; padding: 5px 4px; }
  }
`;

export default function JobsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [selectedJob, setSelectedJob] = useState(null);
  const [latestJobs, setLatestJobs] = useState([]);
  const [oldJobs, setOldJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobPostingsAPI.getAll({
          status: "all",
          limit: 100,
        });
        if (response.success && response.data.postings) {
          const allJobs = response.data.postings.map(
            convertJobToComponentFormat,
          );
          const active = allJobs.filter((j) => j.isNew);
          const inactive = allJobs.filter((j) => !j.isNew);
          active.sort((a, b) => {
            const ja = response.data.postings.find((p) => p._id === a.id);
            const jb = response.data.postings.find((p) => p._id === b.id);
            return new Date(jb.createdAt) - new Date(ja.createdAt);
          });
          setLatestJobs(active);
          setOldJobs(inactive);
        } else {
          setLatestJobs([]);
          setOldJobs([]);
        }
      } catch {
        setLatestJobs([]);
        setOldJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const openDetail = (job) => {
    navigate(`/job-postings/view/${job.id}`);
  };
  const openApply = () => setView("apply");
  const backToList = () => {
    setView("list");
    setSelectedJob(null);
  };
  const backToDetail = () => setView("detail");

  if (view === "apply" && selectedJob)
    return <ApplicationForm job={selectedJob} onBack={backToDetail} />;
  if (view === "detail" && selectedJob)
    return (
      <JobDetailPage
        job={selectedJob}
        onBack={backToList}
        onApply={openApply}
      />
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Segoe UI','Noto Sans',sans-serif",
      }}
      className="jobs-list-wrap"
    >
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            fontSize: 16,
            color: "#666",
          }}
        >
          Loading jobs...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 36 }}>
            <h2 className="jobs-list-heading">List Of Latest Vacancies</h2>
            <div style={{ borderBottom: `2px solid ${GREEN}` }} />
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <VacancyItem key={job.id} job={job} onClick={openDetail} />
              ))
            ) : (
              <div
                style={{
                  padding: "18px",
                  textAlign: "center",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                No active vacancies at the moment.
              </div>
            )}
          </div>
          <div>
            <h2 className="jobs-list-heading">List of Old Vacancies</h2>
            <div style={{ borderBottom: `2px solid ${GREEN}` }} />
            {oldJobs.length > 0 ? (
              oldJobs.map((job) => (
                <VacancyItem key={job.id} job={job} onClick={openDetail} />
              ))
            ) : (
              <div
                style={{
                  padding: "18px",
                  textAlign: "center",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                No old vacancies to display.
              </div>
            )}
          </div>
        </>
      )}
      <style>{jobsCSS}</style>
    </div>
  );
}
