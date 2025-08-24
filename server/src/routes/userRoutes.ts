import express from "express";

import {
  signUp,
  logOut,
  isLoggedIn,
  forgotPasswords,
  protect,
  resetPassword,
  restriction,
  login,
} from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.get("/logout", logOut);

router.patch("/resetPassword/:token", resetPassword);

router.post("/forgotPassword", forgotPasswords);

export default router;
