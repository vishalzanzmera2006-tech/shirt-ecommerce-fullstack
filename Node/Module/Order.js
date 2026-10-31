const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            default: "Gujarat",
        },
        pincode: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            default: "online",
        },
        paymentStatus: {
            type: String,
            default: "Pending",
        },
        orderStatus: {
            type: String,
            default: "Placed",
        },
        subtotal: {
            type: Number,
            required: true,
        },
        shippingCharges: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const ORDER = mongoose.model("order", orderSchema);
module.exports = ORDER;