import express from "express";
import {
  login,
  logOut,
  protect,
  restriction,
  forgotPasswords,
  resetPassword,
  updatePassword,
  googleAuth,
  googleCallback,
  checkUserExists,
  requestOtp,
  verifyOtp,
  setPassword,
  completeProfile,
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Local authentication routes

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/set-password", setPassword);
router.post("/login", login);
router.post("/complete-profile", authMiddleware, completeProfile);
router.post("/logout", logOut);
router.post("/forgotPassword", forgotPasswords);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protect, updatePassword);

// OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/check-user", checkUserExists);

// Protected routes
router.use(protect); // All routes after this are protected

export default router;
