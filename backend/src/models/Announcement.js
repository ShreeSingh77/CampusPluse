const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "academic",
        "exam",
        "placement",
        "event",
        "club",
        "general",
        "emergency",
      ],
      default: "general",
    },

    department: {
      type: String,
      default: "all",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    priorityScore: {
      type: Number,
      default: 0,
    },

    priorityReason: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      default: null,
    },

    eventDate: {
      type: Date,
      default: null,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Announcement",
  announcementSchema
);