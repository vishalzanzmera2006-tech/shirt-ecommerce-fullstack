const WISHLIST = require("../Module/Wishlist");



// ADD TO WISHLIST
exports.addWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            throw new Error("Product ID is required");
        }

        const existing = await WISHLIST.findOne({
            user: req.user,
            product: productId
        });

        if (existing) {
            throw new Error("Product already in wishlist");
        }

        const wishlist = await WISHLIST.create({
            user: req.user,
            product: productId
        });

        res.status(201).json({
            status: "Success",
            message: "Product added to wishlist",
            data: wishlist
        });

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        });
    }
};




// GET WISHLIST 

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await WISHLIST.find({
            user: req.user
        }).populate("product");

        const orphanedItems = wishlist.filter(item => !item.product);

        if (orphanedItems.length > 0) {
            const orphanedIds = orphanedItems.map(item => item._id);
            await WISHLIST.deleteMany({ _id: { $in: orphanedIds } });
        }

        const validWishlist = wishlist.filter(item => item.product !== null);

        res.status(200).json({
            status: "Success",
            count: validWishlist.length,
            data: validWishlist
        });

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
};



// REMOVE FROM WISHLIST 
exports.removeWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            throw new Error("ID is required to remove");
        }

        const wishlist = await WISHLIST.findOneAndDelete({
            user: req.user,
            $or: [
                { product: productId },
                { _id: productId }
            ]
        });

        res.status(200).json({
            status: "Success",
            message: "Product removed from wishlist"
        });

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        });
    }
};