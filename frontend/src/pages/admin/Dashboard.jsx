import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminName = user?.name || "Administrator";

  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [complaintsResponse, staffResponse] =
        await Promise.all([
          api.get("/complaints"),
          api.get("/users/staff"),
        ]);

      // Complaints
      if (complaintsResponse.data.success) {
        setComplaints(
          complaintsResponse.data.complaints || []
        );
      }

      // Staff
      if (staffResponse.data.success) {
        setStaff(
          staffResponse.data.staff ||
            staffResponse.data.users ||
            []
        );
      }
    } catch (error) {
      console.error(
        "Admin dashboard data error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "submitted" ||
      complaint.status === "under_review" ||
      complaint.status === "assigned"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "in_progress"
  ).length;

  const escalatedComplaints = complaints.filter(
    (complaint) =>
      complaint.isEscalated === true
  ).length;

  // ==========================================
  // RECENT COMPLAINTS
  // ==========================================

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  // ==========================================
  // STATUS FORMATTER
  // ==========================================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ==========================================
  // PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "urgent";

      case "high":
        return "high";

      case "medium":
        return "medium";

      case "low":
        return "low";

      default:
        return "";
    }
  };

  return (
    <div className="admin-dashboard-page">

      {/* ================= NAVBAR ================= */}

      <nav className="admin-navbar">

        <div className="admin-navbar-brand">
          CampusPulse
        </div>

        <div className="admin-navbar-actions">

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="admin-nav-btn active"
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/admin/complaints")
            }
            className="admin-nav-btn"
          >
            Complaints
          </button>

          <button
            onClick={() =>
              navigate("/admin/notifications")
            }
            className="admin-nav-btn"
          >
            Notifications
          </button>

          <button
            onClick={() =>
              navigate("/admin/staff")
            }
            className="admin-nav-btn"
          >
            Staff
          </button>

          <button
            onClick={() =>
              navigate("/admin/profile")
            }
            className="admin-nav-btn"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="admin-dashboard-main">

        {/* ================= WELCOME ================= */}

        <section className="admin-welcome">

          <div>

            <p className="admin-page-label">
              Admin Dashboard
            </p>

            <h1>
              Welcome back, {adminName} 👋
            </h1>

            <p>
              Monitor campus complaints, manage
              assignments, and keep campus services
              running smoothly.
            </p>

          </div>

          <div className="admin-welcome-badge">
            <span>●</span>
            System Active
          </div>

        </section>

        {/* ================= STATISTICS ================= */}

        <section className="admin-stats-grid">

          {/* TOTAL */}

          <div
            className="admin-stat-card"
            onClick={() =>
              navigate("/admin/complaints")
            }
          >

            <div className="admin-stat-icon">
              📋
            </div>

            <div>
              <span>Total Complaints</span>

              <strong>
                {loading
                  ? "..."
                  : totalComplaints}
              </strong>
            </div>

          </div>

          {/* PENDING */}

          <div
            className="admin-stat-card"
            onClick={() =>
              navigate("/admin/complaints")
            }
          >

            <div className="admin-stat-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {loading
                  ? "..."
                  : pendingComplaints}
              </strong>
            </div>

          </div>

          {/* IN PROGRESS */}

          <div
            className="admin-stat-card"
            onClick={() =>
              navigate("/admin/complaints")
            }
          >

            <div className="admin-stat-icon">
              🔄
            </div>

            <div>
              <span>In Progress</span>

              <strong>
                {loading
                  ? "..."
                  : inProgressComplaints}
              </strong>
            </div>

          </div>

          {/* ESCALATED */}

          <div
            className="admin-stat-card"
            onClick={() =>
              navigate("/admin/complaints")
            }
          >

            <div className="admin-stat-icon">
              🚨
            </div>

            <div>
              <span>Escalated</span>

              <strong>
                {loading
                  ? "..."
                  : escalatedComplaints}
              </strong>
            </div>

          </div>

        </section>

        {/* ================= RECENT COMPLAINTS ================= */}

        <section className="admin-management-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Complaints
              </h2>

              <p>
                Latest complaints submitted by
                students.
              </p>

            </div>

            <button
              className="admin-view-btn"
              onClick={() =>
                navigate("/admin/complaints")
              }
            >
              View All Complaints →
            </button>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                ⏳
              </div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while dashboard data
                is loaded.
              </p>

            </div>

          ) : recentComplaints.length === 0 ? (

            /* EMPTY */

            <div className="admin-empty-state">

              <div className="admin-empty-icon">
                📋
              </div>

              <h3>
                No complaints to display
              </h3>

              <p>
                New complaints submitted by students
                will appear here.
              </p>

            </div>

          ) : (

            /* RECENT COMPLAINT LIST */

            <div className="admin-recent-complaints">

              {recentComplaints.map(
                (complaint) => (

                  <div
                    key={complaint._id}
                    className="admin-recent-complaint"
                    onClick={() =>
                      navigate(
                        `/admin/complaints/${complaint._id}`
                      )
                    }
                  >

                    <div className="recent-complaint-main">

                      <div className="recent-complaint-category">
                        {complaint.category ||
                          "General"}
                      </div>

                      <h3>
                        {complaint.title}
                      </h3>

                      <p>
                        {complaint.reportedBy?.name ||
                          "Unknown Student"}
                      </p>

                    </div>

                    <div className="recent-complaint-meta">

                      <span
                        className={`admin-status-badge ${complaint.status}`}
                      >
                        {formatStatus(
                          complaint.status
                        )}
                      </span>

                      {complaint.priority && (
                        <span
                          className={`admin-priority ${getPriorityClass(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority}
                        </span>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="admin-quick-section">

          <div className="admin-section-heading">

            <h2>
              Quick Actions
            </h2>

            <p>
              Quickly access important
              administrative tools.
            </p>

          </div>

          <div className="admin-actions-grid">

            {/* COMPLAINTS */}

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/complaints")
              }
            >

              <span className="action-icon">
                📋
              </span>

              <span>
                <strong>
                  Manage Complaints
                </strong>

                <small>
                  Review and assign complaints
                </small>
              </span>

              <b>→</b>

            </button>

            {/* STAFF */}

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/staff")
              }
            >

              <span className="action-icon">
                👥
              </span>

              <span>
                <strong>
                  Staff Management
                </strong>

                <small>
                  Add and manage campus staff
                </small>
              </span>

              <b>→</b>

            </button>

            {/* NOTIFICATIONS */}

            <button
              className="admin-action-card"
              onClick={() =>
                navigate(
                  "/admin/notifications"
                )
              }
            >

              <span className="action-icon">
                🔔
              </span>

              <span>
                <strong>
                  Notifications
                </strong>

                <small>
                  Check important alerts
                </small>
              </span>

              <b>→</b>

            </button>

            {/* PROFILE */}

            <button
              className="admin-action-card"
              onClick={() =>
                navigate("/admin/profile")
              }
            >

              <span className="action-icon">
                👤
              </span>

              <span>
                <strong>
                  My Profile
                </strong>

                <small>
                  View account information
                </small>
              </span>

              <b>→</b>

            </button>

          </div>

        </section>

        {/* ================= STAFF OVERVIEW ================= */}

        <section className="admin-staff-overview">

          <div className="admin-section-header">

            <div>

              <h2>
                Staff Overview
              </h2>

              <p>
                Active staff members handling
                campus complaints.
              </p>

            </div>

            <button
              className="admin-view-btn"
              onClick={() =>
                navigate("/admin/staff")
              }
            >
              Manage Staff →
            </button>

          </div>

          <div className="admin-staff-summary">

            <div className="admin-staff-summary-icon">
              👥
            </div>

            <div>

              <span>
                Active Staff Members
              </span>

              <strong>
                {loading
                  ? "..."
                  : staff.length}
              </strong>

            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

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

export default AdminDashboard;