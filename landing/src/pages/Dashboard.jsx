// import { useState, useEffect } from "react";
// import myGovLogo from "../assets/jss1.png";
// import unicefLogo from "../assets/jss2.png";
// import nitiAayogLogo from "../assets/jss3.jpeg";
// import msmeLogo from "../assets/jss4.png";
// import logo from "../assets/img0.png";
// import swachhBharat from "../assets/Swachh.png";
// import appImg1 from "../assets/img2b.png";
// import appImg2 from "../assets/img1.png";
// import appImg3 from "../assets/img3a.png";
// import logo1 from "../assets/jss.png";
// import AboutPage from "../pages/Aboutpage";
// import MembershipPage from "../pages/Membershippage";
// import ServicesPage from "../pages/Servicespage";
// import JobsPage from "../pages/Jobspage";
// import NotificationsPage from "../pages/Notificationspage";
// import GalleryPage from "../pages/Gallerypage";
// import VerificationPage from "../pages/Verificationpage";
// import ContactsPage from "../pages/Contactspage";
// import { jobPostingsAPI, scrollerAPI, notificationsAPI } from "../utils/api.js";

// const GREEN = "#3AB000";
// const BLUE_TEXT = "#1a56c4";

// // Fallback slides if API fails
// const fallbackSlides = [
//   "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1100&q=80",
//   "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1100&q=80",
//   "https://images.unsplash.com/photo-1593491205049-7f032d28cf01?w=1100&q=80",
//   "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1100&q=80",
// ];

// const navLinks = [
//   { label: "HOME", page: "home" },
//   { label: "ABOUT US", page: "about" },
//   { label: "MEMBERSHIPS & BENIFITS", page: "membership" },
//   { label: "SERVICES", page: "services" },
//   { label: "JOBS & CARRIERS", page: "jobs" },
//   { label: "NOTIFICATIONS", page: "notifications" },
//   { label: "GALLERY", page: "gallery" },
//   { label: "Verification", page: "verification" },
//   { label: "CONTACTS", page: "contacts" },
// ];

// // No static data - all data will come from API

// function Logo({ size = 100 }) {
//   return (
//     <img
//       src={logo}
//       alt="JSS Abhiyan Logo"
//       style={{
//         width: size * 3,
//         height: "auto",
//         objectFit: "contain",
//         flexShrink: 0,
//       }}
//     />
//   );
// }

// function Marquee({ items }) {
//   // Check if items are objects (new format) or strings (old format)
//   const isObjectFormat = items.length > 0 && typeof items[0] === "object";

//   return (
//     <div
//       style={{
//         overflow: "hidden",
//         whiteSpace: "nowrap",
//         padding: "8px 0",
//         flex: 1,
//       }}
//     >
//       <div
//         className="marquee-inner"
//         style={{ display: "inline-flex", gap: 64 }}
//       >
//         {[...items, ...items].map((item, i) => {
//           // Handle old string format for backward compatibility
//           if (!isObjectFormat) {
//             return (
//               <a
//                 key={i}
//                 href="#"
//                 style={{
//                   color: "#1d4ed8",
//                   fontWeight: 600,
//                   fontSize: 12,
//                   flexShrink: 0,
//                   textDecoration: "none",
//                 }}
//                 onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
//                 onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
//               >
//                 {item}
//               </a>
//             );
//           }

//           // New object format: English on top, Hindi below
//           return (
//             <a
//               key={item.id || i}
//               href={item.link || "#"}
//               style={{
//                 color: "#1d4ed8",
//                 fontWeight: 600,
//                 fontSize: 12,
//                 flexShrink: 0,
//                 textDecoration: "none",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 4,
//                 whiteSpace: "nowrap",
//               }}
//               onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
//               onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
//             >
//               <span style={{ whiteSpace: "nowrap" }}>{item.english}</span>
//               {item.hindi && (
//                 <span style={{ whiteSpace: "nowrap", fontSize: 11, color: "#1d4ed8" }}>
//                   {item.hindi}
//                 </span>
//               )}
//             </a>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// const PersonIcon = ({ color = "#2e8b00" }) => (
//   <svg width="36" height="36" viewBox="0 0 46 46" fill={color}>
//     <circle cx="23" cy="14" r="9" />
//     <ellipse cx="23" cy="36" rx="14" ry="9" />
//   </svg>
// );

// const DoctorIcon = () => (
//   <svg width="36" height="36" viewBox="0 0 46 46" fill="#c0392b">
//     <circle cx="23" cy="11" r="8" />
//     <path d="M9 46 Q9 29 23 29 Q37 29 37 46Z" />
//     <circle
//       cx="31"
//       cy="39"
//       r="4"
//       fill="none"
//       stroke="#c0392b"
//       strokeWidth="2"
//     />
//     <path
//       d="M27 35 Q25 25 21 23"
//       fill="none"
//       stroke="#c0392b"
//       strokeWidth="2"
//     />
//   </svg>
// );

// const YogaIcon = () => (
//   <svg
//     width="36"
//     height="36"
//     viewBox="0 0 46 46"
//     fill="none"
//     stroke="#e67e22"
//     strokeWidth="2.2"
//     strokeLinecap="round"
//   >
//     <circle cx="23" cy="9" r="5" fill="#e67e22" stroke="none" />
//     <line x1="23" y1="14" x2="23" y2="27" />
//     <line x1="23" y1="19" x2="8" y2="25" />
//     <line x1="23" y1="19" x2="38" y2="25" />
//     <line x1="23" y1="27" x2="15" y2="38" />
//     <line x1="23" y1="27" x2="31" y2="38" />
//     <line x1="15" y1="38" x2="25" y2="33" />
//     <line x1="31" y1="38" x2="21" y2="33" />
//   </svg>
// );

// function CertSlider() {
//   const [current, setCurrent] = useState(0);
//   const certImages = [
//     "https://via.placeholder.com/400x200?text=Certificate+1",
//     "https://via.placeholder.com/400x200?text=Certificate+2",
//     "https://via.placeholder.com/400x200?text=Certificate+3",
//     "https://via.placeholder.com/400x200?text=Certificate+4",
//   ];
//   const total = certImages.length;
//   const visibleCount = 4;
//   const prev = () => setCurrent((c) => Math.max(0, c - 1));
//   const next = () => setCurrent((c) => Math.min(total - visibleCount, c + 1));
//   return (
//     <div
//       style={{
//         maxWidth: 1000,
//         margin: "0 auto 24px",
//         position: "relative",
//         padding: "0 36px",
//       }}
//     >
//       <div style={{ overflow: "hidden" }}>
//         <div
//           style={{
//             display: "flex",
//             gap: 12,
//             transform: `translateX(-${current * (100 / visibleCount)}%)`,
//             transition: "transform 0.4s ease",
//           }}
//         >
//           {certImages.map((src, i) => (
//             <div
//               key={i}
//               style={{
//                 flexShrink: 0,
//                 borderRadius: 8,
//                 overflow: "hidden",
//                 border: "1px solid #e5e7eb",
//                 background: "#fff",
//                 width: `calc(${100 / visibleCount}% - 9px)`,
//               }}
//             >
//               <img
//                 src={src}
//                 alt={`Cert ${i + 1}`}
//                 style={{ width: "100%", objectFit: "cover", height: 120 }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//       {current > 0 && (
//         <button
//           onClick={prev}
//           style={{
//             position: "absolute",
//             left: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             background: "#fff",
//             borderRadius: "50%",
//             border: "1px solid #e5e7eb",
//             width: 30,
//             height: 30,
//             fontSize: 18,
//             cursor: "pointer",
//           }}
//         >
//           ‹
//         </button>
//       )}
//       {current < total - visibleCount && (
//         <button
//           onClick={next}
//           style={{
//             position: "absolute",
//             right: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             background: "#fff",
//             borderRadius: "50%",
//             border: "1px solid #e5e7eb",
//             width: 30,
//             height: 30,
//             fontSize: 18,
//             cursor: "pointer",
//           }}
//         >
//           ›
//         </button>
//       )}
//     </div>
//   );
// }

// function HomePage({ onNavigate }) {
//   const [slide, setSlide] = useState(0);
//   const [slides, setSlides] = useState(fallbackSlides);
//   const [scrollerImages, setScrollerImages] = useState([]);
//   const [results, setResults] = useState([]);
//   const [vacancies, setVacancies] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [loadingVacancies, setLoadingVacancies] = useState(true);
//   const [loadingResults, setLoadingResults] = useState(true);

//   // Fetch scroller images from admin panel
//   useEffect(() => {
//     const fetchScrollerImages = async () => {
//       try {
//         const response = await scrollerAPI.getAll("true"); // Only fetch active images
//         if (response.success && response.data) {
//           // Backend returns { success: true, data: { scrollerImages: [...] } }
//           const activeImages = response.data.scrollerImages || [];
//           if (activeImages.length > 0) {
//             // Use images from admin panel
//             const imageUrls = activeImages.map((img) => img.imageUrl);
//             setSlides(imageUrls);
//             setScrollerImages(activeImages);
//             setSlide(0);
//           } else {
//             // Fallback to default slides if no active images
//             setSlides(fallbackSlides);
//           }
//         } else {
//           // Fallback if response format is unexpected
//           setSlides(fallbackSlides);
//         }
//       } catch (error) {
//         console.error("Failed to fetch scroller images:", error);
//         // Fallback to default slides on error
//         setSlides(fallbackSlides);
//       }
//     };

//     fetchScrollerImages();
//   }, []);

//   useEffect(() => {
//     if (slides.length > 0) {
//       const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4000);
//       return () => clearInterval(t);
//     }
//   }, [slides.length]);

//   // Fetch latest vacancies from API
//   useEffect(() => {
//     const fetchLatestVacancies = async () => {
//       try {
//         setLoadingVacancies(true);
//         const response = await jobPostingsAPI.getLatestVacancies();
//         if (response.success && response.data.vacancies) {
//           // Always update with API data, even if empty array
//           setVacancies(response.data.vacancies);
//         } else {
//           setVacancies([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch latest vacancies:", error);
//         setVacancies([]);
//       } finally {
//         setLoadingVacancies(false);
//       }
//     };

//     fetchLatestVacancies();

//     // Refresh vacancies every 30 seconds to get latest updates
//     const interval = setInterval(fetchLatestVacancies, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch latest results from API
//   useEffect(() => {
//     const fetchLatestResults = async () => {
//       try {
//         setLoadingResults(true);
//         const response = await jobPostingsAPI.getLatestResults();
//         if (response.success && response.data.results) {
//           // Always update with API data, even if empty array
//           setResults(response.data.results);
//         } else {
//           setResults([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch latest results:", error);
//         setResults([]);
//       } finally {
//         setLoadingResults(false);
//       }
//     };

//     fetchLatestResults();

//     // Refresh results every 30 seconds to get latest updates
//     const interval = setInterval(fetchLatestResults, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch notifications from admin panel
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await notificationsAPI.getAll("true"); // Only fetch active notifications
//         if (response.success && response.data) {
//           setNotifications(response.data.notifications || []);
//         }
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//         setNotifications([]);
//       }
//     };

//     fetchNotifications();
//     // Refresh notifications every 30 seconds
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       {/* ── Slider + Stats ── */}
//       <div style={{ display: "flex", minHeight: 260 }}>
//         <div
//           style={{
//             flex: "0 0 75%",
//             position: "relative",
//             overflow: "hidden",
//             maxHeight: 520,
//           }}
//         >
//           {slides.map((src, i) => {
//             const scrollerImage = scrollerImages[i];
//             const imageElement = (
//               <img
//                 key={i}
//                 src={src}
//                 alt={scrollerImage?.title || `slide ${i + 1}`}
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   opacity: i === slide ? 1 : 0,
//                   transition: "opacity 0.8s ease",
//                 }}
//               />
//             );

//             // If image has a link, wrap it in an anchor tag
//             if (scrollerImage?.link) {
//               return (
//                 <a
//                   key={i}
//                   href={scrollerImage.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     display: i === slide ? "block" : "none",
//                   }}
//                 >
//                   {imageElement}
//                 </a>
//               );
//             }

//             return (
//               <div
//                 key={i}
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   display: i === slide ? "block" : "none",
//                 }}
//               >
//                 {imageElement}
//               </div>
//             );
//           })}
//           <button
//             onClick={() =>
//               setSlide((s) => (s - 1 + slides.length) % slides.length)
//             }
//             style={{
//               position: "absolute",
//               left: 4,
//               top: "50%",
//               transform: "translateY(-50%)",
//               background: "rgba(255,255,255,0.6)",
//               border: "none",
//               borderRadius: "50%",
//               width: 26,
//               height: 26,
//               fontSize: 18,
//               cursor: "pointer",
//             }}
//           >
//             ‹
//           </button>
//           <button
//             onClick={() => setSlide((s) => (s + 1) % slides.length)}
//             style={{
//               position: "absolute",
//               right: 4,
//               top: "50%",
//               transform: "translateY(-50%)",
//               background: "rgba(255,255,255,0.6)",
//               border: "none",
//               borderRadius: "50%",
//               width: 26,
//               height: 26,
//               fontSize: 18,
//               cursor: "pointer",
//             }}
//           >
//             ›
//           </button>
//           <div
//             style={{
//               position: "absolute",
//               bottom: 6,
//               left: "50%",
//               transform: "translateX(-50%)",
//               display: "flex",
//               gap: 6,
//             }}
//           >
//             {slides.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setSlide(i)}
//                 style={{
//                   width: 8,
//                   height: 8,
//                   borderRadius: "50%",
//                   border: "none",
//                   cursor: "pointer",
//                   background: i === slide ? "#fff" : "rgba(255,255,255,0.45)",
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//         <div
//           style={{
//             flex: "0 0 25%",
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             borderLeft: "1px solid #eee",
//             background: "#fff",
//           }}
//         >
//           {[
//             {
//               icon: <PersonIcon color="#2e8b00" />,
//               num: "2265",
//               label: "Joined Us",
//             },
//             {
//               icon: <PersonIcon color="#1565c0" />,
//               num: "2185",
//               label: "Took Benifits",
//             },
//             { icon: <DoctorIcon />, num: "2265", label: "Medical Camps" },
//             { icon: <YogaIcon />, num: "2185", label: "Yoga Camps" },
//           ].map((s, i) => (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 2,
//                 padding: "8px 4px",
//                 borderBottom: i < 2 ? "1px solid #eee" : "none",
//                 borderRight: i % 2 === 0 ? "1px solid #eee" : "none",
//               }}
//             >
//               <span style={{ fontWeight: 900, fontSize: 13, color: "#1a1a1a" }}>
//                 {s.num}
//               </span>
//               {s.icon}
//               <span
//                 style={{
//                   fontSize: 9,
//                   color: "#666",
//                   fontWeight: 600,
//                   textAlign: "center",
//                   lineHeight: 1.2,
//                 }}
//               >
//                 {s.label}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Notifications */}
//       {notifications.length > 0 && (
//         <div
//           style={{
//             background: "#fff3cd",
//             borderTop: "2px solid #ffc107",
//             borderBottom: "2px solid #ffc107",
//             padding: "12px 16px",
//           }}
//         >
//           {notifications.map((notification, idx) => (
//             <div
//               key={notification._id || idx}
//               style={{
//                 marginBottom: idx < notifications.length - 1 ? "12px" : 0,
//                 paddingBottom: idx < notifications.length - 1 ? "12px" : 0,
//                 borderBottom:
//                   idx < notifications.length - 1 ? "1px solid #ffc107" : "none",
//               }}
//             >
//               {notification.url ? (
//                 <a
//                   href={notification.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{
//                     color: "#856404",
//                     textDecoration: "none",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 4,
//                   }}
//                 >
//                   <span style={{ fontWeight: 600, fontSize: 13 }}>
//                     {notification.title || ""}
//                   </span>
//                   {notification.url && (
//                     <span style={{ fontSize: 11, color: "#1e40af", marginTop: 2, textDecoration: "underline" }}>
//                       🔗 {notification.url.length > 50 ? `${notification.url.substring(0, 50)}...` : notification.url}
//                     </span>
//                   )}
//                   {notification.notificationDate && (
//                     <span style={{ fontSize: 11, color: "#856404", marginTop: 2 }}>
//                       {new Date(notification.notificationDate).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                       {notification.notificationTime && ` • ${notification.notificationTime}`}
//                     </span>
//                   )}
//                 </a>
//               ) : (
//                 <div
//                   style={{
//                     color: "#856404",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 4,
//                   }}
//                 >
//                   <span style={{ fontWeight: 600, fontSize: 13 }}>
//                     {notification.title || ""}
//                   </span>
//                   {notification.url && (
//                     <span style={{ fontSize: 11, color: "#1e40af", marginTop: 2, textDecoration: "underline" }}>
//                       🔗 {notification.url.length > 50 ? `${notification.url.substring(0, 50)}...` : notification.url}
//                     </span>
//                   )}
//                   {notification.notificationDate && (
//                     <span style={{ fontSize: 11, color: "#856404", marginTop: 2 }}>
//                       {new Date(notification.notificationDate).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                       {notification.notificationTime && ` • ${notification.notificationTime}`}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Vacancies Marquee */}
//       <div
//         style={{
//           display: "flex",
//           background: "#f0f0f0",
//           borderTop: "1px solid #ddd",
//           borderBottom: "1px solid #ddd",
//         }}
//       >
//         <div
//           style={{
//             minWidth: 70,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "10px 6px",
//             borderRight: "2px solid #ccc",
//             flexShrink: 0,
//           }}
//         >
//           <span
//             style={{
//               fontWeight: 900,
//               fontSize: 9,
//               color: "#333",
//               textAlign: "center",
//               lineHeight: 1.4,
//             }}
//           >
//             LATEST
//             <br />
//             VACANCIES
//           </span>
//         </div>
//         <Marquee items={vacancies.length > 0 ? vacancies : []} />
//       </div>

//       {/* Notice */}
//       <div style={{ padding: "16px 12px", background: "#fff" }}>
//         <p
//           style={{
//             fontSize: 11,
//             lineHeight: 1.8,
//             color: "#1a1a1a",
//             marginBottom: 12,
//           }}
//         >
//           <strong>NOTICE/सूचना:</strong> जिन अभ्यर्थियों का नाम जिला प्रबंधक पद
//           विज्ञापन सं: JSSA/REQ/01/2025/P–III तथा ब्लॉक सुपरवाइजर सह पंचायत
//           कार्यपालक विज्ञापन सं: JSSA/REQ/02/2025/P–III तथा पंचायत कार्यपालक
//           विज्ञापन सं: JSSA/REQ/03/2026/P–III के अंतर्गत प्रथम मेधा सूची में
//           जारी किया गया है वे अभ्यर्थी कृपया ऑनलाइन एमओयू और सहमति प्रपत्र अंतिम
//           तिथि 02/03/2026 से पहले भर लें।
//           <br />
//           <br />
//           Candidates whose name has been released in the first merit list —
//           please fill the online MoU and consent form before last date
//           02/03/2026.
//         </p>
//         <div
//           style={{
//             background: "#fee2e2",
//             border: "1px solid #fca5a5",
//             padding: "8px 12px",
//             borderRadius: 4,
//             fontSize: 11,
//             fontWeight: 700,
//             color: "#1a1a1a",
//             marginBottom: 12,
//           }}
//         >
//           IMPORTANT NOTICE:– जन स्वास्थ्य सहायता अभियान के कार्यक्रमों को जमीनी
//           स्तर पर शुरुवात करने हेतु आवश्यक अधिसूचना।
//         </div>
//         <div style={{ display: "flex", gap: 6 }}>
//           {[
//             "Online Test & Interview",
//             "Online Mou & Consent Form",
//             "Authorized Login",
//           ].map((btn, i) => (
//             <button
//               key={i}
//               style={{
//                 flex: 1,
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 700,
//                 padding: "8px 4px",
//                 borderRadius: 4,
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: 10,
//                 lineHeight: 1.3,
//               }}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* App Images */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-around",
//           gap: 8,
//           padding: "24px 12px",
//           background: "#fce8f0",
//         }}
//       >
//         {[appImg1, appImg2, appImg3].map((src, i) => (
//           <img
//             key={i}
//             src={src}
//             alt={`app${i + 1}`}
//             style={{ width: "31%", height: "auto", objectFit: "contain" }}
//           />
//         ))}
//       </div>

//       {/* Results Marquee */}
//       <div
//         style={{
//           display: "flex",
//           background: "#f4f4f4",
//           borderTop: "1px solid #ddd",
//           borderBottom: "1px solid #ddd",
//         }}
//       >
//         <div
//           style={{
//             minWidth: 70,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "10px 6px",
//             borderRight: "2px solid #ccc",
//             flexShrink: 0,
//           }}
//         >
//           <span
//             style={{
//               fontWeight: 700,
//               fontSize: 9,
//               color: "#333",
//               textAlign: "center",
//               lineHeight: 1.4,
//             }}
//           >
//             Latest
//             <br />
//             Results
//           </span>
//         </div>
//         <Marquee items={results.length > 0 ? results : []} />
//       </div>

//       {/* Legal Notice */}
//       <div
//         style={{
//           padding: "16px 12px",
//           background: "#f0fae8",
//           fontSize: 11,
//           color: "#555",
//           lineHeight: 1.7,
//           textAlign: "center",
//         }}
//       >
//         This project is organized Under social welfare organization 'NAC"
//         Registration No. : 053083 incorporated under [Pursuant to sub-section
//         (2) of section 7 and sub-section (1) of section 8 of the Companies Act,
//         2013].
//       </div>

//       {/* Public Notice */}
//       <div
//         style={{
//           padding: "20px 12px",
//           textAlign: "center",
//           background: "#fffde8",
//         }}
//       >
//         <div
//           style={{
//             display: "inline-block",
//             border: "2px solid #374151",
//             padding: "6px 16px",
//             fontWeight: 900,
//             fontSize: 13,
//             marginBottom: 14,
//           }}
//         >
//           सार्वजनिक सूचना / PUBLIC NOTICE:
//         </div>
//         <p
//           style={{
//             margin: "0 auto 10px",
//             fontSize: 11,
//             lineHeight: 1.8,
//             color: "#555",
//           }}
//         >
//           हमारे संस्था द्वारा सदस्यता शुल्क, जाद आवेदन शुल्क एवं एमओयू और सहमति
//           शुल्क के अलावा कोई अतिरिक्त शुल्क नहीं लिया जाता हैं।
//         </p>
//         <p
//           style={{
//             margin: "0 auto",
//             fontSize: 11,
//             lineHeight: 1.8,
//             color: "#555",
//           }}
//         >
//           No extra fee is charged by our organization other than membership fee,
//           job application fee and MOU and consent fee.
//         </p>
//       </div>

//       {/* Notification + Cards */}
//       <div
//         style={{
//           display: "flex",
//           gap: 10,
//           padding: "12px",
//           background: "#fff",
//         }}
//       >
//         <div
//           style={{
//             flex: "0 0 48%",
//             borderRadius: 8,
//             padding: 12,
//             background: GREEN,
//           }}
//         >
//           <h2
//             style={{
//               color: "#fff",
//               fontWeight: 900,
//               fontSize: 13,
//               marginBottom: 10,
//             }}
//           >
//             Notification
//           </h2>
//           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//             {notifications.length > 0 ? (
//               notifications.slice(0, 5).map((notification, i) => (
//                 <a
//                   key={notification._id || i}
//                   href={notification.url || "#"}
//                   target={notification.url ? "_blank" : undefined}
//                   rel={notification.url ? "noopener noreferrer" : undefined}
//                   style={{
//                     display: "block",
//                     background: "rgba(255,255,255,0.88)",
//                     color: "#1e40af",
//                     fontWeight: 600,
//                     fontSize: 9,
//                     padding: "8px 10px",
//                     borderRadius: 4,
//                     lineHeight: 1.5,
//                     textDecoration: "underline",
//                   }}
//                 >
//                   {notification.title}
//                   {notification.url && (
//                     <span style={{ display: "block", fontSize: 8, color: "#1e40af", marginTop: 2, textDecoration: "underline" }}>
//                       🔗 {notification.url.length > 40 ? `${notification.url.substring(0, 40)}...` : notification.url}
//                     </span>
//                   )}
//                   {notification.notificationDate && (
//                     <span style={{ display: "block", fontSize: 8, color: "#666", marginTop: 2 }}>
//                       {new Date(notification.notificationDate).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                       {notification.notificationTime && ` • ${notification.notificationTime}`}
//                     </span>
//                   )}
//                 </a>
//               ))
//             ) : (
//               <div
//                 style={{
//                   background: "rgba(255,255,255,0.88)",
//                   color: "#666",
//                   fontSize: 9,
//                   padding: "8px 10px",
//                   borderRadius: 4,
//                   textAlign: "center",
//                 }}
//               >
//                 No notifications available
//               </div>
//             )}
//           </div>
//         </div>
//         <div
//           style={{
//             flex: "0 0 48%",
//             display: "flex",
//             flexDirection: "column",
//             gap: 10,
//           }}
//         >
//           <div
//             style={{
//               border: "2px solid #4ade80",
//               borderRadius: 8,
//               padding: 10,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 marginBottom: 8,
//               }}
//             >
//               <Logo size={24} />
//               <div>
//                 <div style={{ fontWeight: 900, color: "#15803d", fontSize: 8 }}>
//                   JAN SWASTHYA SAHAYTA CARD
//                 </div>
//                 <div style={{ fontSize: 7, color: "#666" }}>
//                   A Project Of Healthcare Research & Development Board
//                 </div>
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
//               <img
//                 src="https://randomuser.me/api/portraits/men/32.jpg"
//                 alt="member"
//                 style={{
//                   width: 36,
//                   height: 44,
//                   objectFit: "cover",
//                   border: "1px solid #ddd",
//                   borderRadius: 2,
//                   flexShrink: 0,
//                 }}
//               />
//               <div style={{ fontSize: 8, color: "#333", lineHeight: 1.8 }}>
//                 <div>
//                   <strong>NAME</strong>: Rahul Rajwanshi
//                 </div>
//                 <div>
//                   <strong>S/O</strong>: Shri Chandrakant Kumar
//                 </div>
//                 <div>
//                   <strong>DOB</strong>: 15/07/1947
//                 </div>
//                 <div>
//                   <strong>GENDER</strong>: MALE
//                 </div>
//                 <div>
//                   <strong>CARD NO.</strong>: JSSA/43/01
//                 </div>
//               </div>
//               <div
//                 style={{
//                   marginLeft: "auto",
//                   width: 28,
//                   height: 28,
//                   background: "#e5e7eb",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 7,
//                   color: "#888",
//                   border: "1px solid #ccc",
//                   flexShrink: 0,
//                 }}
//               >
//                 QR
//               </div>
//             </div>
//             <div
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontSize: 7,
//                 textAlign: "center",
//                 padding: "4px 0",
//                 marginTop: 6,
//                 borderRadius: 3,
//               }}
//             >
//               website: www.jssabhiyan-nac.in | Email: support@jssabhiyan-nac.in
//             </div>
//           </div>
//           <div
//             style={{
//               border: "2px solid #4ade80",
//               borderRadius: 8,
//               padding: 10,
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 marginBottom: 6,
//               }}
//             >
//               <Logo size={24} />
//               <div>
//                 <div style={{ fontWeight: 900, color: "#15803d", fontSize: 8 }}>
//                   JAN SWASTHYA SAHAYTA CARD
//                 </div>
//                 <div
//                   style={{
//                     fontWeight: 700,
//                     fontSize: 7,
//                     color: "#333",
//                     marginTop: 2,
//                   }}
//                 >
//                   MEMBERSHIP'S BENIFITS/ सदस्यता का सुविधा
//                 </div>
//               </div>
//             </div>
//             <p
//               style={{ fontSize: 8, color: "#555", lineHeight: 1.6, margin: 0 }}
//             >
//               Benefits: Jan Swasthya sahayata card is provided to each member.
//               Through this card, you will get better treatment by special
//               doctor, medicines and medical examination in health camps.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* About */}
//       <div
//         style={{
//           borderTop: `4px solid ${GREEN}`,
//           borderBottom: `4px solid ${GREEN}`,
//           padding: "16px 12px",
//           background: "#fff",
//         }}
//       >
//         <div style={{ display: "flex", gap: 16 }}>
//           <div style={{ flex: "1 1 0" }}>
//             <h3
//               style={{
//                 fontWeight: 900,
//                 color: "#1a1a1a",
//                 marginBottom: 8,
//                 fontSize: 11,
//               }}
//             >
//               JAN SWASTHYA SAHAYATA ABHIYAN
//             </h3>
//             <p
//               style={{
//                 fontSize: 10,
//                 lineHeight: 1.7,
//                 color: "#555",
//                 marginBottom: 6,
//               }}
//             >
//               <strong>Introduction:</strong> Jan Swasthya Sahayata Abhiyan has
//               been formed by the Healthcare Research and Development Board to
//               provide affordable, free & better treatment.
//             </p>
//             <p style={{ fontSize: 10, lineHeight: 1.7, color: "#555" }}>
//               <strong>Purpose:</strong> To provide better treatment by special
//               doctors...{" "}
//               <button
//                 onClick={() => onNavigate("about")}
//                 style={{
//                   color: BLUE_TEXT,
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 0,
//                   fontSize: 10,
//                 }}
//               >
//                 read more
//               </button>
//             </p>
//           </div>
//           <div style={{ flex: "1 1 0" }}>
//             <h3
//               style={{
//                 fontWeight: 900,
//                 color: "#1a1a1a",
//                 marginBottom: 8,
//                 fontSize: 11,
//                 fontFamily: "serif",
//               }}
//             >
//               जन स्वास्थ्य सहायता अभियान
//             </h3>
//             <p
//               style={{
//                 fontSize: 10,
//                 lineHeight: 1.7,
//                 color: "#555",
//                 marginBottom: 6,
//               }}
//             >
//               <strong>परिचय:</strong> जन स्वास्थ्य सहायता अभियान का गठन
//               हेल्थकेयर रिसर्च एंड डेवलपमेंट बोर्ड द्वारा किया गया है।
//             </p>
//             <p style={{ fontSize: 10, lineHeight: 1.7, color: "#555" }}>
//               <strong>उद्देश्य:</strong> देश के गरीब और जरूरतमंद लोगों को बेहतर
//               उपचार प्रदान करना...{" "}
//               <button
//                 onClick={() => onNavigate("about")}
//                 style={{
//                   color: BLUE_TEXT,
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: 0,
//                   fontSize: 10,
//                 }}
//               >
//                 अधिक पढ़ें
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Cert Slider */}
//       <div style={{ padding: "24px 12px", background: "#f8f8f8" }}>
//         <CertSlider />
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: 8,
//             maxWidth: 1000,
//             margin: "0 auto",
//           }}
//         >
//           {["Enquiry", "Broucher", "Membership", "Services"].map((btn, i) => (
//             <button
//               key={i}
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 padding: "12px 4px",
//                 borderRadius: 4,
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: 12,
//               }}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Accreditations */}
//       <div
//         style={{
//           padding: "20px 12px",
//           textAlign: "center",
//           background: "#fff",
//           borderTop: "1px solid #eee",
//         }}
//       >
//         <p
//           style={{
//             fontSize: 9,
//             fontWeight: 700,
//             color: "#aaa",
//             letterSpacing: "0.1em",
//             textTransform: "uppercase",
//             marginBottom: 16,
//           }}
//         >
//           ACCREDITATIONS & FOLLOWS GUIDELINES
//         </p>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             gap: 20,
//             flexWrap: "wrap",
//           }}
//         >
//           {[myGovLogo, unicefLogo, nitiAayogLogo, msmeLogo].map((src, i) => (
//             <img
//               key={i}
//               src={src}
//               alt={`accreditation-${i}`}
//               style={{
//                 height: "60px",
//                 width: "auto",
//                 objectFit: "contain",
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default function JSSAbhiyan() {
//   const [activePage, setActivePage] = useState("home");
//   const navigate = (page) => {
//     setActivePage(page);
//     window.scrollTo(0, 0);
//   };

//   const renderPage = () => {
//     switch (activePage) {
//       case "about":
//         return <AboutPage onNavigate={navigate} />;
//       case "membership":
//         return <MembershipPage />;
//       case "services":
//         return <ServicesPage />;
//       case "jobs":
//         return <JobsPage />;
//       case "notifications":
//         return <NotificationsPage />;
//       case "gallery":
//         return <GalleryPage />;
//       case "verification":
//         return <VerificationPage />;
//       case "contacts":
//         return <ContactsPage />;
//       default:
//         return <HomePage onNavigate={navigate} />;
//     }
//   };

//   const socialLinks = [
//     {
//       bg: "#1877f2",
//       content: (
//         <span
//           style={{
//             fontWeight: 900,
//             fontSize: 16,
//             color: "#fff",
//             lineHeight: 1,
//           }}
//         >
//           f
//         </span>
//       ),
//     },
//     {
//       bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
//       content: (
//         <svg
//           viewBox="0 0 24 24"
//           width="16"
//           height="16"
//           fill="none"
//           stroke="white"
//           strokeWidth="2.2"
//         >
//           <rect x="2" y="2" width="20" height="20" rx="5" />
//           <circle cx="12" cy="12" r="5" />
//           <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
//         </svg>
//       ),
//     },
//     {
//       bg: "#ff0000",
//       content: (
//         <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
//           <polygon points="9.5,7 9.5,17 18,12" />
//         </svg>
//       ),
//     },
//     {
//       bg: "#0077b5",
//       content: (
//         <span style={{ fontWeight: 900, fontSize: 12, color: "#fff" }}>in</span>
//       ),
//     },
//   ];

//   const quickLinks = [
//     { label: "About Us", page: "about" },
//     { label: "MmeberShip & Benifits", page: "membership" },
//     { label: "View Jobs & Carrier", page: "jobs" },
//     { label: "View Our Services", page: "services" },
//     { label: "Our Privacy Policy", page: "home" },
//     { label: "Refund & Cancellation", page: "home" },
//     { label: "Terms & Condition", page: "home" },
//   ];

//   return (
//     <div
//       style={{
//         fontFamily: "'Segoe UI', sans-serif",
//         color: "#333",
//         background: "#fff",
//         overflowX: "hidden",
//       }}
//     >
//       {/* TOP BAR */}
//       <div
//         style={{
//           background: GREEN,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "7px 16px",
//           gap: 8,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 16,
//             flexShrink: 0,
//           }}
//         >
//           <span
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="white"
//               strokeWidth="2"
//             >
//               <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
//             </svg>
//             9471987611
//           </span>
//           <span
//             className="tb-email"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 600,
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="white"
//               strokeWidth="2"
//             >
//               <rect x="2" y="4" width="20" height="16" rx="2" />
//               <path d="M2 7l10 7 10-7" />
//             </svg>
//             support@jssabhiyan-nac.in
//           </span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <div
//             className="tb-search"
//             style={{
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <input
//               style={{
//                 borderRadius: 4,
//                 padding: "5px 28px 5px 10px",
//                 fontSize: 13,
//                 border: "1px solid #ddd",
//                 background: "#fff",
//                 color: "#333",
//                 width: 220,
//               }}
//               placeholder="Type and hit enter..."
//             />
//             <svg
//               style={{ position: "absolute", right: 8 }}
//               width="13"
//               height="13"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#999"
//               strokeWidth="2.5"
//             >
//               <circle cx="11" cy="11" r="8" />
//               <line x1="21" y1="21" x2="16.65" y2="16.65" />
//             </svg>
//           </div>
//           <button
//             style={{
//               background: "#e53e3e",
//               color: "#fff",
//               fontSize: 13,
//               fontWeight: 700,
//               padding: "6px 16px",
//               borderRadius: 4,
//               border: "none",
//               cursor: "pointer",
//               whiteSpace: "nowrap",
//             }}
//           >
//             Download Document
//           </button>
//         </div>
//       </div>

//       {/* HEADER DESKTOP */}
//       <div
//         className="hdr-desktop"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "12px 24px",
//           background: "#fff",
//           borderBottom: "1px solid #eee",
//         }}
//       >
//         <button
//           onClick={() => navigate("home")}
//           style={{
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             padding: 0,
//           }}
//         >
//           {/* ✅ DESKTOP LOGO - WIDTH BADHA DIYA: 90 → 130 */}
//           <img
//             src={logo}
//             alt="JSS Logo"
//             style={{ height: 130, width: "auto", objectFit: "contain" }}
//           />
//         </button>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//             gap: 10,
//           }}
//         >
//           <div style={{ display: "flex", gap: 10 }}>
//             <button
//               onClick={() => navigate("jobs")}
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 fontSize: 15,
//                 padding: "9px 36px",
//                 borderRadius: 4,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               RESULTS
//             </button>
//             <button
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 fontSize: 15,
//                 padding: "9px 36px",
//                 borderRadius: 4,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               BROUCHERS
//             </button>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//             <img
//               src={swachhBharat}
//               alt="Swachh Bharat"
//               style={{ height: 55, width: "auto", objectFit: "contain" }}
//             />
//             <div style={{ display: "flex", gap: 6 }}>
//               {socialLinks.map((s, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   style={{
//                     background: s.bg,
//                     borderRadius: 7,
//                     width: 34,
//                     height: 34,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     textDecoration: "none",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {s.content}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* HEADER MOBILE */}
//       <div
//         className="hdr-mobile"
//         style={{
//           display: "none",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "8px 10px",
//           background: "#fff",
//           borderBottom: "1px solid #eee",
//           gap: 8,
//         }}
//       >
//         <button
//           onClick={() => navigate("home")}
//           style={{
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             padding: 0,
//             flexShrink: 1,
//             minWidth: 0,
//           }}
//         >
//           {/* ✅ MOBILE LOGO - HEIGHT BADHA DIYA: 52 → 80 */}
//           <img
//             src={logo}
//             alt="JSS Logo"
//             style={{ height: 80, width: "auto", objectFit: "contain" }}
//           />
//         </button>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//             gap: 5,
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ display: "flex", gap: 5 }}>
//             <button
//               onClick={() => navigate("jobs")}
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 fontSize: 11,
//                 padding: "5px 12px",
//                 borderRadius: 3,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               RESULTS
//             </button>
//             <button
//               style={{
//                 background: GREEN,
//                 color: "#fff",
//                 fontWeight: 900,
//                 fontSize: 11,
//                 padding: "5px 12px",
//                 borderRadius: 3,
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               BROUCHERS
//             </button>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//             <img
//               src={swachhBharat}
//               alt="Swachh Bharat"
//               style={{ height: 28, width: "auto", objectFit: "contain" }}
//             />
//             <div style={{ display: "flex", gap: 4 }}>
//               {socialLinks.map((s, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   style={{
//                     background: s.bg,
//                     borderRadius: 5,
//                     width: 24,
//                     height: 24,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     textDecoration: "none",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <span style={{ transform: "scale(0.75)", display: "flex" }}>
//                     {s.content}
//                   </span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* NAVBAR */}
//       <nav
//         style={{
//           background: GREEN,
//           overflowX: "auto",
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         <ul
//           style={{
//             display: "flex",
//             margin: 0,
//             padding: 0,
//             listStyle: "none",
//             whiteSpace: "nowrap",
//             minWidth: "max-content",
//           }}
//         >
//           {navLinks.map((item, i) => (
//             <li key={i}>
//               <button
//                 onClick={() => navigate(item.page)}
//                 style={{
//                   display: "block",
//                   color: "#fff",
//                   fontWeight: 700,
//                   fontSize: 11,
//                   padding: "10px 12px",
//                   letterSpacing: "0.03em",
//                   background:
//                     activePage === item.page
//                       ? "rgba(0,0,0,0.25)"
//                       : "transparent",
//                   border: "none",
//                   borderRight: "1px solid rgba(255,255,255,0.2)",
//                   cursor: "pointer",
//                   whiteSpace: "nowrap",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.background = "rgba(0,0,0,0.2)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.background =
//                     activePage === item.page
//                       ? "rgba(0,0,0,0.25)"
//                       : "transparent")
//                 }
//               >
//                 {item.label}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {renderPage()}

//       {/* FOOTER */}
//       <footer
//         style={{ background: "#304865", color: "#fff", padding: "32px 16px 0" }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             gap: 12,
//             maxWidth: 1200,
//             margin: "0 auto",
//           }}
//         >
//           {/* LEFT: Quick Links */}
//           <div style={{ flex: "1 1 0", minWidth: 0 }}>
//             <h4
//               className="ft-heading"
//               style={{
//                 fontWeight: 900,
//                 marginBottom: 16,
//                 color: "#5ecfcf",
//                 letterSpacing: "0.06em",
//               }}
//             >
//               QUICK LINKS
//             </h4>
//             <ul
//               style={{
//                 listStyle: "none",
//                 padding: 0,
//                 margin: 0,
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//               className="ft-list"
//             >
//               {quickLinks.map((l, i) => (
//                 <li key={i}>
//                   <button
//                     onClick={() => navigate(l.page)}
//                     className="ft-link"
//                     style={{
//                       color: "#cbd5e0",
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       textAlign: "left",
//                       padding: "2px 0",
//                       display: "block",
//                       width: "100%",
//                     }}
//                     onMouseEnter={(e) => (e.target.style.color = "#fff")}
//                     onMouseLeave={(e) => (e.target.style.color = "#cbd5e0")}
//                   >
//                     {l.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* CENTER: Logo */}
//           <div
//             className="ft-logo-wrap"
//             style={{
//               flexShrink: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {/* ✅ FOOTER LOGO - CSS mein bhi badha diya */}
//             <img
//               src={logo1}
//               alt="JSS Logo"
//               className="ft-logo-img"
//               style={{ objectFit: "contain" }}
//             />
//           </div>

//           {/* RIGHT: Contact Info */}
//           <div
//             style={{
//               flex: "1 1 0",
//               minWidth: 0,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "flex-end",
//             }}
//           >
//             <h4
//               className="ft-heading"
//               style={{
//                 fontWeight: 900,
//                 marginBottom: 16,
//                 color: "#5ecfcf",
//                 letterSpacing: "0.06em",
//               }}
//             >
//               CONTACT INFO
//             </h4>
//             <div
//               className="ft-contact"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "flex-end",
//               }}
//             >
//               <div className="ft-contact-item">
//                 Helpline No. : +91-9471987611
//               </div>
//               <div className="ft-contact-item">
//                 Email : support@jssabhiyan-nac.in
//               </div>
//               <div className="ft-contact-item">
//                 Email : info@jssabhiyan-nac.in
//               </div>
//               <button
//                 onClick={() => navigate("contacts")}
//                 className="ft-contact-link"
//                 style={{
//                   color: "#5ecfcf",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   textAlign: "right",
//                   padding: 0,
//                   lineHeight: 1.6,
//                 }}
//               >
//                 To know our all office branch address
//                 <br />
//                 click here
//               </button>
//             </div>
//           </div>
//         </div>
//         <div
//           className="ft-copyright"
//           style={{
//             textAlign: "center",
//             color: "#94a3b8",
//             borderTop: "1px solid #4a5a6c",
//             fontWeight: 500,
//           }}
//         >
//           © 2021 JSS Abhiyan. All Rights Reserved. Trademark &amp; Brands are
//           property of their respective owner.
//         </div>
//       </footer>

//       <style>{`
//         @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
//         .marquee-inner { animation: marquee-scroll 30s linear infinite; }
//         .marquee-inner:hover { animation-play-state: paused; }
//         * { box-sizing: border-box; }
//         nav::-webkit-scrollbar { height: 3px; }
//         nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }

//         /* ── DESKTOP (>768px) ── */
//         .hdr-desktop     { display: flex !important; }
//         .hdr-mobile      { display: none !important; }
//         .tb-email        { display: flex !important; }
//         .tb-search       { display: flex !important; }
//         .ft-heading      { font-size: 15px; }
//         .ft-list         { gap: 14px; }
//         .ft-link         { font-size: 14px; font-weight: 500; }
//         .ft-logo-wrap    { padding: 0 40px; }
//         .ft-logo-img     { width: 280px; height: auto; }
//         .ft-contact      { gap: 14px; }
//         .ft-contact-item { font-size: 14px; font-weight: 500; color: #cbd5e0; }
//         .ft-contact-link { font-size: 14px; font-weight: 500; margin-top: 6px; }
//         .ft-copyright    { font-size: 12px; padding: 16px 0; margin-top: 40px; }

//         /* ── MOBILE (≤768px) ── */
//         @media (max-width: 768px) {
//           .hdr-desktop     { display: none !important; }
//           .hdr-mobile      { display: flex !important; }
//           .tb-email        { display: none !important; }
//           .tb-search       { display: none !important; }
//           .ft-heading      { font-size: 9px; margin-bottom: 8px !important; letter-spacing: 0.04em !important; }
//           .ft-list         { gap: 5px !important; }
//           .ft-link         { font-size: 8px !important; font-weight: 500 !important; }
//           .ft-logo-wrap    { padding: 0 6px !important; }
//           .ft-logo-img     { width: 100px !important; }
//           .ft-contact      { gap: 5px !important; }
//           .ft-contact-item { font-size: 8px !important; }
//           .ft-contact-link { font-size: 8px !important; margin-top: 3px !important; }
//           .ft-copyright    { font-size: 8px !important; padding: 10px 0 !important; margin-top: 16px !important; }
//           footer           { padding: 16px 8px 0 !important; }
//         }
//       `}</style>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import myGovLogo from "../assets/jss1.png";
import unicefLogo from "../assets/jss2.png";
import nitiAayogLogo from "../assets/jss3.jpeg";
import msmeLogo from "../assets/jss4.png";
import logo from "../assets/img0.png";
import swachhBharat from "../assets/Swachh.png";
import appImg1 from "../assets/img2b.png";
import appImg2 from "../assets/img1.png";
import appImg3 from "../assets/img3a.png";
import logo1 from "../assets/jss.png";
// ✅ Certificate images — assets se import
import cert1 from "../assets/cer1.jpeg";
import cert2 from "../assets/cer6.jpeg";
import cert3 from "../assets/cer7.jpeg";
import cert4 from "../assets/cer9.jpeg";
import AboutPage from "../pages/Aboutpage";
import MembershipPage from "../pages/Membershippage";
import ServicesPage from "../pages/Servicespage";
import JobsPage from "../pages/Jobspage";
import NotificationsPage from "../pages/Notificationspage";
import GalleryPage from "../pages/Gallerypage";
import VerificationPage from "../pages/Verificationpage";
import ContactsPage from "../pages/Contactspage";
import { jobPostingsAPI, scrollerAPI, notificationsAPI } from "../utils/api.js";

const GREEN = "#3AB000";
const BLUE_TEXT = "#1a56c4";

const fallbackSlides = [
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1100&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1100&q=80",
  "https://images.unsplash.com/photo-1593491205049-7f032d28cf01?w=1100&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1100&q=80",
];

const navLinks = [
  { label: "HOME", page: "home" },
  { label: "ABOUT US", page: "about" },
  { label: "MEMBERSHIPS & BENIFITS", page: "membership" },
  { label: "SERVICES", page: "services" },
  { label: "JOBS & CARRIERS", page: "jobs" },
  { label: "NOTIFICATIONS", page: "notifications" },
  { label: "GALLERY", page: "gallery" },
  { label: "Verification", page: "verification" },
  { label: "CONTACTS", page: "contacts" },
];

/* ─── Animated Counter ─── */
function CounterNumber({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  
  useEffect(() => {
    // Reset when target changes
    started.current = false;
    setCount(0);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const end = parseInt(target.replace(/\D/g, ""), 10) || 0;
          
          const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(eased * end);
            setCount(currentCount);
            
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          
          requestAnimationFrame(step);
        }
      },
      { 
        threshold: 0.1, // Trigger when 10% visible (earlier trigger)
        rootMargin: '0px 0px -50px 0px' // Trigger 50px before element enters viewport
      },
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [target, duration]);
  
  return <span ref={ref}>{count.toLocaleString("en-IN")}</span>;
}

/* ─── Mobile Horizontal Marquee ─── */
function Marquee({ items }) {
  const isObjectFormat = items.length > 0 && typeof items[0] === "object";
  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        padding: "8px 0",
        flex: 1,
      }}
    >
      <div
        className="marquee-inner"
        style={{ display: "inline-flex", gap: 64 }}
      >
        {[...items, ...items].map((item, i) => {
          if (!isObjectFormat) {
            return (
              <a
                key={i}
                href="#"
                style={{
                  color: "#1d4ed8",
                  fontWeight: 600,
                  fontSize: 13,
                  flexShrink: 0,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                {item}
              </a>
            );
          }
          return (
            <a
              key={item.id || i}
              href={item.link || "#"}
              style={{
                color: "#1d4ed8",
                fontWeight: 600,
                fontSize: 13,
                flexShrink: 0,
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              <span style={{ whiteSpace: "nowrap" }}>{item.english}</span>
              {item.hindi && (
                <span
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: 12,
                    color: "#1d4ed8",
                  }}
                >
                  {item.hindi}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Desktop Vertical Scrolling Marquee Band ─── */
function VerticalMarqueeBand({
  items,
  labelLine1,
  labelLine2,
  accentColor,
  labelBg,
  fadeBg,
}) {
  // Calculate dynamic height based on number of items
  const itemHeight = 90; // Approximate height per item
  const minHeight = 200;
  const calculatedHeight = Math.max(items.length * itemHeight, minHeight);
  
  // Double items for seamless loop animation
  const doubled = items.length > 0 ? [...items, ...items] : [];
  
  const renderItem = (item, i) => {
    const isObj = typeof item === "object";
    const english = isObj ? item.english : item;
    const hindi = isObj ? item.hindi : null;
    const link = isObj ? item.link || "#" : "#";
    const isNew = isObj ? !!item.isNew : false;
    return (
      <a
        key={`${item.id || item._id || i}-${Math.floor(i / items.length)}`}
        href={link}
        target={link !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: "14px 18px",
          textDecoration: "none",
          borderLeft: `4px solid ${accentColor}`,
          background: i % 2 === 0 ? "#fff" : "#f9f9fa",
          width: "auto",
          minWidth: "320px",
          maxWidth: "400px",
          flexShrink: 0,
          marginRight: "24px",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: accentColor,
            lineHeight: 1.4,
          }}
        >
          {english}
          {isNew && (
            <span
              style={{
                marginLeft: 6,
                background: "#e53e3e",
                color: "#fff",
                fontSize: 10,
                fontWeight: 900,
                padding: "1px 5px",
                borderRadius: 3,
                verticalAlign: "middle",
              }}
            >
              NEW
            </span>
          )}
        </span>
        {hindi && (
          <span
            style={{
              fontSize: 14,
              color: "#374151",
              fontWeight: 500,
              lineHeight: 1.35,
            }}
          >
            {hindi}
          </span>
        )}
        {link && link !== "#" && (
          <span
            style={{
              fontSize: 12,
              color: "#6b7280",
              textDecoration: "underline",
              lineHeight: 1.3,
            }}
          >
            🔗 {link.length > 55 ? link.substring(0, 55) + "…" : link}
          </span>
        )}
      </a>
    );
  };
  return (
    <div
      className="vband-desktop"
      style={{
        display: "flex",
        borderTop: `3px solid ${accentColor}`,
        borderBottom: "1px solid #ddd",
      }}
    >
      <div
        style={{
          minWidth: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 8px",
          borderRight: "2px solid rgba(255,255,255,0.3)",
          flexShrink: 0,
          background: labelBg,
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: 15,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
          }}
        >
          {labelLine1}
          <br />
          {labelLine2}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          height: calculatedHeight,
          overflow: "hidden",
          position: "relative",
          background: fadeBg,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 18,
            zIndex: 2,
            background: `linear-gradient(to right, ${fadeBg}, transparent)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 18,
            zIndex: 2,
            background: `linear-gradient(to left, ${fadeBg}, transparent)`,
            pointerEvents: "none",
          }}
        />
        {doubled.length > 0 ? (
          <div className="vmarquee-right-to-left">
            {doubled.map((item, i) => renderItem(item, i))}
          </div>
        ) : (
          <div
            style={{
              padding: "18px 16px",
              fontSize: 15,
              color: "#999",
              textAlign: "center",
            }}
          >
            No items available
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Mobile Horizontal Marquee Row ─── */
function MobileMarqueeRow({ items, labelTop, labelBottom, labelBg }) {
  return (
    <div
      className="vband-mobile"
      style={{
        display: "none",
        background: "#f0f0f0",
        borderTop: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div
        style={{
          minWidth: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 6px",
          borderRight: "2px solid #ccc",
          flexShrink: 0,
          background: labelBg,
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: 11,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {labelTop}
          <br />
          {labelBottom}
        </span>
      </div>
      <Marquee items={items.length > 0 ? items : []} />
    </div>
  );
}

/* ─── Desktop JSS Card ─── */
function JSSCard({ variant = "id" }) {
  const isId = variant === "id";
  return (
    <div
      style={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        minHeight: 400,
        flex: 1,
      }}
    >
      <div
        style={{
          background: "#1a7c00",
          padding: "12px 10px 10px",
          textAlign: "center",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: 44, width: "auto", objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            fontWeight: 900,
            color: "#fff",
            fontSize: 11,
            letterSpacing: "0.04em",
            lineHeight: 1.5,
          }}
        >
          JAN SWASTHYA SAHAYTA CARD
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#c8f0b8",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          A Project Of Healthcare Research &amp; Development Board
        </div>
        <div
          style={{
            fontSize: 8,
            color: "#a8e090",
            fontStyle: "italic",
            lineHeight: 1.3,
            marginTop: 1,
          }}
        >
          (HRDB is Division of social welfare organization "NAC India")
        </div>
        {!isId && (
          <div
            style={{
              marginTop: 5,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 3,
              padding: "2px 6px",
              display: "inline-block",
            }}
          >
            <span
              style={{
                fontWeight: 900,
                color: "#fff",
                fontSize: 9,
                letterSpacing: "0.04em",
              }}
            >
              MEMBERSHIP'S BENIFITS / सदस्यता का सुविधा
            </span>
          </div>
        )}
      </div>
      {isId ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0 5px",
              background: "#fff",
            }}
          >
            <div
              style={{
                border: "2px solid " + GREEN,
                borderRadius: 4,
                overflow: "hidden",
                width: 68,
                height: 84,
              }}
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="member"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div style={{ padding: "8px 14px 6px", flex: 1 }}>
            {[
              ["NAME", "Rahul Rajwanshi"],
              ["S/O", "Shri Chandrakant Kumar"],
              ["DOB", "15/07/1947"],
              ["GENDER", "MALE"],
              ["CARD NO.", "JSSA/43/01"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  fontSize: 10,
                  color: "#111",
                  lineHeight: 2.2,
                  borderBottom: "1px dotted #e5e7eb",
                }}
              >
                <span
                  style={{ fontWeight: 700, minWidth: 56, color: "#374151" }}
                >
                  {k}
                </span>
                <span style={{ color: "#555" }}>: {v}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "6px 0 8px",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "1px solid #ccc",
                borderRadius: 3,
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                {[
                  0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 25,
                  26, 28, 29, 30, 32, 33, 34,
                ].map((n, ii) => (
                  <rect
                    key={ii}
                    x={(n % 6) * 6}
                    y={Math.floor(n / 6) * 6}
                    width={5}
                    height={5}
                    fill="#222"
                  />
                ))}
              </svg>
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: "12px 14px", flex: 1 }}>
          <p
            style={{
              fontSize: 11,
              color: "#222",
              lineHeight: 1.85,
              margin: "0 0 10px",
            }}
          >
            <strong>Benefits:</strong> Jan Swasthya sahayata card is provided by
            the organization to each member. Through this card, you will get
            better treatment by special doctor, medicines and medical
            examination in health camps.
          </p>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "#e5e7eb",
              margin: "8px 0",
            }}
          />
          <p
            style={{ fontSize: 10, color: "#555", lineHeight: 1.8, margin: 0 }}
          >
            <strong>सुविधा:</strong> जन स्वास्थ्य सहायता अभियान के अंतर्गत जुड़े
            प्रत्येक सदस्य को संस्था द्वारा एक जन स्वास्थ्य सहायता कार्ड प्रदान
            किया जाता है।
          </p>
        </div>
      )}
      <div
        style={{
          position: "relative",
          height: 30,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 200 26"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <polygon points="0,0 70,0 42,26 0,26" fill="#FF9933" />
          <polygon points="55,0 130,0 102,26 27,26" fill="#fff" />
          <polygon points="115,0 188,0 160,26 87,26" fill="#3AB000" />
          <polygon points="173,0 200,0 200,26 145,26" fill="#FF9933" />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(220,100,0,0.80)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              color: "#fff",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            website: www.jssabhiyan-nac.in &nbsp;|&nbsp; Email:
            support@jssabhiyan-nac.in
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile JSS Card ─── */
function MobileJSSCard({ variant = "id" }) {
  const isId = variant === "id";
  return (
    <div
      style={{
        border: "2px solid #4ade80",
        borderRadius: 4,
        padding: 10,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: isId ? 8 : 6,
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: 60,
            height: "auto",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontWeight: 900, color: "#15803d", fontSize: 9 }}>
            JAN SWASTHYA SAHAYTA CARD
          </div>
          {isId ? (
            <div style={{ fontSize: 8, color: "#666" }}>
              A Project Of Healthcare Research &amp; Development Board
            </div>
          ) : (
            <div
              style={{
                fontWeight: 700,
                fontSize: 8,
                color: "#333",
                marginTop: 2,
              }}
            >
              MEMBERSHIP'S BENIFITS / सदस्यता का सुविधा
            </div>
          )}
        </div>
      </div>
      {isId ? (
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="member"
            style={{
              width: 36,
              height: 44,
              objectFit: "cover",
              border: "1px solid #ddd",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <div style={{ fontSize: 9, color: "#333", lineHeight: 1.8 }}>
            <div>
              <strong>NAME</strong>: Rahul Rajwanshi
            </div>
            <div>
              <strong>S/O</strong>: Shri Chandrakant Kumar
            </div>
            <div>
              <strong>DOB</strong>: 15/07/1947
            </div>
            <div>
              <strong>GENDER</strong>: MALE
            </div>
            <div>
              <strong>CARD NO.</strong>: JSSA/43/01
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 28,
              height: 28,
              background: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#888",
              border: "1px solid #ccc",
              flexShrink: 0,
            }}
          >
            QR
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 9, color: "#555", lineHeight: 1.6, margin: 0 }}>
          Benefits: Jan Swasthya sahayata card is provided to each member.
          Through this card, you will get better treatment by special doctor,
          medicines and medical examination in health camps.
        </p>
      )}
      <div
        style={{
          background: GREEN,
          color: "#fff",
          fontSize: 8,
          textAlign: "center",
          padding: "4px 0",
          marginTop: 6,
          borderRadius: 3,
        }}
      >
        website: www.jssabhiyan-nac.in | Email: support@jssabhiyan-nac.in
      </div>
    </div>
  );
}

/* ─── Cert Slider — assets se real images, mobile responsive ─── */
function CertSlider() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCurrent(0);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const certImages = [
    { src: cert1, alt: "Certificate 1" },
    { src: cert2, alt: "Certificate 2" },
    { src: cert3, alt: "Certificate 3" },
    { src: cert4, alt: "Certificate 4" },
  ];

  const total = certImages.length;
  const visibleCount = isMobile ? 1 : 4;
  const cardHeight = isMobile ? 260 : 220;
  const maxSlide = total - visibleCount;

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto 24px",
        position: "relative",
        padding: isMobile ? "0 44px" : "0 36px",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: isMobile ? 0 : 12,
            transform: `translateX(-${current * (100 / visibleCount)}%)`,
            transition: "transform 0.4s ease",
          }}
        >
          {certImages.map((img, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                borderRadius: 8,
                overflow: "hidden",
                border: "3px solid #3AB000",
                background: "#fff",
                width: `calc(${100 / visibleCount}% ${!isMobile ? "- 9px" : ""})`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: "100%",
                  objectFit: "contain",
                  height: cardHeight,
                  background: "#fff",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev button */}
      {current > 0 && (
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#fff",
            borderRadius: "50%",
            border: "2px solid #3AB000",
            width: isMobile ? 36 : 30,
            height: isMobile ? 36 : 30,
            fontSize: isMobile ? 22 : 18,
            cursor: "pointer",
            color: "#3AB000",
            fontWeight: 900,
          }}
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {current < maxSlide && (
        <button
          onClick={() => setCurrent((c) => Math.min(maxSlide, c + 1))}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#fff",
            borderRadius: "50%",
            border: "2px solid #3AB000",
            width: isMobile ? 36 : 30,
            height: isMobile ? 36 : 30,
            fontSize: isMobile ? 22 : 18,
            cursor: "pointer",
            color: "#3AB000",
            fontWeight: 900,
          }}
        >
          ›
        </button>
      )}

      {/* Dots — mobile only */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          {certImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: i === current ? "#3AB000" : "#ccc",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const PersonIcon = ({ color = "#2e8b00", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 46 46" fill={color}>
    <circle cx="23" cy="14" r="9" />
    <ellipse cx="23" cy="36" rx="14" ry="9" />
  </svg>
);
const DoctorIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 46 46" fill="#c0392b">
    <circle cx="23" cy="11" r="8" />
    <path d="M9 46 Q9 29 23 29 Q37 29 37 46Z" />
    <circle
      cx="31"
      cy="39"
      r="4"
      fill="none"
      stroke="#c0392b"
      strokeWidth="2"
    />
    <path
      d="M27 35 Q25 25 21 23"
      fill="none"
      stroke="#c0392b"
      strokeWidth="2"
    />
  </svg>
);
const YogaIcon = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 46 46"
    fill="none"
    stroke="#e67e22"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <circle cx="23" cy="9" r="5" fill="#e67e22" stroke="none" />
    <line x1="23" y1="14" x2="23" y2="27" />
    <line x1="23" y1="19" x2="8" y2="25" />
    <line x1="23" y1="19" x2="38" y2="25" />
    <line x1="23" y1="27" x2="15" y2="38" />
    <line x1="23" y1="27" x2="31" y2="38" />
    <line x1="15" y1="38" x2="25" y2="33" />
    <line x1="31" y1="38" x2="21" y2="33" />
  </svg>
);

function HomePage({ onNavigate }) {
  const [slide, setSlide] = useState(0);
  const [slides, setSlides] = useState(fallbackSlides);
  const [scrollerImages, setScrollerImages] = useState([]);
  const [results, setResults] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await scrollerAPI.getAll("true");
        if (res.success && res.data) {
          const imgs = res.data.scrollerImages || [];
          if (imgs.length > 0) {
            setSlides(imgs.map((i) => i.imageUrl));
            setScrollerImages(imgs);
            setSlide(0);
          } else setSlides(fallbackSlides);
        } else setSlides(fallbackSlides);
      } catch {
        setSlides(fallbackSlides);
      }
    };
    fetch_();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const t = setInterval(
        () => setSlide((s) => (s + 1) % slides.length),
        4000,
      );
      return () => clearInterval(t);
    }
  }, [slides.length]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingVacancies(true);
        const r = await jobPostingsAPI.getLatestVacancies();
        setVacancies(r.success && r.data.vacancies ? r.data.vacancies : []);
      } catch {
        setVacancies([]);
      } finally {
        setLoadingVacancies(false);
      }
    };
    fetch_();
    const iv = setInterval(fetch_, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingResults(true);
        const r = await jobPostingsAPI.getLatestResults();
        setResults(r.success && r.data.results ? r.data.results : []);
      } catch {
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    };
    fetch_();
    const iv = setInterval(fetch_, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const r = await notificationsAPI.getAll("true");
        setNotifications(r.success && r.data ? r.data.notifications || [] : []);
      } catch {
        setNotifications([]);
      }
    };
    fetch_();
    const iv = setInterval(fetch_, 30000);
    return () => clearInterval(iv);
  }, []);

  const statsData = [
    {
      icon: <PersonIcon color="#2e8b00" size={46} />,
      mobileIcon: <PersonIcon color="#2e8b00" size={32} />,
      num: "2265",
      label: "Joined Us",
    },
    {
      icon: <PersonIcon color="#1565c0" size={46} />,
      mobileIcon: <PersonIcon color="#1565c0" size={32} />,
      num: "2185",
      label: "Took Benifits",
    },
    {
      icon: <DoctorIcon size={46} />,
      mobileIcon: <DoctorIcon size={32} />,
      num: "2265",
      label: "Medical Camps",
    },
    {
      icon: <YogaIcon size={46} />,
      mobileIcon: <YogaIcon size={32} />,
      num: "2185",
      label: "Yoga Camps",
    },
  ];

  const notifCard = (n, i, isMobile) => (
    <a
      key={n._id || i}
      href={n.url || "#"}
      target={n.url ? "_blank" : undefined}
      rel={n.url ? "noopener noreferrer" : undefined}
      style={{
        display: "block",
        background: "rgba(255,255,255,0.88)",
        color: "#1e40af",
        fontWeight: 600,
        fontSize: isMobile ? 11 : 13,
        padding: isMobile ? "9px 11px" : "11px 14px",
        borderRadius: isMobile ? 4 : 5,
        lineHeight: 1.55,
        textDecoration: "underline",
      }}
    >
      {n.title}
      {n.url && (
        <span
          style={{
            display: "block",
            fontSize: isMobile ? 10 : 12,
            color: "#1e40af",
            marginTop: 2,
          }}
        >
          🔗 {n.url.length > 40 ? n.url.substring(0, 40) + "..." : n.url}
        </span>
      )}
      {n.notificationDate && (
        <span
          style={{
            display: "block",
            fontSize: isMobile ? 10 : 12,
            color: "#666",
            marginTop: 2,
          }}
        >
          {new Date(n.notificationDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {n.notificationTime && ` • ${n.notificationTime}`}
        </span>
      )}
    </a>
  );

  const seeMoreBtn = (isMobile) => (
    <button
      onClick={() => onNavigate("notifications")}
      style={{
        marginTop: isMobile ? 10 : 14,
        width: "100%",
        background: "#fff",
        color: GREEN,
        fontWeight: 800,
        fontSize: isMobile ? 13 : 15,
        padding: isMobile ? "9px 0" : "12px 0",
        borderRadius: isMobile ? 5 : 6,
        border: "2px solid #fff",
        cursor: "pointer",
        letterSpacing: "0.03em",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#e8ffe0")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
    >
      See More →
    </button>
  );

  return (
    <>
      {/* ── Slider + Stats ── */}
      <div className="slider-stats-wrap">
        {/* Slider */}
        <div className="slider-area">
          {slides.map((src, i) => {
            const si = scrollerImages[i];
            const imgEl = (
              <img
                key={i}
                src={src}
                alt={si?.title || `slide ${i + 1}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: i === slide ? 1 : 0,
                  transition: "opacity 0.8s ease",
                }}
              />
            );
            if (si?.link)
              return (
                <a
                  key={i}
                  href={si.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: i === slide ? "block" : "none",
                  }}
                >
                  {imgEl}
                </a>
              );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: i === slide ? "block" : "none",
                }}
              >
                {imgEl}
              </div>
            );
          })}
          <button
            onClick={() =>
              setSlide((s) => (s - 1 + slides.length) % slides.length)
            }
            style={{
              position: "absolute",
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.7)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ‹
          </button>
          <button
            onClick={() => setSlide((s) => (s + 1) % slides.length)}
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.7)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ›
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 8,
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: i === slide ? "#fff" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>
        </div>
        {/* Stats */}
        <div className="stats-area">
          {statsData.map((s, i) => (
            <div key={i} className="stat-cell">
              <span
                className="stat-num"
                style={{ fontWeight: 900, color: "#1a1a1a" }}
              >
                <CounterNumber target={s.num} />
              </span>
              <span className="stat-icon-desktop">{s.icon}</span>
              <span className="stat-icon-mobile" style={{ display: "none" }}>
                {s.mobileIcon}
              </span>
              <span
                className="stat-label"
                style={{
                  color: "#666",
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <VerticalMarqueeBand
        items={vacancies}
        labelLine1="LATEST"
        labelLine2="VACANCIES"
        accentColor="#1d4ed8"
        labelBg={GREEN}
        fadeBg="#f0f0f0"
      />
      <MobileMarqueeRow
        items={vacancies}
        labelTop="LATEST"
        labelBottom="VACANCIES"
        labelBg={GREEN}
      />

      <div style={{ padding: "20px 16px", background: "#fff" }}>
        <p
          className="body-text"
          style={{ lineHeight: 1.9, color: "#1a1a1a", marginBottom: 14 }}
        >
          <strong>NOTICE/सूचना:</strong> जिन अभ्यर्थियों का नाम जिला प्रबंधक पद
          विज्ञापन सं: JSSA/REQ/01/2025/P–III तथा ब्लॉक सुपरवाइजर सह पंचायत
          कार्यपालक विज्ञापन सं: JSSA/REQ/02/2025/P–III तथा पंचायत कार्यपालक
          विज्ञापन सं: JSSA/REQ/03/2026/P–III के अंतर्गत प्रथम मेधा सूची में
          जारी किया गया है वे अभ्यर्थी कृपया ऑनलाइन एमओयू और सहमति प्रपत्र अंतिम
          तिथि 02/03/2026 से पहले भर लें।
          <br />
          <br />
          Candidates whose name has been released in the first merit list —
          please fill the online MoU and consent form before last date
          02/03/2026.
        </p>
        <div
          className="body-text"
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            padding: "10px 14px",
            borderRadius: 4,
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 14,
          }}
        >
          IMPORTANT NOTICE:– जन स्वास्थ्य सहायता अभियान के कार्यक्रमों को जमीनी
          स्तर पर शुरुवात करने हेतु आवश्यक अधिसूचना।
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            "Online Test & Interview",
            "Online Mou & Consent Form",
            "Authorized Login",
          ].map((btn, i) => (
            <button
              key={i}
              className="action-btn"
              style={{
                flex: 1,
                background: GREEN,
                color: "#fff",
                fontWeight: 700,
                padding: "10px 6px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                lineHeight: 1.3,
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          gap: 8,
          padding: "24px 12px",
          background: "#fce8f0",
        }}
      >
        {[appImg1, appImg2, appImg3].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`app${i + 1}`}
            style={{ width: "31%", height: "auto", objectFit: "contain" }}
          />
        ))}
      </div>

      <VerticalMarqueeBand
        items={results}
        labelLine1="Latest"
        labelLine2="Results"
        accentColor="#1d4ed8"
        labelBg="#1d4ed8"
        fadeBg="#f4f4f4"
      />
      <MobileMarqueeRow
        items={results}
        labelTop="Latest"
        labelBottom="Results"
        labelBg="#1d4ed8"
      />

      <div
        className="body-text"
        style={{
          padding: "18px 16px",
          background: "#f0fae8",
          color: "#555",
          lineHeight: 1.8,
          textAlign: "center",
        }}
      >
        This project is organized Under social welfare organization 'NAC"
        Registration No. : 053083 incorporated under [Pursuant to sub-section
        (2) of section 7 and sub-section (1) of section 8 of the Companies Act,
        2013].
      </div>

      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          background: "#fffde8",
        }}
      >
        <div
          className="pub-notice-title"
          style={{
            display: "inline-block",
            border: "2px solid #374151",
            padding: "8px 20px",
            fontWeight: 900,
            marginBottom: 16,
          }}
        >
          सार्वजनिक सूचना / PUBLIC NOTICE:
        </div>
        <p
          className="body-text"
          style={{ margin: "0 auto 12px", lineHeight: 1.9, color: "#555" }}
        >
          हमारे संस्था द्वारा सदस्यता शुल्क, जाद आवेदन शुल्क एवं एमओयू और सहमति
          शुल्क के अलावा कोई अतिरिक्त शुल्क नहीं लिया जाता हैं।
        </p>
        <p
          className="body-text"
          style={{ margin: "0 auto", lineHeight: 1.9, color: "#555" }}
        >
          No extra fee is charged by our organization other than membership fee,
          job application fee and MOU and consent fee.
        </p>
      </div>

      <div
        className="notif-cards-desktop"
        style={{
          display: "flex",
          gap: 14,
          padding: "16px",
          background: "#fff",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "0 0 48%",
            borderRadius: 10,
            padding: 16,
            background: GREEN,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 18,
              marginBottom: 14,
            }}
          >
            Notification
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((n, i) => notifCard(n, i, false))
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.88)",
                  color: "#666",
                  fontSize: 13,
                  padding: "10px 12px",
                  borderRadius: 5,
                  textAlign: "center",
                }}
              >
                No notifications available
              </div>
            )}
          </div>
          {seeMoreBtn(false)}
        </div>
        <div style={{ flex: "0 0 48%", display: "flex", gap: 10 }}>
          <JSSCard variant="id" />
          <JSSCard variant="benefits" />
        </div>
      </div>

      <div
        className="notif-cards-mobile"
        style={{
          display: "none",
          flexDirection: "column",
          gap: 12,
          padding: "14px",
          background: "#fff",
        }}
      >
        <div style={{ borderRadius: 8, padding: 14, background: GREEN }}>
          <h2
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 15,
              marginBottom: 12,
            }}
          >
            Notification
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((n, i) => notifCard(n, i, true))
            ) : (
              <div
                style={{
                  background: "rgba(255,255,255,0.88)",
                  color: "#666",
                  fontSize: 11,
                  padding: "8px 10px",
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                No notifications available
              </div>
            )}
          </div>
          {seeMoreBtn(true)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MobileJSSCard variant="id" />
          <MobileJSSCard variant="benefits" />
        </div>
      </div>

      <div
        style={{
          borderTop: `4px solid ${GREEN}`,
          borderBottom: `4px solid ${GREEN}`,
          padding: "20px 16px",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: "1 1 0" }}>
            <h3
              className="section-heading"
              style={{ fontWeight: 900, color: "#1a1a1a", marginBottom: 10 }}
            >
              JAN SWASTHYA SAHAYATA ABHIYAN
            </h3>
            <p
              className="body-text"
              style={{ lineHeight: 1.8, color: "#555", marginBottom: 8 }}
            >
              <strong>Introduction:</strong> Jan Swasthya Sahayata Abhiyan has
              been formed by the Healthcare Research and Development Board to
              provide affordable, free &amp; better treatment.
            </p>
            <p className="body-text" style={{ lineHeight: 1.8, color: "#555" }}>
              <strong>Purpose:</strong> To provide better treatment by special
              doctors...{" "}
              <button
                onClick={() => onNavigate("about")}
                className="body-text"
                style={{
                  color: BLUE_TEXT,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                read more
              </button>
            </p>
          </div>
          <div style={{ flex: "1 1 0" }}>
            <h3
              className="section-heading"
              style={{
                fontWeight: 900,
                color: "#1a1a1a",
                marginBottom: 10,
                fontFamily: "serif",
              }}
            >
              जन स्वास्थ्य सहायता अभियान
            </h3>
            <p
              className="body-text"
              style={{ lineHeight: 1.8, color: "#555", marginBottom: 8 }}
            >
              <strong>परिचय:</strong> जन स्वास्थ्य सहायता अभियान का गठन
              हेल्थकेयर रिसर्च एंड डेवलपमेंट बोर्ड द्वारा किया गया है।
            </p>
            <p className="body-text" style={{ lineHeight: 1.8, color: "#555" }}>
              <strong>उद्देश्य:</strong> देश के गरीब और जरूरतमंद लोगों को बेहतर
              उपचार प्रदान करना...{" "}
              <button
                onClick={() => onNavigate("about")}
                className="body-text"
                style={{
                  color: BLUE_TEXT,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                अधिक पढ़ें
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ── Cert Slider Section ── */}
      <div style={{ padding: "28px 16px", background: "#f8f8f8" }}>
        <CertSlider />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            maxWidth: 1000,
            margin: "0 auto",
          }}
          className="cert-btn-grid"
        >
          {["Enquiry", "Broucher", "Membership", "Services"].map((btn, i) => (
            <button
              key={i}
              className="cert-btn"
              style={{
                background: GREEN,
                color: "#fff",
                fontWeight: 900,
                padding: "14px 4px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          background: "#fff",
          borderTop: "1px solid #eee",
        }}
      >
        <p
          className="accred-label"
          style={{
            fontWeight: 700,
            color: "#aaa",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          ACCREDITATIONS &amp; FOLLOWS GUIDELINES
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {[myGovLogo, unicefLogo, nitiAayogLogo, msmeLogo].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`accreditation-${i}`}
              className="accred-logo"
              style={{ width: "auto", objectFit: "contain" }}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div
        className="floating-phone-btn"
        style={{
          position: "fixed",
          left: 20,
          bottom: 20,
          zIndex: 1000,
        }}
      >
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
            boxShadow: "0 4px 12px rgba(58, 176, 0, 0.4)",
            textDecoration: "none",
            transition: "all 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 16px rgba(58, 176, 0, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 12px rgba(58, 176, 0, 0.4)";
          }}
          title="Call Us / हमें कॉल करें"
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

      <div
        className="floating-whatsapp-btn"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 1000,
        }}
      >
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
            boxShadow: "0 4px 12px rgba(37, 211, 102, 0.4)",
            textDecoration: "none",
            transition: "all 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 16px rgba(37, 211, 102, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.4)";
          }}
          title="WhatsApp Us / व्हाट्सएप करें"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .floating-phone-btn,
          .floating-whatsapp-btn {
            left: 15px !important;
            right: 15px !important;
            bottom: 15px !important;
          }
          .floating-phone-btn a,
          .floating-whatsapp-btn a {
            width: 55px !important;
            height: 55px !important;
          }
          .floating-phone-btn svg {
            width: 24px !important;
            height: 24px !important;
          }
          .floating-whatsapp-btn svg {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </>
  );
}

export default function JSSAbhiyan() {
  const [activePage, setActivePage] = useState("home");
  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (activePage) {
      case "about":
        return <AboutPage onNavigate={navigate} />;
      case "membership":
        return <MembershipPage />;
      case "services":
        return <ServicesPage />;
      case "jobs":
        return <JobsPage />;
      case "notifications":
        return <NotificationsPage />;
      case "gallery":
        return <GalleryPage />;
      case "verification":
        return <VerificationPage />;
      case "contacts":
        return <ContactsPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const socialLinks = [
    {
      bg: "#1877f2",
      content: (
        <span
          style={{
            fontWeight: 900,
            fontSize: 16,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          f
        </span>
      ),
    },
    {
      bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
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
      content: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <polygon points="9.5,7 9.5,17 18,12" />
        </svg>
      ),
    },
    {
      bg: "#0077b5",
      content: (
        <span style={{ fontWeight: 900, fontSize: 12, color: "#fff" }}>in</span>
      ),
    },
  ];

  const quickLinks = [
    { label: "About Us", page: "about" },
    { label: "MmeberShip & Benifits", page: "membership" },
    { label: "View Jobs & Carrier", page: "jobs" },
    { label: "View Our Services", page: "services" },
    { label: "Our Privacy Policy", page: "home" },
    { label: "Refund & Cancellation", page: "home" },
    { label: "Terms & Condition", page: "home" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        color: "#333",
        background: "#fff",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          background: GREEN,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 18px",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <svg
              width="15"
              height="15"
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
              gap: 6,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
            support@jssabhiyan-nac.in
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                padding: "6px 30px 6px 12px",
                fontSize: 14,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#333",
                width: 240,
              }}
              placeholder="Type and hit enter..."
            />
            <svg
              style={{ position: "absolute", right: 9 }}
              width="14"
              height="14"
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
            style={{
              background: "#e53e3e",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              padding: "7px 18px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
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
          onClick={() => navigate("home")}
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
            <button
              onClick={() => navigate("jobs")}
              style={{
                background: GREEN,
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                padding: "10px 40px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
            >
              RESULTS
            </button>
            <button
              style={{
                background: GREEN,
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                padding: "10px 40px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
              }}
            >
              BROUCHERS
            </button>
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
                  href="#"
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
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          background: "#fff",
          borderBottom: "1px solid #eee",
          gap: 8,
        }}
      >
        <button
          onClick={() => navigate("home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          <img
            src={logo}
            alt="JSS Logo"
            style={{ height: 80, width: "auto", objectFit: "contain" }}
          />
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => navigate("jobs")}
              style={{
                background: GREEN,
                color: "#fff",
                fontWeight: 900,
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 3,
                border: "none",
                cursor: "pointer",
              }}
            >
              RESULTS
            </button>
            <button
              style={{
                background: GREEN,
                color: "#fff",
                fontWeight: 900,
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 3,
                border: "none",
                cursor: "pointer",
              }}
            >
              BROUCHERS
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <img
              src={swachhBharat}
              alt="Swachh Bharat"
              style={{ height: 30, width: "auto", objectFit: "contain" }}
            />
            <div style={{ display: "flex", gap: 4 }}>
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    background: s.bg,
                    borderRadius: 5,
                    width: 26,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ transform: "scale(0.8)", display: "flex" }}>
                    {s.content}
                  </span>
                </a>
              ))}
            </div>
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
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  background:
                    activePage === item.page
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
                    activePage === item.page
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

      {renderPage()}

      <footer
        style={{ background: "#304865", color: "#fff", padding: "36px 18px 0" }}
      >
        <div
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
                Email : support@jssabhiyan-nac.in
              </div>
              <div className="ft-contact-item">
                Email : info@jssabhiyan-nac.in
              </div>
              <button
                onClick={() => navigate("contacts")}
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
          }}
        >
          © 2021 JSS Abhiyan. All Rights Reserved. Trademark &amp; Brands are
          property of their respective owner.
        </div>
      </footer>

      <style>{`
        @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-inner            { animation: marquee-scroll 30s linear infinite; }
        .marquee-inner:hover      { animation-play-state: paused; }
        @keyframes vscroll        { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        .vmarquee-col             { display:flex; flex-direction:column; animation:vscroll 22s linear infinite; }
        .vmarquee-col:hover       { animation-play-state:paused; }
        @keyframes hscroll        { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .vmarquee-horizontal      { display:flex; flex-direction:row; align-items:flex-end; animation:hscroll 30s linear infinite; }
        .vmarquee-horizontal:hover { animation-play-state:paused; }
        @keyframes hscroll-parallel { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .vmarquee-horizontal-parallel { display:flex; flex-direction:row; align-items:flex-end; animation:hscroll-parallel 40s linear infinite; }
        .vmarquee-horizontal-parallel:hover { animation-play-state:paused; }
        @keyframes right-to-left { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .vmarquee-right-to-left { display:flex; flex-direction:row; align-items:flex-end; animation:right-to-left 35s linear infinite; }
        .vmarquee-right-to-left:hover { animation-play-state:paused; }
        .vmarquee-parallel        { display:flex; flex-direction:column; }
        .vmarquee-parallel-list   { display:flex; flex-direction:column; width:100%; }
        * { box-sizing:border-box; }
        nav::-webkit-scrollbar       { height:3px; }
        nav::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.3); border-radius:2px; }
        .hdr-desktop          { display:flex !important; }
        .hdr-mobile           { display:none !important; }
        .tb-email             { display:flex !important; }
        .tb-search            { display:flex !important; }

        /* ── Slider + Stats — Desktop ── */
        .slider-stats-wrap    { display:flex; min-height:420px; }
        .slider-area          { flex:0 0 75%; position:relative; overflow:hidden; max-height:680px; }
        .stats-area           { flex:0 0 25%; display:grid; grid-template-columns:1fr 1fr; border-left:1px solid #eee; background:#fff; }
        .stat-cell            { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; padding:10px 4px; border-bottom:1px solid #eee; border-right:1px solid #eee; }
        .stat-cell:nth-child(2), .stat-cell:nth-child(4) { border-right:none; }
        .stat-cell:nth-child(3), .stat-cell:nth-child(4) { border-bottom:none; }
        .nav-list             { width:100%; }
        .nav-item             { flex:1; }
        .nav-btn              { width:100%; font-size:14px; padding:14px 4px; }
        .vband-desktop        { display:flex !important; }
        .vband-mobile         { display:none !important; }
        .notif-cards-desktop  { display:flex !important; }
        .notif-cards-mobile   { display:none !important; }
        .stat-num             { font-size:22px; }
        .stat-icon-desktop    { display:block; }
        .stat-icon-mobile     { display:none !important; }
        .stat-label           { font-size:13px; }
        .body-text            { font-size:15px; }
        .action-btn           { font-size:13px; }
        .pub-notice-title     { font-size:16px; }
        .section-heading      { font-size:15px; }
        .cert-btn             { font-size:15px; }
        .accred-label         { font-size:11px; }
        .accred-logo          { height:68px; }
        .notif-banner-title   { font-size:16px; }
        .notif-banner-url     { font-size:14px; }
        .notif-banner-date    { font-size:13px; }
        .ft-heading           { font-size:17px; }
        .ft-list              { gap:16px; }
        .ft-link              { font-size:15px; font-weight:500; }
        .ft-logo-wrap         { padding:0 40px; }
        .ft-logo-img          { width:280px; height:auto; }
        .ft-contact           { gap:16px; }
        .ft-contact-item      { font-size:15px; font-weight:500; color:#cbd5e0; }
        .ft-contact-link      { font-size:15px; font-weight:500; margin-top:8px; }
        .ft-copyright         { font-size:13px; padding:18px 0; margin-top:44px; }
        @media (max-width: 768px) {
          .hdr-desktop          { display:none !important; }
          .hdr-mobile           { display:flex !important; }
          .tb-email             { display:none !important; }
          .tb-search            { display:none !important; }

          /* ── Slider + Stats — Mobile: stack vertically ── */
          .slider-stats-wrap    { flex-direction:column !important; min-height:unset !important; }
          .slider-area          { flex:none !important; width:100% !important; height:220px !important; max-height:220px !important; }
          .stats-area           { flex:none !important; width:100% !important; grid-template-columns:repeat(4,1fr) !important; border-left:none !important; border-top:1px solid #eee; }
          .stat-cell            { padding:10px 4px !important; border-bottom:none !important; border-right:1px solid #eee !important; }
          .stat-cell:last-child { border-right:none !important; }
          .nav-list             { width:auto !important; min-width:max-content !important; }
          .nav-item             { flex:none !important; }
          .nav-btn              { font-size:12px !important; padding:11px 14px !important; }
          .vband-desktop        { display:none !important; }
          .vband-mobile         { display:flex !important; }
          .notif-cards-desktop  { display:none !important; }
          .notif-cards-mobile   { display:flex !important; }
          .stat-num             { font-size:15px; }
          .stat-icon-desktop    { display:none !important; }
          .stat-icon-mobile     { display:block !important; }
          .stat-label           { font-size:10px; }
          .body-text            { font-size:13px; }
          .action-btn           { font-size:12px; }
          .pub-notice-title     { font-size:15px; }
          .section-heading      { font-size:13px; }
          .cert-btn             { font-size:13px; }
          .accred-label         { font-size:10px; }
          .accred-logo          { height:44px; }
          .notif-banner-title   { font-size:14px; }
          .notif-banner-url     { font-size:12px; }
          .notif-banner-date    { font-size:12px; }
          .ft-heading           { font-size:11px; margin-bottom:10px !important; letter-spacing:0.04em !important; }
          .ft-list              { gap:7px !important; }
          .ft-link              { font-size:10px !important; font-weight:500 !important; }
          .ft-logo-wrap         { padding:0 6px !important; }
          .ft-logo-img          { width:100px !important; }
          .ft-contact           { gap:7px !important; }
          .ft-contact-item      { font-size:10px !important; }
          .ft-contact-link      { font-size:10px !important; margin-top:4px !important; }
          .ft-copyright         { font-size:9px !important; padding:10px 0 !important; margin-top:18px !important; }
          footer                { padding:18px 10px 0 !important; }
          .cert-btn-grid        { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
