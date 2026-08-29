import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./StaffManagement.css";

const StaffManagement = () => {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  });

  // ==========================================
  // FETCH STAFF
  // ==========================================

  const fetchStaff = async () => {
    try {
      const response = await api.get("/users/staff");

      if (response.data.success) {
        setStaff(response.data.staff || []);
      }
    } catch (error) {
      console.error(
        "Fetch staff error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load staff"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH DEPARTMENTS
  // ==========================================

  const fetchDepartments = async () => {
    try {
      const response = await api.get(
        "/departments"
      );

      if (response.data.success) {
        setDepartments(
          response.data.departments || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch departments error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load departments"
      );
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE STAFF
  // ==========================================

  const handleCreateStaff = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    if (formData.password.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    try {
      setCreating(true);

      const response = await api.post(
        "/users/staff",
        formData
      );

      if (response.data.success) {
        toast.success(
          "Staff account created successfully"
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          department: "",
        });

        setShowForm(false);

        await fetchStaff();
      }
    } catch (error) {
      console.error(
        "Create staff error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create staff account"
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStaff = staff.filter((member) => {
    const searchText =
      search.toLowerCase();

    return (
      member.name
        ?.toLowerCase()
        .includes(searchText) ||
      member.email
        ?.toLowerCase()
        .includes(searchText) ||
      member.department?.name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="staff-management-page">

      {/* ================= HEADER ================= */}

      <header className="staff-management-header">

        <div>

          <button
            className="staff-back-btn"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <p className="staff-page-label">
            Admin Dashboard
          </p>

          <h1>Staff Management</h1>

          <p>
            Add and manage staff members responsible
            for handling campus complaints.
          </p>

        </div>

        <button
          className="add-staff-btn"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "✕ Close"
            : "+ Add Staff"}
        </button>

      </header>

      {/* ================= ADD STAFF FORM ================= */}

      {showForm && (

        <section className="add-staff-card">

          <div className="add-staff-heading">

            <div>
              <h2>Add New Staff</h2>

              <p>
                Create a staff account and assign
                a department.
              </p>
            </div>

            <span>👤</span>

          </div>

          <form
            onSubmit={handleCreateStaff}
            className="staff-form"
          >

            <div className="staff-form-grid">

              {/* NAME */}

              <div className="staff-form-group">

                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter staff name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="staff-form-group">

                <label>
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="staff@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PHONE */}

              <div className="staff-form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

              {/* PASSWORD */}

              <div className="staff-form-group">

                <label>
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />

              </div>

              {/* DEPARTMENT */}

              <div className="staff-form-group full-width">

                <label>
                  Department *
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department._id}
                        value={department._id}
                      >
                        {department.name} (
                        {department.code})
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            <div className="staff-form-actions">

              <button
                type="button"
                className="cancel-staff-btn"
                onClick={() =>
                  setShowForm(false)
                }
                disabled={creating}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-staff-btn"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Staff"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ================= STAFF LIST ================= */}

      <section className="staff-list-section">

        <div className="staff-list-header">

          <div>
            <h2>Active Staff</h2>

            <p>
              {staff.length} active staff member
              {staff.length !== 1 ? "s" : ""}
            </p>
          </div>

          <input
            type="text"
            className="staff-search"
            placeholder="Search staff..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="staff-management-empty">
            ⏳
            <h3>Loading staff...</h3>
            <p>
              Please wait while staff members
              are loaded.
            </p>
          </div>

        ) : filteredStaff.length === 0 ? (

          <div className="staff-management-empty">

            <div>
              👥
            </div>

            <h3>
              No staff found
            </h3>

            <p>
              Add a staff member to start
              managing complaints.
            </p>

          </div>

        ) : (

          <div className="staff-table-wrapper">

            <table className="staff-table">

              <thead>

                <tr>
                  <th>Staff</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredStaff.map(
                  (member) => (

                    <tr key={member._id}>

                      <td>

                        <div className="staff-user-cell">

                          <div className="staff-avatar">
                            {member.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "S"}
                          </div>

                          <strong>
                            {member.name}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {member.email}
                      </td>

                      <td>

                        <span className="department-badge">
                          {member.department?.name ||
                            "Not Assigned"}
                        </span>

                      </td>

                      <td>
                        {member.phone ||
                          "—"}
                      </td>

                      <td>

                        <span className="active-badge">
                          ● Active
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
};

export default StaffManagement;