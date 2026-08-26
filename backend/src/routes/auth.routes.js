const express = require("express");

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

router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;