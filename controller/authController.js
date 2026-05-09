const cartMergeService = require("../services/cartMergeService");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_super_secret_refresh_key';
const RESET_SECRET = process.env.RESET_SECRET || 'your_super_secret_reset_key';

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    let role = "user";
    if (adminSecretKey && adminSecretKey === process.env.ADMIN_SECRET_KEY) {
      role = "admin";
    }

    const newUser = await User.create({
      name,
      email,
      password_hash,
      role
    });

    if (newUser.role === "user") {
      await cartMergeService.mergeSessionData(req.sessionID, newUser.id);
    }

    const tokens = generateTokens(newUser);
    const userData = newUser.toJSON();
    delete userData.password_hash;
    
    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.status(201).json({ 
        success: true, 
        message: "Registration successful", 
        user: userData,
        ...tokens
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

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.role === "user") {
      await cartMergeService.mergeSessionData(req.sessionID, user.id);
    }

    const tokens = generateTokens(user);
    const userData = user.toJSON();
    delete userData.password_hash;

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ 
        success: true, 
        message: "Login successful",
        user: userData,
        ...tokens
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Invalid refresh token" });

    const tokens = generateTokens(user);
    res.status(200).json({ success: true, accessToken: tokens.accessToken });
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = jwt.sign({ id: user.id, email: user.email }, RESET_SECRET, { expiresIn: '15m' });
    
    // Simulate sending email
    console.log(`\n\n--- PASSWORD RESET LINK ---`);
    console.log(`http://localhost:8000/reset-password?token=${resetToken}`);
    console.log(`---------------------------\n\n`);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ success: false, message: "Token and new password required" });

    const decoded = jwt.verify(token, RESET_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    await user.update({ password_hash });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }
};
