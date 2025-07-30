import {Apis} from '../Endpoints';
import {get, post, patch, documentPost, put, deleted} from '../Methods';

export const apiCall = {
  //POST API CALL
  otpVerification: async obj => {
    let result = await post(Apis.registration, obj);
    if (result.status === 206) return result.data;
    else throw result;
  },
  registration: async obj => {
    let result = await post(Apis.registration, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  login: async obj => {
    let result = await post(Apis.login, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  logout: async obj => {
    let result = await post(Apis.logout, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  postRequest: async obj => {
    let result = await post(Apis.postRequest, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  postCase: async obj => {
    let result = await post(Apis.postCase, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  caseProceeding: async obj => {
    let result = await post(Apis.caseProceeding, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  addMember: async obj => {
    let result = await post(Apis.addMember, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  postMatterRequest: async obj => {
    let result = await post(Apis.postMatterRequest, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  readNotification: async obj => {
    let result = await post(Apis.readNotification, obj);
    if (result.status === 200) return result.data;
    else throw result;
  },
  //GET API CALL
  getMetters: async params => {
    let result = await get(Apis.getMetters,params);
    if (result.status === 200) return result.data;
  },
  getServices: async params => {
    let result = await get(Apis.getServices,params);
    if (result.status === 200) return result.data;
  },
  getMatterCategories: async params => {
    let result = await get(Apis.getMatterCategories,params);
    if (result.status === 200) return result.data;
  },
  getAllCases: async params => {
    let result = await get(Apis.getAllCases,params);
    if (result.status === 200) return result.data;
  },
  getCalendarDates: async params => {
    let result = await get(Apis.getCalendarDates,params);
    if (result.status === 200) return result.data;
  },
  getSelectedDateCases: async params => {
    let result = await get(Apis.getSelectedDateCases,params);
    if (result.status === 200) return result.data;
  },
  getAllTeams: async params => {
    let result = await get(Apis.getAllTeams,params);
    if (result.status === 200) return result.data;
  },
  getCasesCategories: async params => {
    let result = await get(Apis.getCasesCategories,params);
    if (result.status === 200) return result.data;
  },
  getAllChats: async params => {
    let result = await get(Apis.getAllChats,params);
    if (result.status === 200) return result.data;
  },
  getAllNotifications: async params => {
    let result = await get(Apis.getAllNotifications,params);
    if (result.status === 200) return result.data;
  },
  getRoomDetails: async params => {
    let result = await get(Apis.getRoomDetails,params);
    if (result.status === 200) return result.data;
  },
  getRoomChat: async params => {
    let result = await get(Apis.getRoomChat,params);
    if (result.status === 200) return result.data;
  },
  getNotificationCont: async params => {
    let result = await get(Apis.getNotificationCount,params);
    if (result.status === 200) return result.data;
  },
  getChatCount: async params => {
    let result = await get(Apis.getChatCount,params);
    if (result.status === 200) return result.data;
  },
  getProfile: async params => {
    let result = await get(Apis.getProfile,params);
    if (result.status === 200) return result.data;
  },
  //PATCH
  updateLawyerProfile: async obj => {
    let result = await patch(Apis.updateLawyerProfile, obj);
    if (result.status === 200) return result.data;
  },
  updateMatterStatus: async obj => {
    let result = await patch(Apis.updateMatterStatus, obj);
    if (result.status === 200) return result.data;
  },
  updateTeamMembers: async (obj,uid) => {
    console.log("obj",uid)
    let result = await patch(Apis.updateTeamMembers+`?user_id=${uid}`, obj);
    if (result.status === 200) return result.data;
  },
  
  //DELETE
  deleteNotification: async params => {
    let result = await deleted(Apis.deleteNotification,params);
    if (result.status === 200) return result.data;
  },
};
 