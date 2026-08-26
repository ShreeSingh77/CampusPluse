const LostFoundClaim = require("../models/LostFoundClaim");
const LostFound = require("../models/LostFound");

// ==========================================
// CREATE CLAIM
// ==========================================

const createClaim = async (req, res) => {
  try {
    const {
      reportId,
      matchedReportId,
      message,
    } = req.body;

    if (
      !reportId ||
      !matchedReportId ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "reportId, matchedReportId and message are required",
      });
    }

    const report =
      await LostFound.findById(reportId);

    const matchedReport =
      await LostFound.findById(
        matchedReportId
      );

    if (!report || !matchedReport) {
      return res.status(404).json({
        success: false,
        message:
          "Lost/Found report not found",
      });
    }

    // Prevent claiming your own report
    if (
      report.reportedBy.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot claim your own report",
      });
    }

    // Check existing pending claim
    const existingClaim =
      await LostFoundClaim.findOne({
        report: reportId,
        claimant: req.user._id,
        status: "pending",
      });

    if (existingClaim) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a pending claim for this item",
      });
    }

    const claim =
      await LostFoundClaim.create({
        report: reportId,
        claimant: req.user._id,
        matchedReport: matchedReportId,
        message,
      });

    return res.status(201).json({
      success: true,
      message:
        "Claim request submitted successfully",
      claim,
    });
  } catch (error) {
    console.error(
      "Create Claim Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// STUDENT → MY CLAIMS
// ==========================================

const getMyClaims = async (req, res) => {
  try {
    const claims =
      await LostFoundClaim.find({
        claimant: req.user._id,
      })
        .populate(
          "report",
          "type title category location status"
        )
        .populate(
          "matchedReport",
          "type title category location status"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error(
      "Get My Claims Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// ADMIN → ALL CLAIMS
// ==========================================

const getAllClaims = async (req, res) => {
  try {
    const claims =
      await LostFoundClaim.find()
        .populate(
          "claimant",
          "name email phone department"
        )
        .populate(
          "report",
          "type title description category location status"
        )
        .populate(
          "matchedReport",
          "type title description category location status"
        )
        .populate(
          "reviewedBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error(
      "Get All Claims Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// ADMIN → REVIEW CLAIM
// ==========================================

const reviewClaim = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      reviewNote,
    } = req.body;

    if (
      !["approved", "rejected"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be approved or rejected",
      });
    }

    const claim =
      await LostFoundClaim.findById(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "This claim has already been reviewed",
      });
    }

    claim.status = status;
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    claim.reviewNote =
      reviewNote || null;

    await claim.save();

    // If approved → resolve reports
    if (status === "approved") {
      await LostFound.updateMany(
        {
          _id: {
            $in: [
              claim.report,
              claim.matchedReport,
            ],
          },
        },
        {
          $set: {
            status: "resolved",
            resolvedAt: new Date(),
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Claim approved and item resolved"
          : "Claim rejected successfully",
      claim,
    });
  } catch (error) {
    console.error(
      "Review Claim Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createClaim,
  getMyClaims,
  getAllClaims,
  reviewClaim,
};