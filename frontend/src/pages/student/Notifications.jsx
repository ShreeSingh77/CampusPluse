
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Notifications.css";

function Notifications() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      let url = "/notifications";

      if (filter === "read") {
        url += "?read=true";
      }

      if (filter === "unread") {
        url += "?read=false";
      }

      const response = await api.get(url);

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);

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
  }, [filter]);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead) return;

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
    const hasUnread = notifications.some(
      (notification) => !notification.isRead
    );

    if (!hasUnread) {
      toast("All notifications are already read.");
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

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark all notifications"
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== id
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
  // NOTIFICATION CLICK
  // ==========================================

  const handleNotificationClick = async (notification) => {
    await handleMarkAsRead(notification);

    if (notification.complaint?._id) {
      navigate(
        `/student/complaints/${notification.complaint._id}`
      );
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "complaint_escalated":
        return "🚨";

      case "complaint_assigned":
        return "👤";

      case "complaint_status_updated":
        return "🔄";

      case "general":
      default:
        return "🔔";
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case "complaint_escalated":
        return "escalated";

      case "complaint_assigned":
        return "assigned";

      case "complaint_status_updated":
        return "status-updated";

      case "general":
      default:
        return "general";
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    const created = new Date(date);
    const now = new Date();

    const difference =
      Math.floor((now - created) / 1000);

    if (difference < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      difference / 60
    );

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      difference / 3600
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      difference / 86400
    );

    if (days < 7) {
      return `${days}d ago`;
    }

    return created.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="student-notifications-page">

  

     {/* ================= NAVBAR ================= */}
     

<nav className="notification-navbar">

  {/* LOGO */}
  <div
    className="notification-navbar-brand"
    onClick={() => navigate("/student/dashboard")}
  >
    CampusPulse
  </div>

  {/* DESKTOP NAVIGATION */}
  <div className="notification-navigation">

    <button
      className="notification-nav-link"
      onClick={() => navigate("/student/dashboard")}
    >
      Dashboard
    </button>

    <button
      className="notification-nav-link"
      onClick={() => navigate("/student/complaints")}
    >
      My Complaints
    </button>

    <button className="notification-nav-link active">
      Notifications

      {unreadCount > 0 && (
        <span className="notification-nav-badge">
          {unreadCount}
        </span>
      )}
    </button>

    <button
      className="notification-nav-link"
      onClick={() => navigate("/student/profile")}
    >
      Profile
    </button>

  </div>

  {/* USER + MOBILE MENU */}
  <div className="notification-user">

    <span className="notification-user-name">
      {user?.name || "Student"}
    </span>

    <div className="notification-user-avatar">
      {user?.name?.charAt(0).toUpperCase() || "S"}
    </div>

    {/* DESKTOP LOGOUT */}
    <button
      className="notification-logout"
      onClick={logout}
    >
      Logout
    </button>

    {/* MOBILE HAMBURGER */}
    <button
      className={`notification-hamburger ${
        menuOpen ? "hamburger-active" : ""
      }`}
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Open navigation menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

  </div>

  {/* MOBILE MENU */}
  {menuOpen && (
    <div className="notification-mobile-navigation">

      <button
        className="notification-mobile-nav-link"
        onClick={() => {
          setMenuOpen(false);
          navigate("/student/dashboard");
        }}
      >
        Dashboard
      </button>

      <button
        className="notification-mobile-nav-link"
        onClick={() => {
          setMenuOpen(false);
          navigate("/student/complaints");
        }}
      >
        My Complaints
      </button>

      <button
        className="notification-mobile-nav-link active"
        onClick={() => setMenuOpen(false)}
      >
        <span>Notifications</span>

        {unreadCount > 0 && (
          <span className="notification-nav-badge">
            {unreadCount}
          </span>
        )}
      </button>

      <button
        className="notification-mobile-nav-link"
        onClick={() => {
          setMenuOpen(false);
          navigate("/student/profile");
        }}
      >
        Profile
      </button>

      <button
        className="notification-mobile-logout"
        onClick={() => {
          setMenuOpen(false);
          logout();
        }}
      >
        Logout
      </button>

    </div>
  )}

</nav>



      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="notifications-main">

        {/* HEADER */}

        <section className="notifications-header">

          <div>

            <p className="notifications-label">
              Student Notifications
            </p>

            <h1>
              Notifications
            </h1>

            <p className="notifications-subtitle">
              Stay updated about your complaints and
              campus activities.
            </p>

          </div>

          <button
            className="mark-all-btn"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
          >
            {markingAll
              ? "Marking..."
              : "✓ Mark all as read"}
          </button>

        </section>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <section className="notifications-toolbar">

          <div className="notification-filters">

            <button
              className={
                filter === "all"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "unread"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setFilter("unread")}
            >
              Unread
              {unreadCount > 0 && (
                <span className="filter-count">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              className={
                filter === "read"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setFilter("read")}
            >
              Read
            </button>

          </div>

          <span className="notification-count-text">
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </span>

        </section>

        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        <section className="notifications-container">

          {loading ? (

            <div className="notifications-empty">

              <div className="notifications-empty-icon">
                ⏳
              </div>

              <h3>
                Loading notifications...
              </h3>

              <p>
                Please wait while we fetch your
                notifications.
              </p>

            </div>

          ) : notifications.length === 0 ? (

            <div className="notifications-empty">

              <div className="notifications-empty-icon">
                🔔
              </div>

              <h3>
                No notifications
              </h3>

              <p>
                {filter === "unread"
                  ? "You have no unread notifications."
                  : filter === "read"
                  ? "You have no read notifications."
                  : "You're all caught up! New updates will appear here."}
              </p>

              {filter !== "all" && (
                <button
                  className="empty-view-all-btn"
                  onClick={() => setFilter("all")}
                >
                  View all notifications
                </button>
              )}

            </div>

          ) : (

            <div className="notifications-list">

              {notifications.map(
                (notification) => (

                  <article
                    key={notification._id}
                    className={`notification-card ${
                      !notification.isRead
                        ? "unread"
                        : ""
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >

                    {!notification.isRead && (
                      <span className="unread-dot"></span>
                    )}

                    <div
                      className={`notification-icon ${getNotificationClass(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    <div className="notification-content">

                      <div className="notification-top-row">

                        <h3>
                          {notification.title}
                        </h3>

                        <span className="notification-time">
                          {formatTime(
                            notification.createdAt
                          )}
                        </span>

                      </div>

                      <p>
                        {notification.message}
                      </p>

                      {notification.complaint && (
                        <div className="notification-complaint">

                          <span>
                            Complaint:
                          </span>

                          <strong>
                            {notification.complaint.title}
                          </strong>

                        </div>
                      )}

                    </div>

                    <div
                      className="notification-actions"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >

                      {!notification.isRead && (
                        <button
                          className="mark-read-btn"
                          onClick={() =>
                            handleMarkAsRead(
                              notification
                            )
                          }
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}

                      <button
                        className="delete-notification-btn"
                        onClick={() =>
                          handleDelete(
                            notification._id
                          )
                        }
                        title="Delete notification"
                      >
                        ×
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="student-notification-footer">

        <div className="student-notification-footer-content">

          <div className="footer-brand">
            CampusPulse
          </div>

          <p>
            Smart Campus Complaint Management System
          </p>

          <span>
            © {new Date().getFullYear()} CampusPulse.
            All rights reserved.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Notifications;

