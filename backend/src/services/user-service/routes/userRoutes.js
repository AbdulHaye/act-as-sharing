const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserHistory,
  getAllUsers,
  editUser,
  deleteUser,
  forgotPassword,
  resetPassword,
    verifyEmail,
} = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/history", auth, getUserHistory);
router.put("/:userId", editUser);
router.get("/", auth, authorize(["admin"]), getAllUsers);
router.delete("/:userId", auth, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);

module.exports = router;
