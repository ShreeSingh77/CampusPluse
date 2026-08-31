import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./MyComplaints.css";

const MyComplaints = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [unreadCount, setUnreadCount] = useState(0);

  // =====================================================
  // FETCH COMPLAINTS
  // =====================================================

  const fetchComplaints = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/complaints/my");

      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Fetch complaints error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your complaints."
      );

      if (showRefresh) {
        toast.error(
          error.response?.data?.message ||
            "Failed to refresh complaints"
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // FETCH NOTIFICATION COUNT
  // =====================================================

  const fetchNotificationCount = async () => {
    try {
      const response = await api.get("/notifications");

      const notifications =
        response.data.notifications || [];

      const unread = notifications.filter(
        (notification) => !notification.isRead
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error(
        "Notification count error:",
        error
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchComplaints();
    fetchNotificationCount();
  }, []);

  // =====================================================
  // FORMAT HELPERS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatPriority = (priority) => {
    if (!priority) return "Unknown";

    return priority.replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredComplaints = useMemo(() => {
    let result = [...complaints];

    // SEARCH
    if (searchTerm.trim()) {
      const search = searchTerm
        .trim()
        .toLowerCase();

      result = result.filter((complaint) => {
        const title =
          complaint.title?.toLowerCase() || "";

        const description =
          complaint.description?.toLowerCase() || "";

        const location =
          complaint.location?.toLowerCase() || "";

        const category =
          complaint.category?.toLowerCase() || "";

        return (
          title.includes(search) ||
          description.includes(search) ||
          location.includes(search) ||
          category.includes(search)
        );
      });
    }

    // STATUS FILTER
    if (statusFilter !== "all") {
      result = result.filter(
        (complaint) =>
          complaint.status === statusFilter
      );
    }

    // PRIORITY FILTER
    if (priorityFilter !== "all") {
      result = result.filter(
        (complaint) =>
          complaint.priority === priorityFilter
      );
    }

    // SORT
    result.sort((a, b) => {
      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      if (sortOrder === "oldest") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

    return result;
  }, [
    complaints,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortOrder,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalComplaints = complaints.length;

  const activeComplaints = complaints.filter(
    (complaint) =>
      !["resolved", "rejected"].includes(
        complaint.status
      )
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "resolved"
  ).length;

  const urgentComplaints = complaints.filter(
    (complaint) =>
      complaint.priority === "urgent"
  ).length;

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortOrder("newest");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sortOrder !== "newest";

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="my-complaints-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="complaints-navbar">

        {/* BRAND */}

        <div
          className="complaints-navbar-brand"
          onClick={() =>
            goTo("/student/dashboard")
          }
        >
          CampusPulse
        </div>

        {/* DESKTOP NAVIGATION */}

        <div className="complaints-navigation">

          <button
            className="complaints-nav-link"
            onClick={() =>
              goTo("/student/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className="complaints-nav-link active"
            onClick={() =>
              goTo("/student/complaints")
            }
          >
            My Complaints
          </button>

          <button
            className="complaints-nav-link"
            onClick={() =>
              goTo("/student/notifications")
            }
          >
            Notifications

            {unreadCount > 0 && (
              <span className="complaints-nav-badge">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            className="complaints-nav-link"
            onClick={() =>
              goTo("/student/profile")
            }
          >
            Profile
          </button>

        </div>

        {/* USER */}

        <div className="complaints-user">

          <span className="complaints-user-name">
            {user?.name || "Student"}
          </span>

          <div className="complaints-user-avatar">
            {user?.name
              ?.charAt(0)
              .toUpperCase() || "S"}
          </div>

          {/* DESKTOP LOGOUT */}

          <button
            className="complaints-logout"
            onClick={logout}
          >
            Logout
          </button>

          {/* MOBILE HAMBURGER */}

          <button
            className={`complaints-hamburger ${
              menuOpen
                ? "hamburger-active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* MOBILE MENU */}

        {menuOpen && (
          <div className="complaints-mobile-navigation">

            <button
              className="complaints-mobile-nav-link"
              onClick={() =>
                goTo("/student/dashboard")
              }
            >
              Dashboard
            </button>

            <button
              className="complaints-mobile-nav-link active"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              My Complaints
            </button>

            <button
              className="complaints-mobile-nav-link"
              onClick={() =>
                goTo("/student/notifications")
              }
            >
              <span>Notifications</span>

              {unreadCount > 0 && (
                <span className="complaints-nav-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              className="complaints-mobile-nav-link"
              onClick={() =>
                goTo("/student/profile")
              }
            >
              Profile
            </button>

            <button
              className="complaints-mobile-logout"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </button>

          </div>
        )}

      </nav>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="my-complaints-main">

        {/* HEADER */}

        <section className="my-complaints-header">

          <div className="header-left">

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
              View, track and manage all the
              complaints you have submitted.
            </p>

          </div>

          <div className="header-actions">

            <button
              className="refresh-button"
              onClick={() =>
                fetchComplaints(true)
              }
              disabled={refreshing}
            >
              {refreshing
                ? "↻ Refreshing..."
                : "↻ Refresh"}
            </button>

            <button
              className="new-complaint-button"
              onClick={() =>
                navigate(
                  "/student/complaints/new"
                )
              }
            >
              + New Complaint
            </button>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        {!loading && !error && (
          <section className="complaint-stats">

            <div className="stat-card">
              <div className="stat-icon">
                📋
              </div>

              <div>
                <span>Total Complaints</span>
                <strong>
                  {totalComplaints}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon active-icon">
                🔄
              </div>

              <div>
                <span>Active</span>
                <strong>
                  {activeComplaints}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon resolved-icon">
                ✓
              </div>

              <div>
                <span>Resolved</span>
                <strong>
                  {resolvedComplaints}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon urgent-icon">
                🚨
              </div>

              <div>
                <span>Urgent</span>
                <strong>
                  {urgentComplaints}
                </strong>
              </div>
            </div>

          </section>
        )}

        {/* =================================================
            CONTENT CARD
        ================================================= */}

        <section className="my-complaints-card">

          {/* ERROR */}

          {error && !loading ? (
            <div className="complaints-error">

              <div className="error-icon">
                ⚠️
              </div>

              <h3>
                Unable to load complaints
              </h3>

              <p>{error}</p>

              <button
                className="retry-button"
                onClick={() =>
                  fetchComplaints()
                }
              >
                Try Again
              </button>

            </div>
          ) : loading ? (

            /* LOADING */

            <div className="complaints-loading">

              <div className="loading-spinner"></div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while we fetch
                your complaints.
              </p>

            </div>
          ) : (

            <>
              {/* =================================================
                  FILTER TOOLBAR
              ================================================= */}

              <div className="complaints-toolbar">

                <div className="toolbar-heading">

                  <div>
                    <h2>
                      Complaint History
                    </h2>

                    <p>
                      {filteredComplaints.length} of{" "}
                      {complaints.length} complaints
                      showing
                    </p>
                  </div>

                </div>

                {/* SEARCH */}

                <div className="complaint-search">

                  <span className="search-icon">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Search complaints..."
                  />

                  {searchTerm && (
                    <button
                      className="clear-search"
                      onClick={() =>
                        setSearchTerm("")
                      }
                    >
                      ×
                    </button>
                  )}

                </div>

                {/* FILTERS */}

                <div className="complaint-filters">

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                  >
                    <option value="all">
                      All Status
                    </option>

                    <option value="submitted">
                      Submitted
                    </option>

                    <option value="under_review">
                      Under Review
                    </option>

                    <option value="assigned">
                      Assigned
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
                    onChange={(event) =>
                      setPriorityFilter(
                        event.target.value
                      )
                    }
                  >
                    <option value="all">
                      All Priority
                    </option>

                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="urgent">
                      Urgent
                    </option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(
                        event.target.value
                      )
                    }
                  >
                    <option value="newest">
                      Newest First
                    </option>

                    <option value="oldest">
                      Oldest First
                    </option>
                  </select>

                  {hasActiveFilters && (
                    <button
                      className="clear-filters-button"
                      onClick={clearFilters}
                    >
                      Clear
                    </button>
                  )}

                </div>

              </div>

              {/* =================================================
                  EMPTY RESULT
              ================================================= */}

              {complaints.length === 0 ? (

                <div className="complaints-empty">

                  <div className="empty-icon">
                    📋
                  </div>

                  <h3>
                    No complaints yet
                  </h3>

                  <p>
                    You haven't submitted any
                    complaints.
                  </p>

                  <button
                    className="new-complaint-button"
                    onClick={() =>
                      navigate(
                        "/student/complaints/new"
                      )
                    }
                  >
                    + Submit New Complaint
                  </button>

                </div>

              ) : filteredComplaints.length ===
                0 ? (

                <div className="no-results">

                  <div className="no-results-icon">
                    🔎
                  </div>

                  <h3>
                    No matching complaints
                  </h3>

                  <p>
                    Try changing your search or
                    filter options.
                  </p>

                  <button
                    className="clear-filters-button large"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>

                </div>

              ) : (

                /* =================================================
                    COMPLAINT LIST
                ================================================= */

                <div className="complaints-list">

                  {filteredComplaints.map(
                    (complaint) => (

                      <article
                        className="my-complaint-item"
                        key={complaint._id}
                      >

                        {/* MAIN */}

                        <div className="complaint-main">

                          <div className="complaint-title-row">

                            <h3>
                              {complaint.title ||
                                "Untitled Complaint"}
                            </h3>

                            <span
                              className={`complaint-status ${
                                complaint.status ||
                                "unknown"
                              }`}
                            >
                              {formatStatus(
                                complaint.status
                              )}
                            </span>

                          </div>

                          <p className="complaint-description">
                            {complaint.description ||
                              "No description available."}
                          </p>

                          <div className="complaint-details">

                            <span>
                              📍{" "}
                              {complaint.location ||
                                "Location not specified"}
                            </span>

                            <span>
                              📂{" "}
                              {formatStatus(
                                complaint.category
                              )}
                            </span>

                            <span>
                              📅{" "}
                              {formatDate(
                                complaint.createdAt
                              )}
                            </span>

                          </div>

                        </div>

                        {/* SIDE */}

                        <div className="complaint-side">

                          <div className="complaint-badges">

                            <span
                              className={`complaint-priority ${
                                complaint.priority ||
                                "unknown"
                              }`}
                            >
                              {formatPriority(
                                complaint.priority
                              )}
                            </span>

                          </div>

                          <div className="complaint-date">

                            <span>
                              Submitted
                            </span>

                            <strong>
                              {formatDateTime(
                                complaint.createdAt
                              )}
                            </strong>

                          </div>

                          <button
                            className="view-details-btn"
                            onClick={() =>
                              navigate(
                                `/student/complaints/${complaint._id}`
                              )
                            }
                          >
                            View Details →
                          </button>

                        </div>

                      </article>
                    )
                  )}

                </div>
              )}
            </>
          )}

        </section>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="student-complaints-footer">

        <div className="student-complaints-footer-content">

          <div className="footer-brand">
            CampusPulse
          </div>

          <p>
            Smart Campus Complaint Management
            System
          </p>

          <span>
            © {new Date().getFullYear()} CampusPulse.
            All rights reserved.
          </span>

        </div>

      </footer>

    </div>
  );
};

export default MyComplaints;