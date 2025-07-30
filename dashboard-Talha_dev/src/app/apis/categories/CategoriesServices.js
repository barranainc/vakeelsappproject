import { post, get, put, deleted } from "../index";
import CategoriesRoutes from "./Categories.routes";

const CategoriesServices = {
  createCategory: async (obj) => {
    const result = await post(CategoriesRoutes.createCategory, obj);
    return result;
  },

  getCategories: async () => {
    const result = await get(CategoriesRoutes.getCategories);
    return result;
  },

  updateCategory: async (id, obj) => {
    const result = await put(CategoriesRoutes.updateCategory + `?id=${id}`, obj);
    return result;
  },

  deleteCategory: async (id) => {
    const result = await deleted(CategoriesRoutes.deleteCategory + `?id=${id}`);
    return result;
  },
};

export default CategoriesServices;