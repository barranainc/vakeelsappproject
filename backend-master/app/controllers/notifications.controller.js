const { Notifications, Fcm_tokens } = require("../models");

const response = require("../utils/responseHelpers");
const { ObjectId } = require("mongodb");
const logger = require("../logger");
require("dotenv").config();

module.exports.getNotifications = async (req, res) => {
  try {
    //    let page = 1;
    //    let limit = 20;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (req.query.page) {
      page = parseInt(req.query.page.toString());
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit.toString());
    }
    var skip = limit * page - limit;

    const notifications = await Notifications.find({ user_id: req.user.id })
      .sort({ _id: "desc" })
      .skip(skip)
      .limit(limit);
    const notification_unseen_count = await Notifications.countDocuments({
      user_id: req.user.id,
      is_seen: false,
    });
    const count = await Notifications.countDocuments({ user_id: req.user.id });
    // await Notifications.updateMany(
    //   { user_id: req.user.id, is_seen: false },
    //   { $set: { is_seen: true } }
    // );
    return response.success(res, "Notifications List", {
      notifications,
      count,
      notification_unseen_count,
    });
  } catch (error) {
    console.log(error);
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    return response.serverError(res, "Some Error Occurred");
  }
};

module.exports.getNotificationsCount = async (req, res) => {
  try {
    const notifications = await Notifications.countDocuments({
      user_id: req.user.id,
      is_seen: false,
    });
    return response.success(res, "Notifications Count", {
      count: notifications,
    });
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    return response.serverError(res, "Some Error Occurred");
  }
};

module.exports.markNotificationsAsSeen = async (req, res) => {
  try {
    await Notifications.updateOne(
      { _id: new ObjectId(req.body.notification_id)}, {$set: {is_seen: true, seen_at: new Date()} }
    );

    return response.success(res, "Notification marked as seen");
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    return response.serverError(res, "Some Error Occurred");
  }
};

module.exports.deleteNotification = async (req, res) => {
  try {
    await Notifications.deleteOne(
      { _id: new ObjectId(req.query.id) }
    );

    return response.success(res, "Notification Removed");
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    return response.serverError(res, "Some Error Occurred");
  }
};

