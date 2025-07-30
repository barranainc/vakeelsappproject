import { get } from "../index";
import UsersRoutes from "./Users.routes";

const UsersServices = {
  getUsers: async (limit, page, role, pricingPlan, lastLoginFrom, lastLoginTo, search) => {
    const result = await get(UsersRoutes.getUsers + `?limit=${limit}&page=${page}&role=${role}&pricingPlan=${pricingPlan}&lastLoginFrom=${lastLoginFrom}&lastLoginTo=${lastLoginTo}&search=${search}`);
    return result;
  },
};

export default UsersServices;