const CART = require("../Module/Cart");


// ADD TO CART 
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            throw new Error("Product ID is required");
        }

        let existingCart = await CART.findOne({
            user: req.user,
            product: productId,
        });

        if (existingCart) {
            existingCart.quantity += Number(quantity) || 1;
            await existingCart.save();

            await existingCart.populate("product");

            return res.status(200).json({
                status: "Success",
                message: "Cart quantity updated",
                data: existingCart,
            });
        }

        let cart = await CART.create({
            user: req.user,
            product: productId,
            quantity: Number(quantity) || 1,
        });

        await cart.populate("product");

        res.status(200).json({
            status: "Success",
            message: "Product added to cart",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
        });
    }
};



// GET CART
exports.getCart = async (req, res) => {
    try {
        const cart = await CART.find({
            user: req.user,
        }).populate("product");

        res.status(200).json({
            status: "Success",
            count: cart.length,
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
        });
    }
};




// REMOVE FROM CART
exports.removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await CART.findOneAndDelete({
            _id: cartId,
            user: req.user,
        });

        if (!cart) {
            throw new Error("Cart item not found");
        }
        res.status(200).json({
            status: "Success",
            message: "Product removed from cart",
        });

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
        });
    }
};




//  CLEAR CART
exports.clearCart = async (req, res) => {
    try {
        await CART.deleteMany({
            user: req.user,
        });

        res.status(200).json({
            status: "Success",
            message: "Cart cleared",
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
        });
    }
};




// UPDATE CART QUANTITY 

exports.updateCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            throw new Error("Quantity must be at least 1");
        }

        const cart = await CART.findOneAndUpdate(
            {
                user: req.user,
                product: productId,
            },
            {
                quantity: Number(quantity),
            },
            {
                new: true,
            }
        ).populate("product");

        if (!cart) {
            throw new Error("Product not found in cart");
        }

        res.status(200).json({
            status: "Success",
            message: "Cart quantity updated",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
        });
    }
};

