import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

function StudentDashboard() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="student-dashboard">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-navbar">

        {/* LOGO */}
        <div className="navbar-brand">
          CampusPulse
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="desktop-navigation">

          <button className="navbar-link active">
            Dashboard
          </button>

          <button className="navbar-link">
            My Complaints
          </button>

          <button className="navbar-link">
            Notifications
          </button>

          <button className="navbar-link">
            Profile
          </button>

        </div>

        {/* USER + MOBILE MENU BUTTON */}
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

          {/* MOBILE HAMBURGER */}
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

        {/* MOBILE MENU */}
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
              onClick={closeMenu}
            >
              My Complaints
            </button>

            <button
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Notifications
            </button>

            <button
              className="mobile-nav-link"
              onClick={closeMenu}
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


      {/* ================= MAIN CONTENT ================= */}

      <main className="student-main">

        {/* PAGE HEADER */}
        <section className="student-header">

          <div>

            <p className="dashboard-label">
              Student Dashboard
            </p>

            <h1>
              Welcome, {user?.name || "Student"} 👋
            </h1>

            <p className="dashboard-subtitle">
              Track your complaints and stay updated with your campus.
            </p>

          </div>

          <button className="new-complaint-btn">
            + New Complaint
          </button>

        </section>


        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>
              <p>Total Complaints</p>
              <h2>0</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <p>Pending</p>
              <h2>0</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔄
            </div>

            <div>
              <p>In Progress</p>
              <h2>0</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <p>Resolved</p>
              <h2>0</h2>
            </div>

          </div>

        </section>


        {/* RECENT COMPLAINTS */}
        <section className="dashboard-section">

          <div className="section-title-row">

            <div>

              <h2>
                Recent Complaints
              </h2>

              <p>
                Your latest submitted complaints will appear here.
              </p>

            </div>

            <button className="view-all-btn">
              View All
            </button>

          </div>


          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No complaints yet
            </h3>

            <p>
              You haven't submitted any complaints yet.
            </p>

            <button className="empty-action-btn">
              Submit Your First Complaint
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StudentDashboard;