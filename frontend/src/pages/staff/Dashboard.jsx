
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./Dashboard.css";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ==========================================
  // FETCH ASSIGNED COMPLAINTS
  // ==========================================

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      try {
        const response = await api.get("/complaints/assigned");

        setComplaints(response.data.complaints || []);
      } catch (error) {
        console.error(
          "Fetch assigned complaints error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load assigned complaints"
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

  const totalAssigned = complaints.length;

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

  const urgentComplaints = complaints.filter(
    (complaint) =>
      complaint.priority === "urgent" ||
      complaint.priority === "high"
  ).length;

  return (
    <div className="staff-dashboard">

      {/* ==========================================
          NAVBAR
          ========================================== */}

      <nav className="staff-navbar">

        <div className="staff-navbar-brand">
          CampusPulse
        </div>

        {/* DESKTOP NAVIGATION */}

        <div className="staff-desktop-navigation">

          <button className="staff-navbar-link active">
            Dashboard
          </button>

          <button
  className="navbar-link"
  onClick={() => navigate("/staff/complaints")}
>
  Complaints
</button>

          <button
            className="staff-navbar-link"
            onClick={() =>
              navigate("/staff/notifications")
            }
          >
            Notifications
          </button>

          <button
            className="staff-navbar-link"
            onClick={() =>
              navigate("/staff/profile")
            }
          >
            Profile
          </button>

        </div>

        {/* USER */}

        <div className="staff-navbar-user">

          <span className="staff-user-name">
            {user?.name || "Staff"}
          </span>

          <div className="staff-user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </div>

          <button
            className="staff-logout-button"
            onClick={logout}
          >
            Logout
          </button>

          {/* MOBILE MENU */}

          <button
            className={`staff-hamburger ${
              menuOpen ? "active" : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* MOBILE NAVIGATION */}

        {menuOpen && (
          <div className="staff-mobile-navigation">

            <button
              className="staff-mobile-link active"
              onClick={closeMenu}
            >
              Dashboard
            </button>

            <button
              className="staff-mobile-link"
              onClick={() => {
                closeMenu();
                navigate("/staff/complaints");
              }}
            >
              My Complaints
            </button>

            <button
              className="staff-mobile-link"
              onClick={() => {
                closeMenu();
                navigate("/staff/notifications");
              }}
            >
              Notifications
            </button>

            <button
              className="staff-mobile-link"
              onClick={() => {
                closeMenu();
                navigate("/staff/profile");
              }}
            >
              Profile
            </button>

            <button
              className="staff-mobile-logout"
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

      {/* ==========================================
          MAIN
          ========================================== */}

      <main className="staff-main">

        {/* HEADER */}

        <section className="staff-header">

          <div>

            <p className="staff-dashboard-label">
              Staff Dashboard
            </p>

            <h1>
              Welcome, {user?.name || "Staff"} 👋
            </h1>

            <p className="staff-dashboard-subtitle">
              Manage your assigned complaints and help
              resolve campus issues efficiently.
            </p>

          </div>

        </section>

        {/* ==========================================
            STATISTICS
            ========================================== */}

        <section className="staff-stats-grid">

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              📋
            </div>

            <div>
              <p>Total Assigned</p>
              <h2>{totalAssigned}</h2>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              ⏳
            </div>

            <div>
              <p>Pending</p>
              <h2>{pendingComplaints}</h2>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              🔄
            </div>

            <div>
              <p>In Progress</p>
              <h2>{inProgressComplaints}</h2>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="staff-stat-icon">
              🚨
            </div>

            <div>
              <p>High Priority</p>
              <h2>{urgentComplaints}</h2>
            </div>

          </div>

        </section>

        {/* ==========================================
            ASSIGNED COMPLAINTS
            ========================================== */}

        <section className="staff-section">

          <div className="staff-section-title-row">

            <div>
              <h2>
                Assigned Complaints
              </h2>

              <p>
                Complaints currently assigned to you.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="staff-empty-state">

              <div className="staff-empty-icon">
                ⏳
              </div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while we fetch your assignments.
              </p>

            </div>

          ) : complaints.length === 0 ? (

            <div className="staff-empty-state">

              <div className="staff-empty-icon">
                🎉
              </div>

              <h3>
                No complaints assigned
              </h3>

              <p>
                You currently don't have any active complaints
                assigned to you.
              </p>

            </div>

          ) : (

            <div className="staff-complaints-list">

              {complaints.map((complaint) => (

                <div
                  className="staff-complaint-card"
                  key={complaint._id}
                >

                  <div className="staff-complaint-content">

                    <div className="staff-complaint-top">

                      <h3>
                        {complaint.title}
                      </h3>

                      <span
                        className={`staff-priority ${complaint.priority}`}
                      >
                        {complaint.priority}
                      </span>

                    </div>

                    <p className="staff-complaint-description">
                      {complaint.description}
                    </p>

                    <div className="staff-complaint-details">

                      <span>
                        📍 {complaint.location}
                      </span>

                      <span>
                        🏷️ {complaint.category}
                      </span>

                    </div>

                  </div>

                  <div className="staff-complaint-meta">

                    <span
                      className={`staff-status ${complaint.status}`}
                    >
                      {complaint.status.replace(
                        "_",
                        " "
                      )}
                    </span>

                    <button
                      className="staff-view-button"
                      onClick={() =>
                        navigate(
                          `/staff/complaints/${complaint._id}`
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default StaffDashboard;

