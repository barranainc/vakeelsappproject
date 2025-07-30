import { useState } from "react";
import AuthServices from "../apis/auth/AuthServices";
import { SuccessToaster } from "../components/toaster";

function useProvideAuth() {
  const [id, setId] = useState(localStorage.getItem("id"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [image, setImage] = useState(localStorage.getItem("picture"));
 

  const userLogin = (data) => {
   
    localStorage.setItem("id", data._id);
    localStorage.setItem("name", data.first_name +" " +  data.last_name);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("picture", data.picture);
    localStorage.setItem("role", data.user_type);
    setId(data?._id);
    setName(data?.name);
    setUser(data?.token);
    setEmail(data?.email);
    setImage(data?.picture)
    setRole(data?.user_type)
  };
  const updateProfile = (image) => {
    localStorage.setItem("picture", image);
    setImage(image)
  };

  const userLogout = async () => {
    // const obj = {
    //   user_id: id
    // }
    // const result = await AuthServices.logout(obj);
    // if (result.responseCode == 200) {
      localStorage.clear();
      // SuccessToaster(result.message);
    // }
  };

  return {
    id,
    name,
    role,
    user,
    email,
    image,
    userLogin,
    userLogout,
    updateProfile
  };
};

export default useProvideAuth;