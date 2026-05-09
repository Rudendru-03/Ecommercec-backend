const userRepo = require("../repository/userRepository");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res) => {
  try {
    const user = await userRepo.findUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name } = req.body;
    // Prevent updating password or email directly here
    const updatedUser = await userRepo.updateUser(req.user.id, { name });
    
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    const userData = updatedUser.toJSON();
    delete userData.password_hash;

    res.status(200).json({ success: true, message: "Profile updated successfully", user: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords are required" });
    }

    const user = await userRepo.findUserByIdWithPassword(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.password_hash) {
      return res.status(400).json({ success: false, message: "You registered via Google. Cannot change password." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect old password" });

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    await userRepo.updateUser(req.user.id, { password_hash });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await userRepo.getUserAddresses(req.user.id);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMyAddress = async (req, res) => {
  try {
    const { label, line1, line2, city, state, country, postal_code, is_default } = req.body;
    
    if (!line1 || !city || !state || !country || !postal_code) {
      return res.status(400).json({ success: false, message: "Please provide all required address fields" });
    }

    const newAddress = await userRepo.createAddress({
      user_id: req.user.id,
      label, line1, line2, city, state, country, postal_code, is_default
    });

    res.status(201).json({ success: true, message: "Address created", address: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updateData = req.body;

    const updatedAddress = await userRepo.updateAddress(addressId, req.user.id, updateData);
    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found or you don't have permission" });
    }

    res.status(200).json({ success: true, message: "Address updated", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMyAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const deletedCount = await userRepo.deleteAddress(addressId, req.user.id);
    
    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Address not found or you don't have permission" });
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
