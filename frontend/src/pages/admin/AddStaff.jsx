import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./AddStaff.css";

const AddStaff = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  });

  // ==========================================
  // FETCH DEPARTMENTS
  // ==========================================

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");

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
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // ==========================================
  // INPUT CHANGE
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department
    ) {
      toast.error(
        "Name, email, password and department are required"
      );
      return;
    }

    try {
      setLoading(true);

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

        setTimeout(() => {
          navigate("/admin/staff");
        }, 800);
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
      setLoading(false);
    }
  };

  return (
    <div className="add-staff-page">

      <div className="add-staff-card">

        {/* HEADER */}

        <div className="add-staff-header">

          <button
            className="add-staff-back"
            onClick={() =>
              navigate("/admin/staff")
            }
          >
            ← Back to Staff
          </button>

          <p className="add-staff-label">
            Staff Management
          </p>

          <h1>Add New Staff</h1>

          <p>
            Create a staff account and assign them
            to a department.
          </p>

        </div>

        {/* FORM */}

        <form
          className="add-staff-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="staff@example.com"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* PHONE */}

          <div className="form-group">

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
            />

          </div>

          {/* DEPARTMENT */}

          <div className="form-group">

            <label htmlFor="department">
              Department
            </label>

            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={loadingDepartments}
            >

              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select department"}
              </option>

              {departments.map((department) => (
                <option
                  key={department._id}
                  value={department._id}
                >
                  {department.name} (
                  {department.code})
                </option>
              ))}

            </select>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="create-staff-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Staff..."
              : "Create Staff Account"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddStaff;