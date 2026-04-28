const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

// --- PROTECTED ROUTES (auth required) ---
// We will add auth middleware here later

router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.put("/me/password", userController.updateMyPassword);

// Addresses routes for the current user
router.get("/me/addresses", userController.getMyAddresses);
router.post("/me/addresses", userController.createMyAddress);
router.put("/me/addresses/:id", userController.updateMyAddress);
router.delete("/me/addresses/:id", userController.deleteMyAddress);

// --- ADMIN ROUTES (auth + admin role required) ---
// We will add role-based access control middleware here later
router.get("/", userController.getAllUsers);

module.exports = router;
