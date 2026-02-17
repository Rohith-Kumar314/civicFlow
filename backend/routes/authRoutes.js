const express = require("express");
const router = express.Router();
const {
  registerResident,
  login,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Resident Registration
router.post("/register", registerResident);

// Central login
router.post("/login", login);

// Get logged in user
router.get("/me", protect, getMe);

module.exports = router;
