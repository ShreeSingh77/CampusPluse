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

    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      complaint: complaint._id,
      type: "complaint_escalated",
      title: "🚨 Complaint Escalated",
      message: `Complaint "${complaint.title}" has breached its SLA deadline and has been escalated.`,
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