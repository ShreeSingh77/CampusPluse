import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
function StudentDashboard() {
    const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const closeMenu = () => {
    setMenuOpen(false);
  };

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


const recentComplaints = complaints.slice(0, 5);
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
  <span className="notification-badge">4</span>
</button>

          <button
  className="navbar-link"
  onClick={() => navigate("/student/profile")}
>
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
  Notifications
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

          <button
  className="new-complaint-btn"
  onClick={() => navigate("/student/complaints/new")}
>
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
          <h2>{totalComplaints}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <p>Pending</p>
             <h2>{pendingComplaints}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔄
            </div>

            <div>
              <p>In Progress</p>
              <h2>{inProgressComplaints}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <p>Resolved</p>
             <h2>{resolvedComplaints}</h2>
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

            <button
  className="view-all-btn"
  onClick={() => navigate("/student/complaints")}
>
  View All
</button>
          </div>


          {loading ? (
  <div className="empty-state">
    <div className="empty-icon">⏳</div>

    <h3>Loading complaints...</h3>

    <p>
      Please wait while we fetch your complaints.
    </p>
  </div>
) : recentComplaints.length === 0 ? (
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

    <button
      className="empty-action-btn"
      onClick={() =>
        navigate("/student/complaints/new")
      }
    >
      Submit Your First Complaint
    </button>

  </div>
) : (
  <div className="complaints-list">

    {recentComplaints.map((complaint) => (
      <div
        className="complaint-card"
        key={complaint._id}
      >

        <div className="complaint-card-content">

          <h3>
            {complaint.title}
          </h3>

          <p>
            {complaint.description}
          </p>

          <span>
            📍 {complaint.location}
          </span>

        </div>

        <div className="complaint-card-meta">

          <span
            className={`complaint-status ${complaint.status}`}
          >
            {complaint.status.replace("_", " ")}
          </span>

          <span
            className={`complaint-priority ${complaint.priority}`}
          >
            {complaint.priority}
          </span>

        </div>

      </div>
    ))}

  </div>
)}

        </section>

      </main>

   
      {/* ================= FOOTER ================= */}

      <footer className="student-footer">
        <div className="student-footer-content">

          <div className="student-footer-brand">
            CampusPulse
          </div>

          <p>
            Smart Campus Complaint Management System
          </p>

          <span>
            © {new Date().getFullYear()} CampusPulse. All rights reserved.
          </span>

        </div>
      </footer>

   
    </div>
  );
}

export default StudentDashboard;