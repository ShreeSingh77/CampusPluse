import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const StaffDashboard = () => {
 

  const navigate = useNavigate();
  const { user , logout} = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const staffName = user?.name || "Staff Member";

  // ==========================================
  // FETCH ASSIGNED COMPLAINTS
  // ==========================================

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      try {
        const response = await api.get(
          "/complaints/assigned"
        );

        if (response.data.success) {
          setComplaints(
            response.data.complaints || []
          );
        }
      } catch (error) {
        console.error(
          "Fetch assigned complaints error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load complaints"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedComplaints();
  }, []);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "assigned" ||
      complaint.status === "under_review"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "in_progress"
  ).length;

  const urgentComplaints = complaints.filter(
    (complaint) =>
      complaint.priority === "urgent"
  ).length;
const handleLogout = async () => {
  await logout();
  navigate("/login");
};
  return (
    <div className="staff-dashboard-page">

      {/* ================= NAVBAR ================= */}

      <nav className="staff-navbar">

        <div className="staff-navbar-brand">
          CampusPulse
        </div>

        <div className="staff-navbar-actions">

          <button
            className="staff-nav-btn active"
            onClick={() =>
              navigate("/staff/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className="staff-nav-btn"
            onClick={() =>
              navigate("/staff/complaints")
            }
          >
            Complaints
          </button>

          <button
            className="staff-nav-btn"
            onClick={() =>
              navigate("/staff/notifications")
            }
          >
            Notifications
          </button>

          <button
            className="staff-nav-btn"
            onClick={() =>
              navigate("/staff/profile")
            }
          >
            Profile
          </button>
        <button
  className="staff-logout-btn"
  onClick={handleLogout}
>
  Logout
</button>
        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="staff-dashboard-main">

        {/* ================= WELCOME ================= */}

        <section className="staff-welcome">

          <div>

            <p className="staff-page-label">
              Staff Dashboard
            </p>

            <h1>
              Welcome back, {staffName} 👋
            </h1>

            <p>
              Manage your assigned complaints and
              help resolve campus issues efficiently.
            </p>

          </div>

          <div className="staff-status-badge">
            <span>●</span>
            Staff Active
          </div>

        </section>

        {/* ================= STATISTICS ================= */}

        <section className="staff-stats-grid">

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              📋
            </div>

            <div>
              <span>Assigned Complaints</span>
              <strong>{totalComplaints}</strong>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingComplaints}</strong>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              🔄
            </div>

            <div>
              <span>In Progress</span>
              <strong>{inProgressComplaints}</strong>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              🚨
            </div>

            <div>
              <span>Urgent</span>
              <strong>{urgentComplaints}</strong>
            </div>

          </div>

        </section>

        {/* ================= COMPLAINTS ================= */}

        <section className="staff-complaints-section">

          <div className="staff-section-header">

            <div>
              <h2>
                Assigned Complaints
              </h2>

              <p>
                Complaints currently assigned to you.
              </p>
            </div>

            <button
              className="staff-view-btn"
              onClick={() =>
                navigate("/staff/complaints")
              }
            >
              View All →
            </button>

          </div>

          {/* ================= LOADING ================= */}

          {loading ? (

            <div className="staff-empty-state">

              <div className="staff-empty-icon">
                ⏳
              </div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while your complaints
                are being loaded.
              </p>

            </div>

          ) : complaints.length === 0 ? (

            <div className="staff-empty-state">

              <div className="staff-empty-icon">
                📋
              </div>

              <h3>
                No complaints assigned
              </h3>

              <p>
                New complaints assigned to you
                will appear here.
              </p>

            </div>

          ) : (

            <div className="staff-complaints-list">

              {complaints
                .slice(0, 5)
                .map((complaint) => (

                  <div
                    className="staff-complaint-card"
                    key={complaint._id}
                  >

                    <div className="staff-complaint-main">

                      <div>

                        <span className="staff-category">
                          {complaint.category}
                        </span>

                        <h3>
                          {complaint.title}
                        </h3>

                        <p>
                          📍{" "}
                          {complaint.location ||
                            "Location not provided"}
                        </p>

                      </div>

                      <div className="staff-complaint-meta">

                        <span
                          className={`staff-priority ${complaint.priority}`}
                        >
                          {complaint.priority}
                        </span>

                        <span
                          className={`staff-status ${complaint.status}`}
                        >
                          {complaint.status?.replace(
                            "_",
                            " "
                          )}
                        </span>

                      </div>

                    </div>

                    <button
                      className="staff-details-btn"
                      onClick={() =>
                        navigate(
                          `/staff/complaints/${complaint._id}`
                        )
                      }
                    >
                      View Details →
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="staff-footer">

        <div className="staff-footer-brand">
          CampusPulse
        </div>

        <div className="staff-footer-text">
          Smart Campus Complaint Management System
        </div>

        <div className="staff-footer-copy">
          © 2026 CampusPulse. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default StaffDashboard;