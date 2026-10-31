const express = require("express");
const router = express.Router();
const WishlistController = require("../Controller/wishlist.controller");
const usercontroller = require("../Controller/product.controller");


// CREATE
router.post("/add", usercontroller.secure, WishlistController.addWishlist);

// SHOW
router.get("/", usercontroller.secure, WishlistController.getWishlist);

// DELETE
router.delete("/remove", usercontroller.secure, WishlistController.removeWishlist);


module.exports = router;