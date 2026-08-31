import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const studentName = user?.name || "Student";

  const initials =
    studentName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  const department =
    user?.department?.name ||
    user?.department ||
    "Not assigned";

  const departmentCode =
    user?.department?.code || "";

  return (
    <div className="student-profile-page">

      {/* ================= NAVBAR ================= */}

      <nav className="profile-navbar">

        <div className="profile-navbar-brand">
          CampusPulse
        </div>

        {/* DESKTOP NAVIGATION */}

        <div className="profile-desktop-navigation">

          <button
            className="profile-navbar-link"
            onClick={() =>
              navigate("/student/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className="profile-navbar-link"
            onClick={() =>
              navigate("/student/complaints")
            }
          >
            My Complaints
          </button>

          <button
            className="profile-navbar-link"
            onClick={() =>
              navigate("/student/notifications")
            }
          >
            Notifications
          </button>

          <button className="profile-navbar-link active">
            Profile
          </button>

        </div>

        {/* USER AREA */}

        <div className="profile-navbar-user">

          <span className="profile-user-name">
            {studentName}
          </span>

          <div className="profile-small-avatar">
            {initials}
          </div>

          <button
            className="profile-logout-top"
            onClick={logout}
          >
            Logout
          </button>

          {/* MOBILE MENU */}

          <button
            className={`profile-hamburger ${
              menuOpen ? "profile-hamburger-active" : ""
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
          <div className="profile-mobile-navigation">

            <button
              onClick={() => {
                closeMenu();
                navigate("/student/dashboard");
              }}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                closeMenu();
                navigate("/student/complaints");
              }}
            >
              My Complaints
            </button>

            <button
              onClick={() => {
                closeMenu();
                navigate("/student/notifications");
              }}
            >
              Notifications
            </button>

            <button className="active">
              Profile
            </button>

            <button
              className="mobile-profile-logout"
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


      {/* ================= MAIN ================= */}

      <main className="student-profile-main">

        {/* PAGE HEADER */}

        <div className="profile-header">

          <div>

            <button
              className="profile-back-btn"
              onClick={() =>
                navigate("/student/dashboard")
              }
            >
              ← Back to Dashboard
            </button>

            <p className="profile-label">
              Student Dashboard
            </p>

            <h1>My Profile</h1>

            <p className="profile-subtitle">
              View your CampusPulse account information
              and student details.
            </p>

          </div>

        </div>


        {/* ================= PROFILE CARD ================= */}

        <section className="profile-card">

          {/* PROFILE TOP */}

          <div className="profile-top">

            <div className="profile-avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Student profile"
                />
              ) : (
                initials
              )}
            </div>

            <div className="profile-user-info">

              <h2>{studentName}</h2>

              <p>
                {user?.email || "No email available"}
              </p>

              <span className="profile-role">
                🎓 Student
              </span>

            </div>

            <div className="profile-account-status">
              <span>●</span>
              {user?.isActive !== false
                ? "Active Account"
                : "Inactive Account"}
            </div>

          </div>


          <div className="profile-divider" />


          {/* ================= ACCOUNT INFORMATION ================= */}

          <section className="profile-section">

            <h3>Account Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <span>👤 Full Name</span>

                <strong>
                  {studentName}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>📧 Email Address</span>

                <strong>
                  {user?.email || "Not available"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>📱 Phone Number</span>

                <strong>
                  {user?.phone || "Not provided"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>🎓 Account Role</span>

                <strong>
                  Student
                </strong>
              </div>

              <div className="profile-info-item">
                <span>🟢 Account Status</span>

                <strong>
                  {user?.isActive !== false
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>📅 Member Since</span>

                <strong>
                  {user?.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>

            </div>

          </section>


          {/* ================= DEPARTMENT ================= */}

          <section className="profile-section">

            <h3>Department</h3>

            <div className="profile-department-box">

              <div className="profile-department-icon">
                🎓
              </div>

              <div>

                <strong>
                  {department}
                </strong>

                <span>
                  {departmentCode
                    ? `Department Code: ${departmentCode}`
                    : "Your assigned academic department"}
                </span>

              </div>

            </div>

          </section>


          {/* ================= SECURITY ================= */}

          <section className="profile-section">

            <h3>Security</h3>

            <div className="profile-security-box">

              <div>

                <strong>
                  Account Security
                </strong>

                <p>
                  Your CampusPulse account is protected
                  with authenticated access.
                </p>

              </div>

              <span className="profile-security-badge">
                🔒 Protected
              </span>

            </div>

          </section>


          {/* ================= ACTIONS ================= */}

          <div className="profile-actions">

            <button
              className="profile-complaints-btn"
              onClick={() =>
                navigate("/student/complaints")
              }
            >
              View My Complaints →
            </button>

            <button
              className="profile-logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="student-profile-footer">

        <div className="student-profile-footer-content">

          <strong>
            CampusPulse
          </strong>

          <span>
            Smart Campus Complaint Management System
          </span>

          <small>
            © {new Date().getFullYear()} CampusPulse.
            All rights reserved.
          </small>

        </div>

      </footer>

    </div>
  );
};

export default Profile;