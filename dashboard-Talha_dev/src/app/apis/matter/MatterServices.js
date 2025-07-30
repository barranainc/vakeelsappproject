import { post, get, put, deleted, patch } from "../index";
import MatterRoutes from "./Matter.routes";

const MatterServices = {


  getMatter: async (id) => {
    const result = await get(MatterRoutes.getMatter + `?only_parent=${true}`);
    return result;
  },
  getMatterSub: async (id) => {
    const result = await get(MatterRoutes.getMatter + `?parent_id=${id}`);
    return result;
  },
  getMatterDetails: async (id) => {
    const result = await get(MatterRoutes.getMatterDetails + `?id=${id}`);
    return result;
  },
  getMatterManagement: async (search,page,limit) => {
    const result = await get(MatterRoutes.getMatterManagement + `?search=${search}&page=${page}&limit=${limit}`);
    return result;
  },
  createMatter: async (obj) => {
    const result = await post(MatterRoutes.createMatter , obj);
    return result;
  },
  updateMatter: async (obj) => {
    const result = await patch(MatterRoutes.updateMatter , obj);
    return result;
  },
  deleteCategory: async (id) => {
    const result = await deleted(MatterRoutes.deleteCategory + `?id=${id}`);
    return result;
  },

};

export default MatterServices;