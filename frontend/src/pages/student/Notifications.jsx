import { useNavigate } from "react-router-dom";
import "./Notifications.css";

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      icon: "📝",
      title: "Complaint Submitted",
      message:
        "Your complaint has been successfully submitted and is waiting for review.",
      time: "Today",
      type: "info",
    },
    {
      id: 2,
      icon: "👀",
      title: "Complaint Under Review",
      message:
        "Your complaint is currently being reviewed by the campus administration.",
      time: "Yesterday",
      type: "review",
    },
    {
      id: 3,
      icon: "🔄",
      title: "Complaint Assigned",
      message:
        "Your complaint has been assigned to the concerned staff member.",
      time: "2 days ago",
      type: "assigned",
    },
    {
      id: 4,
      icon: "✅",
      title: "Complaint Resolved",
      message:
        "Your reported issue has been resolved successfully.",
      time: "3 days ago",
      type: "success",
    },
  ];

  return (
    <div className="notifications-page">

      {/* HEADER */}
      <div className="notifications-header">

        <div>
          <p className="page-label">
            Student Dashboard
          </p>

          <h1>Notifications</h1>

          <p>
            Stay updated with your complaints and campus activities.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/student/dashboard")}
        >
          ← Dashboard
        </button>

      </div>

      {/* NOTIFICATION CARD */}
      <div className="notifications-card">

        <div className="notifications-card-header">
          <div>
            <h2>Recent Notifications</h2>
            <p>
              Updates related to your complaints will appear here.
            </p>
          </div>

          <span className="notification-count">
            {notifications.length}
          </span>
        </div>

        {/* LIST */}
        <div className="notifications-list">

          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-notification-icon">
                🔔
              </div>

              <h3>No notifications yet</h3>

              <p>
                You don't have any notifications right now.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                className="notification-item"
                key={notification.id}
              >

                <div
                  className={`notification-icon ${notification.type}`}
                >
                  {notification.icon}
                </div>

                <div className="notification-content">

                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    <span>
                      {notification.time}
                    </span>
                  </div>

                  <p>
                    {notification.message}
                  </p>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
};

export default Notifications;