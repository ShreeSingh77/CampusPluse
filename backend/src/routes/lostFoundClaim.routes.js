const express = require("express");

const {
  createClaim,
  getMyClaims,
  getAllClaims,
  reviewClaim,
} = require("../controllers/lostFoundClaim.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  requireRole,
} = require("../middleware/role.middleware");

const router = express.Router();

// Student → Create Claim
router.post(
  "/",
  protect,
  requireRole("student"),
  createClaim
);

// Student → My Claims
router.get(
  "/my",
  protect,
  requireRole("student"),
  getMyClaims
);

// Admin/Staff → All Claims
router.get(
  "/",
  protect,
  requireRole(
    "admin",
    "super_admin",
    "staff"
  ),
  getAllClaims
);

// Admin/Staff → Review Claim
router.patch(
  "/:id/review",
  protect,
  requireRole(
    "admin",
    "super_admin",
    "staff"
  ),
  reviewClaim
);

module.exports = router;