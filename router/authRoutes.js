const express = require("express");
const passport = require("passport");
const authController = require("../controller/authController");
const router = express.Router();

// --- PUBLIC ROUTES ---

// Email/Password Auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Google OAuth 2.0 Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

// --- PROTECTED ROUTES ---
// We will add auth and role-based access control middleware here later
router.post("/logout", authController.logout);

module.exports = router;
