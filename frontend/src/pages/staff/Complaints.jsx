import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./Complaints.css";

const StaffComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/complaints/assigned"
        );

        if (response.data.success) {
          setComplaints(
            response.data.complaints || []
          );
        }
      } catch (error) {
        console.error(
          "Fetch staff complaints error:",
          error
        );

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

  // ==========================================
  // FORMATTERS
  // ==========================================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatPriority = (priority) => {
    if (!priority) return "Normal";

    return priority
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        complaints
          .map((complaint) => complaint.category)
          .filter(Boolean)
      ),
    ];
  }, [complaints]);

  // ==========================================
  // FILTERED COMPLAINTS
  // ==========================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        complaint.title
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.description
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        complaint.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        complaint.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "assigned" ||
      complaint.status === "under_review"
  ).length;

  const inProgressComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "in_progress"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "resolved"
    ).length;

  const urgentComplaints =
    complaints.filter(
      (complaint) =>
        complaint.priority === "urgent"
    ).length;

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const hasFilters =
    search ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="staff-complaints-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="staff-complaints-header">

        <div>
          <p className="page-label">
            Staff Dashboard
          </p>

          <h1>Assigned Complaints</h1>

          <p>
            View, filter and manage complaints
            assigned to you.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() =>
            navigate("/staff/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="staff-complaints-summary">

        <div className="summary-card">
          <div className="summary-icon">
            📋
          </div>

          <div>
            <span>Total Assigned</span>
            <strong>
              {loading ? "..." : totalComplaints}
            </strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {loading ? "..." : pendingComplaints}
            </strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">
            🔄
          </div>

          <div>
            <span>In Progress</span>
            <strong>
              {loading
                ? "..."
                : inProgressComplaints}
            </strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">
            🚨
          </div>

          <div>
            <span>Urgent</span>
            <strong>
              {loading
                ? "..."
                : urgentComplaints}
            </strong>
          </div>
        </div>


        <div className="summary-card">
          <div className="summary-icon">
            ✅
          </div>

          <div>
            <span>Resolved</span>
            <strong>
              {loading
                ? "..."
                : resolvedComplaints}
            </strong>
          </div>
        </div>

      </div>


      {/* ======================================
          FILTER SECTION
      ====================================== */}

      {!loading && complaints.length > 0 && (
        <div className="complaints-filter-panel">

          <div className="filter-search">

            <span>🔎</span>

            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="assigned">
              Assigned
            </option>

            <option value="under_review">
              Under Review
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="resolved">
              Resolved
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>


          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="all">
              All Priority
            </option>

            <option value="urgent">
              Urgent
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>


          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {formatStatus(category)}
              </option>
            ))}
          </select>


          {hasFilters && (
            <button
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}

        </div>
      )}


      {/* ======================================
          RESULT INFO
      ====================================== */}

      {!loading &&
        complaints.length > 0 && (
          <div className="complaints-result-info">
            <span>
              Showing{" "}
              <strong>
                {filteredComplaints.length}
              </strong>{" "}
              of{" "}
              <strong>
                {complaints.length}
              </strong>{" "}
              complaints
            </span>
          </div>
        )}


      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="staff-complaints-empty">

          <div className="empty-icon">
            ⏳
          </div>

          <h3>
            Loading complaints...
          </h3>

          <p>
            Please wait while we fetch your
            assigned complaints.
          </p>

        </div>

      ) : complaints.length === 0 ? (

        /* ====================================
           NO COMPLAINTS
        ==================================== */

        <div className="staff-complaints-empty">

          <div className="empty-icon">
            📋
          </div>

          <h3>
            No complaints assigned
          </h3>

          <p>
            Complaints assigned to you will
            appear here.
          </p>

        </div>

      ) : filteredComplaints.length === 0 ? (

        /* ====================================
           NO FILTER RESULTS
        ==================================== */

        <div className="staff-complaints-empty">

          <div className="empty-icon">
            🔎
          </div>

          <h3>
            No matching complaints
          </h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            className="clear-empty-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        /* ====================================
           COMPLAINT LIST
        ==================================== */

        <div className="staff-complaints-list">

          {filteredComplaints.map(
            (complaint) => (

              <div
                className="staff-complaint-card"
                key={complaint._id}
              >

                <div className="staff-complaint-main">

                  <div className="complaint-title-row">

                    <div className="title-content">

                      <span className="complaint-category">
                        {formatStatus(
                          complaint.category ||
                            "General"
                        )}
                      </span>

                      <h2>
                        {complaint.title}
                      </h2>

                    </div>

                    <span
                      className={`status-badge ${
                        complaint.status || ""
                      }`}
                    >
                      {formatStatus(
                        complaint.status
                      )}
                    </span>

                  </div>


                  <p className="complaint-description">
                    {complaint.description}
                  </p>


                  <div className="complaint-meta">

                    <span>
                      📍{" "}
                      {complaint.location ||
                        "Location not provided"}
                    </span>

                    <span>
                      🏷️{" "}
                      {formatStatus(
                        complaint.category ||
                          "General"
                      )}
                    </span>

                    <span
                      className={`priority-badge ${
                        complaint.priority || ""
                      }`}
                    >
                      ⚡{" "}
                      {formatPriority(
                        complaint.priority
                      )}
                    </span>

                  </div>


                  <p className="complaint-date">
                    Submitted{" "}
                    {complaint.createdAt
                      ? new Date(
                          complaint.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
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

            )
          )}

        </div>

      )}

    </div>
  );
};

export default StaffComplaints;