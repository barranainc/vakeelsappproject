import { post, get, put, deleted, patch } from "../index";
import CaseRoutes from "./Cases.routes";

const CaseServices = {


  getCases: async (id) => {
    const result = await get(CaseRoutes.getCases + `?only_parent=${true}`);
    return result;
  },
  getAllCases: async (search ,page , limit) => {
    const result = await get(CaseRoutes.getAllCases + `?search=${search}&page=${page}&limit=${limit}`);
    return result;
  },
  getCasesSub: async (id) => {
    const result = await get(CaseRoutes.getCases + `?parent_id=${id}`);
    return result;
  },
  createCase: async (obj) => {
    const result = await post(CaseRoutes.createCase , obj);
    return result;
  },
  updateCase: async (obj) => {
    const result = await patch(CaseRoutes.updateCase , obj);
    return result;
  },
  deleteCategory: async (id) => {
    const result = await deleted(CaseRoutes.deleteCategory + `?id=${id}`);
    return result;
  },

};

export default CaseServices;