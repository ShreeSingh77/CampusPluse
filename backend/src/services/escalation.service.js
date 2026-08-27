const cron = require("node-cron");
const Complaint = require("../models/Complaint");

const {
  createEscalationNotifications,
} = require("./notification.service");

const processComplaintEscalations = async () => {
  try {
    const now = new Date();

    // ==========================================
    // LEVEL 1 ESCALATION
    // ==========================================

    const complaints = await Complaint.find({
      slaDeadline: { $lte: now },
      isEscalated: false,
      status: {
        $nin: ["resolved", "rejected"],
      },
    });

    for (const complaint of complaints) {
      complaint.isEscalated = true;
      complaint.escalatedAt = now;
      complaint.escalationLevel = 1;

      // Level 2 deadline
      complaint.escalationNextDeadline = new Date(
        now.getTime() + 2 * 60 * 60 * 1000
      );

      complaint.escalationHistory.push({
        level: 1,
        reason: "SLA deadline breached",
        escalatedAt: now,
        statusAtEscalation: complaint.status,
      });

      await complaint.save();

      console.log(
        `🚨 Level 1 Complaint escalated: ${complaint._id}`
      );

      // Admin notification
      await createEscalationNotifications(complaint);

      console.log(
        `🔔 Admin notification processed for: ${complaint._id}`
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
    });

    for (const complaint of level2Complaints) {
      complaint.escalationLevel = 2;

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

      // Notification for Level 2
      await createEscalationNotifications(complaint);

      console.log(
        `🔔 Level 2 notification processed for: ${complaint._id}`
      );
    }

    // ==========================================
    // LOGS
    // ==========================================

    if (
      complaints.length === 0 &&
      level2Complaints.length === 0
    ) {
      console.log("✅ No complaints require escalation");
    }

    if (complaints.length > 0) {
      console.log(
        `🚨 Level 1 escalation processed: ${complaints.length} complaint(s)`
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

module.exports = {
  startEscalationEngine,
  processComplaintEscalations,
};