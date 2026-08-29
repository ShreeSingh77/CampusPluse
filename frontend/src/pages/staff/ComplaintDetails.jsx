
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./ComplaintDetails.css";

const StaffComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);

        const data = response.data.complaint;

        setComplaint(data);
        setStatus(data?.status || "");
      } catch (error) {
        console.error("Fetch complaint details error:", error);

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
const statusOptions = {
  submitted: [
    { value: "under_review", label: "Under Review" },
    { value: "assigned", label: "Assigned" },
    { value: "rejected", label: "Rejected" },
  ],

  under_review: [
    { value: "assigned", label: "Assigned" },
    { value: "rejected", label: "Rejected" },
  ],

  assigned: [
    { value: "in_progress", label: "In Progress" },
    { value: "rejected", label: "Rejected" },
  ],

  in_progress: [
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
  ],

  resolved: [],
  rejected: [],
};
  const handleStatusUpdate = async () => {
    if (!status || status === complaint.status) {
      toast.error("Please select a different status");
      return;
    }

    try {
      setUpdating(true);

      const response = await api.patch(
        `/complaints/${id}/status`,
        {
          status,
        }
      );

      if (response.data.success) {
        toast.success("Complaint status updated");

        setComplaint((prev) => ({
          ...prev,
          status,
        }));
      }
    } catch (error) {
      console.error("Update complaint status error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="staff-details-page">
        <div className="details-empty">
          <div className="details-empty-icon">⏳</div>
          <h3>Loading complaint...</h3>
          <p>Please wait while we fetch the complaint details.</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="staff-details-page">
        <div className="details-empty">
          <div className="details-empty-icon">📋</div>
          <h3>Complaint not found</h3>
          <p>
            The complaint may have been removed or is no longer available.
          </p>

          <button
            className="back-list-btn"
            onClick={() => navigate("/staff/complaints")}
          >
            ← Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-details-page">

      {/* HEADER */}
      <div className="staff-details-header">

        <button
          className="back-details-btn"
          onClick={() => navigate("/staff/complaints")}
        >
          ← Back to Complaints
        </button>

        <div>
          <p className="page-label">
            Staff Dashboard
          </p>

          <h1>Complaint Details</h1>

          <p>
            Review the complaint and update its current status.
          </p>
        </div>

      </div>


      {/* MAIN CONTENT */}
      <div className="details-layout">

        {/* LEFT */}
        <div className="details-main-card">

          <div className="details-title-row">

            <div>
              <p className="details-category">
                {complaint.category}
              </p>

              <h2>{complaint.title}</h2>
            </div>

            <span
              className={`details-status ${complaint.status}`}
            >
              {complaint.status.replace("_", " ")}
            </span>

          </div>


          {/* DESCRIPTION */}
          <div className="details-section">

            <h3>Description</h3>

            <p className="details-description">
              {complaint.description}
            </p>

          </div>


          {/* INFORMATION */}
          <div className="details-section">

            <h3>Complaint Information</h3>

            <div className="details-info-grid">

              <div className="info-box">
                <span>📍 Location</span>
                <strong>
                  {complaint.location || "Not provided"}
                </strong>
              </div>

              <div className="info-box">
                <span>⚡ Priority</span>
                <strong className={`priority-text ${complaint.priority}`}>
                  {complaint.priority}
                </strong>
              </div>

              <div className="info-box">
                <span>📅 Submitted</span>
                <strong>
                  {complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>

              <div className="info-box">
                <span>⏱️ SLA</span>
                <strong>
                  {complaint.slaHours
                    ? `${complaint.slaHours} hours`
                    : "Not available"}
                </strong>
              </div>

            </div>

          </div>


          {/* PRIORITY REASON */}
          {complaint.priorityReason && (
            <div className="details-section">

              <h3>Priority Reason</h3>

              <div className="priority-reason">
                ⚡ {complaint.priorityReason}
              </div>

            </div>
          )}


          {/* ESCALATION */}
          {complaint.isEscalated && (
            <div className="details-section">

              <h3>Escalation</h3>

              <div className="escalation-box">

                <strong>
                  🚨 Complaint Escalated
                </strong>

                <p>
                  Escalation Level:{" "}
                  {complaint.escalationLevel || 0}
                </p>

                {complaint.escalatedAt && (
                  <p>
                    Escalated on:{" "}
                    {new Date(
                      complaint.escalatedAt
                    ).toLocaleString()}
                  </p>
                )}

              </div>

            </div>
          )}

        </div>


        {/* RIGHT */}
        <aside className="details-side-card">

          <h3>Update Status</h3>

          <p>
            Change the current status of this complaint.
          </p>

          <label htmlFor="status">
            Complaint Status
          </label>

         <select
  id="status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  disabled={updating}
>
  <option value={complaint.status}>
    Current: {complaint.status.replace("_", " ")}
  </option>

  {(statusOptions[complaint.status] || []).map((option) => (
    <option
      key={option.value}
      value={option.value}
    >
      {option.label}
    </option>
  ))}
</select>

          <button
            className="update-status-btn"
            onClick={handleStatusUpdate}
            disabled={updating || status === complaint.status}
          >
            {updating
              ? "Updating..."
              : "Update Status"}
          </button>

        </aside>

      </div>

    </div>
  );
};


export default StaffComplaintDetails;