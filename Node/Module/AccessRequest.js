const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        status: {
            type: String,
            default: 'pending',
        },
    },
    { timestamps: true }
);


const AccessRequest = mongoose.model("AccessRequest", accessRequestSchema);
module.exports = AccessRequest;