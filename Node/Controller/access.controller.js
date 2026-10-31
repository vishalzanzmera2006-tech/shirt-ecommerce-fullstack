const AccessRequest = require('../Module/AccessRequest');


//CREATE

exports.addRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is Required' });
        }

        // Check duplicate
        const checkEmail = await AccessRequest.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                success: false,
                message: 'Already Submitted!!'
            });
        }

        // Save into Database
        const newRequest = new AccessRequest({ email });
        await newRequest.save();

        res.status(200).json({
            success: true,
            message: 'Request access successfully submitted!',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



//SHOW ALL DATA

exports.getAllRequests = async (req, res) => {
    try {
        const data = await AccessRequest.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//DELETE

exports.deleteRequest = async (req, res) => {
    try {
        
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'id is Provided'
            });
        }

        const deletedItem = await AccessRequest.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ success: false, message: 'Record Not Found!' });
        }

        return res.status(200).json({
            success: true,
            message: 'Request deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};