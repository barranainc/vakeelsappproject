const express = require("express");
const ctrl = require("../controllers/notifications.controller");
const verifyToken = require("../middleware/auth");
const validateUser = require("../middleware/optionalAuth");
const duplicateUser  = require("../middleware/validate.auth");
const Otp = require("../middleware/otp")
const {sendVerifyOTP} = require("../middleware/otp");
const router = express.Router();


router.get('/',[verifyToken], ctrl.getNotifications);
router.get('/count',[verifyToken], ctrl.getNotificationsCount);


router.post('/markAsRead',[verifyToken], ctrl.markNotificationsAsSeen);

router.delete('/delete',[verifyToken], ctrl.deleteNotification);



module.exports = router;

