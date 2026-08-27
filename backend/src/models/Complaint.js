const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        "academic",
        "infrastructure",
        "hostel",
        "library",
        "transport",
        "technical",
        "security",
        "cleanliness",
        "other",
      ],
      default: "other",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },
department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department",
  required: true,
},

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },

    priorityScore: {
      type: Number,
      default: 0,
    },

    priorityReason: {
      type: String,
      default: "",
    },

    slaHours: {
  type: Number,
  default: 72,
},

slaDeadline: {
  type: Date,
  default: null,
},

isEscalated: {
  type: Boolean,
  default: false,
},

escalatedAt: {
  type: Date,
  default: null,
},

escalationLevel: {
  type: Number,
  default: 0,
},

escalationHistory: [
  {
    level: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    escalatedAt: {
      type: Date,
      required: true,
    },

    statusAtEscalation: {
      type: String,
      required: true,
    },
  },
],
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "rejected",
      ],
      default: "submitted",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adminNote: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);