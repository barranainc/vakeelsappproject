import { post, get, put, deleted } from "../index";
import NotificationRoute from "./routes";

const NorificationServices = {

  getNotificationCount: async () => {
    const result = await get(NotificationRoute.getNotificationCount);
    return result;
  },
  getNotifications: async (page ,limit) => {
    const result = await get(NotificationRoute.getNotifications +`?page=${page}&limit=${limit}`);
    return result;
  }
 
};

export default NorificationServices;