const PRODUCT = require("../Module/Product");
const USER = require("../Module/Userlogin");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require("dotenv").config();

//JWT
exports.secure = async function (req, res, next) {
    try {
        console.log(req.headers.token);
        let token = req.headers.token;

        if (!token) {
            throw new Error("Access Denied. Token is not found!!!")
        }

        var decorded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decorded);


        let checkUser = await USER.findById(decorded.id);

        if (!checkUser) {
            throw new Error("User is Not Found!!!.")
        }

        req.user = decorded.id;

        next();

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message,
        })
    }
}




//SIGN-UP

exports.UserSignup = async function (req, res, next) {
    try {

        if (!req.body.fname || !req.body.email || !req.body.password || !req.body.phone) {
            throw new Error("Please Enter All Required Fields!!!.");
        }

        console.log(req.body);

        req.body.password = await bcrypt.hash(req.body.password, 10);

        const data = await USER.create(req.body);

        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        data.password = undefined;

        res.status(201).json({
            status: "Success",
            message: "Signup Successfully.",
            token,
            data,
        })

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}





//LOGIN

exports.UserLogin = async function (req, res, next) {

    try {

        if (!req.body.email || !req.body.password) {
            throw new Error("Please Enter All Required Fields!!!.");
        }

        let user = await USER.findOne({ email: req.body.email });

        console.log(user);

        if (!user) {
            throw new Error("User not found!!. Please Sign-up.");
        }

        let checkpass = await bcrypt.compare(req.body.password, user.password);

        if (!checkpass) {
            throw new Error("Invalid password!!. Please enter the correct password.");
        }

        let token = jwt.sign({ id: user._id }, "SecretKey");

        user.password = undefined;

        res.status(201).json({
            status: "Success",
            message: "Login Successfully",
            token,
            user,
        })

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}




exports.AdminLogin = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Please enter both email and password.");
        }

        const user = await USER.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            throw new Error("Invalid credentials.");
        }

        if (user.role !== "admin") {
            throw new Error("Access Denied: You do not have administrative privileges.");
        }

        if (!user.isActive) {
            throw new Error("Your admin account is deactivated.");
        }

        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            throw new Error("Invalid credentials. Incorrect password.");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "SecretKey",
            { expiresIn: "1d" }
        );

        user.password = undefined;

        res.status(200).json({
            status: "Success",
            message: "Admin Login Successfully",
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message || "Server Error",
        });
    }
};



// CREATE PRODUCT
exports.Createdata = async function (req, res) {
    try {
        console.log(req.body);

        // Main Image

        if (req.files?.mainimage && req.files.mainimage[0]) {
            req.body.mainimage = req.files.mainimage[0].filename;
        }

        // Preview Images

        if (req.files?.previewimages) {
            req.body.previewimages = req.files.previewimages.map(
                (file) => file.filename
            );
        }

        // Product Sizes

        if (req.body.sizes && typeof req.body.sizes === "string") {
            try {
                req.body.sizes = JSON.parse(req.body.sizes);
                if (typeof req.body.sizes === "string") {
                    req.body.sizes = JSON.parse(req.body.sizes);
                }
            } catch {
                req.body.sizes = req.body.sizes.split(",");
            }
        }

        // PRICE & DISCOUNT

        const originalPrice = Number(req.body.originalPrice || 0);
        let salePrice = Number(req.body.salePrice || 0);
        const discountText = req.body.discount || "";

        const discountMatch = discountText.match(/(\d+(\.\d+)?)\s*%/);

        if (originalPrice > 0 && discountMatch) {
            const discountPercent = Number(discountMatch[1]);
            const discountAmount = (originalPrice * discountPercent) / 100;
            salePrice = Math.round(originalPrice - discountAmount);
        } else if (salePrice === 0 && originalPrice > 0) {
            salePrice = originalPrice;
        }

        req.body.originalPrice = originalPrice;
        req.body.salePrice = salePrice;
        req.body.discount = discountText;

        // CREATE
        const data = await PRODUCT.create(req.body);

        res.status(201).json({
            status: "Success",
            message: "Product Added Successfully.",
            data,
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "Failed",
            message: error.message,
        });
    }
};




//DELETE PRODUCT
exports.Deletedata = async function (req, res) {
    try {
        console.log(req.body);
        var data = await PRODUCT.findByIdAndDelete(req.query.id);
        res.status(201).json({
            status: "Success",
            message: "Product Deleted Successfully.",
            data
        })

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message,
        })
    }
}




// UPDATE SINGLE PRODUCT
exports.UpdateOnedata = async function (req, res) {
    try {
        if (req.files?.mainimage) {
            req.body.mainimage = req.files.mainimage[0].filename;
        }
        if (req.files?.previewimages) {
            req.body.previewimages = req.files.previewimages.map(file => file.filename);
        }

        if (req.body.sizes) {
            const parsedSizes = typeof req.body.sizes === "string"
                ? JSON.parse(req.body.sizes)
                : req.body.sizes;

            req.body.sizes = [...new Set(parsedSizes)];
        }

        var data = await PRODUCT.findByIdAndUpdate(req.query.id, req.body, { new: true });

        res.status(200).json({
            status: "Success",
            message: "Product Updated Successfully.",
            data: data
        });

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
};





//UPDATE ALL PRODUCT
exports.UpdateAlldata = async function (req, res) {
    try {
        console.log(req.body);
        var data = await PRODUCT.updateMany(
            {},
            { $set: req.body }
        );
        res.status(201).json({
            status: "Success",
            message: "Product Updated Successfully.",
            data
        })

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message,
        })
    }
}





//SHOW ONE PRODUCT
exports.ShowOnedata = async function (req, res) {
    try {
        console.log(req.body);
        var data = await PRODUCT.findById({ _id: req.query.id });
        res.status(201).json({
            status: "Success",
            message: "Show Product Successfully.",
            data
        })

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message,
        })
    }
}





//SHOW All PRODUCT

exports.ShowAlldata = async function (req, res) {
    try {
        console.log(req.body);
        var data = await PRODUCT.find();
        res.status(201).json({
            status: "Success",
            message: "Show All Product Successfully.",
            data
        })

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message,
        })
    }
}



// UPDATE USER PROFILE(MyAccount)

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const updatedUser = await USER.findByIdAndUpdate(
            req.user,
            {
                fname: name,
                name: name,
                phone: phone
            },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw new Error("User not found!!!")
        }

        res.status(200).json({
            status: "Success",
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
    }
};