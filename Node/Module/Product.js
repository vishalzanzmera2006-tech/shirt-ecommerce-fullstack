const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        salePrice: {
            type: Number,
            default: "",
        },

        originalPrice: {
            type: Number,
            default: 0,
            required: true,
        },

        discount: {
            type: String,
            default: "",
            trim: true,
        },

        badge: {
            type: String,
            enum: ["", "BEST SELLER", "TRENDING", "NEW ARRIVAL"],
            default: "",
        },

        mainimage: {
            type: String,
            default: "",
        },

        previewimages: {
            type: [String],
            default: [],
        },

        sizes: {
            type: [String],
            default: ["S", "M", "L", "XL", "XXL"],
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        isBestSeller: {
            type: Boolean,
            default: false,
        },

        isNewArrival: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const PRODUCT = mongoose.model("Product", productSchema);

module.exports = PRODUCT;