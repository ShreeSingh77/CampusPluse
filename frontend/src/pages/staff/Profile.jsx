import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Profile.css";

const StaffProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  const userName = user?.name || "Staff Member";
  const userEmail = user?.email || "Not available";
  const userRole = user?.role || "staff";

  // Department can be object or string depending on backend populate
  const userDepartment =
    typeof user?.department === "object"
      ? user?.department?.name
      : user?.department;

  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  // ==========================================
  // FETCH STAFF COMPLAINT STATISTICS
  // ==========================================

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(
          "/complaints/assigned"
        );

        const complaints =
          response.data.complaints || [];

        setStats({
          total: complaints.length,

          inProgress: complaints.filter(
            (complaint) =>
              complaint.status === "in_progress"
          ).length,

          resolved: complaints.filter(
            (complaint) =>
              complaint.status === "resolved"
          ).length,
        });
      } catch (error) {
        console.error(
          "Fetch staff profile stats error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ==========================================
  // FORMAT ROLE
  // ==========================================

  const formatRole = (role) => {
    if (!role) return "Staff";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  return (
    <div className="staff-profile-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="staff-profile-header">

        <div>
          <p className="page-label">
            Staff Dashboard
          </p>

          <h1>My Profile</h1>

          <p>
            View your account information and
            staff activity.
          </p>
        </div>

        <button
          className="profile-dashboard-btn"
          onClick={() =>
            navigate("/staff/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* ======================================
          PROFILE LAYOUT
      ====================================== */}

      <div className="staff-profile-layout">

        {/* ====================================
            MAIN PROFILE CARD
        ==================================== */}

        <div className="staff-profile-main-card">

          {/* PROFILE HERO */}

          <div className="profile-hero">

            <div className="profile-avatar">
              {getInitial()}
            </div>

            <div className="profile-hero-info">

              <h2>
                {userName}
              </h2>

              <p>
                {userEmail}
              </p>

              <span className="profile-role-badge">
                {formatRole(userRole)}
              </span>

            </div>

          </div>


          {/* ==================================
              PERSONAL INFORMATION
          ================================== */}

          <div className="profile-section">

            <h3>
              Personal Information
            </h3>

            <div className="profile-info-grid">

              <div className="profile-info-box">

                <span>
                  Full Name
                </span>

                <strong>
                  {userName}
                </strong>

              </div>


              <div className="profile-info-box">

                <span>
                  Email Address
                </span>

                <strong>
                  {userEmail}
                </strong>

              </div>


              <div className="profile-info-box">

                <span>
                  Account Role
                </span>

                <strong>
                  {formatRole(userRole)}
                </strong>

              </div>


              <div className="profile-info-box">

                <span>
                  Department
                </span>

                <strong>
                  {userDepartment || "Not assigned"}
                </strong>

              </div>


              <div className="profile-info-box">

                <span>
                  Account Status
                </span>

                <strong className="account-active">
                  ● Active
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================
              STAFF ACTIVITY
          ================================== */}

          <div className="profile-section">

            <h3>
              Staff Activity
            </h3>

            <p className="profile-section-description">
              Overview of your assigned complaint
              activity.
            </p>

            <div className="profile-stats-grid">

              {/* TOTAL */}

              <div className="profile-stat-card">

                <div className="profile-stat-icon">
                  📋
                </div>

                <div>
                  <span>
                    Assigned
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.total}
                  </strong>
                </div>

              </div>


              {/* IN PROGRESS */}

              <div className="profile-stat-card">

                <div className="profile-stat-icon">
                  🔄
                </div>

                <div>
                  <span>
                    In Progress
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.inProgress}
                  </strong>
                </div>

              </div>


              {/* RESOLVED */}

              <div className="profile-stat-card">

                <div className="profile-stat-icon">
                  ✅
                </div>

                <div>
                  <span>
                    Resolved
                  </span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.resolved}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ====================================
            SIDE CARD
        ==================================== */}

        <aside className="staff-profile-side-card">

          <div className="side-card-icon">
            👤
          </div>

          <h3>
            Staff Account
          </h3>

          <p>
            Your profile information is linked
            to your CampusPulse staff account.
          </p>


          {/* ROLE */}

          <div className="side-card-role">

            <span>
              Role
            </span>

            <strong>
              {formatRole(userRole)}
            </strong>

          </div>


          {/* DEPARTMENT */}

          <div className="side-card-role">

            <span>
              Department
            </span>

            <strong>
              {userDepartment || "Not assigned"}
            </strong>

          </div>


          {/* STATUS */}

          <div className="side-card-role">

            <span>
              Status
            </span>

            <strong className="account-active">
              Active
            </strong>

          </div>


          {/* VIEW COMPLAINTS */}

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