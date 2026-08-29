import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user , logout } = useAuth();

  const adminName = user?.name || "Administrator";
const handleLogout = async () => {
  await logout();
  navigate("/login");
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
            onClick={() => navigate("/admin/dashboard")}
            className="admin-nav-btn active"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/complaints")}
            className="admin-nav-btn"
          >
            Complaints
          </button>

          <button
            onClick={() => navigate("/admin/notifications")}
            className="admin-nav-btn"
          >
            Notifications
          </button>
           
           <button
  onClick={() => navigate("/admin/staff")}
  className="admin-nav-btn"
>
  Staff
</button>
          <button
            onClick={() => navigate("/admin/profile")}
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

        {/* WELCOME */}

        <section className="admin-welcome">

          <div>
            <p className="admin-page-label">
              Admin Dashboard
            </p>

            <h1>
              Welcome back, {adminName} 👋
            </h1>

            <p>
              Monitor campus complaints, manage assignments,
              and keep campus services running smoothly.
            </p>
          </div>

          <div className="admin-welcome-badge">
            <span>●</span>
            System Active
          </div>

        </section>


        {/* ================= STATISTICS ================= */}

        <section className="admin-stats-grid">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📋
            </div>

            <div>
              <span>Total Complaints</span>
              <strong>0</strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>0</strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🔄
            </div>

            <div>
              <span>In Progress</span>
              <strong>0</strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🚨
            </div>

            <div>
              <span>Escalated</span>
              <strong>0</strong>
            </div>

          </div>

        </section>


        {/* ================= MANAGEMENT ================= */}

        <section className="admin-management-section">

          <div className="admin-section-header">

            <div>
              <h2>Complaint Management</h2>

              <p>
                Review complaints and manage their assignments.
              </p>
            </div>

            <button
              className="admin-view-btn"
              onClick={() => navigate("/admin/complaints")}
            >
              View All Complaints →
            </button>

          </div>


          {/* EMPTY STATE */}

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📋
            </div>

            <h3>
              No complaints to display
            </h3>

            <p>
              New complaints submitted by students will
              appear here for review.
            </p>

          </div>

        </section>


        {/* ================= QUICK ACTIONS ================= */}

        <section className="admin-quick-section">

          <div className="admin-section-heading">

            <h2>Quick Actions</h2>

            <p>
              Quickly access important administrative tools.
            </p>

          </div>


          <div className="admin-actions-grid">

            <button
              className="admin-action-card"
              onClick={() => navigate("/admin/complaints")}
            >
              <span className="action-icon">
                📋
              </span>

              <span>
                <strong>Manage Complaints</strong>
                <small>
                  Review and assign complaints
                </small>
              </span>

              <b>→</b>
            </button>

           <button
  className="admin-action-card"
  onClick={() => navigate("/admin/staff")}
>
  <span className="action-icon">
    👥
  </span>

  <span>
    <strong>Staff Management</strong>
    <small>
      Add and manage campus staff
    </small>
  </span>

  <b>→</b>
</button>
            <button
              className="admin-action-card"
              onClick={() => navigate("/admin/notifications")}
            >
              <span className="action-icon">
                🔔
              </span>

              <span>
                <strong>Notifications</strong>
                <small>
                  Check important alerts
                </small>
              </span>

              <b>→</b>
            </button>


            <button
              className="admin-action-card"
              onClick={() => navigate("/admin/profile")}
            >
              <span className="action-icon">
                👤
              </span>

              <span>
                <strong>My Profile</strong>
                <small>
                  View account information
                </small>
              </span>

              <b>→</b>
            </button>

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