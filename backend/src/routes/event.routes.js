const express = require("express");

const {
  createEvent,
  getEvents,
  registerForEvent,
  getMyRegistrations,
  markAttendance,
  getEventAnalytics,
  openEventCheckIn,
  closeEventCheckIn,
  checkInToEvent,
} = require("../controllers/event.controller");

const { protect } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// Admin / Staff can create events
router.post(
  "/",
  protect,
  requireRole("admin", "super_admin", "staff"),
  createEvent
);

// Logged-in users can view events
router.get(
  "/",
  protect,
  getEvents
);

router.get(
  "/my-registrations",
  protect,
  requireRole("student"),
  getMyRegistrations
);
router.post(
  "/:id/register",
  protect,
  requireRole("student"),
  registerForEvent
);

router.post(
  "/registrations/:id/attendance",
  protect,
  requireRole("student"),
  markAttendance
);

router.get(
  "/:id/analytics",
  protect,
  requireRole("admin", "super_admin", "staff"),
  getEventAnalytics
);

// Admin / Staff → Open Check-in
router.post(
  "/:id/check-in/open",
  protect,
  requireRole("admin", "super_admin", "staff"),
  openEventCheckIn
);

// Admin / Staff → Close Check-in
router.post(
  "/:id/check-in/close",
  protect,
  requireRole("admin", "super_admin", "staff"),
  closeEventCheckIn
);

// Student → Check-in
router.post(
  "/:id/check-in",
  protect,
  requireRole("student"),
  checkInToEvent
);
module.exports = router;
