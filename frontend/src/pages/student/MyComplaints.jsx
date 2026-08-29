import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./MyComplaints.css";

const MyComplaints = () => {
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

  const formatStatus = (status) => {
    return status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPriority = (priority) => {
    return priority
      ?.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="my-complaints-page">

      {/* HEADER */}

      <div className="my-complaints-header">

        <button
          className="back-button"
          onClick={() =>
            navigate("/student/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <p className="page-label">
          Student Dashboard
        </p>

        <h1>My Complaints</h1>

        <p className="page-description">
          View and track all the complaints you have
          submitted.
        </p>

      </div>


      {/* CONTENT */}

      <div className="my-complaints-card">

        {loading ? (

          <div className="complaints-loading">
            <div className="loading-icon">⏳</div>

            <h3>Loading complaints...</h3>

            <p>
              Please wait while we fetch your complaints.
            </p>
          </div>

        ) : complaints.length === 0 ? (

          <div className="complaints-empty">

            <div className="empty-icon">
              📋
            </div>

            <h3>No complaints yet</h3>

            <p>
              You haven't submitted any complaints.
            </p>

            <button
              className="new-complaint-button"
              onClick={() =>
                navigate("/student/complaints/new")
              }
            >
              + Submit New Complaint
            </button>

          </div>

        ) : (

          <div className="complaints-list">

            {complaints.map((complaint) => (

              <div
                className="my-complaint-item"
                key={complaint._id}
              >

                {/* MAIN CONTENT */}

                <div className="complaint-main">

                  <div className="complaint-title-row">

                    <h3>
                      {complaint.title}
                    </h3>

                    <span
                      className={`complaint-status ${complaint.status}`}
                    >
                      {formatStatus(complaint.status)}
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
                      📂 {formatStatus(complaint.category)}
                    </span>

                    <span>
                      📅 {formatDate(complaint.createdAt)}
                    </span>

                  </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="complaint-side">

                  <span
                    className={`complaint-priority ${complaint.priority}`}
                  >
                    {formatPriority(complaint.priority)}
                  </span>

                  <div className="complaint-date">
  Submitted on{" "}
  {formatDate(complaint.createdAt)}
</div>

<button
  className="view-details-btn"
  onClick={() =>
    navigate(`/student/complaints/${complaint._id}`)
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

export default MyComplaints;