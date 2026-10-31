const express = require('express');
const router = express.Router();
const accessrequest = require("../Controller/access.controller")


//Create 
router.post('/requestaccess', accessrequest.addRequest);

//Show All
router.get('/allrequests', accessrequest.getAllRequests);

//Delete
router.delete('/delete/accessrequest', accessrequest.deleteRequest);

module.exports = router;