// import { useState, useEffect } from "react";
// import { notificationsAPI } from "../utils/api.js";

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         setLoading(true);
//         const response = await notificationsAPI.getAll("true"); // Only fetch active notifications
//         if (response.success && response.data) {
//           setNotifications(response.data.notifications || []);
//         }
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//         setNotifications([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f5f5f5",
//         padding: "32px 20px",
//         fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
//       }}
//     >
//       <div style={{ maxWidth: 1000, margin: "0 auto" }}>
//         <h1
//           style={{
//             fontSize: 28,
//             fontWeight: 700,
//             color: "#1a2a4a",
//             marginBottom: 24,
//             textAlign: "center",
//           }}
//         >
//           Notifications
//         </h1>

//         {loading ? (
//           <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
//             Loading notifications...
//           </div>
//         ) : notifications.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               background: "#fff",
//               borderRadius: 8,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             }}
//           >
//             <p style={{ fontSize: 16, color: "#666" }}>No notifications available at the moment.</p>
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//             {notifications.map((notification) => (
//               <div
//                 key={notification._id}
//                 style={{
//                   background: "#fff",
//                   borderRadius: 8,
//                   padding: "20px",
//                   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                   borderLeft: "4px solid #3AB000",
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: 18,
//                     fontWeight: 700,
//                     color: "#1a2a4a",
//                     marginBottom: 8,
//                   }}
//                 >
//                   {notification.title}
//                 </h3>
//                 {notification.url && (
//                   <div style={{ marginBottom: 8 }}>
//                     <a
//                       href={notification.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       style={{
//                         fontSize: 14,
//                         color: "#1e40af",
//                         textDecoration: "underline",
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: 6,
//                       }}
//                     >
//                       🔗 {notification.url}
//                     </a>
//                   </div>
//                 )}
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 12,
//                     marginTop: 12,
//                     paddingTop: 12,
//                     borderTop: "1px solid #eee",
//                   }}
//                 >
//                   {notification.notificationDate && (
//                     <span
//                       style={{
//                         fontSize: 13,
//                         color: "#666",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                       }}
//                     >
//                       📅 {formatDate(notification.notificationDate)}
//                     </span>
//                   )}
//                   {notification.notificationTime && (
//                     <span
//                       style={{
//                         fontSize: 13,
//                         color: "#666",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 6,
//                       }}
//                     >
//                       🕐 {notification.notificationTime}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { notificationsAPI } from "../utils/api.js";

const GREEN = "#3AB000";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const dedupe = (items) => {
    const arr = Array.isArray(items) ? items : [];
    const seen = new Set();
    const out = [];
    for (const n of arr) {
      const key =
        n?._id ||
        `${n?.title || ""}__${n?.notificationDate || ""}__${n?.notificationTime || ""}__${n?.url || ""}`;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(n);
    }
    return out;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Fetch ALL notifications (active + inactive)
        const response = await notificationsAPI.getAll();
        if (response.success && response.data) {
          setNotifications(dedupe(response.data.notifications || []));
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const isNew = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
      }}
      className="notif-wrap"
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h2
          style={{
            fontWeight: 700,
            fontSize: 20,
            color: "#1a2a4a",
            marginBottom: 6,
          }}
          className="notif-heading"
        >
          Notifications / सूचनाएं
        </h2>
        <div style={{ borderBottom: `2px solid ${GREEN}`, marginBottom: 0 }} />

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#666",
              fontSize: 15,
            }}
          >
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#666",
              fontSize: 15,
            }}
          >
            No notifications available at the moment.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n._id}>
              <div
                className="notif-item"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f0fae8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  style={{
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2,
                    color: "#1a2a4a",
                  }}
                >
                  &gt;&gt;
                </span>
                <span style={{ lineHeight: 1.7, color: "#1a2a4a" }}>
                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1a2a4a",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                    >
                      {n.title}
                    </a>
                  ) : (
                    <span>{n.title}</span>
                  )}
                  {isNew(n.notificationDate) && (
                    <span
                      style={{
                        display: "inline-block",
                        background: "#e53e3e",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 900,
                        padding: "1px 6px",
                        borderRadius: 3,
                        marginLeft: 6,
                        verticalAlign: "middle",
                        letterSpacing: "0.05em",
                      }}
                    >
                      NEW
                    </span>
                  )}
                  {(n.notificationDate || n.notificationTime) && (
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 12,
                        color: "#888",
                        fontWeight: 400,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n.notificationDate &&
                        new Date(n.notificationDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      {n.notificationDate && n.notificationTime && " · "}
                      {n.notificationTime}
                    </span>
                  )}
                </span>
              </div>
              <div
                style={{ borderBottom: "1px dashed #aaa", margin: "0 8px" }}
              />
            </div>
          ))
        )}
      </div>

      <style>{`
        .notif-wrap { padding: 32px 100px; }
        .notif-heading { font-size: 20px; }
        .notif-item {
          padding: 14px 20px;
          font-size: 15px;
          cursor: default;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          transition: background 0.15s;
        }
        @media (max-width: 768px) {
          .notif-wrap { padding: 16px 10px !important; }
          .notif-heading { font-size: 14px; padding: 0 8px; }
          .notif-item { padding: 10px 8px; font-size: 11px; gap: 5px; }
          .notif-item span { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
