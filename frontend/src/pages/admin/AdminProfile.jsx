import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminProfile.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="admin-profile-page">
        <div className="admin-profile-empty">
          <div className="admin-profile-empty-icon">👤</div>

          <h2>Profile unavailable</h2>

          <p>
            Please login again to view your profile.
          </p>

          <button
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const adminName = user.name || "Administrator";

  const initials =
    adminName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  const role =
    user.role === "super_admin"
      ? "Super Administrator"
      : "Administrator";

  return (
    <div className="admin-profile-page">

      {/* ================= NAVBAR ================= */}

      <nav className="admin-profile-navbar">

        <div className="admin-profile-brand">
          CampusPulse
        </div>

        <div className="admin-profile-nav-actions">

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/admin/complaints")
            }
          >
            Complaints
          </button>

          <button
            onClick={() =>
              navigate("/admin/notifications")
            }
          >
            Notifications
          </button>

          <button className="active">
            Profile
          </button>
           
           
        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="admin-profile-main">

        {/* HEADER */}

        <div className="admin-profile-page-header">

          <button
            className="admin-profile-back"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <p>Admin Dashboard</p>

          <h1>My Profile</h1>

          <span>
            View your CampusPulse administrator account
            information.
          </span>

        </div>

        {/* ================= PROFILE CARD ================= */}

        <section className="admin-profile-card">

          {/* PROFILE TOP */}

          <div className="admin-profile-top">

            <div className="admin-profile-avatar">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Admin profile"
                />
              ) : (
                initials
              )}
            </div>

            <div className="admin-profile-identity">

              <h2>{adminName}</h2>

              <p>{user.email || "No email available"}</p>

              <span className="admin-role-badge">
                🛡️ {role}
              </span>

            </div>

            <div className="admin-account-status">
              <span>●</span>
              {user.isActive
                ? "Active Account"
                : "Inactive Account"}
            </div>

          </div>

          {/* DIVIDER */}

          <div className="admin-profile-divider" />

          {/* ACCOUNT INFORMATION */}

          <section className="admin-profile-section">

            <h3>Account Information</h3>

            <div className="admin-profile-grid">

              <div className="admin-profile-info">

                <span>👤 Full Name</span>

                <strong>
                  {user.name || "Not available"}
                </strong>

              </div>

              <div className="admin-profile-info">

                <span>📧 Email Address</span>

                <strong>
                  {user.email || "Not available"}
                </strong>

              </div>

              <div className="admin-profile-info">

                <span>📱 Phone Number</span>

                <strong>
                  {user.phone || "Not provided"}
                </strong>

              </div>

              <div className="admin-profile-info">

                <span>🛡️ Account Role</span>

                <strong>
                  {role}
                </strong>

              </div>

              <div className="admin-profile-info">

                <span>🟢 Account Status</span>

                <strong>
                  {user.isActive
                    ? "Active"
                    : "Inactive"}
                </strong>

              </div>

              <div className="admin-profile-info">

                <span>📅 Member Since</span>

                <strong>
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>

              </div>

            </div>

          </section>

          {/* DEPARTMENT */}

          <section className="admin-profile-section">

            <h3>Department</h3>

            <div className="admin-department-box">

              <div className="admin-department-icon">
                🏢
              </div>

              <div>

                <strong>
                  {user.department?.name ||
                    "All Departments"}
                </strong>

                <span>
                  {user.department?.code
                    ? `Department Code: ${user.department.code}`
                    : "Administrative access across campus departments"}
                </span>

              </div>

            </div>

          </section>

          {/* SECURITY */}

          <section className="admin-profile-section">

            <h3>Security</h3>

            <div className="admin-security-box">

              <div>

                <strong>
                  Account Security
                </strong>

                <p>
                  Your account is protected with
                  authenticated access.
                </p>

              </div>

              <span className="security-badge">
                🔒 Protected
              </span>

            </div>

          </section>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="admin-profile-footer">

        <strong>CampusPulse</strong>

        <span>
          Smart Campus Complaint Management System
        </span>

        <small>
          © 2026 CampusPulse. All rights reserved.
        </small>

      </footer>

    </div>
  );
};

export default AdminProfile;