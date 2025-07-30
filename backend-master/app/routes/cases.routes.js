const express = require("express");
const ctrl = require("../controllers/cases.controller");
const verifyToken = require("../middleware/auth");
const validateUser = require("../middleware/optionalAuth");
const duplicateUser  = require("../middleware/validate.auth");
const Otp = require("../middleware/otp")
const {sendVerifyOTP} = require("../middleware/otp");
const router = express.Router();

router.get('/categories', ctrl.getCategories);
router.post('/add',[validateUser], ctrl.addCase);
router.post('/addProceeding',[validateUser], ctrl.addProceeding);
router.get('/',[validateUser], ctrl.getCases);
router.get('/details',[validateUser], ctrl.getCaseDetails);



module.exports = router;

