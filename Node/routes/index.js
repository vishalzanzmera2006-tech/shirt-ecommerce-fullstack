var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const Controller = require("../Controller/product.controller");



// Multer--------------->

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/productimages"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(
            null,
            file.fieldname +
            "-" +
            uniqueSuffix +
            path.extname(file.originalname)
        );
    }
});
const upload = multer({
    storage: storage
});




//LOGIN & SIGNUP------------------>

router.post("/user/login", Controller.UserLogin);
router.post("/user/signup", Controller.UserSignup);




//ADMIN LOGIN ------------------>

router.post("/admin/login", Controller.AdminLogin);




// CRUD--------------->

router.post(
    "/shirt/create",

    upload.fields([
        {
            name: "mainimage",
            maxCount: 1
        },
        {
            name: "previewimages",
            maxCount: 6
        }
    ]),
    Controller.Createdata);


router.delete("/shirt/delete", Controller.secure, Controller.Deletedata);

router.patch(
    '/shirt/updateOne',
    upload.fields([
        { name: 'mainimage', maxCount: 1 },
        { name: 'previewimages', maxCount: 6 }
    ]),
    Controller.secure, Controller.UpdateOnedata
);

router.put("/shirt/updateAll", Controller.UpdateAlldata);

router.get("/shirt/showOne", Controller.ShowOnedata);

router.get("/shirt/showAll", Controller.ShowAlldata);



//PROFILE-UPDATE--------------->

router.put("/update-profile", Controller.secure, Controller.updateProfile);




module.exports = router;