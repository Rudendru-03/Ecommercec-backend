const CartItem = require("../model/CartItem");
const WishlistItem = require("../model/WishlistItem");

const mergeSessionData = async (sessionID, userID) => {
  try {
    if (!sessionID || !userID) return;

    // 1. Merge Cart Items
    const sessionCartItems = await CartItem.findAll({ where: { session_id: sessionID } });
    
    for (const sessionItem of sessionCartItems) {
      // Check if user already has this product (and variant) in their cart
      const existingUserItem = await CartItem.findOne({
        where: {
          user_id: userID,
          product_id: sessionItem.product_id,
          variant_id: sessionItem.variant_id || null
        }
      });

      if (existingUserItem) {
        // User already has it, so sum the quantities
        await existingUserItem.update({
          quantity: existingUserItem.quantity + sessionItem.quantity
        });
        // Delete the session item since it's merged
        await sessionItem.destroy();
      } else {
        // User doesn't have it, just reassign it to the user
        await sessionItem.update({
          user_id: userID,
          session_id: null
        });
      }
    }

    // 2. Merge Wishlist Items
    const sessionWishlistItems = await WishlistItem.findAll({ where: { session_id: sessionID } });

    for (const sessionItem of sessionWishlistItems) {
      const existingUserItem = await WishlistItem.findOne({
        where: {
          user_id: userID,
          product_id: sessionItem.product_id
        }
      });

      if (existingUserItem) {
        // User already has this product in their wishlist, just delete the duplicate session item
        await sessionItem.destroy();
      } else {
        // User doesn't have it, reassign it
        await sessionItem.update({
          user_id: userID,
          session_id: null
        });
      }
    }

    console.log(`Successfully merged session ${sessionID} data for user ${userID}`);
  } catch (error) {
    console.error("Error merging session data:", error);
  }
};

module.exports = {
  mergeSessionData
};
