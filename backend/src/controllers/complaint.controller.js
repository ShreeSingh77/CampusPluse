const Complaint = require("../models/Complaint");
const calculateComplaintPriority = require("../utils/complaintPriority");

const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and location are required",
      });
    }

    const priorityData = calculateComplaintPriority({
      title,
      description,
      category,
    });

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,

      priority: priorityData.priority,
      priorityScore: priorityData.priorityScore,
      priorityReason: priorityData.priorityReason,

      reportedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error(
      "Create Complaint Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      reportedBy: req.user._id,
    })
      .populate(
        "reportedBy",
        "name email role"
      )
      .populate(
        "assignedTo",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(
      "Get My Complaints Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "reportedBy",
        "name email role"
      )
      .populate(
        "assignedTo",
        "name email role"
      )
      .sort({
        priorityScore: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(
      "Get All Complaints Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
};