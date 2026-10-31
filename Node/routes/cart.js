const express = require("express");
const router = express.Router();
const CartController = require("../Controller/cart.controller");
const usercontroller = require("../Controller/product.controller")


//CREATE
router.post("/add", usercontroller.secure, CartController.addToCart);


//SHOW
router.get("/", usercontroller.secure, CartController.getCart);


//UPDATE
router.patch("/update/:productId", usercontroller.secure, CartController.updateCart);


//DELETE
router.delete("/remove/:cartId", usercontroller.secure, CartController.removeFromCart);


//ALL CLEAR CART ITEM
router.delete("/clear", usercontroller.secure, CartController.clearCart);


module.exports = router;