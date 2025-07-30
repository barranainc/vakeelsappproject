const  response  = require('../utils/responseHelpers');
const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { saveBase64Image } = require("../utils/utility");
const {
  Users,
  Case_categories,
  Cases,
  Invites,
} = require("../models");
require('dotenv').config()



exports.getCategories = async (req, res) => {
    try {
      var categories = await Case_categories.aggregate([
        {$match: {parent: null}},
        {
          $lookup: {
            from: "case_categories", // The name of the subcategories collection
            localField: "_id", // Field in Case_categories
            foreignField: "parent", // Field in subcategories that matches _id
            as: "subcategories" // The name of the field for nested data
          }
        },
        {
          $project: {
            name: 1, // Include the name field
            icon: 1, // Include the icon field
            _id: 1, // Include the icon field
            subcategories: { 
              $map: {
                input: "$subcategories", // Iterate over subcategories
                as: "subcategory",
                in: { 
                  _id: "$$subcategory._id",
                  name: "$$subcategory.name", 
                  icon: "$$subcategory.icon" 
                }
              }
            }
          }
        }
      ]);
      
  
      return response.success(res, "Case Categories", { categories: categories })
    } catch (error) {
      writeLog(`IP => ${req.ip} API => ${req.url} - Request Data => ${JSON.stringify(req.query)} Error => ${error}`, 'error', 'both');
      return response.error(res, "Unable to upload! Try again Later", error)
  
    }
};

module.exports.addCase = async (req, res) => {
  try {


    let caseDetails = await Cases.findOne({case_number: req.body.case_number})
    if (caseDetails) {
      return response.badRequest(res, "Case Number already Exists", {});

    }

    let cases = new Cases(req.body);
    cases.lawyer_id = new ObjectId(req.user.id);

    await cases.save();
    

    return response.success(res, "Case added Successfully", {});
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};

module.exports.addProceeding = async (req, res) => {
  try {

    let caseDetails = await Cases.findOne({_id: new ObjectId(req.body.case_id)});
    if (!caseDetails) {
      return response.badRequest(res, "Case not Found", {});
    }

    let proceedings = caseDetails.proceedings;

    let date = new Date()
    if (req.body.next_hearing) {
      caseDetails.next_hearing = req.body.next_hearing;
      date = caseDetails.next_hearing
    }

    proceedings.push({
      date: date,
      order: req.body.order,
      attachments: req.body.attachments, 
      status: req.body.status
    })

    caseDetails.proceedings = proceedings



    if (req.body.case_status) {
      caseDetails.case_status= req.body.case_status;
    }
  
    await caseDetails.save();
    

    return response.success(res, "Proceeding added Successfully", {});
  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
};


module.exports.getCases = async(req,res) => {
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
    if (req.user.user_type == "lawyer") {
      matchQuery = {lawyer_id : new ObjectId(req.user.id) }
    }

    if (req.query.category_id) {
      matchQuery["category_id"] = new ObjectId(req.query.category_id)
    }

    if (req.query.case_number) {
      matchQuery["case_number"] = { $regex: req.query.case_number, $options: "i" };
    }  
    
    if (req.query.title) {
      matchQuery["title"] = { $regex: req.query.title, $options: "i" };
    }   
    
    let cases = await Cases.aggregate([{
      $match: {
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
    { $sort: { created_at: -1 } } ,
    {$skip: skip},
    {$limit: limit},
  


    ])

    const casesCount = await Cases.countDocuments(matchQuery)

    return response.success(res, "Cases Fetched ", {cases: cases,casesCount});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}

module.exports.getCaseDetails = async(req,res) => {
  try {
    let matchQuery = {}

    if (req.query.id) {
      matchQuery["_id"] = new ObjectId(req.query.id)
    }
    
    let cases = await Cases.aggregate([{
      $match: {
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

    return response.success(res, "Case Details ", {case: cases});

  } catch (error) {
    console.log(error);
    logger.error(`ip: ${req.ip},url: ${req.url},error:${error.stack}`);
    return response.serverError(res, "Something bad happened! Try Again Later");
  }
}