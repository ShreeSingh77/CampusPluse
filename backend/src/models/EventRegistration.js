const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["registered", "cancelled", "attended"],
      default: "registered",
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    attendedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One student can register only once for one event
eventRegistrationSchema.index(
  { event: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);