import express from "express";

const router = express.Router();

// Debug route to check environment variables
router.get("/oauth-config", (req, res) => {
  res.json({
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) || "Not set",
    callbackURL: "/api/v1/auth/google/callback",
    nodeEnv: process.env.NODE_ENV,
  });
});

export default router;
