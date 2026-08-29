import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./Notifications.css";

const StaffNotifications = () => {
  const navigate = useNavigate();

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

      setNotifications(
        response.data.notifications || []
      );
    } catch (error) {
      console.error(
        "Fetch staff notifications error:",
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
  // COUNTS
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="staff-notifications-page">

      {/* HEADER */}

      <div className="staff-notifications-header">

        <div>
          <p className="page-label">
            Staff Dashboard
          </p>

          <h1>Notifications</h1>

          <p>
            Stay updated with your assigned complaints
            and important alerts.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() =>
            navigate("/staff/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* SUMMARY */}

      <div className="notifications-summary">

        <div className="notification-summary-card">
          <span>Total Notifications</span>

          <strong>
            {notifications.length}
          </strong>
        </div>

        <div className="notification-summary-card">
          <span>Unread</span>

          <strong>
            {unreadCount}
          </strong>
        </div>

      </div>


      {/* NOTIFICATIONS CARD */}

      <div className="notifications-card">

        <div className="notifications-card-header">

          <div>
            <h2>Recent Notifications</h2>

            <p>
              Important updates related to your staff
              activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-btn"
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
            >
              {markingAll
                ? "Updating..."
                : "Mark all as read"}
            </button>
          )}

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              ⏳
            </div>

            <h3>Loading notifications...</h3>

            <p>
              Please wait while we fetch your notifications.
            </p>

          </div>

        ) : notifications.length === 0 ? (

          /* EMPTY */

          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              🔔
            </div>

            <h3>No notifications</h3>

            <p>
              You are all caught up. New notifications
              will appear here.
            </p>

          </div>

        ) : (

          /* LIST */

          <div className="notifications-list">

            {notifications.map((notification) => (

              <div
                className={`notification-item ${
                  !notification.isRead
                    ? "unread"
                    : ""
                }`}
                key={notification._id}
                onClick={() =>
                  handleMarkAsRead(notification)
                }
              >

                <div className="notification-icon">
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>


                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="unread-dot"></span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <span className="notification-time">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </span>

                </div>


                <button
                  className="delete-notification-btn"
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

      </div>

    </div>
  );
};

export default StaffNotifications;