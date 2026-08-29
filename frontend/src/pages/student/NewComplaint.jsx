import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import "./NewComplaint.css";

const NewComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.location.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/complaints",
        formData
      );

      if (response.data.success) {
        toast.success(
          "Complaint submitted successfully!"
        );

        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
        });

       setTimeout(() => {
  navigate("/student/complaints");
}, 800);
      }
    } catch (error) {
      console.error(
        "Create Complaint Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-complaint-page">

      {/* HEADER */}

      <div className="new-complaint-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/student/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <div>
          <p className="page-label">
            Student Dashboard
          </p>

          <h1>Submit a New Complaint</h1>

          <p className="page-description">
            Report a campus issue and our team will
            review it as soon as possible.
          </p>
        </div>

      </div>


      {/* FORM */}

      <div className="complaint-form-card">

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="form-group">

            <label htmlFor="title">
              Complaint Title
              <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Water supply problem in hostel"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              disabled={loading}
            />

            <small>
              {formData.title.length}/150
            </small>

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label htmlFor="category">
              Category
              <span>*</span>
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">
                Select complaint category
              </option>

              <option value="academic">
                Academic
              </option>

              <option value="infrastructure">
                Infrastructure
              </option>

              <option value="hostel">
                Hostel
              </option>

              <option value="library">
                Library
              </option>

              <option value="transport">
                Transport
              </option>

              <option value="technical">
                Technical
              </option>

              <option value="security">
                Security
              </option>

              <option value="cleanliness">
                Cleanliness
              </option>

              <option value="other">
                Other
              </option>
            </select>

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label htmlFor="location">
              Location
              <span>*</span>
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Hostel Block A, Room 204"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="description">
              Description
              <span>*</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows="7"
              placeholder="Describe the problem in detail..."
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
              disabled={loading}
            />

            <small>
              {formData.description.length}/2000
            </small>

          </div>


          {/* INFO */}

          <div className="complaint-info">

            <div className="info-icon">
              ⚡
            </div>

            <div>
              <strong>
                Smart Priority Detection
              </strong>

              <p>
                Your complaint priority will be
                automatically determined based on
                the issue details.
              </p>
            </div>

          </div>


          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/student/dashboard")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default NewComplaint;