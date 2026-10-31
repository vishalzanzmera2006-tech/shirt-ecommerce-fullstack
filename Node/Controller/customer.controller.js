const USER = require("../Module/Userlogin");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');


//GET ALL CUSTOMERS DETAILES

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await USER.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(201).json({
            status: "Success",
            count: customers.length,
            data: customers,
        });
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message,
        });
    }
};



//CUSTOMERS ACTIVE OR NOT

exports.CustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const updatedUser = await USER.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw new Error("Customer not found!!")
        }

        res.status(200).json({
            status: "Success",
            message: `Account has been ${isActive ? "activated" : "suspended"}.`,
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message,
        });
    }
};