import { useState, useEffect } from "react";
import { notificationsAPI } from "../utils/api.js";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationsAPI.getAll("true"); // Only fetch active notifications
        if (response.success && response.data) {
          setNotifications(response.data.notifications || []);
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "32px 20px",
        fontFamily: "'Segoe UI', 'Noto Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1a2a4a",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Notifications
        </h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontSize: 16, color: "#666" }}>No notifications available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderLeft: "4px solid #3AB000",
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a2a4a",
                    marginBottom: 8,
                  }}
                >
                  {notification.title}
                </h3>
                {notification.url && (
                  <div style={{ marginBottom: 8 }}>
                    <a
                      href={notification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 14,
                        color: "#1e40af",
                        textDecoration: "underline",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      🔗 {notification.url}
                    </a>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #eee",
                  }}
                >
                  {notification.notificationDate && (
                    <span
                      style={{
                        fontSize: 13,
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      📅 {formatDate(notification.notificationDate)}
                    </span>
                  )}
                  {notification.notificationTime && (
                    <span
                      style={{
                        fontSize: 13,
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      🕐 {notification.notificationTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
