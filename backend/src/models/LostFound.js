const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

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
    },

    category: {
      type: String,
      enum: [
        "electronics",
        "documents",
        "wallet",
        "keys",
        "bag",
        "clothing",
        "books",
        "accessories",
        "other",
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "active",
        "matched",
        "claimed",
        "resolved",
        "cancelled",
      ],
      default: "active",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

lostFoundSchema.index({
  type: 1,
  category: 1,
  location: 1,
});

module.exports = mongoose.model(
  "LostFound",
  lostFoundSchema
);