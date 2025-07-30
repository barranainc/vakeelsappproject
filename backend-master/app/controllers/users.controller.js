const {
  Users,
  Fcm_tokens,
  Cases,
  Invites,
  Homes,
  Requests,
  Chats,
  Client_matters,
  Client_requests,
  Chat_rooms,
  Notifications
} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("../utils/responseHelpers");
const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { adminRoleID, saveBase64Image, memberRoleID, businessRoleID } = require("../utils/utility");
const fs = require("fs");
const moment = require("moment");
const multer = require("multer");
const sendNotification = require("../utils/sendNotifications");
const sendBulkNotificationMulti = require("../utils/sendBulkNotificationsMultiCast");
require("dotenv").config();

module.exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email ? email.trim() : undefined;
    let matchQuery = {};
    if (email) {
      matchQuery.email = { $regex: new RegExp(email, "i") };
    }

    var user = await Users.aggregate([{
      $match: {
        ...matchQuery,
        is_deleted: false
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
    { "$limit": 1 }
    ])

    if (user.length == 0) return response.notFound(res, "Invalid Credentials");
    else user = user[0];


    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { first_name: user.first_name, email: user.email, phone: user.phoneNumber, id: user._id,user_type: user.user_type, role: user.role.name },
        process.env.SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      let obj = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        _id: user._id,
        phone: user.phone,
        picture: user.picture,
        user_type: user.user_type,
        lawyer_details: user.user_type == "client" ? null : user.lawyer_details,
        is_approved: user.is_approved,
        token: token,
      };

      if(req.body.fcm_token){
        let obj = new Fcm_tokens({user_id: user._id, token: req.body.fcm_token})
        await obj.save()
      }


      return response.success(res, "Login Successful", obj);
    } else {
      return response.notFound(res, "Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};

module.exports.register = async (req, res) => {
  try {

    let newUserObj = req.body;
    let user = new Users(newUserObj);
    user.role_id = memberRoleID
    let encryptedPassword = await bcrypt.hashSync(user.password, 12);
    user.password = encryptedPassword;
    user.is_approved= true;
    if (user.user_type == "lawyer") {
      user.is_approved= null;

      user.lawyer_details = {
        lawyer_id: null,
        professional_documents: [],
        council_documents: req.body.council_documents,
        city: "",
        office_address: "",
        area_of_expertise: "",
        years_of_experience: 0,
        qualifications: "",
        designation: "",
        station: ""
    };
    }
    await user.save();
    const token = jwt.sign(
      { first_name: user.first_name,last_name: user.last_name, email: user.email, phone: user.phone, id: user._id,user_type: user.user_type, role: "member" },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    let obj = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: req.body.email,
      phone: req.body.phone,
      picture: req.body.picture,
      token: token,
      is_approved: user.is_approved,

    };

    if (req.body.fcm_token) {
      let fcmObj = {
        user_id: user._id,
        token: req.body.fcm_token,
      };
      let fcm = new Fcm_tokens(fcmObj);
      await fcm.save();
    }

    return response.success(
      res,
      "Registered Successfully",
      obj
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An Error Occurred");
  }
};

module.exports.changePassword = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email: email })
      if (user) {
          let encryptedPassword = await bcrypt.hashSync(password, 10);
          await Users.updateOne({_id:user._id},{password: encryptedPassword})
         
          return response.success(res, "Password Reset Successfully")
      }
      else {
          return response.badRequest(res, "Error! Try again later ")
      }
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.updateProfile = async (req, res) => {
  try {


    let user_id = req.query.user_id || req.user.id
      const { email, picture, phone, first_name,last_name,professional_documents,council_documents,city,office_address,area_of_expertise,years_of_experience,qualifications,designation,station,is_approved,cnic_back,cnic_front,cnic_number,council_id    } = req.body;

      checkUser = await Users.findOne({email: email, _id: {$ne: new ObjectId(user_id)}})
      if (checkUser) {
        return response.badRequest(res, "You cannot use this Email Address")

      }

      checkUser = await Users.findOne({_id: new ObjectId(user_id)})


      const obj = {
        ...(email && { email }),
        ...(picture && { picture }),
        ...(phone && { phone }),
        ...(first_name && { first_name }),
        ...(last_name && { last_name }),
        ...(cnic_number && { cnic_number }),
        ...(cnic_front && { cnic_front }),
        ...(cnic_back && { cnic_back }),
        ...(council_id && { council_id }),
      };

      const lawyerObj = {
        ...(professional_documents && { professional_documents }),
        ...(council_documents && { council_documents }),
        ...(city && { city }),
        ...(office_address && { office_address }),
        ...(area_of_expertise && { area_of_expertise }),
        ...(years_of_experience && { years_of_experience }),
        ...(qualifications && { qualifications }),
        ...(designation && { designation }),
        ...(station && { station }),
        ...req.body.lawyer_details
      };

      if ( checkUser?.lawyer_details?.lawyer_id) {
        lawyerObj.lawyer_id = checkUser.lawyer_details.lawyer_id
      }

      if (lawyerObj) {
        checkUser.lawyer_details = lawyerObj
        obj.lawyer_details = lawyerObj
      }

      await Users.updateOne({_id:new ObjectId(user_id)},{$set: obj})
      return response.success(res, "Profile Updated Successfully")
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.approveUser = async (req, res) => {
  try {


    let user_id = req.body.user_id
      const { is_approved } = req.body;

      await Users.updateOne({_id:new ObjectId(user_id)},{is_approved: is_approved})

      let notiTitle = "Your Profile Status is Updated";
      let notiDescription = is_approved ? `Congratulations! Your profile has been approved` : "Unfortunately, We cannot approve your profile."
      let data = {
      }
  
      let notificationObj = new Notifications({
        title: notiTitle,
        content: notiDescription,
        user_id: user_id,
        data: JSON.stringify(data),
        type: "profile_approval"
        
      })
  
      await notificationObj.save()
  
      let token = await Fcm_tokens.find({user_id: new ObjectId(user_id)});
      let tokens = [];
      for (let i = 0; i < token.length; i++) {
       const fcm = token[i];
       tokens.push(fcm.token)
      }
  
      if (tokens.length > 0) {
        sendBulkNotificationMulti(notiTitle,notiDescription,JSON.stringify(data),tokens)
      }
      return response.success(res, "Lawyer Status Updated")

  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.getProfile = async (req, res) => {
  try {
      

    let user_id = new ObjectId(req.user.id)
    if (req.query.user_id) {
      user_id = new ObjectId(req.query.user_id)
    }

      let userDetails = await Users.findOne({_id: user_id })

      let casesCount = await Cases.countDocuments({lawyer_id: new ObjectId(user_id)})
      let matterCount = await Requests.countDocuments({requester_id: new ObjectId(user_id), type: "client_matter"})
      return response.success(res, "Profile Fetched Successfully", {userDetails,casesCount,matterCount})
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.getList = async (req, res) => {
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
    return response.success(res, "User List", {users,count})
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.getChatRooms = async (req, res) => {
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

    if (req.user.user_type == "client") {
      matchQuery["client_id"] = new ObjectId(req.user.id)
    }
    else{
      matchQuery["requester_id"] = new ObjectId(req.user.id)
    }

    matchQuery.type = req.query.type;



    let requests = await Requests.aggregate([
      {
        $match: {
          ...matchQuery,
        }
      },
      {
          $lookup: {
              from: "users", // Users collection
              localField: "requester_id",
              foreignField: "_id",
              as: "requester_details"
          }
      },
      { $unwind: { path: "$requester_details", preserveNullAndEmptyArrays: true } },
  
      {
          $lookup: {
              from: "users", // Users collection
              localField: "client_id",
              foreignField: "_id",
              as: "client_details"
          }
      },
      { $unwind: { path: "$client_details", preserveNullAndEmptyArrays: true } },
  
      {
          $lookup: {
              from: "client_matters", 
              localField: "type_id",
              foreignField: "_id",
              as: "client_matter_details"
          }
      },
  

      {
          $lookup: {
              from: "client_requests", 
              localField: "type_id",
              foreignField: "_id",
              as: "client_request_details"
          }
      },
  
        {
          $lookup: {
              from: "chat_rooms", 
              localField: "_id",
              foreignField: "request_id",
              as: "room_details"
          }
      },
      { $unwind: { path: "$room_details", preserveNullAndEmptyArrays: true } },
  
      {
        $lookup: {
            from: "chats",
            let: { roomId: "$room_details._id" }, // Pass room_id for filtering
            pipeline: [
                { $match: { $expr: { $eq: ["$room_id", "$$roomId"] } } },
                
                { $sort: { sent_at: -1 } },
                
                { $limit: 1 }
            ],
            as: "last_chat"
        }
    },
    { $unwind: { path: "$last_chat", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
          from: "chats",
          let: { roomId: "$room_details._id" }, // Pass room_id for filtering
          pipeline: [
              // Match unread chats with is_seen = false
              { 
                  $match: { 
                      $expr: { 
                          $and: [
                              { $eq: ["$room_id", "$$roomId"] },
                              { $eq: ["$is_seen", false] },
                              { $eq: ["$receiver_id", new ObjectId(req.user.id)] }
                          ]
                      }
                  }
              },
              // Count unread chats
              { $count: "unread_count" }
          ],
          as: "unread_info"
      }
  },

  // Flatten unread_info to get the unread count
  {
      $addFields: {
          unread_count: { $ifNull: [{ $arrayElemAt: ["$unread_info.unread_count", 0] }, 0] }
      }
  },
  {
    $addFields: {
      unread_count: {
        $cond: {
          if: { $eq: ["$last_chat.sender_id", new ObjectId(req.user.id)] }, // compare with req.user.id
          then: 0,
          else: "$unread_count"
        }
      }
    }
  },
  { 
    $sort: { "last_chat.created_at": -1 } 
  },
  
      { "$skip": skip },
      { "$limit": limit },
  
     
  ]);
  

    let count = await Requests.countDocuments(matchQuery)
    return response.success(res, "Chat Rooms", {chats: requests,count})
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.getChats = async (req, res) => {
  try {
      
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 200;
    if (req.query.page) {
      page = parseInt(req.query.page.toString())
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit.toString())
    }
    var skip = (limit * page) - limit;

    
    let matchQuery = {}

    if (req.query.room_id) {
      matchQuery["room_id"] = new ObjectId(req.query.room_id)
    }
    

    var users = await Chats.aggregate([{
      $match: {
        ...matchQuery,
      }
    },
    { 
      $sort: { _id: -1 } 
    },
    { "$skip": skip },
    { "$limit": limit },
    
    ])

    let count = await Chats.countDocuments(matchQuery)

    await Chats.updateMany({room_id: new ObjectId(req.query.room_id), receiver_id: new ObjectId(req.user.id)},{$set: {is_seen: true}})
    return response.success(res, "Chats", {users,count})
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.getRoomDetails = async (req,res) => {
  try {

    let roomDetails = await Chat_rooms.findOne({_id: new ObjectId(req.query.room_id)});
    let request = await Requests.findOne({_id: roomDetails.request_id});


    //MatterDetails
    let matchQuery = {_id: new ObjectId(roomDetails.type_id)}
    
    
    let matters = await Client_matters.aggregate([{
      $match: {
        ...matchQuery,
      }
    },
    {
      $lookup: {
        from: "matter_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category"
      },
    },
    { $unwind: "$category", },
    {
      $lookup: {
        from: "matter_categories",
        localField: "subcategory_id",
        foreignField: "_id",
        as: "subcategory"
      },
    },
    { $unwind: "$subcategory", },
    
    {
      $lookup: {
        from: "users",
        localField: "client_id",
        foreignField: "_id",
        as: "client"
      },
    },
    { $unwind: "$client", },
    ])

  if (matters.length > 0) {
    matters = matters[0]
  }

    let matterDetails = matters

    //Request Details

    let matchQuery2 = {_id: new ObjectId(roomDetails.type_id)}
    
    
    let requests = await Client_requests.aggregate([
      {
          $match: {
              ...matchQuery2,
          },
      },
      {
          $lookup: {
              from: "request_services",
              localField: "service_id",
              foreignField: "_id",
              as: "service",
          },
      },
      {
          $lookup: {
              from: "request_services",
              localField: "sub_service_id",
              foreignField: "_id",
              as: "sub_service",
          },
      },
      {
          $project: {
              title: 1,
              client_id: 1,
              service_id: 1,
              service: {
                $cond: {
                    if: { $gt: [{ $size: "$service" }, 0] },
                    then: { $arrayElemAt: ["$service", 0] },
                    else: null,
                },
            },
              sub_service_id: 1,
              description: 1,
              request_type: 1,
              created_at: 1,
              sub_service: {
                  $cond: {
                      if: { $gt: [{ $size: "$sub_service" }, 0] },
                      then: { $arrayElemAt: ["$sub_service", 0] },
                      else: null,
                  },
              },
          },
      },
      {
          $lookup: {
              from: "users",
              localField: "client_id",
              foreignField: "_id",
              as: "client",
          },
      },
      { $unwind: "$client" },
  ]);

  if (requests.length > 0) {
    requests = requests[0]
  }

    let requestDetails = requests

    let client = await Users.findOne({_id: request.client_id})
    let requester = await Users.findOne({_id: request.requester_id})

    let details = {matterDetails,requestDetails,client,requester}
    return response.success(res, "Room Details", {details})

    
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.readMessages = async (req,res) => {
  try {

     await Chats.updateMany({_id: new ObjectId(req.query.room_id), is_seen: false,receiver_id: new ObjectId(req.user.id)},{$set: {is_seen: true}});
    return response.success(res, "Chat updated")

    
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.unreadCount = async (req,res) => {
  try {

    let count = await Chats.aggregate([
      {
        $match: {
          receiver_id: new ObjectId(req.user.id),
          is_seen: false
        }
      },
      {
        $group: {
          _id: "$room_id"
        }
      },
      {
        $count: "uniqueRoomCount"
      }
    ]);

    let chatCount = 0;
    if (count.length > 0) {
      chatCount = count[0]?.uniqueRoomCount || 0
    }
    
    return response.success(res, "Unread chats",{count: chatCount})

    
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}


module.exports.logout = async (req, res) => {
  try {
    const fcm_token = req.body.fcm_token; // Extract the FCM token from the request body
    const deleteResult = await Fcm_tokens.deleteMany({ token: fcm_token });

    if (deleteResult.deletedCount === 0) {
      console.log("No FCM Token found for this user or it's already deleted.");
    } else {
      console.log("FCM Token deleted successfully from active tokens.");
    }

    return response.success(res, "Logged out")

  } catch (err) {
    console.error(`Logout Error: ${err.stack}`);
    return response.serverError(res, "Error! Try again Later", err)

  }
};
