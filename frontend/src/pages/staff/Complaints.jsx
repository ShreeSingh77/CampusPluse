
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./Complaints.css";

const StaffComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints/assigned");

        setComplaints(response.data.complaints || []);
      } catch (error) {
        console.error("Fetch staff complaints error:", error);

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
    return status.replace("_", " ");
  };

  return (
    <div className="staff-complaints-page">

      {/* HEADER */}
      <div className="staff-complaints-header">

        <div>
          <p className="page-label">
            Staff Dashboard
          </p>

          <h1>Assigned Complaints</h1>

          <p>
            View and manage complaints assigned to you.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/staff/dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* SUMMARY */}
      <div className="staff-complaints-summary">

        <div className="summary-card">
          <span>Total Assigned</span>
          <strong>{complaints.length}</strong>
        </div>

        <div className="summary-card">
          <span>In Progress</span>
          <strong>
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "in_progress"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Resolved</span>
          <strong>
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "resolved"
              ).length
            }
          </strong>
        </div>

      </div>


      {/* COMPLAINTS */}
      {loading ? (

        <div className="staff-complaints-empty">
          <div className="empty-icon">⏳</div>

          <h3>Loading complaints...</h3>

          <p>
            Please wait while we fetch your assigned complaints.
          </p>
        </div>

      ) : complaints.length === 0 ? (

        <div className="staff-complaints-empty">

          <div className="empty-icon">📋</div>

          <h3>No complaints assigned</h3>

          <p>
            Complaints assigned to you will appear here.
          </p>

        </div>

      ) : (

        <div className="staff-complaints-list">

          {complaints.map((complaint) => (

            <div
              className="staff-complaint-card"
              key={complaint._id}
            >

              <div className="staff-complaint-main">

                <div className="complaint-title-row">

                  <h2>
                    {complaint.title}
                  </h2>

                  <span
                    className={`status-badge ${complaint.status}`}
                  >
                    {getStatusLabel(complaint.status)}
                  </span>

                </div>

                <p className="complaint-description">
                  {complaint.description}
                </p>

                <div className="complaint-meta">

                  <span>
                    📍 {complaint.location}
                  </span>

                  <span>
                    🏷️ {complaint.category}
                  </span>

                  <span
                    className={`priority-badge ${complaint.priority}`}
                  >
                    ⚡ {complaint.priority}
                  </span>

                </div>

                <p className="complaint-date">
                  Submitted{" "}
                  {new Date(
                    complaint.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>


              <div className="staff-complaint-action">

                <button
                  className="view-complaint-btn"
                  onClick={() =>
                    navigate(
                      `/staff/complaints/${complaint._id}`
                    )
                  }
                >
                  View Details →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default StaffComplaints;

