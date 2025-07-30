const express = require("express");
const ctrl = require("../controllers/lawyer.controller");
const userCtrl = require("../controllers/users.controller");
const verifyToken = require("../middleware/auth");
const validateUser = require("../middleware/optionalAuth");
const duplicateUser  = require("../middleware/validate.auth");
const Otp = require("../middleware/otp")
const {sendVerifyOTP} = require("../middleware/otp");
const router = express.Router();


router.get('/calendar',[verifyToken], ctrl.getCalendar);
router.get('/dayDetails',[verifyToken], ctrl.getDayDetails);
router.post('/addMember',[duplicateUser,verifyToken], ctrl.addTeamMember);
router.get('/team',[verifyToken], ctrl.getTeam);

router.post('/sendRequest',[verifyToken], ctrl.sendRequest);
router.post('/approve',[verifyToken], userCtrl.approveUser);



module.exports = router;

