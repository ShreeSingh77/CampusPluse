const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification,
} = require("../controllers/notification.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  requireRole,
} = require("../middleware/role.middleware");

const router = express.Router();

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get(
  "/",
  protect,
  requireRole("admin", "super_admin"),
  getMyNotifications
);

router.get(
  "/unread-count",
  protect,
  getUnreadNotificationCount
);
// ==========================================
// MARK ONE AS READ
// ==========================================

router.patch(
  "/:id/read",
  protect,
  requireRole("admin", "super_admin"),
  markNotificationAsRead
);

// ==========================================
// MARK ALL AS READ
// ==========================================

router.patch(
  "/read-all",
  protect,
  requireRole("admin", "super_admin"),
  markAllNotificationsAsRead
);
router.delete(
  "/:id",
  protect,
  requireRole("admin", "super_admin"),
  deleteNotification
);
module.exports = router;