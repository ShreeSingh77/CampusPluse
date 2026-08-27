const cron = require("node-cron");
const Complaint = require("../models/Complaint");

const processComplaintEscalations = async () => {
  try {
    const now = new Date();

    const complaints = await Complaint.find({
      slaDeadline: { $lte: now },
      isEscalated: false,
      status: {
        $nin: ["resolved", "rejected"],
      },
    });

    if (complaints.length === 0) {
      return;
    }

    for (const complaint of complaints) {
  complaint.isEscalated = true;
  complaint.escalatedAt = now;
  complaint.escalationLevel = 1;

  complaint.escalationHistory.push({
    level: 1,
    reason: "SLA deadline breached",
    escalatedAt: now,
    statusAtEscalation: complaint.status,
  });

  await complaint.save();

  console.log(
    `🚨 Complaint escalated: ${complaint._id}`
  );
}

    console.log(
      `🚨 Escalation processed: ${complaints.length} complaint(s)`
    );
  } catch (error) {
    console.error(
      "Escalation Engine Error:",
      error.message
    );
  }
};

const startEscalationEngine = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("🔎 Checking complaint SLA deadlines...");
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