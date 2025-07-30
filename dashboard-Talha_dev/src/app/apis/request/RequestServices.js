import { post, get, put, deleted, patch } from "../index";
import RequestRoutes from "./Request.routes";

const RequestServices = {


  getRequest: async (id) => {
    const result = await get(RequestRoutes.getRequest + `?only_parent=${true}`);
    return result;
  },
  getRequestManagment: async (req , page ,limit) => {
    const result = await get(RequestRoutes.getRequestManagment + `?request_type=${req}&page=${page}&limit=${limit}`);
    return result;
  },
  getRequestDetail: async (id) => {
  
    const result = await get(RequestRoutes.getRequestDetail + `?id=${id}`);
    return result;
  },
  getRequestSub: async (id) => {
    const result = await get(RequestRoutes.getRequest + `?parent_id=${id}`);
    return result;
  },
  createRequest: async (obj) => {
    const result = await post(RequestRoutes.createRequest , obj);
    return result;
  },
  updateRequest: async (obj) => {
    const result = await patch(RequestRoutes.updateRequest , obj);
    return result;
  },
  deleteCategory: async (id) => {
    const result = await deleted(RequestRoutes.deleteCategory + `?id=${id}`);
    return result;
  },

};

export default RequestServices;