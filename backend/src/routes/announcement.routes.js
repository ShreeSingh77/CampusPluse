const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
 deleteAnnouncement,
} = require("../controllers/announcement.controller");

const { protect } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Admin + Staff can create announcements
router.post(
  "/",
  protect,
  requireRole("admin", "super_admin", "staff"),
  createAnnouncement
);

// Logged-in users can view announcements
router.get(
  "/",
  protect,
  getAnnouncements
);

router.put(
  "/:id",
  protect,
  requireRole("admin", "super_admin", "staff"),
  updateAnnouncement
);
router.delete(
  "/:id",
  protect,
  requireRole("admin", "super_admin", "staff"),
  deleteAnnouncement
);
module.exports = router;