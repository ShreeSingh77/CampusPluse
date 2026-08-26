const express = require("express");

const {
  createEvent,
  getEvents,
  registerForEvent,
  getMyRegistrations,
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


module.exports = router;
