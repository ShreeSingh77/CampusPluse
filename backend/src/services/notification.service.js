const Notification = require("../models/Notification");
const User = require("../models/User");

const createEscalationNotifications = async (complaint) => {
  try {
    // ==========================================
    // FIND ACTIVE ADMINS
    // ==========================================

    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] },
      isActive: true,
    }).select("_id");

    if (admins.length === 0) {
      console.log(
        "⚠️ No active admin found for notification"
      );
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

    // ==========================================
    // PREVENT DUPLICATE NOTIFICATIONS
    // ==========================================

    const existingNotifications =
      await Notification.find({
        complaint: complaint._id,
        type: "complaint_escalated",
        title,
      }).select("recipient");

    const notifiedAdminIds = new Set(
      existingNotifications.map((notification) =>
        notification.recipient.toString()
      )
    );

    // ==========================================
    // CREATE ONLY NEW NOTIFICATIONS
    // ==========================================

    const notifications = admins
      .filter(
        (admin) =>
          !notifiedAdminIds.has(
            admin._id.toString()
          )
      )
      .map((admin) => ({
        recipient: admin._id,
        complaint: complaint._id,
        type: "complaint_escalated",
        title,
        message,
        isRead: false,
      }));

    // ==========================================
    // SAVE NOTIFICATIONS
    // ==========================================

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);

      console.log(
        `🔔 Escalation notifications created: ${notifications.length}`
      );
    } else {
      console.log(
        "ℹ️ No new escalation notifications required"
      );
    }
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