const express = require("express");
const ctrl = require("../controllers/client.controller");
const verifyToken = require("../middleware/auth");
const validateUser = require("../middleware/optionalAuth");
const duplicateUser  = require("../middleware/validate.auth");
const Otp = require("../middleware/otp")
const {sendVerifyOTP} = require("../middleware/otp");
const router = express.Router();

router.post('/matters/add',[validateUser], ctrl.addMatter);
router.get('/matters',[validateUser], ctrl.getMatters);
router.get('/matters/details',[validateUser], ctrl.getMatterDetails);
router.patch('/matters/update',[validateUser], ctrl.updateMatter);

router.post('/requests/add',[validateUser], ctrl.addRequest);
router.get('/requests',[validateUser], ctrl.getRequests);
router.get('/requests/details',[validateUser], ctrl.getRequestDetails);
router.patch('/requests/update',[validateUser], ctrl.updateRequest);




module.exports = router;

