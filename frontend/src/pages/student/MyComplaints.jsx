
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import "./MyComplaints.css";

function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");

        setComplaints(response.data.complaints || []);
      } catch (error) {
        console.error("Fetch complaints error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load complaints"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusLabel = (status) => {
    return status.replaceAll("_", " ");
  };

  if (loading) {
    return (
      <div className="my-complaints-page">
        <div className="complaints-loading">
          <h2>Loading complaints...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-complaints-page">

      {/* HEADER */}
      <header className="complaints-header">

        <div>
          <p className="page-label">
            Student Portal
          </p>

          <h1>My Complaints</h1>

          <p>
            Track all complaints submitted by you.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() =>
            navigate("/student/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* SUMMARY */}
      <div className="complaints-summary">
        <strong>{complaints.length}</strong>
        <span>Total Complaints</span>
      </div>

      {/* COMPLAINTS */}
      {complaints.length === 0 ? (

        <div className="no-complaints">

          <div className="no-complaints-icon">
            📋
          </div>

          <h2>No complaints yet</h2>

          <p>
            You haven't submitted any complaints yet.
          </p>

          <button
            onClick={() =>
              navigate("/student/complaints/new")
            }
          >
            + Submit Complaint
          </button>

        </div>

      ) : (

        <div className="complaints-page-list">

          {complaints.map((complaint) => (

            <div
              className="complaint-page-card"
              key={complaint._id}
            >

              <div className="complaint-page-main">

                <div className="complaint-page-top">

                  <h2>
                    {complaint.title}
                  </h2>

                  <span
                    className={`status-badge ${complaint.status}`}
                  >
                    {getStatusLabel(
                      complaint.status
                    )}
                  </span>

                </div>

                <p className="complaint-description">
                  {complaint.description}
                </p>

                <div className="complaint-details">

                  <span>
                    📍 {complaint.location}
                  </span>

                  <span>
                    📂 {complaint.category}
                  </span>

                  <span>
                    ⚡ {complaint.priority}
                  </span>

                </div>

                <div className="complaint-date">
                  Submitted:{" "}
                  {new Date(
                    complaint.createdAt
                  ).toLocaleDateString()}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyComplaints;

