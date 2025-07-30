import { post, get, put, deleted } from "../index";
import ClientRoutes from "./Client.route";

const ClientServices = {
 
  getClient: async (search,userType ,page ,limit) => {
    const result = await get(ClientRoutes.getClient + `?search=${search}&user_type=${userType}&page=${page}&limit=${limit}`);
    return result;
  },
  clientRequest: async (search , page ,limit) => {
    const result = await get(ClientRoutes.clientRequest + `?search=${search}&page=${page}&limit=${limit}`);
    return result;
  },
  clientMatter: async (search,page ,limit) => {
    const result = await get(ClientRoutes.clientMatter + `?search=${search}&page=${page}&limit=${limit}`);
    return result;
  },
  changeStatus: async (obj) => {
    const result = await post(ClientRoutes.changeStatus ,obj);
    return result;
  },

};

export default ClientServices;