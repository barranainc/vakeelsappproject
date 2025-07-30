const express = require("express");
const ctrl = require("../controllers/system.controller");
const verifyToken = require("../middleware/auth");
const duplicateUser  = require("../middleware/validate.auth");
const Otp = require("../middleware/otp")
const route = express.Router();
const upload = require("../middleware/upload");

route.post('/upload',[upload.array("document")],ctrl.uploadDocuments)
route.post('/uploadDoc',[],ctrl.uploadBase64)


route.get('/stats',[verifyToken],ctrl.getStats)

//Case Categories
route.post('/caseCategories/create',[verifyToken],ctrl.createCaseCategories)
route.delete('/caseCategories/delete',[verifyToken],ctrl.deleteCaseCategories)
route.get('/caseCategories/',[],ctrl.getCaseCategories)
route.patch('/caseCategories/update',[verifyToken],ctrl.updateCaseCategories)

//Matter Categories
route.post('/matterCategories/create',[verifyToken],ctrl.createMatterCategories)
route.delete('/matterCategories/delete',[verifyToken],ctrl.deleteMatterCategories)
route.get('/matterCategories/',[],ctrl.getMatterCategories)
route.patch('/matterCategories/update',[verifyToken],ctrl.updateMatterCategories)


//Request Services
route.post('/requestServices/create',[verifyToken],ctrl.createRequestServices)
route.delete('/requestServices/delete',[verifyToken],ctrl.deleteRequestServices)
route.get('/requestServices/',[],ctrl.getRequestServices)
route.patch('/requestServices/update',[verifyToken],ctrl.updateRequestServices)



module.exports = route;

