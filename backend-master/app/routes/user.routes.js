const express = require("express");
const user = require("../controllers/users.controller");
const verifyToken = require("../middleware/auth");
const validateUser = require("../middleware/optionalAuth");
const duplicateUser  = require("../middleware/validate.auth");
const  verifyUser = require("../middleware/validate.user");
const Otp = require("../middleware/otp")
const {sendVerifyOTP} = require("../middleware/otp");
const user_route = express.Router();

user_route.post('/login', user.login);
user_route.post('/logout', user.logout);
user_route.post('/register',[duplicateUser,sendVerifyOTP], user.register);
user_route.post('/changePassword',[verifyUser,sendVerifyOTP], user.changePassword);
user_route.patch('/updateProfile',[verifyToken], user.updateProfile);
user_route.get('/profile',[verifyToken], user.getProfile);

user_route.get('/',[verifyToken], user.getList);

user_route.get('/chatRooms',[verifyToken], user.getChatRooms);
user_route.get('/chats',[verifyToken], user.getChats);
user_route.get('/chats/unreadCount',[verifyToken], user.unreadCount);
user_route.get('/roomDetails',[verifyToken], user.getRoomDetails);
user_route.get('/readMessages',[verifyToken], user.readMessages);






module.exports = user_route;

