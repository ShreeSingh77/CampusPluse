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

// ==========================================
// ADMIN → ASSIGN COMPLAINT
// ==========================================

const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "staffId is required",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.assignedTo = staffId;
    complaint.status = "assigned";

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(id)
        .populate(
          "reportedBy",
          "name email role"
        )
        .populate(
          "assignedTo",
          "name email role"
        );

    return res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error(
      "Assign Complaint Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// ADMIN → UPDATE COMPLAINT STATUS
// ==========================================

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const allowedStatuses = [
      "submitted",
      "under_review",
      "assigned",
      "in_progress",
      "resolved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint =
      await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    if (adminNote) {
      complaint.adminNote = adminNote;
    }

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message:
        "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(
      "Update Complaint Status Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// ADMIN → COMPLAINT DETAILS
// ==========================================

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint =
      await Complaint.findById(id)
        .populate(
          "reportedBy",
          "name email phone department role"
        )
        .populate(
          "assignedTo",
          "name email department role"
        );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error(
      "Get Complaint Error:",
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
  assignComplaint,
  updateComplaintStatus,
  getComplaintById,
};