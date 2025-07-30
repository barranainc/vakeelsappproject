const  response  = require('../utils/responseHelpers');
const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { saveBase64Image, memberRoleID } = require("../utils/utility");
const {
  Users,
  Case_categories,
  Client_matters,
  Client_requests,
  Cases,
  Requests,
  Chat_rooms,
  Notifications,
  Fcm_tokens
} = require("../models");
require('dotenv').config()
const moment = require("moment");
const bcrypt = require("bcryptjs");
const sendNotification = require('../utils/sendNotifications');
const sendBulkNotification = require('../utils/sendBulkNotifications');
const sendBulkNotificationMulti = require('../utils/sendBulkNotificationsMultiCast');




module.exports.getCalendar = async(req,res) => {
  try {

    let month = req.query.month;
    let month_start = moment(month,"MMMM-YYYY").startOf("day").startOf("month").toDate();
    let month_end = moment(month,"MMMM-YYYY").endOf("day").endOf("month").toDate();

    const hearingDays = await Cases.aggregate([
      {
        $match: {
          next_hearing: {
            $gte: month_start,
            $lte: month_end,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$next_hearing" },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    const dates = hearingDays.map(day => day._id);

    return response.success(res, "Hearing days for the month", {hearingDays: dates});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.getDayDetails= async(req,res) => {
  try {

    let day = req.query.date;
    let utcoffset = 300;
    if (req.headers.utcoffset) {
      utcoffset = req.headers.utcoffset
    }
    let day_start = moment(day,"YYYY-MM-DD").startOf("day").subtract(-utcoffset,'minute').toDate();
    let day_end = moment(day,"YYYY-MM-DD").endOf("day").subtract(-utcoffset,'minute').toDate();
    let matchQuery = {}

    let todayCases = await Cases.aggregate([{
      $match: {
        next_hearing: {
          $gte: day_start,
          $lte: day_end,
        },
        ...matchQuery,
      }
    },
    {
      $lookup: {
        from: "case_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category"
      },
    },
    { $unwind: "$category", },

    {
      $lookup: {
        from: "case_categories",
        localField: "subcategory_id",
        foreignField: "_id",
        as: "subcategory"
      },
    },
    { $unwind: "$subcategory", },

    
    {
      $lookup: {
        from: "users",
        localField: "lawyer_id",
        foreignField: "_id",
        as: "lawyer"
      },
    },
    ])

    //Next Day Calculation
    const hearingDays = await Cases.aggregate([
      {
        $match: {
          next_hearing: {
            $gte: day_end,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$next_hearing" },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    
    let nextDay = hearingDays.length >0 ? hearingDays[0]._id : null;
    nextDayCases = []
    if (nextDay) {
      let nextDay_start = moment(nextDay,"YYYY-MM-DD").startOf("day").toDate();
      let nextDay_end = moment(nextDay,"YYYY-MM-DD").endOf("day").toDate();
      nextDayCases = await Cases.aggregate([{
        $match: {
          hearing_date: {
            $gte: nextDay_start,
            $lte: nextDay_end,
          },
          ...matchQuery,
        }
      },
      {
        $lookup: {
          from: "case_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category"
        },
      },
      { $unwind: "$category", },
      {
        $lookup: {
          from: "case_categories",
          localField: "subcategory_id",
          foreignField: "_id",
          as: "subcategory"
        },
      },
      { $unwind: "$subcategory", },
      
      {
        $lookup: {
          from: "users",
          localField: "lawyer_id",
          foreignField: "_id",
          as: "lawyer"
        },
      },
      { $unwind: "$lawyer", },
      ])
    }



    return response.success(res, "Details for the day", {selectedDateCases: todayCases, nextCases: nextDayCases});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.addTeamMember = async (req, res) => {
  try {

    let newUserObj = req.body;
    let user = new Users(newUserObj);
    user.role_id = memberRoleID
    let encryptedPassword = await bcrypt.hashSync("Password@123", 12);
    user.password = encryptedPassword;
    user.lawyer_details["lawyer_id"] = req.user.id;
    
    await user.save();



    return response.success(
      res,
      "Team Member added Successfully",    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An Error Occurred");
  }
};

module.exports.getTeam = async (req, res) => {
  try {
      
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (req.query.page) {
      page = parseInt(req.query.page.toString())
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit.toString())
    }
    var skip = (limit * page) - limit;

    
    let matchQuery = {}

    if (req.query.user_type) {
      matchQuery["user_type"] = req.query.user_type
    }

    if (req.user.id) {
      matchQuery["lawyer_details.lawyer_id"] = new ObjectId(req.user.id)
    }

    var users = await Users.aggregate([{
      $match: {
        ...matchQuery,
      }
    },
    {
      $lookup: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        as: "role"
      },
    },
    { $unwind: "$role", },
    { 
      $sort: { _id: -1 } // Replace `createdAt` with the field you want to sort by
    },
    { "$skip": skip },
    { "$limit": limit },
    
    ])

    let count = await Users.countDocuments(matchQuery)
    return response.success(res, "Team List", {users,count})
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.sendRequest = async (req, res) => {
  try {


    let checkRequest = await Requests.findOne({client_id: new ObjectId(req.body.client_id), type_id: new ObjectId(req.body.type_id), requester_id: new ObjectId(req.user.id)});

    if (checkRequest) {

      let chat_room =  await Chat_rooms.findOne({request_id: checkRequest._id});
      
        return response.success(
          res,
          "You've already responded to this.",
          {room_id: chat_room?._id}
        );
    }

    let newRequest = req.body;
    newRequest.requester_id = req.user.id;
    let request = new Requests(newRequest);
    await request.save();

    let room = new Chat_rooms({request_id: request._id, type_id: new ObjectId(req.body.type_id) ,users: [new ObjectId(req.body.client_id), new ObjectId(req.user.id)]})
    await room.save()

    let notiTitle = "New Message Received";
    let notiDescription = `${req.user.first_name} sent you a new message on ${req.body.type_name}`
    let data = {
      room_id: room._id
    }

    let notificationObj = new Notifications({
      title: notiTitle,
      content: notiDescription,
      user_id: req.body.client_id,
      data: JSON.stringify(data),
      type: "message"
      
    })

    await notificationObj.save()

    let token = await Fcm_tokens.find({user_id: req.body.client_id});
    let tokens = [];
    for (let i = 0; i < token.length; i++) {
     const fcm = token[i];
     tokens.push(fcm.token)
    }

    if (tokens.length > 0) {
      sendBulkNotificationMulti(notiTitle,notiDescription,JSON.stringify(data),tokens)
    }

    return response.success(res,"Message Request Sent",{room_id: room._id} );
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An Error Occurred");
  }
};