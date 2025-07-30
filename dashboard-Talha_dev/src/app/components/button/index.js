import { Button } from "@mui/material";
import Colors from "../../assets/styles";
import "@fontsource/open-sans";
import Loader from "../loader";

function PrimaryButton(props) {
  return (
    <Button
      varaint={"contained"}
      startIcon={props.startIcon}
      sx={{
        borderRadius: "8px",
        background: Colors.primary,
        color: Colors.white,
        textTransform: "capitalize",
        fontFamily: "Open Sans",
        fontSize: "20px",
        fontWeight: 500,
        p: "14px 40px",
        border: `1px solid ${Colors.primary}`,
        ":hover": {
          background: Colors.primary,
          color: Colors.white,
        },
        "&.Mui-disabled": {
          background: Colors.primary
        },
        ...props.style
      }}
      {...props}
    >
      {props.loading ? <Loader /> : props.title}
    </Button>
  );
};

function SecondaryButton(props) {
  return (
    <Button
      variant={"outlined"}
      sx={{
        background: Colors.lightGray,
        borderColor: Colors.white + "33",
        borderRadius: "8px",
        color: Colors.white,
        fontSize: "20px",
        fontFamily: "Open Sans",
        textTransform: "capitalize",
        p: "14px 40px",
        ":hover": {
          borderColor: Colors.accent,
          color: Colors.accent
        }
      }}
      {...props}
    >
      {props.title}
    </Button>
  );
};

export default PrimaryButton;
export { SecondaryButton };
