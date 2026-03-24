const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getMe,
  getUserById,
  followUser,
  registerUser,
  getAllUsers,
} = require("../controllers/userController");

router.post("/register", registerUser);          // public — called after Clerk signup
router.get("/", protect, getAllUsers);
router.get("/me", protect, getMe);
router.get("/:id", protect, getUserById);
router.post("/follow/:id", protect, followUser);

module.exports = router;
