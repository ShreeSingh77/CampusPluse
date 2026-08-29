import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const StaffProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.name || "Staff Member";
  const userEmail = user?.email || "Not available";
  const userRole = user?.role || "staff";

  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="staff-profile-page">

      {/* HEADER */}
      <div className="staff-profile-header">

        <div>
          <p className="page-label">
            Staff Dashboard
          </p>

          <h1>My Profile</h1>

          <p>
            View your account information and staff details.
          </p>
        </div>

        <button
          className="profile-dashboard-btn"
          onClick={() => navigate("/staff/dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* PROFILE CONTENT */}
      <div className="staff-profile-layout">

        {/* PROFILE CARD */}
        <div className="staff-profile-main-card">

          <div className="profile-hero">

            <div className="profile-avatar">
              {getInitial()}
            </div>

            <div className="profile-hero-info">

              <h2>{userName}</h2>

              <p>{userEmail}</p>

              <span className="profile-role-badge">
                {userRole}
              </span>

            </div>

          </div>


          {/* PERSONAL INFORMATION */}
          <div className="profile-section">

            <h3>Personal Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-box">
                <span>Full Name</span>
                <strong>{userName}</strong>
              </div>

              <div className="profile-info-box">
                <span>Email Address</span>
                <strong>{userEmail}</strong>
              </div>

              <div className="profile-info-box">
                <span>Account Role</span>
                <strong>
                  {userRole.replace("_", " ")}
                </strong>
              </div>

              <div className="profile-info-box">
                <span>Account Status</span>

                <strong className="account-active">
                  Active
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* SIDE CARD */}
        <aside className="staff-profile-side-card">

          <div className="side-card-icon">
            👤
          </div>

          <h3>Staff Account</h3>

          <p>
            Your profile information is linked to your
            CampusPulse staff account.
          </p>

          <div className="side-card-role">
            <span>Role</span>

            <strong>
              {userRole.replace("_", " ")}
            </strong>
          </div>

          <button
            className="side-dashboard-btn"
            onClick={() =>
              navigate("/staff/complaints")
            }
          >
            View Assigned Complaints →
          </button>

        </aside>

      </div>

    </div>
  );
};

export default StaffProfile;