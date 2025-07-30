import {
  Box,
  Button,
  Grid,
  Grid2,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
//   import { Colors } from "../../Assets/Styles/Colors";
//   import { Images } from "../../Assets/Images/Images";
//   import InputField from "../../Components/InputField/InputField";
import IconButton from "@mui/material/IconButton";
import UploadIcon from "@mui/icons-material/Upload";
import { useForm } from "react-hook-form";
// import SimpleDialog from "../../Components/Dialog/Dialog";
// import Storage from "../../Utils/Storage";
// import { ErrorToaster, SuccessToaster } from "../../Components/Toaster/Toaster";
// import UserServices from "../../Api/UserServices/User.index";
// import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import moment from "moment";
import Colors from "../../assets/styles";
import Images from "../../assets/images";
import InputField from "../../components/inputfield";
import UploadServices from "../../apis/upload/UploadServices";
import { ErrorToaster, SuccessToaster } from "../../components/toaster";
import Storage from "../../utils/Storage";
import AuthServices from "../../apis/auth/AuthServices";
import SimpleDialog from "../../components/Modal";
import { baseUrl } from "../../config/axios";
import OTPInput from "react-otp-input";

export default function AccountSetting() {
  const Grid = (props) => <Grid2 {...props} />;

  const [editAccountSetting, setEditAccountSetting] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const { setStorageItem, getStorageItem } = Storage();
  const { userLogin, updateProfile, setImage, email } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [userDetail, setUserDetail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const [otpEnable, setOtpEnable] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState(null);
  const [otpError, setOtpError] = useState(false);
  // *For User
  //   const decodedToken = jwtDecode(user.token);
  //   const userIdFromToken = decodedToken.id;
  //   const userId = userIdFromToken;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    formState: { errors: errors2 },
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    setValue: setValue3,
    formState: { errors: errors3 },
    getValues: getValues3,
    watch: watch3,
  } = useForm();

  const submitForm = async (formData) => {
   
    try {
      const { data, message } = await AuthServices.updateProfile(formData);
      SuccessToaster(message);
      
      handleGetUsers();
      setEditAccountSetting(false);
    } catch (error) {
      ErrorToaster(error?.message);
    }
  };
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("document", e.target.files[0]);

      const response = await UploadServices.uploadImage(formData);
      setImageURL(response?.data?.path);
      updateProfile(response?.data?.path);
      handleUpdate(response?.data?.path);

    } catch (error) {
      //   ErrorHandler(error);
      ErrorToaster(error?.message);
    }
  };

  const handleGetUsers = async () => {
    try {
      const { data } = await AuthServices.getProfile();
      setUserDetail(data.userDetails);
      setValue("email", data?.userDetails?.email);
      setValue2("first_name", data?.userDetails?.first_name);
      setValue2("last_name", data?.userDetails?.last_name);
      setValue2("phone", data?.userDetails?.phone);
      //   setImage(data?.userDetails?.picture)
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };
  useEffect(() => {
    handleGetUsers();
  }, []);

  const handleUpdate = async (data) => {
    const obj = {
      picture: data,
    };
    try {
      const response = await AuthServices.updateProfile(obj);
      SuccessToaster(response?.message);
      handleGetUsers();
      
    } catch (error) {
      ErrorToaster(error?.message)
    }
  };

  const SubmitOTP = async (sendData, result) => {
   
    try {
      let obj = {
        email: email,
        otp: otp,
      };

      const data = await AuthServices.changePassword(obj);
      
      if (data.responseCode == 206) {
        setOtpToken(data?.data?.otp_token);
        setOtpError(false);
        setActiveStep(1);
      }
    } catch (error) {
      setOtpError(true);
    } finally {
    }
  };
  const changePassword = async (data) => {
    const obj = {
      email: getValues("email"),
      otp_token: otpToken,
      password: getValues3("password"),
    };
    try {
      const response = await AuthServices.changePassword(obj);
      SuccessToaster(response?.message);
      
      if (response?.responseCode == 200) {
        setEditPassword(false);
        setValue3("password", "");
        setValue3("confirmPassword", "");
        setOtp("");
        setActiveStep(0);
      }
    } catch (error) {
      ErrorToaster(error?.message)
      console.error("Error while fetching users:", error);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 500,
            fontFamily: "Open Sans",
            color: Colors.primary,
            fontWeight: "bold",
            fontFamily:"Poppins"
          }}
        >
          Account Setting
        </Typography>
      </Box>
      <SimpleDialog
        open={editAccountSetting}
        onClose={() => setEditAccountSetting(false)}
        title="Edit Account Setting"
      >
        <Box component={"form"} onSubmit={handleSubmit2(submitForm)}>
          <Grid container spacing={2}>
            <Grid item size={{ md: 12 }} sx={{ width: "100%" }}>
              <InputLabel sx={{fontFamily:"Poppins"}}l>First Name </InputLabel>
              <InputField
                fullWidth
                placeholder={"Enter First Name"}
                type="text"
                // value={user.name}
                error={!!errors2?.first_name}
                helperText={errors2?.first_name?.message}
                register={register2("first_name", {
                  required: "Please enter the name.",
                })}
              />
            </Grid>
            <Grid item size={{ md: 12 }} sx={{ width: "100%" }}>
              <InputLabel sx={{fontFamily:"Poppins"}}>Last Name </InputLabel>
              <InputField
                fullWidth
                placeholder={"Enter Last Name"}
                type="text"
                // value={user.name}
                error={!!errors2?.last_name}
                helperText={errors2?.last_name?.message}
                register={register2("last_name", {
                  required: "Please enter the name.",
                })}
              />
            </Grid>
            <Grid item size={{ md: 12 }} sx={{ width: "100%" }}>
              <InputLabel sx={{fontFamily:"Poppins"}}>Phone Number </InputLabel>
              <InputField
                fullWidth
                placeholder={"Enter Phone Number "}
                type="text"
                // value={user.name}
                error={!!errors2?.phone}
                helperText={errors2?.phone?.message}
                register={register2("phone", {
                  required: "Enter Phone Number.",
                })}
              />
            </Grid>

            <Grid
              size={{ xs: 12, sm: 12, md: 12 }}
              sx={{
                my: 1,
              
              }}
            >
              <Button
                type="submit"
                sx={{
                //   padding: "5px 38px",
                  color: Colors.white,
                  background: Colors.primary,
                  width:'100%',
                  fontFamily:"Poppins"
                }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </SimpleDialog>
      <SimpleDialog
        open={editPassword}
        onClose={() => {
          setEditPassword(false);
          setActiveStep(0);
          setOtp("");
          setValue3("password", "");
          setValue3("confirmPassword", "");
        }}
      >
        {/* {activeStep == 0 && (
          <Box component={"form"} onSubmit={handleSubmit(updatePassword)}>
            <Typography
              className="heading-font"
              variant="h5"
              mb={2}
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: Colors.primary,
              }}
            >
              Enter Email to get OTP
            </Typography>
            <Grid container>
              <Grid item size={{ md: 12 }} sx={{ width: "100%" }}>
                <InputLabel>Enter Email </InputLabel>
                <InputField
                  fullWidth
                  placeholder={"Enter Email"}
                  type="text"
                  // value={user.name}
                  error={!!errors?.email}
                  helperText={errors?.email?.message}
                  register={register("email", {
                    required: "Please Rnter Email.",
                  })}
                />
              </Grid>
              <Grid
                size={{ xs: 12, sm: 12, md: 12 }}
                sx={{
                  my: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  sx={{
                    padding: "5px 38px",
                    color: Colors.white,
                    background: Colors.primary,
                  }}
                >
                  Get Otp
                </Button>
              </Grid>
            </Grid>
          </Box>
        )} */}
        {activeStep == 0 && (
          <>
            <Typography
              className="heading-font"
              variant="h5"
              mb={1}
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: Colors.primary,
                fontFamily:"Poppins"
              }}
            >
              Enter OTP
            </Typography>
            <Typography
              className="heading-font"          
              mb={1}
              sx={{
                fontWeight: 200,
                textAlign: "center",
                fontSize:'14px',
                color: Colors.darkGray,
                fontFamily:"Poppins"
              }}
            >
            Enter the OTP that has been sent to your registered email.
            </Typography>
            <div className="otp-container">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span className="separator">-</span>}
                renderInput={(props) => (
                  <input className="otp-input" {...props} />
                )}
              />
            </div>{" "}
            {otpError && (
              <span
                style={{ color: "red", marginTop: "5px", fontSize: "12px" }}
              >
                {" "}
                &nbsp; OTP is Invalid{" "}
              </span>
            )}
            <Button
              fullWidth
              variant="contained"
              disabled={otp?.length < 4 && otp == ""}
              sx={{
                backgroundColor: Colors.primary,
                color: Colors.white,
                padding: "6px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "capitalize",
                mt: 3,
                fontFamily:"Poppins",

                "&:hover": { backgroundColor: Colors.primary },
              }}
              onClick={() => SubmitOTP()}
            >
              Submit
            </Button>{" "}
          </>
        )}
        {activeStep == 1 && (
          <>
            <Typography
              className="heading-font"
              variant="h5"
              mb={2}
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: Colors.primary,
                fontFamily:"Poppins"
              }}
            >
              Enter Password
            </Typography>
            <form onSubmit={handleSubmit3(changePassword)}>
              <InputLabel sx={{fontFamily:"Poppins"}}>Enter password </InputLabel>
              <TextField
                fullWidth
                type={!isVisible ? "password" : "text"}
                placeholder="Enter Password"
                {...register3("password", {
                  required: "Password is required", // Error message
                })}
                error={!!errors3.password}
                helperText={errors3.password ? errors3.password.message : ""}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          setIsVisible((prevIsVisible) => !prevIsVisible)
                        }
                      >
                        {!isVisible ? (
                          <VisibilityOff sx={{ color: "#7F8B9E" }} />
                        ) : (
                          <Visibility sx={{ color: "#7F8B9E" }} />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />
              <InputLabel sx={{mt:2 ,fontFamily:"Poppins"}}>Confirm password </InputLabel>
              <TextField
                fullWidth
                type={!isVisible2 ? "password" : "text"}
                placeholder="Confirm Password"
                {...register3("confirmPassword", {
                    required: "Confirm Password is required.",
                    validate: (value) =>
                      value === watch3("password") || "Passwords do not match.",
                  })}
                  error={errors3?.confirmPassword && true}
                  helperText={errors3?.confirmPassword?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          setIsVisible2((prevIsVisible) => !prevIsVisible)
                        }
                      >
                        {!isVisible2 ? (
                          <VisibilityOff sx={{ color: "#7F8B9E" }} />
                        ) : (
                          <Visibility sx={{ color: "#7F8B9E" }} />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
              
                sx={{
                  backgroundColor: Colors.primary,
                  color: Colors.white,
                  padding: "6px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "capitalize",
                  mt: 3,
                  "&:hover": { backgroundColor: Colors.primary },
                  fontFamily:"Poppins"
                }}
              >
                Submit
              </Button>
            </form>
           
          </>
        )}
      </SimpleDialog>

      <Box sx={{ mt: 2 }}>
        <Grid container justifyContent={"space-between"}>
          <Grid
            item
            size={{ md: 12, xs: 12 }}
            sx={{ padding: { md: "12px", xs: "6px" } }}
          >
            <Box
              sx={{
                background: Colors.white,
                borderRadius: "10px",
                padding: "38px 15px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  type="submit"
                  sx={{
                    padding: "7px 30px",
                    color: Colors.white,
                    background: Colors.primary,
                    borderRadius: "15px",
                  }}
                  onClick={() => {
                    setEditAccountSetting(true);
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  type="submit"
                  sx={{
                    padding: "7px 30px",
                    color: Colors.white,
                    background: Colors.primary,
                    borderRadius: "15px",
                  }}
                  onClick={() => {
                    setEditPassword(true);
                  }}
                >
                  Change Password
                </Button>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  mt: 2,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Box
                  component="img"
                  src={
                    userDetail?.picture
                      ? baseUrl + userDetail?.picture
                      : Images.defaultImage
                  }
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    cursor: "pointer",
                    objectFit: "cover",
                    border: "1px solid grey",
                  }}
                  onClick={(e) => {
                    handleImageClick(e);
                  }}
                />
                {hovered && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      padding: "5px 15px",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      display: "block",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                    onClick={(e) => {
                      handleImageClick(e);
                    }}
                  >
                    <UploadIcon />
                    <Box sx={{ fontSize: "12px" }}>Upload Image</Box>
                  </IconButton>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Box>

              <Box
                sx={{
                  mt: 3,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Name:{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {userDetail?.first_name + " " + userDetail?.last_name}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 3,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Email:{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {userDetail?.email}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 3,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Phone Number:{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {userDetail?.phone}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
