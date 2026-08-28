const cron = require("node-cron");
const Complaint = require("../models/Complaint");

const findAvailableStaff = require("../utils/assignComplaintStaff");

const {
  createEscalationNotifications,
} = require("./notification.service");

// ==========================================
// PROCESS COMPLAINT ESCALATIONS
// ==========================================

const processComplaintEscalations = async () => {
  try {
    const now = new Date();

    // ==========================================
    // LEVEL 1 ESCALATION
    // ==========================================

    const level1Complaints = await Complaint.find({
      slaDeadline: { $lte: now },

      // Only completely un-escalated complaints
      isEscalated: false,
      escalationLevel: 0,

      status: {
        $nin: ["resolved", "rejected"],
      },
    });

   for (const complaint of level1Complaints) {

  // Safety check: prevent duplicate Level 1 escalation
  if (
    complaint.isEscalated === true ||
    complaint.escalationLevel > 0
  ) {
    continue;
  }

  // Save original status
  const previousStatus = complaint.status;

      // ------------------------------------------
      // Mark Level 1 escalation
      // ------------------------------------------

      complaint.isEscalated = true;
      complaint.escalatedAt = now;
      complaint.escalationLevel = 1;

      // ------------------------------------------
      // Auto assign staff
      // ------------------------------------------

      if (!complaint.assignedTo) {
        const staff = await findAvailableStaff(
          complaint.department
        );

        if (staff) {
          complaint.assignedTo = staff._id;
          complaint.status = "assigned";

          console.log(
            `👨‍💼 Complaint automatically assigned to staff: ${staff._id}`
          );
        } else {
          console.log(
            `⚠️ No available staff found for complaint: ${complaint._id}`
          );
        }
      }

      // ------------------------------------------
      // Level 2 deadline
      // ------------------------------------------

      complaint.escalationNextDeadline = new Date(
        now.getTime() + 2 * 60 * 60 * 1000
      );

      // ------------------------------------------
      // Escalation history
      // ------------------------------------------

      complaint.escalationHistory.push({
        level: 1,
        reason: "SLA deadline breached",
        escalatedAt: now,
        statusAtEscalation: previousStatus,
      });

      await complaint.save();

      console.log(
        `🚨 Level 1 Complaint escalated: ${complaint._id}`
      );

      // ------------------------------------------
      // Notification
      // ------------------------------------------

      await createEscalationNotifications(complaint);

      console.log(
        `🔔 Level 1 notification processed for: ${complaint._id}`
      );
    }

    // ==========================================
    // LEVEL 2 ESCALATION
    // ==========================================

   const level2Complaints = await Complaint.find({
  escalationNextDeadline: { $lte: now },

  isEscalated: true,
  escalationLevel: 1,

  status: {
    $nin: ["resolved", "rejected"],
  },

  escalationHistory: {
    $elemMatch: {
      level: 1,
    },
  },
});

    for (const complaint of level2Complaints) {
      // ------------------------------------------
      // Move to Level 2
      // ------------------------------------------

      complaint.escalationLevel = 2;

      // IMPORTANT:
      // No more escalation after Level 2
      complaint.escalationNextDeadline = null;

      complaint.escalationHistory.push({
        level: 2,
        reason:
          "Complaint remained unresolved after Level 1 escalation",
        escalatedAt: now,
        statusAtEscalation: complaint.status,
      });

      await complaint.save();

      console.log(
        `🚨 Level 2 escalation: ${complaint._id}`
      );

      // ------------------------------------------
      // Level 2 Notification
      // ------------------------------------------

      await createEscalationNotifications(complaint);

      console.log(
        `🔔 Level 2 notification processed for: ${complaint._id}`
      );
    }

    // ==========================================
    // LOGS
    // ==========================================

    if (
      level1Complaints.length === 0 &&
      level2Complaints.length === 0
    ) {
      console.log(
        "✅ No complaints require escalation"
      );
    }

    if (level1Complaints.length > 0) {
      console.log(
        `🚨 Level 1 escalation processed: ${level1Complaints.length} complaint(s)`
      );
    }

    if (level2Complaints.length > 0) {
      console.log(
        `🚨 Level 2 escalation processed: ${level2Complaints.length} complaint(s)`
      );
    }
  } catch (error) {
    console.error(
      "Escalation Engine Error:",
      error.message
    );
  }
};

// ==========================================
// START ESCALATION ENGINE
// ==========================================

const startEscalationEngine = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log(
      "🔎 Checking complaint SLA deadlines..."
    );

    await processComplaintEscalations();
  });

  console.log(
    "🚨 Complaint Escalation Engine started"
  );
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  startEscalationEngine,
  processComplaintEscalations,
};