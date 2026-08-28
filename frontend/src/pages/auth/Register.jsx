import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* LEFT SIDE */}
        <div className="register-info">

          <Link to="/" className="register-logo">
            CampusPulse
          </Link>

          <div className="register-info-content">
            <span className="register-badge">
              🎓 Smart Campus
            </span>

            <h1>
              Join the
              <span> CampusPulse </span>
              community.
            </h1>

            <p>
              Create your account and make campus issue reporting
              simpler, faster and more transparent.
            </p>

            <div className="register-features">
              <div>
                <span>✓</span>
                Report campus complaints easily
              </div>

              <div>
                <span>✓</span>
                Track complaint status
              </div>

              <div>
                <span>✓</span>
                Stay connected with campus administration
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="register-form-section">

          <div className="register-form-header">
            <h2>Create Account</h2>

            <p>
              Get started with your CampusPulse account
            </p>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          <div className="register-login">
            Already have an account?
            <Link to="/login">
              Login
            </Link>
          </div>

          <Link to="/" className="register-back">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Register;