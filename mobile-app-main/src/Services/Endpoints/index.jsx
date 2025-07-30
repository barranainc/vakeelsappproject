export const Apis = {
  //POST ENDPOINTS
  uploadDocument:'/api/system/upload',
  registration:'/api/auth/register',
  login:'/api/auth/login',
  logout:'/api/auth/logout',
  postRequest:'/api/client/requests/add',
  postCase:'/api/cases/add',
  addMember:'/api/lawyers/addMember',
  postMatterRequest:'/api/lawyers/sendRequest',
  forgetPwd:'/api/auth/changePassword',
  readNotification:'/api/notifications/markAsRead',
  //GET ENDPOINTS
  getMetters:'/api/client/matters',
  getRequest:'/api/client/requests',
  getServices:'/api/system/requestServices',
  getRequestDetails:'/api/client/requests/details',
  getMatterCategories:'/api/system/matterCategories',
  getAllCases:'/api/cases',
  caseProceeding:'/api/cases/addProceeding',
  getCalendarDates:'/api/lawyers/calendar',
  getSelectedDateCases:'/api/lawyers/dayDetails',
  getAllTeams:'/api/lawyers/team',
  getCasesCategories:'/api/cases/categories',
  getAllChats:'/api/users/chatRooms',
  getAllNotifications:'/api/notifications',
  getRoomDetails:'/api/users/roomDetails',
  getRoomChat:'/api/users/chats',
  getNotificationCount:'/api/notifications/count',
  getChatCount:'/api/users/chats/unreadCount',
  getProfile:'/api/auth/profile',
  // DELETE ENDPOINTS
  deleteNotification:'/api/notifications/delete',
  
  // PATCH ENDPOINTS
  updateLawyerProfile:'/api/auth/updateProfile',
  updateMatterStatus:'/api/client/matters/update',
  updateTeamMembers:'/api/auth/updateProfile',
};
