const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    device_id: {
      type: String
    },
    api_name: {
      type: String
    },
    code: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    expired_at: {
      type: Date
    },
    is_verified: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
})

const OTP =  mongoose.model('otp_codes', OTPSchema)
module.exports =  OTP;