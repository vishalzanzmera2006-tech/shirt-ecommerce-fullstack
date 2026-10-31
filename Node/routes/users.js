var express = require('express');
var router = express.Router();
const customerController = require("../Controller/customer.controller");

// Get all customers
router.get("/customers", customerController.getAllCustomers);

// Update status 
router.patch("/customer-status/:id", customerController.CustomerStatus);

module.exports = router;
