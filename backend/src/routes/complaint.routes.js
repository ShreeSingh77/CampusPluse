const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getAssignedComplaints,
  assignComplaint,
  autoAssignComplaint,
  updateComplaintStatus,
  getComplaintById,
} = require("../controllers/complaint.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  requireRole,
} = require("../middleware/role.middleware");

const router = express.Router();

// ==========================================
// STUDENT → CREATE COMPLAINT
// ==========================================
router.post(
  "/",
  protect,
  requireRole("student"),
  createComplaint
);

// ==========================================
// STUDENT → MY COMPLAINTS
// ==========================================
router.get(
  "/my",
  protect,
  requireRole("student"),
  getMyComplaints
);

// ==========================================
// ADMIN / STAFF → ALL COMPLAINTS
// ==========================================
router.get(
  "/",
  protect,
  requireRole(
    "admin",
    "super_admin",
    "staff"
  ),
  getAllComplaints
);

router.get(
  "/assigned",
  protect,
  requireRole("staff"),
  getAssignedComplaints
);
// ==========================================
// ADMIN / STAFF → COMPLAINT DETAILS
// ==========================================
router.get(
  "/:id",
  protect,
  requireRole(
    "admin",
    "super_admin",
    "staff"
  ),
  getComplaintById
);

// ==========================================
// ADMIN → ASSIGN COMPLAINT
// ==========================================
router.patch(
  "/:id/assign",
  protect,
  requireRole(
    "admin",
    "super_admin"
  ),
  assignComplaint
);
// ==========================================
// ADMIN → AUTO ASSIGN COMPLAINT
// ==========================================
router.patch(
  "/:id/auto-assign",
  protect,
  requireRole(
    "admin",
    "super_admin"
  ),
  autoAssignComplaint
);

// ==========================================
// ADMIN / STAFF → UPDATE STATUS
// ==========================================
router.patch(
  "/:id/status",
  protect,
  requireRole(
    "admin",
    "super_admin",
    "staff"
  ),
  updateComplaintStatus
);

module.exports = router;