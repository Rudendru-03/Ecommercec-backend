const cartMergeService = require("../services/cartMergeService");
const User = require("../model/User");
const bcrypt = require("bcrypt");

exports.googleCallback = async (req, res) => {
  if (req.user && req.user.role === "user") {
    await cartMergeService.mergeSessionData(req.sessionID, req.user.id);
  }
  res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Determine role
    let role = "user";
    if (adminSecretKey && adminSecretKey === process.env.ADMIN_SECRET_KEY) {
      role = "admin";
    }

    // Create user
    const newUser = await User.create({
      name,
      email,
      password_hash,
      role
    });

    // Auto-login after registration
    req.login(newUser, async (err) => {
      if (err) {
        return next(err);
      }
      
      // Merge anonymous cart/wishlist ONLY for regular users
      if (newUser.role === "user") {
        await cartMergeService.mergeSessionData(req.sessionID, newUser.id);
      }
      
      // Remove password hash before sending to client
      const userData = newUser.toJSON();
      delete userData.password_hash;
      
      return res.status(201).json({ 
        success: true, 
        message: "Registration successful", 
        user: userData 
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // If user registered via Google but tries to login with password, password_hash might be null
    if (!user.password_hash) {
      return res.status(401).json({ success: false, message: "Please sign in with Google" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Login
    req.login(user, async (err) => {
      if (err) {
        return next(err);
      }
      
      // Merge anonymous cart/wishlist ONLY for regular users
      if (user.role === "user") {
        await cartMergeService.mergeSessionData(req.sessionID, user.id);
      }
      
      const userData = user.toJSON();
      delete userData.password_hash;

      return res.status(200).json({ 
        success: true, 
        message: "Login successful",
        user: userData
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refresh = async (req, res) => {
  // Logic and database queries will be implemented later
  res.status(200).json({ message: "Refresh token endpoint" });
};

exports.forgotPassword = async (req, res) => {
  // Logic and database queries will be implemented later
  res.status(200).json({ message: "Forgot password endpoint" });
};

exports.resetPassword = async (req, res) => {
  // Logic and database queries will be implemented later
  res.status(200).json({ message: "Reset password endpoint" });
};
