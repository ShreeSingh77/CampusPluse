const Complaint = require("../models/Complaint");
const User = require("../models/User");
const calculateComplaintPriority = require("../utils/complaintPriority");
const findAvailableStaff = require("../utils/assignComplaintStaff");


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

    // Student department validation
    if (!req.user.department) {
      return res.status(400).json({
        success: false,
        message: "Student department is not assigned",
      });
    }

    // Calculate complaint priority
    const priorityData = calculateComplaintPriority({
      title,
      description,
      category,
    });

    // SLA based on priority
    const slaHoursMap = {
      urgent: 6,
      high: 24,
      medium: 48,
      low: 72,
    };

    const slaHours =
      slaHoursMap[priorityData.priority] || 72;

    const slaDeadline = new Date(
      Date.now() + slaHours * 60 * 60 * 1000
    );

    // Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,

      department: req.user.department,

      priority: priorityData.priority,
      priorityScore: priorityData.priorityScore,
      priorityReason: priorityData.priorityReason,

      slaHours,
      slaDeadline,

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

const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedTo: req.user._id,
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
      "Get Assigned Complaints Error:",
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

    // Verify staff
    const staff = await User.findOne({
      _id: staffId,
      role: "staff",
      isActive: true,
    });

    if (!staff) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive staff member",
      });
    }

    // Department-aware assignment
    if (
      !staff.department ||
      staff.department.toString() !==
        complaint.department.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Staff member does not belong to the complaint department",
      });
    }

    // Assign complaint
    complaint.assignedTo = staff._id;
    complaint.status = "assigned";

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(id)
        .populate(
          "reportedBy",
          "name email role department"
        )
        .populate(
          "assignedTo",
          "name email role department"
        )
        .populate(
          "department",
          "name code description"
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

const autoAssignComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Complaint is already assigned",
      });
    }

    const staff = await findAvailableStaff(
      complaint.department
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message:
          "No active staff found for this department",
      });
    }

    
    complaint.assignedTo = staff._id;
    complaint.status = "assigned";

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(id)
        .populate(
          "reportedBy",
          "name email role department"
        )
        .populate(
          "assignedTo",
          "name email role department"
        )
        .populate(
          "department",
          "name code description"
        );

    return res.status(200).json({
      success: true,
      message: "Complaint automatically assigned successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error(
      "Auto Assign Complaint Error:",
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


    // Staff can update only complaints assigned to them
if (
  req.user.role === "staff" &&
  (!complaint.assignedTo ||
    complaint.assignedTo.toString() !==
      req.user._id.toString())
) {
  return res.status(403).json({
    success: false,
    message:
      "You can update only complaints assigned to you",
  });
}
  const allowedTransitions = {
  submitted: ["under_review", "assigned", "rejected"],
  under_review: ["assigned", "rejected"],
  assigned: ["in_progress", "rejected"],
  in_progress: ["resolved", "rejected"],
  resolved: [],
  rejected: [],
};

if (!allowedTransitions[complaint.status]?.includes(status)) {
  return res.status(400).json({
    success: false,
    message: `Cannot change complaint status from ${complaint.status} to ${status}`,
  });
}

complaint.status = status;

if (adminNote) {
  complaint.adminNote = adminNote;
}

if (status === "resolved") {
  complaint.resolvedAt = new Date();
} else {
  complaint.resolvedAt = null;
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
  getAssignedComplaints,
  assignComplaint,
  autoAssignComplaint,
  updateComplaintStatus,
  getComplaintById,
};