import React, { useState } from "react";
import {
  Grid2,
  Box,
  Typography,
  CardMedia,
  Button,
  IconButton,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import Images from "../../assets/images";
import Colors from "../../assets/styles";
import "@fontsource/poppins";
import "@fontsource/open-sans";
import { useForm } from "react-hook-form";
import InputField from "../../components/inputfield";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthServices from "../../apis/auth/AuthServices";
import { ErrorToaster, SuccessToaster } from "../../components/toaster";

const Grid = (props) => <Grid2 {...props} />;

function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { userLogin } = useAuth();
  const navigate = useNavigate();

  const submit = async (formData) => {
    setIsLoading(true);
    const obj = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const result = await AuthServices.login(obj);
      if (result.responseCode == 200 && result?.data?.user_type == "admin")  {
        userLogin(result.data);
        SuccessToaster(result.message);
        navigate("/admin-dashboard");
      }else if (result.responseCode == 200 && result?.data?.user_type == "paralegal" )  {
        userLogin(result.data);
        SuccessToaster(result.message);
        navigate("/paralegal-dashboard");
      }
      else{
        ErrorToaster("Invalid Credentials");

      }
    } catch (error) {
      ErrorToaster(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Box
    // 	sx={{
    // 		height: { md: "100vh", sm: "100%", xs: "100%" },
    // 		display: "flex",
    // 		flexDirection: "column",
    // 		justifyContent: "space-between",
    // 		background: Colors.white,
    // 	}}
    // >
    // 	<Grid container justifyContent={"center"} sx={{

    // 	}} >
    // 		<Grid size={{ md: 8, sm: 12, xs: 12 }}>
    // 			<Box
    // 				sx={{
    // 					py: 6,
    // 					width: "100%",
    // 					display: "flex",
    // 					justifyContent: "center",
    // 				}}
    // 			>
    // 				<CardMedia
    // 					component={"img"}
    // 					src={Images.logo}
    // 					alt={"logo"}
    // 					sx={{
    // 						width: {lg:"25%",md:"25%",sm:"25%",xs:"60%"},

    // 						objectFit: "contain"
    // 					}}
    // 				/>
    // 			</Box>
    // 		</Grid>
    // 		<Grid size={{ md: 8, sm: 12, xs: 12 }}>
    // 			<Grid container justifyContent={"center"}>
    // 				<Grid size={{ md: 8, sm: 12, xs: 12 }}>
    // 					<Grid
    // 						component={"form"}
    // 						onSubmit={handleSubmit(submit)}
    // 						container
    // 						rowGap={4}
    // 						sx={{ px: { md: 0, sm: 2, xs: 2 } }}
    // 					>
    // 						<Grid size={12}>
    // 							<Typography
    // 								sx={{
    // 									fontFamily: "Poppins",
    // 									fontSize: "30px",
    // 									fontWeight: 500,
    // 									color: Colors.primary
    // 								}}
    // 							>
    // 								Login in to your account
    // 							</Typography>
    // 						</Grid>
    // 						<Grid size={12}>
    // 							<Box
    // 								sx={{
    // 									display: "flex",
    // 									flexDirection: "column",
    // 									gap: 1
    // 								}}
    // 							>
    // 								<Typography
    // 									sx={{
    // 										fontSize: "20px",
    // 										fontWeight: 500,
    // 										fontFamily: "Open Sans",
    // 										color: Colors.black
    // 									}}
    // 								>
    // 									Email Address
    // 								</Typography>
    // 								<InputField
    // 									type={"email"}
    // 									placeholder={"Enter Email Address"}
    // 									register={register("email", {
    // 										required: "Email Address"
    // 									})}
    // 									error={errors?.email && true}
    // 									helperText={errors?.email?.message}
    // 								/>
    // 							</Box>
    // 						</Grid>
    // 						<Grid size={12}>
    // 							<Box
    // 								sx={{
    // 									display: "flex",
    // 									flexDirection: "column",
    // 									gap: 1
    // 								}}
    // 							>
    // 								<Typography
    // 									sx={{
    // 										fontSize: "20px",
    // 										fontWeight: 500,
    // 										fontFamily: "Open Sans",
    // 										color: Colors.black
    // 									}}
    // 								>
    // 									Password
    // 								</Typography>
    // 								<InputField
    // 									type={!isVisible ? "password" : "text"}
    // 									placeholder={"Enter Password"}
    // 									register={register("password", {
    // 										required: "Password"
    // 									})}
    // 									error={errors?.password && true}
    // 									helperText={errors?.password?.message}
    // 									slotProps={{
    // 										input: {
    // 											endAdornment: (
    // 												<IconButton onClick={() => setIsVisible((prevIsVisible) => !prevIsVisible)}>
    // 													{isVisible ? <VisibilityOff sx={{ color: "#7F8B9E" }} /> : <Visibility sx={{ color: "#7F8B9E" }} />}
    // 												</IconButton>
    // 											)
    // 										}
    // 									}}
    // 								/>
    // 							</Box>
    // 						</Grid>
    // 						<Grid size={12}>
    // 							<Button
    // 								type={"submit"}
    // 								fullWidth
    // 								variant={"contained"}
    // 								sx={{
    // 									background:" #0F5189",
    // 									color: Colors.white,
    // 									borderRadius: "8px",
    // 									p: "14px 40px",
    // 									"&.Mui-disabled": {
    // 										background: "#337DBD"
    // 									}
    // 								}}
    // 								disabled={isLoading}
    // 							>
    // 								{isLoading ? <CircularProgress sx={{ "&.MuiCircularProgress-root": { width: "26px !important", height: "26px !important" }, color: Colors.primary }} /> : "Login"}
    // 							</Button>
    // 						</Grid>
    // 					</Grid>
    // 				</Grid>
    // 			</Grid>
    // 		</Grid>
    // 	</Grid>
    // </Box>
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: "20px", sm: "30px", md: "40px" }, // Responsive padding
          borderRadius: "16px",
          width: { xs: "90%", sm: "400px", md: "450px" }, // Responsive width
          textAlign: "center",
        }}
      >
		<Box sx={{display:'flex',justifyContent:"center", mb: 4,}}>
        <CardMedia
          component={"img"}
          src={Images.logo}
          alt={"logo"}
          sx={{
            width: { lg: "55%", md: "55%", sm: "55%", xs: "60%" },

            objectFit: "contain",
          }}
        />
			</Box>
       
      

        <form onSubmit={handleSubmit(submit)}>

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: Colors.primary,
                },
              "& label.Mui-focused": {
                color: Colors.primary,
              },
              fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive font size
            }}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Email is not valid",
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <TextField
            label="Password"
            type={isVisible ? "text" : "password"}
            variant="outlined"
            fullWidth
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: Colors.primary,
                },
              "& label.Mui-focused": {
                color: Colors.primary,
              },
              fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive font size
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsVisible(!isVisible)}
                    edge="end"
                  >
                    {isVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type={"submit"}
            fullWidth
            variant={"contained"}
            sx={{
              background: " #0F5189",
              color: Colors.white,
              borderRadius: "8px",
              p: "14px 40px",
              "&.Mui-disabled": {
                background: "#337DBD",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress
                sx={{
                  "&.MuiCircularProgress-root": {
                    width: "26px !important",
                    height: "26px !important",
                  },
                  color: Colors.primary,
                }}
              />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
