const express = require("express");
const router = express.Router();
const orderController = require("../Controller/order.controller");
const Controller = require("../Controller/product.controller");


//CREATE ORDER
router.post("/create", Controller.secure, orderController.createOrder);

//MY-ORDER
router.get("/myorders", Controller.secure, orderController.getUserOrders);

// CANCEL ORDER
router.put("/cancel", Controller.secure, orderController.cancelOrder);

//ALL ORDER (SHOWALL)
router.get("/admin/all", Controller.secure, orderController.getAllOrders);

//UPDATE ALL ORDER-STATUS
router.put("/admin/status-update", Controller.secure, orderController.updateOrderStatus);

module.exports = router;