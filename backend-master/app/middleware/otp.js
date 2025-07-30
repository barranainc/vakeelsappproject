const logger = require("../config/logger");
const response = require("../utils/responseHelpers");
const utils = require("../utils/utility");
const {  UserAuth, User } = require("../models/");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const config = process.env;
const fs = require("fs");
var generator = require("generate-password");
const moment = require("moment");
const { sendEmail } = require("../utils/sendEmail");

const GenerateOTP = (length) => {
  let OTP = generator.generate({
    length: length,
    numbers: true,
    lowercase: false,
    uppercase: false,
  });

  return OTP;
};

const sendVerifyOTP = async (req, res, next) => {
  try {

    if (req.body.otp_token) {
      try {
        const decoded = jwt.verify(req.body.otp_token, config.SECRET_KEY);
        if (
          decoded.device_id == req.headers.deviceuid &&
          decoded.api == req.url
        ) {
          return next();
        }
      } catch (error) {
        if (error) {
          return response.authError(res, "OTP Authentication Expired");
        }
      }
    }

    if (req.body.otp) {
      let matchQuery = {};
      if (req.body.email) {
        matchQuery.email = { $regex: new RegExp(req.body.email, "i") };
      } else if (req.body.phone) {
        matchQuery.phone = req.body.phone;
      }
      var find_query = {
        ...matchQuery,
        expired_at: { $gte: moment() },
        code: req.body.otp,
        api_name: req.url,
        is_verified: false,
      };
      var result = await OTP.findOne(find_query);

     // OTP Testing MODE
        if (req.body.otp == "0000") {
          console.log("DEVICE UIDDD:"+req.headers.deviceuid)

          const token = jwt.sign(
            { device_id: req.headers.deviceuid, api: req.url },
            process.env.SECRET_KEY,
            {
              expiresIn: "5m",
            }
          );
          return response.otpSuccess(res, "OTP verified", { otp_token: token });
        }
      console.log("this is result",result)
      if (result) {
        var updateResult = await OTP.updateOne(find_query, {
          is_verified: true,
        });
        const token = jwt.sign(
          { device_id: req.headers.deviceuid, api: req.url },
          process.env.SECRET_KEY,
          {
            expiresIn: "2d",
          }
        );
        return response.otpSuccess(res, "OTP verified", { otp_token: token });
      } else {
        console.log(result)
        return response.badRequest(res, "You've entered incorrect OTP code");
      }
    } else {
      var otpCode = GenerateOTP(4);
      let matchQuery = {};
      if (req.body.email) {
        matchQuery.email = { $regex: new RegExp(req.body.email, "i") };
      } else if (req.body.phone) {
        matchQuery.phone = req.body.phone;
      } else {
        return next();
        //return response.badRequest(res, "no number or email found");
      }

      var find_query = {
        ...matchQuery,
        device_id: req.headers.deviceuid,
        api_name: req.url,
        is_verified: false,
      };
      var result = await OTP.find(find_query);
      if (result.length > 0) {
        var returnedOTP = result[result.length - 1];
      }

      if (returnedOTP) {
        var newDate = moment()
          .add(utils.otpExpiryMinutes, "minutes")
          .toString();
          var updateResult = await OTP.updateOne(find_query, {
            email: req.body.email,
            phone: req.body.phone,
            code: otpCode,
            expired_at: newDate,
          });
        if (updateResult) {
          
         
            sendOTPEmail(req.body.email, otpCode, 5);
          
          //  console.log(otpCode);
          return response.otpSuccess(
            res,
            "OTP code has been resent successfully",
            {}
          );
        }
      } else {
        var insertData = {
          email: req.body.email,
          phone: req.body.phone,
          device_id: req.headers.deviceuid,
          code: otpCode,
          api_name: req.url,
          expired_at: moment().add(utils.otpExpiryMinutes, "minutes"),
        };

        var insertResult = new OTP(insertData);
        //console.log(req.body.phone, "phone");
        await insertResult.save();
          sendOTPEmail(req.body.email, otpCode, 5);
        

        return response.otpSuccess(res, `OTP Sent`, {});
      }
    }
  } catch (error) {
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, "error");
    return response.authError(res, "Unauthorized");
  }
  return next();
};

const sendOTPEmail = (email, otpcode, minutes) => {
  fs.readFile("./app/utils/emailTemplates/otp.html", 'utf8', (err, content) => {
      if (err) {
          console.log(err);
      }
      let htmlcontent = content;
      htmlcontent = htmlcontent.replace('{minutes}', minutes);
      htmlcontent = htmlcontent.replace('{otp1}', otpcode[0]);
      htmlcontent = htmlcontent.replace('{otp2}', otpcode[1]);
      htmlcontent = htmlcontent.replace('{otp3}', otpcode[2]);
      htmlcontent = htmlcontent.replace('{otp4}', otpcode[3]);
      var result = sendEmail(email, "Vakeel - You have requested OTP.", htmlcontent)
      console.log(result)
  });
};


module.exports = { sendVerifyOTP };
