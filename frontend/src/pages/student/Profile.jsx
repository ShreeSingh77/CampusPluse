import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="student-profile-page">

      {/* HEADER */}
      <div className="profile-header">

        <div>
          <p className="profile-label">
            Student Dashboard
          </p>

          <h1>My Profile</h1>

          <p className="profile-subtitle">
            View your CampusPulse account information.
          </p>
        </div>

        <button
          className="profile-back-btn"
          onClick={() => navigate("/student/dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* PROFILE CARD */}
      <div className="profile-card">

        {/* PROFILE TOP */}
        <div className="profile-top">

          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </div>

          <div className="profile-user-info">
            <h2>{user?.name || "Student"}</h2>

            <p>
              {user?.email || "No email available"}
            </p>

            <span className="profile-role">
              Student
            </span>
          </div>

        </div>


        {/* ACCOUNT INFORMATION */}
        <div className="profile-section">

          <h3>Account Information</h3>

          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span>Name</span>
              <strong>
                {user?.name || "Not available"}
              </strong>
            </div>

            <div className="profile-info-item">
              <span>Email</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

            <div className="profile-info-item">
              <span>Role</span>
              <strong>
                {user?.role || "student"}
              </strong>
            </div>

            <div className="profile-info-item">
              <span>Department</span>
              <strong>
                {user?.department?.name ||
                  user?.department ||
                  "Not assigned"}
              </strong>
            </div>

          </div>

        </div>


        {/* ACCOUNT STATUS */}
        <div className="profile-status-box">

          <div className="status-icon">
            ✓
          </div>

          <div>
            <strong>Account Active</strong>

            <p>
              Your CampusPulse student account is active
              and ready to use.
            </p>
          </div>

        </div>


        {/* ACTIONS */}
        <div className="profile-actions">

          <button
            className="profile-complaints-btn"
            onClick={() =>
              navigate("/student/complaints")
            }
          >
            View My Complaints
          </button>

          <button
            className="profile-logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;