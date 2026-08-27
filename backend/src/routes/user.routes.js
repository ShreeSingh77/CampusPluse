const express = require("express");

const {
  getStaffUsers,
  createStaffUser,
} = require("../controllers/user.controller");

const { protect } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// ==========================================
// GET ALL ACTIVE STAFF
// ADMIN ONLY
// ==========================================
router.get(
  "/staff",
  protect,
  requireRole("admin", "super_admin"),
  getStaffUsers
);

// ==========================================
// CREATE STAFF USER
// ADMIN ONLY
// ==========================================
router.post(
  "/staff",
  protect,
  requireRole("admin", "super_admin"),
  createStaffUser
);

module.exports = router;