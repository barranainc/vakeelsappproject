const  response  = require('../utils/responseHelpers');
const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { saveBase64Image } = require("../utils/utility");
const {
  Users,
  Case_categories,
  Client_matters,
  Client_requests,
  Lawyer_responds
} = require("../models");
require('dotenv').config()



module.exports.addMatter = async (req, res) => {
  try {

    let matter = new Client_matters(req.body);
    matter.client_id = new ObjectId(req.user.id);
    await matter.save();
    

    return response.success(res, "Matter added Successfully", {});
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};


module.exports.getMatters = async(req,res) => {
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
      matchQuery = {client_id : new ObjectId(req.user.id) }
    }

    if (req.query.category_id) {
      matchQuery["category_id"] = new ObjectId(req.query.category_id)
    }

    if (req.query.subcategory_id) {
      matchQuery["subcategory_id"] = new ObjectId(req.query.subcategory_id)
    }

    
    
    let matters = await Client_matters.aggregate([
      {
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
        }
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "matter_categories",
          localField: "subcategory_id",
          foreignField: "_id",
          as: "subcategory"
        }
      },
      { $unwind: "$subcategory" },
      {
        $lookup: {
          from: "users",
          localField: "client_id",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: "$client" },
    
      // Lookup to count documents in Message_requests where type_id matches client_matter._id
      {
        $lookup: {
          from: "message_requests",
          let: { matterId: "$_id" }, // Define variable for _id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$type_id", "$$matterId"] } // Match type_id with client_matter._id
              }
            },
            { $count: "responded_lawyer" } // Count documents
          ],
          as: "response_count"
        }
      },
    
      // Add responded_lawyer field with count value (default to 0 if empty)
      {
        $addFields: {
          responded_lawyer: { $ifNull: [{ $arrayElemAt: ["$response_count.responded_lawyer", 0] }, 0] }
        }
      },

      {
        $lookup: {
          from: "lawyer_responds",
          let: { matterId: "$_id", currentUserId: new ObjectId(req.user.id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type_id", "$$matterId"] },
                    { $eq: ["$user_id", "$$currentUserId"] }
                  ]
                }
              }
            }
          ],
          as: "lawyer_respond"
        }
      },
      {
        $addFields: {
          respond: {
            $cond: {
              if: { $gt: [{ $size: "$lawyer_respond" }, 0] },
              then: { $arrayElemAt: ["$lawyer_respond", 0] }, // return first match
              else: null // or {}
            }
          }
        }
      },
      
    
      { 
        $sort: { _id: -1 } 
      },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    const count = await Client_matters.countDocuments(matchQuery)

    return response.success(res, "Matters Fetched ", {matters: matters,count});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.getMatterDetails = async(req,res) => {
  try {
    
    let matchQuery = {_id: new ObjectId(req.query.id)}
    
    
    let matters = await Client_matters.aggregate([
      {
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
        }
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "matter_categories",
          localField: "subcategory_id",
          foreignField: "_id",
          as: "subcategory"
        }
      },
      { $unwind: "$subcategory" },
      {
        $lookup: {
          from: "users",
          localField: "client_id",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: "$client" },
    
      // Lookup to count documents in Message_requests where type_id matches client_matter._id
      {
        $lookup: {
          from: "message_requests",
          let: { matterId: "$_id" }, // Define variable for _id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$type_id", "$$matterId"] } // Match type_id with client_matter._id
              }
            },
            { $count: "responded_lawyer" } // Count documents
          ],
          as: "response_count"
        }
      },
    
      // Add responded_lawyer field with count value (default to 0 if empty)
      {
        $addFields: {
          responded_lawyer: { $ifNull: [{ $arrayElemAt: ["$response_count.responded_lawyer", 0] }, 0] }
        }
      },
      {
        $lookup: {
          from: "lawyer_responds",
          let: { matterId: "$_id", currentUserId: new ObjectId(req.user.id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type_id", "$$matterId"] },
                    { $eq: ["$user_id", "$$currentUserId"] }
                  ]
                }
              }
            }
          ],
          as: "lawyer_respond"
        }
      },
      {
        $addFields: {
          respond: {
            $cond: {
              if: { $gt: [{ $size: "$lawyer_respond" }, 0] },
              then: { $arrayElemAt: ["$lawyer_respond", 0] }, // return first match
              else: null // or {}
            }
          }
        }
      },
    ]);
    

  if (matters.length > 0) {
    matters = matters[0]
  }

    return response.success(res, "Matter Details Fetched ", {matter: matters});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.updateMatter = async (req, res) => {
  try {
      const { subcategory_id, category_id, description, title,reason,is_interested } = req.body;
      const obj = {
        ...(subcategory_id && { subcategory_id }),
        ...(category_id && { category_id }),
        ...(description && { description }),
        ...(title && { title }),
       
      };

      let checkRespond = await Lawyer_responds.findOne({type_id: new ObjectId(req.body.id), user_id: new ObjectId(req.user.id)})
      if (!checkRespond) {
        let respond = new Lawyer_responds({type_id: new ObjectId(req.body.id), user_id: new ObjectId(req.user.id), is_interested: is_interested, reason: reason})
        await respond.save()
      }

      await Client_matters.updateOne({_id:req.body.id},obj)
      return response.success(res, "Request Updated Successfully")
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}

module.exports.addRequest = async (req, res) => {
  try {

    console.log(req.headers)
    let matter = new Client_requests(req.body);
    matter.client_id = new ObjectId(req.user.id);
    await matter.save();
    

    return response.success(res, "Matter added Successfully", {});
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};


module.exports.getRequests = async(req,res) => {
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
      matchQuery = {client_id : new ObjectId(req.user.id) }
    }

    if (req.query.category_id) {
      matchQuery["category_id"] = new ObjectId(req.query.category_id)
    }

    if (req.query.subcategory_id) {
      matchQuery["subcategory_id"] = new ObjectId(req.query.subcategory_id)
    }

    if (req.query.request_type) {
      matchQuery["request_type"] = req.query.request_type
    }
    
    
    let requests = await Client_requests.aggregate([
      {
          $match: {
              ...matchQuery,
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
        $lookup: {
          from: "lawyer_responds",
          let: { matterId: "$_id", currentUserId: new ObjectId(req.user.id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type_id", "$$matterId"] },
                    { $eq: ["$user_id", "$$currentUserId"] }
                  ]
                }
              }
            }
          ],
          as: "lawyer_respond"
        }
      },
      {
        $addFields: {
          respond: {
            $cond: {
              if: { $gt: [{ $size: "$lawyer_respond" }, 0] },
              then: { $arrayElemAt: ["$lawyer_respond", 0] }, // return first match
              else: null // or {}
            }
          }
        }
      },
      {
          $project: {
              title: 1,
              client_id: 1,
              service_id: 1,
              created_at: 1,
              is_interested: 1,
              reason: 1,
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
              respond: 1,
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
      { 
        $sort: { _id: -1 } 
      },
      { $skip: skip },
      { $limit: limit },
  ]);
  

    const count = await Client_requests.countDocuments(matchQuery)

    return response.success(res, "Requests Fetched ", {requests: requests,count});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.getRequestDetails = async(req,res) => {
  try {
    
    let matchQuery = {_id: new ObjectId(req.query.id)}
    
    
    let requests = await Client_requests.aggregate([
      {
          $match: {
              ...matchQuery,
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
      { $unwind: "$service" },
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
              service: 1,
              sub_service_id: 1,
              description: 1,
              request_type: 1,
              is_interested: 1,
              reason: 1,
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
      {
        $lookup: {
          from: "lawyer_responds",
          let: { matterId: "$_id", currentUserId: new ObjectId(req.user.id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type_id", "$$matterId"] },
                    { $eq: ["$user_id", "$$currentUserId"] }
                  ]
                }
              }
            }
          ],
          as: "lawyer_respond"
        }
      },
      {
        $addFields: {
          respond: {
            $cond: {
              if: { $gt: [{ $size: "$lawyer_respond" }, 0] },
              then: { $arrayElemAt: ["$lawyer_respond", 0] }, // return first match
              else: null // or {}
            }
          }
        }
      },
  ]);

  if (requests.length > 0) {
    requests = requests[0]
  }

    return response.success(res, "Request Details Fetched ", {request: requests});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.updateRequest = async (req, res) => {
  try {
      const { service_id, sub_service_id, request_type, description, title,is_interested,reason } = req.body;
      const obj = {
        ...(service_id && { service_id }),
        ...(sub_service_id && { sub_service_id }),
        ...(request_type && { request_type }),
        ...(description && { description }),
        ...(title && { title }),


      };

      let checkRespond = await Lawyer_responds.findOne({type_id: new ObjectId(req.body.id), user_id: new ObjectId(req.user.id)})
      if (!checkRespond) {
        let respond = new Lawyer_responds({type_id: new ObjectId(req.body.id), user_id: new ObjectId(req.user.id), is_interested: is_interested, reason: reason})
        await respond.save()
      }

      await Client_requests.updateOne({_id:req.body.id},obj)
      return response.success(res, "Request Updated Successfully")
      
  } catch (error) {
    console.log(error)
      logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`, 'error')
      return response.serverError(res, "Error! Try again Later", error)
  }
}