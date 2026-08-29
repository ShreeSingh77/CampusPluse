const express = require("express");

const {
  getDepartments,
} = require("../controllers/department.controller");

const { protect } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// ==========================================
// GET ALL ACTIVE DEPARTMENTS
// ADMIN ONLY
// ==========================================

router.get(
  "/",
  protect,
  requireRole("admin", "super_admin"),
  getDepartments
);

module.exports = router;