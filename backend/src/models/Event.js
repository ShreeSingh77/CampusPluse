const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
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
        "technical",
        "cultural",
        "sports",
        "workshop",
        "seminar",
        "hackathon",
        "club",
        "placement",
        "other",
      ],
      default: "other",
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      default: "all",
      trim: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    registrationCount: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Event", eventSchema);