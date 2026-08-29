import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./ComplaintDetails.css";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);

        setComplaint(response.data.complaint);
      } catch (error) {
        console.error("Complaint details error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load complaint"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const formatStatus = (status) => {
    return status.replaceAll("_", " ");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusSteps = [
  {
    key: "submitted",
    label: "Submitted",
    description: "Complaint has been submitted successfully.",
  },
  {
    key: "under_review",
    label: "Under Review",
    description: "Your complaint is being reviewed.",
  },
  {
    key: "assigned",
    label: "Assigned",
    description: "Complaint has been assigned to a staff member.",
  },
  {
    key: "in_progress",
    label: "In Progress",
    description: "Staff is currently working on your complaint.",
  },
  {
    key: "resolved",
    label: "Resolved",
    description: "Complaint has been resolved.",
  },
];

const getStatusIndex = (status) => {
  return statusSteps.findIndex(
    (step) => step.key === status
  );
};
  if (loading) {
    return (
      <div className="complaint-details-page">
        <div className="details-loading">
          ⏳ Loading complaint...
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="complaint-details-page">
        <div className="details-empty">
          <div className="details-empty-icon">📋</div>

          <h2>Complaint not found</h2>

          <p>
            This complaint may have been removed or is
            no longer available.
          </p>

          <button
            onClick={() =>
              navigate("/student/complaints")
            }
          >
            ← Back to My Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-details-page">

      {/* HEADER */}

      <div className="details-header">

        <button
          className="details-back-btn"
          onClick={() =>
            navigate("/student/complaints")
          }
        >
          ← Back to My Complaints
        </button>

        <p className="details-label">
          Complaint Details
        </p>

        <h1>{complaint.title}</h1>

        <p className="details-subtitle">
          Submitted on {formatDate(complaint.createdAt)}
        </p>

      </div>

      {/* MAIN CARD */}

      <div className="details-card">

        {/* STATUS */}

        <div className="details-top">

          <div>
            <p className="details-section-label">
              Current Status
            </p>

            <span
              className={`details-status ${complaint.status}`}
            >
              {formatStatus(complaint.status)}
            </span>
          </div>

          <div>
            <p className="details-section-label">
              Priority
            </p>

            <span
              className={`details-priority ${complaint.priority}`}
            >
              {complaint.priority}
            </span>
          </div>

        </div>

        {/* DESCRIPTION */}

        <div className="details-section">

          <h3>Description</h3>

          <p>{complaint.description}</p>

        </div>

        {/* INFORMATION */}

        <div className="details-section">

          <h3>Complaint Information</h3>

          <div className="details-info-grid">

            <div className="details-info-item">
              <span>📍 Location</span>
              <strong>{complaint.location}</strong>
            </div>

            <div className="details-info-item">
              <span>📂 Category</span>
              <strong>{complaint.category}</strong>
            </div>

            <div className="details-info-item">
              <span>⚡ Priority Score</span>
              <strong>
                {complaint.priorityScore ?? 0}
              </strong>
            </div>

            <div className="details-info-item">
              <span>⏱ SLA</span>
              <strong>
                {complaint.slaHours ?? 72} hours
              </strong>
            </div>

          </div>

        </div>

{/* STATUS TIMELINE */}

<div className="details-section">

  <h3>Complaint Progress</h3>

  {complaint.status === "rejected" ? (

    <div className="rejected-timeline">

      <div className="timeline-icon">
        ✕
      </div>

      <div>
        <strong>Complaint Rejected</strong>

        <p>
          This complaint has been rejected by the
          administration.
        </p>
      </div>

    </div>

  ) : (

    <div className="complaint-timeline">

      {statusSteps.map((step, index) => {

        const currentIndex =
          getStatusIndex(complaint.status);

        const isCompleted =
          index <= currentIndex;

        const isCurrent =
          index === currentIndex;

        return (
          <div
            className={`timeline-item ${
              isCompleted ? "completed" : ""
            } ${isCurrent ? "current" : ""}`}
            key={step.key}
          >

            <div className="timeline-marker">

              {isCompleted ? "✓" : index + 1}

            </div>

            {index !== statusSteps.length - 1 && (
              <div className="timeline-line"></div>
            )}

            <div className="timeline-content">

              <strong>
                {step.label}
              </strong>

              <p>
                {isCurrent
                  ? step.description
                  : index < currentIndex
                  ? "Completed"
                  : "Pending"}
              </p>

            </div>

          </div>
        );
      })}

    </div>

  )}

</div>
        {/* ASSIGNMENT */}

        <div className="details-section">

          <h3>Assignment</h3>

          {complaint.assignedTo ? (
            <div className="assigned-staff">

              <div className="staff-avatar">
                {complaint.assignedTo.name
                  ?.charAt(0)
                  .toUpperCase() || "S"}
              </div>

              <div>
                <strong>
                  {complaint.assignedTo.name}
                </strong>

                <p>
                  {complaint.assignedTo.email}
                </p>
              </div>

            </div>
          ) : (
            <p className="not-assigned">
              This complaint has not been assigned yet.
            </p>
          )}

        </div>

        {/* ADMIN NOTE */}

        {complaint.adminNote && (
          <div className="details-section">

            <h3>Admin Note</h3>

            <div className="admin-note">
              {complaint.adminNote}
            </div>

          </div>
        )}

        {/* RESOLVED */}

        {complaint.resolvedAt && (
          <div className="resolved-info">
            ✅ Resolved on{" "}
            {formatDate(complaint.resolvedAt)}
          </div>
        )}

      </div>

    </div>
  );
};

export default ComplaintDetails;