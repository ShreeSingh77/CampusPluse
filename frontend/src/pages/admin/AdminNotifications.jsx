import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./AdminNotifications.css";

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");

      if (response.data.success) {
        setNotifications(
          response.data.notifications || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch admin notifications error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await api.patch(
        `/notifications/${notification._id}/read`
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark notification as read"
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllAsRead = async () => {
    const unreadExists = notifications.some(
      (notification) => !notification.isRead
    );

    if (!unreadExists) {
      toast("All notifications are already read");
      return;
    }

    try {
      setMarkingAll(true);

      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success(
        "All notifications marked as read"
      );
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark notifications as read"
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );

      toast.success("Notification deleted");
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete notification"
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ==========================================
  // NOTIFICATION ICON
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "complaint_escalated":
        return "🚨";

      case "complaint_assigned":
        return "📋";

      case "complaint_status_updated":
        return "🔄";

      case "general":
      default:
        return "🔔";
    }
  };

  // ==========================================
  // NOTIFICATION LABEL
  // ==========================================

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "complaint_escalated":
        return "Escalation";

      case "complaint_assigned":
        return "Assignment";

      case "complaint_status_updated":
        return "Status Update";

      case "general":
      default:
        return "General";
    }
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const escalatedCount = notifications.filter(
    (notification) =>
      notification.type === "complaint_escalated"
  ).length;

  const complaintAlertCount = notifications.filter(
    (notification) =>
      notification.type === "complaint_assigned" ||
      notification.type ===
        "complaint_status_updated"
  ).length;

  return (
    <div className="admin-notifications-page">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="admin-navbar">

        <div className="admin-navbar-brand">
          CampusPulse
        </div>

        <div className="admin-navbar-actions">

          <button
            className="admin-nav-btn"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className="admin-nav-btn"
            onClick={() =>
              navigate("/admin/complaints")
            }
          >
            Complaints
          </button>

          <button
            className="admin-nav-btn active"
            onClick={() =>
              navigate("/admin/notifications")
            }
          >
            Notifications
          </button>

          <button
            className="admin-nav-btn"
            onClick={() =>
              navigate("/admin/staff")
            }
          >
            Staff
          </button>

          <button
            className="admin-nav-btn"
            onClick={() =>
              navigate("/admin/profile")
            }
          >
            Profile
          </button>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="admin-notifications-main">

        {/* ====================================
            HEADER
        ==================================== */}

        <section className="admin-notifications-header">

          <div>

            <p className="admin-page-label">
              Admin Dashboard
            </p>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated with complaint activity,
              assignments, escalations, and important
              campus alerts.
            </p>

          </div>

          <div className="admin-notifications-header-badge">
            <span>●</span>
            Admin Alerts
          </div>

        </section>


        {/* ====================================
            SUMMARY
        ==================================== */}

        <section className="admin-notification-stats">

          <div className="admin-notification-stat-card">

            <div className="admin-notification-stat-icon">
              🔔
            </div>

            <div>
              <span>Total Notifications</span>

              <strong>
                {loading
                  ? "..."
                  : notifications.length}
              </strong>
            </div>

          </div>


          <div className="admin-notification-stat-card">

            <div className="admin-notification-stat-icon">
              📬
            </div>

            <div>
              <span>Unread</span>

              <strong>
                {loading
                  ? "..."
                  : unreadCount}
              </strong>
            </div>

          </div>


          <div className="admin-notification-stat-card">

            <div className="admin-notification-stat-icon">
              🚨
            </div>

            <div>
              <span>Escalations</span>

              <strong>
                {loading
                  ? "..."
                  : escalatedCount}
              </strong>
            </div>

          </div>


          <div className="admin-notification-stat-card">

            <div className="admin-notification-stat-icon">
              📋
            </div>

            <div>
              <span>Complaint Alerts</span>

              <strong>
                {loading
                  ? "..."
                  : complaintAlertCount}
              </strong>
            </div>

          </div>

        </section>


        {/* ====================================
            NOTIFICATIONS CARD
        ==================================== */}

        <section className="admin-notifications-card">

          <div className="admin-notifications-card-header">

            <div>

              <h2>
                Recent Notifications
              </h2>

              <p>
                Important updates from the
                CampusPulse complaint system.
              </p>

            </div>

            {unreadCount > 0 && (
              <button
                className="admin-mark-all-btn"
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
              >
                {markingAll
                  ? "Updating..."
                  : "Mark all as read"}
              </button>
            )}

          </div>


          {/* ==================================
              LOADING
          ================================== */}

          {loading ? (

            <div className="admin-notification-empty">

              <div className="admin-notification-empty-icon">
                ⏳
              </div>

              <h3>
                Loading notifications...
              </h3>

              <p>
                Please wait while we fetch the
                latest admin notifications.
              </p>

            </div>

          ) : notifications.length === 0 ? (

            /* =================================
               EMPTY
            ================================= */

            <div className="admin-notification-empty">

              <div className="admin-notification-empty-icon">
                🔔
              </div>

              <h3>
                No notifications
              </h3>

              <p>
                You are all caught up. New system
                notifications will appear here.
              </p>

            </div>

          ) : (

            /* =================================
               NOTIFICATION LIST
            ================================= */

            <div className="admin-notification-list">

              {notifications.map((notification) => (

                <div
                  key={notification._id}
                  className={`admin-notification-item ${
                    !notification.isRead
                      ? "unread"
                      : ""
                  }`}
                  onClick={() =>
                    handleMarkAsRead(notification)
                  }
                >

                  <div className="admin-notification-icon">
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>


                  <div className="admin-notification-content">

                    <div className="admin-notification-title-row">

                      <div>

                        <span className="admin-notification-type">
                          {getNotificationTypeLabel(
                            notification.type
                          )}
                        </span>

                        <h3>
                          {notification.title}
                        </h3>

                      </div>

                      {!notification.isRead && (
                        <span className="admin-unread-dot">
                        </span>
                      )}

                    </div>


                    <p>
                      {notification.message}
                    </p>


                    <div className="admin-notification-meta">

                      <span>
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </span>

                      {notification.complaint && (
                        <span>
                          Complaint linked
                        </span>
                      )}

                    </div>

                  </div>


                  <button
                    className="admin-delete-notification-btn"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleDelete(
                        notification._id
                      );
                    }}
                    aria-label="Delete notification"
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="admin-footer">

        <div className="admin-footer-brand">
          CampusPulse
        </div>

        <div className="admin-footer-text">
          Smart Campus Complaint Management System
        </div>

        <div className="admin-footer-copy">
          © 2026 CampusPulse. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default AdminNotifications;