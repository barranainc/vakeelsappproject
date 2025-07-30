import { post } from "../index";
import UploadRoutes from "./Upload.routes";

const UploadServices = {
  uploadImage: async (obj) => {
    const result = await post(UploadRoutes.uploadImage, obj);
    return result;
  },
};

export default UploadServices;