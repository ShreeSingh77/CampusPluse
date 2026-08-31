import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const studentName = user?.name || "Student";

  const initials =
    studentName
      .split(" ")
      .filter(Boolean)
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  const accountIsActive = user?.isActive !== false;

  // ==========================================
  // FETCH STUDENT COMPLAINTS
  // ==========================================

  const fetchComplaintStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");

    try {
      const response = await api.get("/complaints/my");

      const data = response?.data;

      /*
        Backend response can commonly be:
        {
          success: true,
          complaints: [...]
        }

        This fallback also keeps the UI safe if the
        backend uses another common array property.
      */

      const complaintList =
        Array.isArray(data?.complaints)
          ? data.complaints
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

      setComplaints(complaintList);
    } catch (error) {
      console.error(
        "Profile complaints fetch error:",
        error.response?.data?.message || error.message
      );

      setComplaints([]);

      setStatsError(
        error.response?.data?.message ||
          "Unable to load complaint statistics."
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaintStats();
  }, [fetchComplaintStats]);

  // ==========================================
  // COMPLAINT STATISTICS
  // ==========================================

  const statistics = useMemo(() => {
    const total = complaints.length;

    const resolved = complaints.filter(
      (complaint) =>
        complaint?.status?.toLowerCase() === "resolved"
    ).length;

    const rejected = complaints.filter(
      (complaint) =>
        complaint?.status?.toLowerCase() === "rejected"
    ).length;

    const inProgress = complaints.filter((complaint) => {
      const status = complaint?.status?.toLowerCase();

      return (
        status === "assigned" ||
        status === "in_progress"
      );
    }).length;

    const pending = complaints.filter((complaint) => {
      const status = complaint?.status?.toLowerCase();

      return (
        status === "submitted" ||
        status === "under_review"
      );
    }).length;

    const resolutionRate =
      total > 0
        ? Math.round((resolved / total) * 100)
        : 0;

    return {
      total,
      resolved,
      rejected,
      inProgress,
      pending,
      resolutionRate,
    };
  }, [complaints]);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToDashboard = () => {
    closeMenu();
    navigate("/student/dashboard");
  };

  const goToComplaints = () => {
    closeMenu();
    navigate("/student/complaints");
  };

  const goToNotifications = () => {
    closeMenu();
    navigate("/student/notifications");
  };

  // ==========================================
  // STATUS LABEL
  // ==========================================

  const accountStatus = accountIsActive
    ? "Active"
    : "Inactive";

  return (
    <div className="student-profile-page">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="profile-navbar">

        <div className="profile-navbar-brand">
          CampusPulse
        </div>

        {/* DESKTOP NAVIGATION */}

        <div className="profile-desktop-navigation">

          <button
            className="profile-navbar-link"
            onClick={goToDashboard}
          >
            Dashboard
          </button>

          <button
            className="profile-navbar-link"
            onClick={goToComplaints}
          >
            My Complaints
          </button>

          <button
            className="profile-navbar-link"
            onClick={goToNotifications}
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

            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${studentName} profile`}
              />
            ) : (
              initials
            )}

          </div>

          <button
            className="profile-logout-top"
            onClick={logout}
          >
            Logout
          </button>

          {/* SINGLE MOBILE HAMBURGER */}

          <button
            className={`profile-hamburger ${
              menuOpen
                ? "profile-hamburger-active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen((previous) => !previous)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* MOBILE NAVIGATION */}

        {menuOpen && (
          <div className="profile-mobile-navigation">

            <button onClick={goToDashboard}>
              Dashboard
            </button>

            <button onClick={goToComplaints}>
              My Complaints
            </button>

            <button onClick={goToNotifications}>
              Notifications
            </button>

            <button
              className="active"
              onClick={closeMenu}
            >
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


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="student-profile-main">

        {/* PAGE HEADER */}

        <div className="profile-header">

          <button
            className="profile-back-btn"
            onClick={goToDashboard}
            type="button"
          >
            ← Back to Dashboard
          </button>

          <p className="profile-label">
            Student Account
          </p>

          <h1>My Profile</h1>

          <p className="profile-subtitle">
            Manage your account information and view
            your CampusPulse activity.
          </p>

        </div>


        {/* ==========================================
            PROFILE HERO
        ========================================== */}

        <section className="profile-card profile-hero-card">

          <div className="profile-top">

            <div className="profile-avatar-wrapper">

              <div className="profile-avatar">

                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={`${studentName} profile`}
                  />
                ) : (
                  initials
                )}

              </div>

              <span
                className={`profile-avatar-status ${
                  accountIsActive
                    ? "active"
                    : "inactive"
                }`}
              ></span>

            </div>


            <div className="profile-user-info">

              <div className="profile-name-row">

                <h2>{studentName}</h2>

                <span className="profile-verified-badge">
                  ✓ Verified Student
                </span>

              </div>

              <p>
                {user?.email || "No email available"}
              </p>

              <div className="profile-badges">

                <span className="profile-role">
                  🎓 Student
                </span>

                {departmentCode && (
                  <span className="profile-department-badge">
                    {departmentCode}
                  </span>
                )}

              </div>

            </div>


            <div
              className={`profile-account-status ${
                accountIsActive
                  ? "status-active"
                  : "status-inactive"
              }`}
            >
              <span>●</span>

              {accountIsActive
                ? "Active Account"
                : "Inactive Account"}
            </div>

          </div>


          <div className="profile-hero-footer">

            <div className="profile-member-info">
              <span>Member since</span>
              <strong>{memberSince}</strong>
            </div>

            <div className="profile-member-info">
              <span>Department</span>
              <strong>{department}</strong>
            </div>

            <div className="profile-member-info">
              <span>Account type</span>
              <strong>Student Account</strong>
            </div>

          </div>

        </section>


        {/* ==========================================
            COMPLAINT STATISTICS
        ========================================== */}

        <section className="profile-statistics-section">

          <div className="profile-section-heading">

            <div>
              <p className="profile-section-eyebrow">
                ACTIVITY OVERVIEW
              </p>

              <h2>Complaint Statistics</h2>

              <p>
                A quick overview of your complaint
                activity on CampusPulse.
              </p>
            </div>

            <button
              className="profile-refresh-btn"
              onClick={fetchComplaintStats}
              disabled={statsLoading}
              type="button"
              title="Refresh complaint statistics"
            >
              ↻ {statsLoading ? "Loading..." : "Refresh"}
            </button>

          </div>


          {statsError && !statsLoading && (
            <div
              className="profile-stats-error"
              role="alert"
            >
              <span>!</span>

              <div>
                <strong>
                  Statistics unavailable
                </strong>

                <p>{statsError}</p>
              </div>

              <button
                onClick={fetchComplaintStats}
                type="button"
              >
                Retry
              </button>
            </div>
          )}


          <div className="profile-stat-grid">

            {/* TOTAL */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon total">
                #
              </div>

              <div className="profile-stat-content">

                <span>Total Complaints</span>

                <strong>
                  {statsLoading ? (
                    <span className="profile-stat-loading">
                      —
                    </span>
                  ) : (
                    statistics.total
                  )}
                </strong>

                <small>
                  All submitted complaints
                </small>

              </div>

            </div>


            {/* PENDING */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon pending">
                ◷
              </div>

              <div className="profile-stat-content">

                <span>Pending</span>

                <strong>
                  {statsLoading
                    ? "—"
                    : statistics.pending}
                </strong>

                <small>
                  Awaiting action
                </small>

              </div>

            </div>


            {/* IN PROGRESS */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon progress">
                →
              </div>

              <div className="profile-stat-content">

                <span>In Progress</span>

                <strong>
                  {statsLoading
                    ? "—"
                    : statistics.inProgress}
                </strong>

                <small>
                  Currently being handled
                </small>

              </div>

            </div>


            {/* RESOLVED */}

            <div className="profile-stat-card">

              <div className="profile-stat-icon resolved">
                ✓
              </div>

              <div className="profile-stat-content">

                <span>Resolved</span>

                <strong>
                  {statsLoading
                    ? "—"
                    : statistics.resolved}
                </strong>

                <small>
                  Successfully resolved
                </small>

              </div>

            </div>

          </div>


          {/* RESOLUTION PROGRESS */}

          <div className="profile-resolution-card">

            <div className="profile-resolution-header">

              <div>
                <strong>
                  Resolution Progress
                </strong>

                <span>
                  {statistics.resolutionRate}% resolved
                </span>
              </div>

              <small>
                {statistics.resolved} of{" "}
                {statistics.total} complaints
              </small>

            </div>

            <div className="profile-progress-track">

              <div
                className="profile-progress-bar"
                style={{
                  width: `${statistics.resolutionRate}%`,
                }}
              ></div>

            </div>

          </div>

        </section>


        {/* ==========================================
            ACCOUNT INFORMATION
        ========================================== */}

        <section className="profile-card profile-content-card">

          <section className="profile-section">

            <div className="profile-section-title-row">

              <div>
                <p className="profile-section-eyebrow">
                  ACCOUNT
                </p>

                <h3>Account Information</h3>
              </div>

              <span className="profile-section-icon">
                👤
              </span>

            </div>


            <div className="profile-info-grid">

              <div className="profile-info-item">
                <span>Full Name</span>

                <strong>
                  {studentName}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Email Address</span>

                <strong>
                  {user?.email || "Not available"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Phone Number</span>

                <strong>
                  {user?.phone || "Not provided"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Account Role</span>

                <strong>
                  Student
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Account Status</span>

                <strong
                  className={
                    accountIsActive
                      ? "profile-value-active"
                      : "profile-value-inactive"
                  }
                >
                  ● {accountStatus}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Member Since</span>

                <strong>
                  {memberSince}
                </strong>
              </div>

            </div>

          </section>


          {/* ==========================================
              DEPARTMENT
          ========================================== */}

          <section className="profile-section">

            <div className="profile-section-title-row">

              <div>
                <p className="profile-section-eyebrow">
                  ACADEMIC
                </p>

                <h3>Department</h3>
              </div>

              <span className="profile-section-icon">
                🎓
              </span>

            </div>


            <div className="profile-department-box">

              <div className="profile-department-icon">
                🎓
              </div>

              <div className="profile-department-content">

                <strong>
                  {department}
                </strong>

                <span>
                  {departmentCode
                    ? `Department Code: ${departmentCode}`
                    : "Your assigned academic department"}
                </span>

              </div>

              <span className="profile-department-status">
                Assigned
              </span>

            </div>

          </section>


          {/* ==========================================
              SECURITY
          ========================================== */}

          <section className="profile-section">

            <div className="profile-section-title-row">

              <div>
                <p className="profile-section-eyebrow">
                  ACCOUNT PROTECTION
                </p>

                <h3>Security</h3>
              </div>

              <span className="profile-section-icon">
                🔒
              </span>

            </div>


            <div className="profile-security-box">

              <div className="profile-security-main">

                <div className="profile-security-icon">
                  🔐
                </div>

                <div>

                  <strong>
                    Authenticated Account
                  </strong>

                  <p>
                    Your account uses secure
                    authenticated access to protect
                    your CampusPulse data.
                  </p>

                </div>

              </div>

              <span className="profile-security-badge">
                🔒 Protected
              </span>

            </div>

          </section>


          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="profile-actions">

            <button
              className="profile-dashboard-btn"
              onClick={goToDashboard}
              type="button"
            >
              ← Dashboard
            </button>

            <button
              className="profile-complaints-btn"
              onClick={goToComplaints}
              type="button"
            >
              View My Complaints →
            </button>

            <button
              className="profile-logout-btn"
              onClick={logout}
              type="button"
            >
              Logout
            </button>

          </div>

        </section>

      </main>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="student-profile-footer">

        <div className="student-profile-footer-content">

          <div className="profile-footer-brand">
            <strong>CampusPulse</strong>

            <span>
              Smart Campus Complaint Management System
            </span>
          </div>

          <div className="profile-footer-right">

            <span>
              Student Portal
            </span>

            <small>
              © {new Date().getFullYear()} CampusPulse.
              All rights reserved.
            </small>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Profile;