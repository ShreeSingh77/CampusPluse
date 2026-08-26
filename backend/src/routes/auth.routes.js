const express = require("express");
const { requireRole } = require("../middleware/role.middleware");

const {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);

router.get(
  "/student-area",
  protect,
  requireRole("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Student Area",
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);
router.get(
  "/admin-area",
  protect,
  requireRole("admin", "super_admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Admin Area",
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;