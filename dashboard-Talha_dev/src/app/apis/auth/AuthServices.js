import { get, patch, post } from "../index";
import AuthRoutes from "./Auth.routes";

const AuthServices = {
  login: async (obj) => {
    const result = await post(AuthRoutes.login, obj);
    return result;
  },

  logout: async (obj) => {
    const result = await post(AuthRoutes.logout, obj);
    return result;
  },
  getProfile: async () => {
    const result = await get(AuthRoutes.getProfile);
    return result;
  },
  getStats: async () => {
    const result = await get(AuthRoutes.getStats);
    return result;
  },
  updateProfile: async (obj) => {
    const result = await patch(AuthRoutes.updateProfile , obj);
    return result;
  },
  changePassword: async (obj) => {
    const result = await post(AuthRoutes.changePassword, obj);
    return result;
  },
};

export default AuthServices;