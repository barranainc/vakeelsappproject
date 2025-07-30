import { MenuItem, TextField } from "@mui/material";
import styled from "@emotion/styled";
import Colors from "../../assets/styles";
import "@fontsource/open-sans";

function InputField({
  fullWidth,
  type,
  placeholder,
  register,
  error,
  helperText,
  slotProps,
  multiline,
  rows,
  select,
  options,
  color,
  value,
  onKeyDown,
  disabled
}) {
  const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      fontFamily: "Open Sans",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      color: "#000000",
      "& fieldset": {
        border: `1px solid ${Colors.primary + "33"}`,
      },
      "&:hover fieldset": {
        border: `1px solid ${Colors.primary + "33"}`,
      },
      "&.Mui-focused fieldset": {
        border: `1px solid ${Colors.primary + "33"}`,
      },
      "&.Mui-disabled": {
        "& fieldset": {
          border: `1px solid ${Colors.primary + "33"}`, 
        },
        "&:hover fieldset": {
          border: `1px solid ${Colors.primary + "33"}`, 
        },
      },
    },
    "& .MuiInputBase-input": {
      color: "#000000",
    },
  });

  const selectProps = {
    MenuProps: {
      slotProps: {
        paper: {
          sx: {
            // background: Colors.lightGray,
            // border: `1px solid ${Colors.primary + "33"}`,
            borderRadius: "5px",
          },
        },
      },
      MenuListProps: {
        sx: {
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
          "& .MuiMenuItem-root": {
            py: "12px",
            color: "black", // Set the option text color to black
            borderRadius: "4px",
            ":hover": {
              background: "#eaeaea", // Optional: light hover background
              color: "black", // Ensure the hover color stays black
            },
          },
        },
      },
    },
  };
  
  return (
    <CustomTextField
      disabled={disabled}
      value={value}
      fullWidth={fullWidth}
      type={type}
      placeholder={placeholder}
      {...register}
      error={error}
      helperText={helperText}
      slotProps={{
        select: selectProps,
        ...slotProps,
      }}
      multiline={multiline}
      rows={rows}
      select={select}
      onKeyDown={onKeyDown}
    >
      {select && options.map((item, ind) => (
        <MenuItem key={ind} value={item.value}>{item.name}</MenuItem>
      ))}
    </CustomTextField>
  )
}

export default InputField;