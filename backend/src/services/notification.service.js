const Notification = require("../models/Notification");
const User = require("../models/User");

const createEscalationNotifications = async (complaint) => {
  try {
    // Find active admins and super admins
    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] },
      isActive: true,
    }).select("_id");

    if (admins.length === 0) {
      console.log("⚠️ No active admin found for notification");
      return;
    }

    // ==========================================
    // LEVEL-WISE NOTIFICATION
    // ==========================================

    let title;
    let message;

    if (complaint.escalationLevel === 1) {
      title = "🚨 Complaint Escalated";

      message = `Complaint "${complaint.title}" has breached its SLA deadline and has been escalated to Level 1.`;
    } else if (complaint.escalationLevel === 2) {
      title = "🚨 Complaint Escalated to Level 2";

      message = `Complaint "${complaint.title}" remained unresolved after Level 1 escalation and has been escalated to Level 2.`;
    } else {
      title = "🚨 Complaint Escalated";

      message = `Complaint "${complaint.title}" has been escalated.`;
    }

    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      complaint: complaint._id,
      type: "complaint_escalated",
      title,
      message,
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    console.log(
      `🔔 Escalation notifications created: ${notifications.length}`
    );
  } catch (error) {
    console.error(
      "Create Escalation Notification Error:",
      error.message
    );
  }
};

module.exports = {
  createEscalationNotifications,
};