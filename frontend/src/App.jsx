import { Navigate, Route, Routes ,Link} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "react-hot-toast";

//student
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NewComplaint from "./pages/student/NewComplaint";
import MyComplaints from "./pages/student/MyComplaints";
import ComplaintDetails from "./pages/student/ComplaintDetails";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

//staff
import StaffDashboard from "./pages/staff/Dashboard";
import StaffComplaints from "./pages/staff/Complaints";
import StaffComplaintDetails from "./pages/staff/ComplaintDetails";
// Home Page
// Home Page
const Home = () => {
  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-navbar">
        <Link to="/" className="logo">
          CampusPulse
        </Link>

        <div className="nav-buttons">
          <Link to="/login" className="nav-login">
            Login
          </Link>

          <Link to="/register" className="nav-register">
            Register
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">

          {/* LEFT */}
          <div>
            <div className="hero-badge">
              🚀 Smart Campus Management
            </div>

            <h1>
              Make Your Campus
              <span> Better Together.</span>
            </h1>

            <p className="hero-description">
              CampusPulse is a smart complaint management system that
              helps students report campus issues and enables staff and
              administrators to resolve them efficiently.
            </p>

            <div className="hero-buttons">
              <Link to="/login" className="primary-button">
                Login to CampusPulse →
              </Link>

              <Link to="/register" className="secondary-button">
                Create Account
              </Link>
            </div>
          </div>

          {/* RIGHT - DASHBOARD PREVIEW */}
          <div className="hero-visual">
            <div className="dashboard-preview">

              <div className="preview-header">
                <span className="preview-title">
                  Complaint Dashboard
                </span>

                <span className="preview-status">
                  ● Live
                </span>
              </div>

              <div className="preview-card">
                <div className="preview-card-top">
                  <h4>Water Supply Issue</h4>
                  <span className="status pending">
                    Pending
                  </span>
                </div>

                <p>
                  Hostel Block A • Submitted today
                </p>
              </div>

              <div className="preview-card">
                <div className="preview-card-top">
                  <h4>Classroom Fan Repair</h4>
                  <span className="status progress">
                    In Progress
                  </span>
                </div>

                <p>
                  CSE Department • Assigned to Maintenance
                </p>
              </div>

              <div className="preview-card">
                <div className="preview-card-top">
                  <h4>Library Light Issue</h4>
                  <span className="status resolved">
                    Resolved
                  </span>
                </div>

                <p>
                  Central Library • Resolved yesterday
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">

        <div className="section-heading">
          <h2>Everything Your Campus Needs</h2>

          <p>
            A centralized platform for students, staff and administrators
            to manage campus complaints efficiently.
          </p>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              📝
            </div>

            <h3>Easy Complaints</h3>

            <p>
              Students can quickly submit complaints and track their
              progress from one place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              ⚡
            </div>

            <h3>Smart Assignment</h3>

            <p>
              Complaints can be assigned to the appropriate staff for
              faster resolution.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              📊
            </div>

            <h3>Track Everything</h3>

            <p>
              Administrators can monitor complaints, statuses and campus
              issues through dashboards.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">

          <h2>Ready to improve your campus?</h2>

          <p>
            Join CampusPulse and make campus problem reporting
            faster, smarter and more transparent.
          </p>

          <Link to="/register" className="cta-button">
            Get Started →
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">

        <div className="footer-logo">
          CampusPulse
        </div>

        <div>
          Smart Campus Complaint Management System
        </div>

      </footer>

    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Session restore ho raha hai
  if (loading) {
    return (
      <div className="loading-page">
        <p>Loading CampusPulse...</p>
      </div>
    );
  }

  // User logged in nahi hai
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role allowed nahi hai
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* New Complaint */}
        <Route
          path="/student/complaints/new"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <NewComplaint />
            </ProtectedRoute>
          }
        />


       <Route
  path="/student/complaints"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <MyComplaints />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/notifications"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/profile"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/student/complaints/:id"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <ComplaintDetails />
    </ProtectedRoute>
  }
/>

        {/* Staff */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/staff/complaints"
  element={
    <ProtectedRoute allowedRoles={["staff"]}>
      <StaffComplaints />
    </ProtectedRoute>
  }
/>
<Route
  path="/staff/complaints/:id"
  element={
    <ProtectedRoute allowedRoles={["staff"]}>
      <StaffComplaintDetails />
    </ProtectedRoute>
  }
/>
     
        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;