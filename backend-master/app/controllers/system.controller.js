const  response  = require('../utils/responseHelpers');
const { ObjectId } = require("mongodb");
const logger = require("../logger");
const { saveBase64Image } = require("../utils/utility");
require('dotenv').config()
const {
  Case_categories,
  Matter_categories,
  Request_services,
  Users,
  Cases,
  Client_matters,
  Client_requests,
  Requests
} = require("../models");



exports.uploadDocuments = async (req, res) => {
    try {
      console.log(req.imagePaths)

      let path = req.imagePaths;

      if (path.length == 1) {
        path = path[0]
      }
      return response.success(res, "Uploaded Picture", { path: path })
    } catch (error) {
      logger.error(
        `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
      );
            return response.error(res, "Unable to upload! Try again Later", error)
  
    }
  };

  exports.uploadBase64 = async (req, res) => {
    try {
      await saveBase64Image(req.body.document, "./uploads/temp/" + req.body.filename);

      let path = "/media/temp/" + req.body.filename;
      return response.success(res, "Uploaded Document", { path: path })
    } catch (error) {
      logger.error(
        `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
      );
      console.log(error);
      return response.serverError(res, "An Error Occurred");
    }
  };


  exports.getStats = async (req, res) => {
    try {
      
      if (req.user.user_type == "admin") {
        let lawyerCount = await Users.countDocuments({user_type: "lawyer"})
        let clientCount = await Users.countDocuments({user_type: "client"})
        let paralegalCount = await Users.countDocuments({user_type: "paralegal"})
        let casesCount = await Cases.countDocuments({})
        let requestsCount = await Client_requests.countDocuments({})
        let mattersCount = await Client_matters.countDocuments({})
        return response.success(res, "Dashboard Stats", { lawyerCount,clientCount,paralegalCount,casesCount,requestsCount,mattersCount })
      }else{
        let mattersCount = await Requests.countDocuments({requester_id: new ObjectId(req.user.id), type: "client_matter"})
        let requestsCount = await Requests.countDocuments({requester_id: new ObjectId(req.user.id), type: "client_request"})
        return response.success(res, "Dashboard Stats", { requestsCount,mattersCount })

      }
     
    } catch (error) {
      logger.error(
        `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
      );
      console.log(error);
      return response.serverError(res, "An Error Occurred");
    }
  };


  //Case Categories

module.exports.getCaseCategories = async (req, res) => {
  try {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    if (req.query.page) {
      page = parseInt(req.query.page.toString())
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit.toString())
    }

   
    var skip = (limit * page) - limit;

    const query = {};
    if(req.query.only_parent == "true"){
      query.parent = null;
    }
    if(req.query.parent_id){
      query.parent = new ObjectId(req.query.parent_id);
    }

    const categories = await Case_categories.find(query).sort({ _id: "asc" }).skip(skip).limit(limit);
    const total = await Case_categories.countDocuments(query);

    return response.success(
      res,
      "Categories",
      { categories: categories,total_count: total }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An Error Occurred");
  }
};

module.exports.createCaseCategories = async (req, res) => {
  try {
    const { name, icon, parent } = req.body;

    const category = new Case_categories({
      name,
      icon,
      parent
    });

    await category.save();

    return response.success(
      res,
      "Category created successfully",
      { category: category }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while creating the voucher");
  }
};

module.exports.updateCaseCategories = async (req, res) => {
  try {
    const { id } = req.body;
    const { name, icon, parent } = req.body;

    const updateCategory = await Case_categories.findByIdAndUpdate(
      id,
      { name, icon, parent },
      { new: true }
    );

    if (!updateCategory) {
      return response.notFound(res, "Category not found");
    }

    return response.success(
      res,
      "Category updated successfully",
      { category: updateCategory }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while updating the voucher");
  }
};

module.exports.deleteCaseCategories = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedCategory = await Case_categories.findByIdAndDelete(id);

    if (!deletedCategory) {
      return response.notFound(res, "Category not found");
    }

    return response.success(
      res,
      "Category deleted successfully"
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while deleting the voucher");
  }
};

 //Matter Categories

 module.exports.getMatterCategories = async (req, res) => {
  try {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    if (req.query.page) {
      page = parseInt(req.query.page.toString())
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit.toString())
    }

   
    var skip = (limit * page) - limit;

    const query = {};
    if(req.query.only_parent == "true"){
      query.parent = null;
    }
    if(req.query.parent_id){
      query.parent = new ObjectId(req.query.parent_id);
    }

    const categories = await Matter_categories.find(query).sort({ _id: "asc" }).skip(skip).limit(limit);
    const total = await Matter_categories.countDocuments(query);

    return response.success(
      res,
      "Categories",
      { categories: categories,total_count: total }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An Error Occurred");
  }
};

module.exports.createMatterCategories = async (req, res) => {
  try {
    const { name, icon, parent } = req.body;

    const category = new Matter_categories({
      name,
      icon,
      parent
    });

    await category.save();

    return response.success(
      res,
      "Category created successfully",
      { category: category }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while creating the voucher");
  }
};

module.exports.updateMatterCategories = async (req, res) => {
  try {
    const { id } = req.body;
    const { name, icon, parent } = req.body;

    const updateCategory = await Matter_categories.findByIdAndUpdate(
      id,
      { name, icon, parent },
      { new: true }
    );

    if (!updateCategory) {
      return response.notFound(res, "Category not found");
    }

    return response.success(
      res,
      "Category updated successfully",
      { category: updateCategory }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while updating the voucher");
  }
};

module.exports.deleteMatterCategories = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedCategory = await Matter_categories.findByIdAndDelete(id);

    if (!deletedCategory) {
      return response.notFound(res, "Category not found");
    }

    return response.success(
      res,
      "Category deleted successfully"
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while deleting the voucher");
  }
};

 //Request Services

 module.exports.getRequestServices = async (req, res) => {
  try {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    if (req.query.page) {
      page = parseInt(req.query.page.toString())
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit.toString())
    }

   
    var skip = (limit * page) - limit;

    const query = {};
    if (req.query.type) {
      query.type = req.query.type
    }
    if(req.query.only_parent == "true"){
      query.parent = null;
    }
    if(req.query.parent_id){
      query.parent = new ObjectId(req.query.parent_id);
    }

    const categories = await Request_services.find(query).sort({ _id: "asc" }).skip(skip).limit(limit);
    const total = await Request_services.countDocuments(query);

    return response.success(
      res,
      "Categories",
      { categories: categories,total_count: total }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip},url: ${req.url},error:${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An Error Occurred");
  }
};

module.exports.createRequestServices = async (req, res) => {
  try {
    const { name, icon, parent,type } = req.body;

    const category = new Request_services({
      name,
      icon,
      parent,
      type
    });

    await category.save();

    return response.success(
      res,
      "Category created successfully",
      { category: category }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while creating the voucher");
  }
};

module.exports.updateRequestServices = async (req, res) => {
  try {
    const { id } = req.body;
    const { name, icon, parent } = req.body;

    const updateCategory = await Request_services.findByIdAndUpdate(
      id,
      { name, icon, parent },
      { new: true }
    );

    if (!updateCategory) {
      return response.notFound(res, "Category not found");
    }

    return response.success(
      res,
      "Category updated successfully",
      { category: updateCategory }
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while updating the voucher");
  }
};

module.exports.deleteRequestServices = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedCategory = await Request_services.findByIdAndDelete(id);

    if (!deletedCategory) {
      return response.notFound(res, "Category not found");
    }

    return response.success(
      res,
      "Category deleted successfully"
    );
  } catch (error) {
    logger.error(
      `ip: ${req.ip}, url: ${req.url}, error: ${JSON.stringify(error.stack)}`
    );
    console.log(error);
    return response.serverError(res, "An error occurred while deleting the voucher");
  }
};