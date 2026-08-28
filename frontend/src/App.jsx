import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

// Temporary Staff Dashboard
const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Staff Dashboard</h1>
        <p>
          Welcome <strong>{user?.name || "Staff"}</strong>
        </p>
      </div>
    </div>
  );
};

// Home Page
const Home = () => {
  return (
    <div className="home-page">
      <div className="home-card">
        <h1>CampusPulse</h1>
        <p>Smart Campus Complaint Management System</p>

        <div className="home-buttons">
          <a href="/login" className="btn btn-primary">
            Login
          </a>

          <a href="/register" className="btn btn-secondary">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

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

      {/* Staff */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unknown Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;