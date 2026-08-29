import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./Complaints.css";

const AdminComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await api.get("/complaints");

      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Fetch admin complaints error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";

    return status.replace("_", " ");
  };

  const getPriorityLabel = (priority) => {
    if (!priority) return "Not set";

    return priority;
  };

  return (
    <div className="admin-complaints-page">

      {/* HEADER */}
      <div className="admin-complaints-header">

        <div>
          <p className="admin-page-label">
            Admin Dashboard
          </p>

          <h1>Complaint Management</h1>

          <p>
            Review campus complaints, monitor their status,
            and manage assignments.
          </p>
        </div>

        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* SUMMARY */}
      <div className="admin-complaints-summary">

        <div className="admin-summary-card">
          <span>Total Complaints</span>
          <strong>{complaints.length}</strong>
        </div>

        <div className="admin-summary-card">
          <span>Pending</span>
          <strong>
            {
              complaints.filter(
                (complaint) =>
                  complaint.status === "submitted" ||
                  complaint.status === "under_review"
              ).length
            }
          </strong>
        </div>

        <div className="admin-summary-card">
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

        <div className="admin-summary-card">
          <span>Escalated</span>
          <strong>
            {
              complaints.filter(
                (complaint) =>
                  complaint.isEscalated === true
              ).length
            }
          </strong>
        </div>

      </div>


      {/* COMPLAINT LIST */}
      <div className="admin-complaints-card">

        <div className="admin-list-header">

          <div>
            <h2>All Complaints</h2>

            <p>
              Complaints submitted by students.
            </p>
          </div>

          <span className="admin-count-badge">
            {complaints.length} Total
          </span>

        </div>


        {loading ? (

          <div className="admin-complaints-empty">

            <div className="admin-empty-icon">
              ⏳
            </div>

            <h3>Loading complaints...</h3>

            <p>
              Please wait while we fetch the latest complaints.
            </p>

          </div>

        ) : complaints.length === 0 ? (

          <div className="admin-complaints-empty">

            <div className="admin-empty-icon">
              📋
            </div>

            <h3>No complaints to display</h3>

            <p>
              New complaints submitted by students will
              appear here for review.
            </p>

          </div>

        ) : (

          <div className="admin-complaints-list">

            {complaints.map((complaint) => (

              <div
                className="admin-complaint-item"
                key={complaint._id}
              >

                <div className="admin-complaint-content">

                  <div className="admin-complaint-title-row">

                    <div>

                      <span className="admin-category">
                        {complaint.category || "General"}
                      </span>

                      <h3>
                        {complaint.title}
                      </h3>

                    </div>

                    <span
                      className={`admin-status ${complaint.status}`}
                    >
                      {getStatusLabel(complaint.status)}
                    </span>

                  </div>


                  <p className="admin-description">
                    {complaint.description}
                  </p>


                  <div className="admin-complaint-meta">

                    <span>
                      📍 {complaint.location || "Not provided"}
                    </span>

                    <span>
                      👤{" "}
                      {complaint.reportedBy?.name ||
                        "Unknown Student"}
                    </span>

                    <span
                      className={`admin-priority ${complaint.priority}`}
                    >
                      ⚡ {getPriorityLabel(
                        complaint.priority
                      )}
                    </span>

                    {complaint.isEscalated && (
                      <span className="admin-escalated">
                        🚨 Escalated
                      </span>
                    )}

                  </div>


                  <p className="admin-date">
                    Submitted{" "}
                    {complaint.createdAt
                      ? new Date(
                          complaint.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                </div>


                <div className="admin-complaint-action">

                  <button
                    className="admin-view-btn"
                    onClick={() =>
                      navigate(
                        `/admin/complaints/${complaint._id}`
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

    </div>
  );
};

export default AdminComplaints;