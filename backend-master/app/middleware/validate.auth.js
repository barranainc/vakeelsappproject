const { Users } = require("../models/");
const helperFunction  = require("../utils/responseHelpers");
const logger = require("../config/logger");

duplicateUser = async(req, res, next) => {
    try {
        let email = await Users.findOne({
            email: req.body.email
        })
        if (email) {
            return helperFunction.badRequest(res,"This Email already exists")
        }
        let phone = await Users.findOne({
            phone: req.body.phone
        })
        if (phone) {
            return helperFunction.badRequest(res,"This Phone Number already exists")
        }
        if (req.body.validate == true || req.body.validate == "true") {
            return helperFunction.success(res,"Email/Phone is Valid")

        }
        next();
    } catch (error) {
        console.log(error)
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`,'error')
        return helperFunction.serverError(res,"Some Error Occurred")
    }
}

const DuplicateEmail= {
    duplicateUser
};

module.exports = duplicateUser;