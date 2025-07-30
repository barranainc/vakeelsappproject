import { post, get, put, deleted } from "../index";
import ChatRoutes from "./chat.routes";

const ChatServices = {
  sendRequest: async (obj) => {
    const result = await post(ChatRoutes.sendRequest, obj);
    return result;
  },
  getAllChat: async (type) => {
    const result = await get(ChatRoutes.getAllChat + `?type=${type}&page=${1}&limit=${10000}`);
    return result;
  },
  getChatWithRoomId: async (roomId,page,limit) => {
    const result = await get(ChatRoutes.getChatWithRoomId + `?room_id=${roomId}&page=${page}&limit=${limit}`);
    return result;
  },
  getRoomDetail: async (roomId) => {
    const result = await get(ChatRoutes.getRoomDetail + `?room_id=${roomId}`);
    return result;
  },

};

export default ChatServices;