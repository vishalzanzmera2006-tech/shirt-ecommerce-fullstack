const ORDER = require("../Module/Order");


//CREATE ORDER
exports.createOrder = async (req, res) => {
    try {
        req.body.userId = req.user;

        const data = await ORDER.create(req.body);

        res.status(201).json({
            status: "Success",
            message: "Order placed successfully",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
    }
};


// GET MY ORDER
exports.getUserOrders = async (req, res) => {
    try {
        const data = await ORDER.find({ userId: req.user })
            .populate({
                path: "items.product",
                select: "name price image images img thumbnail",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "Success",
            message: "Orders fetched successfully",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
    }
};



// CANCEL ORDER
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const data = await ORDER.findOneAndUpdate(
            { _id: orderId, userId: req.user },
            { orderStatus: "Cancelled" },
            { new: true }
        );

        if (!data) {
            throw new Error("Order not found!!");
        }

        res.status(200).json({
            status: "Success",
            message: "Order cancelled successfully",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
    }

};




//ALL ORDERS

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await ORDER.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: "Success",
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message,
        });
    }
};




// UPDATE ORDER STATUS

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        if (!orderId || !orderStatus) {
            throw new Error("Order ID and status are required!!")
        }

        const updatedOrder = await ORDER.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            throw new Error("Order not found!!")
        }

        res.status(200).json({
            status: "Success",
            message: `Order status changed to ${orderStatus}`,
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message,
        });
    }
};