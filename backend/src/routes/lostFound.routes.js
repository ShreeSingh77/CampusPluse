const express = require("express");

const {
  createReport,
  getReports,
  findMatches,
} = require("../controllers/lostFound.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Create Lost / Found report
router.post(
  "/",
  protect,
  createReport
);

// Get active reports
router.get(
  "/",
  protect,
  getReports
);

// Smart matching
router.get(
  "/:id/matches",
  protect,
  findMatches
);

module.exports = router;