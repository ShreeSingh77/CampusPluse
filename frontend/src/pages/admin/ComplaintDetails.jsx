import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./ComplaintDetails.css";

const AdminComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState("");

  // ==========================================
  // FETCH COMPLAINT
  // ==========================================

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);

        if (response.data.success) {
          setComplaint(response.data.complaint);
        }
      } catch (error) {
        console.error(
          "Fetch admin complaint details error:",
          error
        );

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

  // ==========================================
  // FETCH ALL ACTIVE STAFF
  // ==========================================

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await api.get("/users/staff");

        if (response.data.success) {
          setStaff(
            response.data.staff ||
              response.data.users ||
              []
          );
        }
      } catch (error) {
        console.error(
          "Fetch staff error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load staff members"
        );
      }
    };

    fetchStaff();
  }, []);

  // ==========================================
  // ASSIGN STAFF
  // ==========================================

  const handleAssignComplaint = async () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      setAssigning(true);

      const response = await api.patch(
        `/complaints/${id}/assign`,
        {
          staffId: selectedStaff,
        }
      );

      if (response.data.success) {
        toast.success(
          "Complaint assigned successfully"
        );

        setComplaint(response.data.complaint);

        setSelectedStaff("");
      }
    }  catch (error) {
  console.error("Assign complaint error:", error);
  console.log("BACKEND ERROR:", error.response?.data);

  toast.error(
    error.response?.data?.message ||
      "Failed to assign complaint"
  );

    } finally {
      setAssigning(false);
    }
  };

  // ==========================================
  // AUTO ASSIGN
  // ==========================================

  const handleAutoAssign = async () => {
    try {
      setAssigning(true);

      const response = await api.patch(
        `/complaints/${id}/auto-assign`
      );

      if (response.data.success) {
        toast.success(
          "Complaint automatically assigned"
        );

        setComplaint(response.data.complaint);

        setSelectedStaff("");
      }
    } catch (error) {
      console.error(
        "Auto assign complaint error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to auto assign complaint"
      );
    } finally {
      setAssigning(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-details-page">
        <div className="admin-details-empty">
          <div className="admin-empty-icon">
            ⏳
          </div>

          <h3>Loading complaint...</h3>

          <p>
            Please wait while we fetch the complaint
            details.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!complaint) {
    return (
      <div className="admin-details-page">
        <div className="admin-details-empty">
          <div className="admin-empty-icon">
            📋
          </div>

          <h3>Complaint not found</h3>

          <p>
            The complaint may have been removed or is
            no longer available.
          </p>

          <button
            className="admin-back-btn"
            onClick={() =>
              navigate("/admin/complaints")
            }
          >
            ← Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-details-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="admin-details-header">

        <button
          className="admin-back-link"
          onClick={() =>
            navigate("/admin/complaints")
          }
        >
          ← Back to Complaints
        </button>

        <p className="admin-page-label">
          Admin Dashboard
        </p>

        <h1>Complaint Details</h1>

        <p className="admin-header-description">
          Review complaint information and manage
          staff assignment.
        </p>

      </div>

      {/* ==========================================
          MAIN LAYOUT
      ========================================== */}

      <div className="admin-details-layout">

        {/* ========================================
            LEFT — COMPLAINT INFORMATION
        ======================================== */}

        <main className="admin-details-main-card">

          <div className="admin-title-row">

            <div>
              <p className="admin-category">
                {complaint.category}
              </p>

              <h2>
                {complaint.title}
              </h2>
            </div>

            <span
              className={`admin-status-badge ${complaint.status}`}
            >
              {complaint.status?.replace(
                "_",
                " "
              )}
            </span>

          </div>

          {/* DESCRIPTION */}

          <section className="admin-details-section">

            <h3>Description</h3>

            <p className="admin-description">
              {complaint.description}
            </p>

          </section>

          {/* INFORMATION */}

          <section className="admin-details-section">

            <h3>Complaint Information</h3>

            <div className="admin-info-grid">

              <div className="admin-info-box">
                <span>📍 Location</span>

                <strong>
                  {complaint.location ||
                    "Not provided"}
                </strong>
              </div>

              <div className="admin-info-box">
                <span>⚡ Priority</span>

                <strong
                  className={`admin-priority ${complaint.priority}`}
                >
                  {complaint.priority}
                </strong>
              </div>

              <div className="admin-info-box">
                <span>📅 Submitted</span>

                <strong>
                  {complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>

              <div className="admin-info-box">
                <span>⏱️ SLA</span>

                <strong>
                  {complaint.slaHours
                    ? `${complaint.slaHours} hours`
                    : "Not available"}
                </strong>
              </div>

            </div>

          </section>

          {/* ======================================
              DEPARTMENT
          ====================================== */}

          <section className="admin-details-section">

            <h3>Department</h3>

            <div className="admin-info-box">

              <span>🏢 Department</span>

              <strong>
                {complaint.department?.name ||
                  "Not assigned"}
              </strong>

              {complaint.department?.code && (
                <span>
                  Code:{" "}
                  {complaint.department.code}
                </span>
              )}

            </div>

          </section>

          {/* ======================================
              REPORTER
          ====================================== */}

          <section className="admin-details-section">

            <h3>Reported By</h3>

            <div className="admin-person-box">

              <div className="admin-person-avatar">
                {complaint.reportedBy?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </div>

              <div>

                <strong>
                  {complaint.reportedBy?.name ||
                    "Unknown Student"}
                </strong>

                <span>
                  {complaint.reportedBy?.email ||
                    "No email available"}
                </span>

                {complaint.reportedBy?.phone && (
                  <span>
                    {complaint.reportedBy.phone}
                  </span>
                )}

              </div>

            </div>

          </section>

          {/* ======================================
              ASSIGNED STAFF
          ====================================== */}

          <section className="admin-details-section">

            <h3>Assigned Staff</h3>

            {complaint.assignedTo ? (

              <div className="admin-person-box">

                <div className="admin-person-avatar">
                  {complaint.assignedTo?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>

                <div>

                  <strong>
                    {complaint.assignedTo?.name ||
                      "Staff Member"}
                  </strong>

                  <span>
                    {complaint.assignedTo?.email ||
                      "No email available"}
                  </span>

                  {complaint.assignedTo
                    ?.department && (
                    <span>
                      Department:{" "}
                      {complaint.assignedTo
                        .department.name ||
                        complaint.assignedTo
                          .department}
                    </span>
                  )}

                </div>

              </div>

            ) : (

              <div className="admin-unassigned">

                <span>⚠️</span>

                <div>

                  <strong>
                    Not Assigned
                  </strong>

                  <p>
                    This complaint has not been
                    assigned to any staff member yet.
                  </p>

                </div>

              </div>

            )}

          </section>

          {/* ======================================
              PRIORITY REASON
          ====================================== */}

          {complaint.priorityReason && (
            <section className="admin-details-section">

              <h3>Priority Reason</h3>

              <div className="admin-priority-reason">
                ⚡ {complaint.priorityReason}
              </div>

            </section>
          )}

          {/* ======================================
              ESCALATION
          ====================================== */}

          {complaint.isEscalated && (
            <section className="admin-details-section">

              <h3>Escalation</h3>

              <div className="admin-escalation-box">

                <strong>
                  🚨 Complaint Escalated
                </strong>

                <p>
                  Escalation Level:{" "}
                  {complaint.escalationLevel ||
                    0}
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

            </section>
          )}

        </main>

        {/* ========================================
            RIGHT — ASSIGNMENT PANEL
        ======================================== */}

        <aside className="admin-assignment-card">

          <div className="assignment-heading">

            <span className="assignment-icon">
              👤
            </span>

            <div>

              <h3>Assign Complaint</h3>

              <p>
                Assign this complaint to an
                appropriate staff member.
              </p>

            </div>

          </div>

          {/* CURRENT ASSIGNMENT */}

          {complaint.assignedTo && (
            <div className="current-assignment">

              <span>
                Currently assigned to
              </span>

              <strong>
                {complaint.assignedTo.name}
              </strong>

            </div>
          )}

          {/* ======================================
              STAFF SELECT
          ====================================== */}

          <label htmlFor="staff">
            Select Staff Member
          </label>

          <select
            id="staff"
            value={selectedStaff}
            onChange={(e) =>
              setSelectedStaff(e.target.value)
            }
            disabled={assigning}
          >

            <option value="">
              Select staff member
            </option>

            {staff.map((member) => (
              <option
                key={member._id}
                value={member._id}
              >
                {member.name}
                {member.department?.name
                  ? ` — ${member.department.name}`
                  : ""}
              </option>
            ))}

          </select>

          {/* ======================================
              ASSIGN BUTTON
          ====================================== */}

          <button
            className="admin-assign-btn"
            onClick={handleAssignComplaint}
            disabled={
              assigning || !selectedStaff
            }
          >
            {assigning
              ? "Assigning..."
              : "Assign Complaint"}
          </button>

          <div className="assignment-divider">
            <span>OR</span>
          </div>

          {/* ======================================
              AUTO ASSIGN
          ====================================== */}

          <button
            className="admin-auto-assign-btn"
            onClick={handleAutoAssign}
            disabled={
              assigning ||
              !!complaint.assignedTo
            }
          >
            {assigning
              ? "Processing..."
              : "⚡ Auto Assign"}
          </button>

          <p className="assignment-note">
            Auto Assign will select an active staff
            member from the complaint's department.
          </p>

        </aside>

      </div>

    </div>
  );
};

export default AdminComplaintDetails;