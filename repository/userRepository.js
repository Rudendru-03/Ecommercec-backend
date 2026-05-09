const User = require("../model/User");
const Address = require("../model/Address");

const findUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password_hash'] }
  });
};

const findUserByIdWithPassword = async (id) => {
  return await User.findByPk(id);
};

const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (user) {
    return await user.update(data);
  }
  return null;
};

const getUserAddresses = async (userId) => {
  return await Address.findAll({ where: { user_id: userId } });
};

const createAddress = async (data) => {
  return await Address.create(data);
};

const updateAddress = async (id, userId, data) => {
  const address = await Address.findOne({ where: { id, user_id: userId } });
  if (address) {
    return await address.update(data);
  }
  return null;
};

const deleteAddress = async (id, userId) => {
  return await Address.destroy({ where: { id, user_id: userId } });
};

module.exports = {
  findUserById,
  findUserByIdWithPassword,
  updateUser,
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
