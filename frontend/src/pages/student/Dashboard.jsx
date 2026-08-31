
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* ================= FETCH COMPLAINTS ================= */

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        
        const response = await api.get("/complaints/my");

        setComplaints(response.data.complaints || []);
      } catch (error) {
        console.error("Fetch complaints error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);
useEffect(() => {
  const fetchUnreadNotificationCount = async () => {
    try {
      const response = await api.get("/notifications/unread-count");

      setUnreadNotificationCount(response.data.count || 0);
    } catch (error) {
      console.error(
        "Fetch unread notification count error:",
        error
      );
    }
  };

  fetchUnreadNotificationCount();
}, []);
  /* ================= STATISTICS ================= */

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "submitted" ||
      complaint.status === "under_review"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "assigned" ||
      complaint.status === "in_progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "resolved"
  ).length;

  /* ================= RECENT COMPLAINTS ================= */

  const recentComplaints = complaints.slice(0, 5);

  /* ================= NAVIGATION ================= */

  const goToComplaints = (status = "") => {
    if (status) {
      navigate(`/student/complaints?status=${status}`);
    } else {
      navigate("/student/complaints");
    }
  };

  const openComplaint = (id) => {
    navigate(`/student/complaints/${id}`);
  };

  return (
    <div className="student-dashboard">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="dashboard-navbar">

        {/* BRAND */}
        <div
          className="navbar-brand"
          onClick={() => navigate("/student/dashboard")}
        >
          CampusPulse
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="desktop-navigation">

          <button
            className="navbar-link active"
            onClick={() => navigate("/student/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="navbar-link"
            onClick={() => navigate("/student/complaints")}
          >
            My Complaints
          </button>

          <button
  className="navbar-link"
  onClick={() => navigate("/student/notifications")}
>
  Notifications

  {unreadNotificationCount > 0 && (
    <span className="notification-badge">
      {unreadNotificationCount}
    </span>
  )}
</button>

          <button
            className="navbar-link"
            onClick={() => navigate("/student/profile")}
          >
            Profile
          </button>

        </div>

        {/* USER AREA */}
        <div className="navbar-user">

          <span className="user-name">
            {user?.name || "Student"}
          </span>

          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </div>

          {/* DESKTOP LOGOUT */}
          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className={`hamburger-button ${
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

        {/* MOBILE NAVIGATION */}
        {menuOpen && (
          <div className="mobile-navigation">

            <button
              className="mobile-nav-link active"
              onClick={closeMenu}
            >
              Dashboard
            </button>

            <button
              className="mobile-nav-link"
              onClick={() => {
                closeMenu();
                navigate("/student/complaints");
              }}
            >
              My Complaints
            </button>

            <button
              className="mobile-nav-link"
              onClick={() => {
                closeMenu();
                navigate("/student/notifications");
              }}
            >
              <span>Notifications</span>
              <span className="notification-badge">4</span>
            </button>

            <button
              className="mobile-nav-link"
              onClick={() => {
                closeMenu();
                navigate("/student/profile");
              }}
            >
              Profile
            </button>

            <button
              className="mobile-logout-button"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              Logout
            </button>

          </div>
        )}

      </nav>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="student-main">

        {/* PAGE HEADER */}
        <section className="student-header">

          <div className="header-content">

            <p className="dashboard-label">
              Student Dashboard
            </p>

            <h1>
              Welcome, {user?.name || "Student"} 👋
            </h1>

            <p className="dashboard-subtitle">
              Track your complaints, monitor their progress, and
              stay updated with your campus.
            </p>

          </div>

          <button
            className="new-complaint-btn"
            onClick={() => navigate("/student/complaints/new")}
          >
            <span className="plus-icon">+</span>
            New Complaint
          </button>

        </section>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="stats-grid">

          {/* TOTAL */}
          <button
            className="stat-card stat-total"
            onClick={() => goToComplaints()}
          >
            <div className="stat-card-top">

              <div className="stat-icon">
                📝
              </div>

              <span className="stat-arrow">
                →
              </span>

            </div>

            <div className="stat-info">
              <p>Total Complaints</p>
              <h2>{totalComplaints}</h2>
            </div>

            <div className="stat-hover-text">
              View all complaints →
            </div>

          </button>

          {/* PENDING */}
          <button
            className="stat-card stat-pending"
            onClick={() => goToComplaints("pending")}
          >
            <div className="stat-card-top">

              <div className="stat-icon">
                ⏳
              </div>

              <span className="stat-arrow">
                →
              </span>

            </div>

            <div className="stat-info">
              <p>Pending</p>
              <h2>{pendingComplaints}</h2>
            </div>

            <div className="stat-hover-text">
              View pending complaints →
            </div>

          </button>

          {/* IN PROGRESS */}
          <button
            className="stat-card stat-progress"
            onClick={() => goToComplaints("in_progress")}
          >
            <div className="stat-card-top">

              <div className="stat-icon">
                🔄
              </div>

              <span className="stat-arrow">
                →
              </span>

            </div>

            <div className="stat-info">
              <p>In Progress</p>
              <h2>{inProgressComplaints}</h2>
            </div>

            <div className="stat-hover-text">
              View active complaints →
            </div>

          </button>

          {/* RESOLVED */}
          <button
            className="stat-card stat-resolved"
            onClick={() => goToComplaints("resolved")}
          >
            <div className="stat-card-top">

              <div className="stat-icon">
                ✅
              </div>

              <span className="stat-arrow">
                →
              </span>

            </div>

            <div className="stat-info">
              <p>Resolved</p>
              <h2>{resolvedComplaints}</h2>
            </div>

            <div className="stat-hover-text">
              View resolved complaints →
            </div>

          </button>

        </section>

        {/* =====================================================
            RECENT COMPLAINTS
        ===================================================== */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>
              <div className="section-heading-line">
                <span className="section-dot"></span>

                <h2>
                  Recent Complaints
                </h2>
              </div>

              <p>
                Your latest submitted complaints will appear here.
              </p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => goToComplaints()}
            >
              View All
              <span>→</span>
            </button>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="empty-state loading-state">

              <div className="loading-spinner"></div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while we fetch your latest complaints.
              </p>

            </div>

          ) : recentComplaints.length === 0 ? (

            /* EMPTY */
            <div className="empty-state">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No complaints yet
              </h3>

              <p>
                You haven't submitted any complaints yet.
                Start by reporting an issue on your campus.
              </p>

              <button
                className="empty-action-btn"
                onClick={() =>
                  navigate("/student/complaints/new")
                }
              >
                <span>+</span>
                Submit Your First Complaint
              </button>

            </div>

          ) : (

            /* COMPLAINT LIST */
            <div className="complaints-list">

              {recentComplaints.map((complaint) => (

                <button
                  className="complaint-card"
                  key={complaint._id}
                  onClick={() => openComplaint(complaint._id)}
                >

                  <div className="complaint-card-content">

                    <div className="complaint-title-row">

                      <h3>
                        {complaint.title}
                      </h3>

                      <span className="complaint-view-arrow">
                        →
                      </span>

                    </div>

                    <p>
                      {complaint.description}
                    </p>

                    <div className="complaint-location">
                      <span>📍</span>
                      <span>{complaint.location}</span>
                    </div>

                  </div>

                  <div className="complaint-card-meta">

                    <span
                      className={`complaint-status ${complaint.status}`}
                    >
                      {complaint.status?.replace("_", " ")}
                    </span>

                    <span
                      className={`complaint-priority ${complaint.priority}`}
                    >
                      {complaint.priority}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="student-footer">

        <div className="student-footer-content">

          <div className="footer-main">

            <div className="student-footer-brand">
              CampusPulse
            </div>

            <p>
              Smart Campus Complaint Management System
            </p>

          </div>

          <div className="footer-right">

            <span>
              © {new Date().getFullYear()} CampusPulse
            </span>

            <span className="footer-separator">
              •
            </span>

            <span>
              All rights reserved.
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default StudentDashboard;

