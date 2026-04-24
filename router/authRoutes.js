const express = require("express");
const passport = require("passport");
const authController = require("../controller/authController");
const router = express.Router();

// Initiates the Google OAuth 2.0 authentication flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback URL for handling the OAuth 2.0 response
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect or handle the user as desired
    res.redirect("/");
  },
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
});

module.exports = router;
