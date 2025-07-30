const jwt = require("jsonwebtoken");
const logger = require("../logger");
const response = require("../utils/responseHelpers");
const {Users} = require('../models');

const checkUser = async (req, res, next) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return response.badRequest(res, "Email not associated with any account")
        }
        next();

    } catch (error) {
        logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
        return response.serverError(res, "Not able to process your request")
    }
}

module.exports = checkUser;