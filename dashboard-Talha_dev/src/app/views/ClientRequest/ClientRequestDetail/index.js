import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  CreditCard as IdCardIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../config/axios";
import ImageIcon from "@mui/icons-material/Image";
import RequestServices from "../../../apis/request/RequestServices";
import Colors from "../../../assets/styles";
import { ErrorToaster, SuccessToaster } from "../../../components/toaster";
import ChatServices from "../../../apis/chat";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function UserDetailPage() {
  const [tabValue, setTabValue] = useState(0);
  const [activeImage, setActiveImage] = useState("front");
  const [state ,setState] = useState([])
  const {id} = useParams()
  const navigate = useNavigate()
  // In a real application, you'd fetch this data from an API

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const getdetail = async () => {
  
    try {
      const result = await RequestServices.getRequestDetail(id);
      if (result.responseCode === 200) {
       setState(result?.data?.request)
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
      
  };
useEffect(()=>{
getdetail()
},[])
const handleSendRespond = async () => {
  // navigate("/chat")
  const obj = {
    client_id: state?.client_id,
    type: "client_request",
    type_id: state?._id,
    type_name: state?.title,
  };
  try {
    const result = await ChatServices.sendRequest(obj);
    if (result.responseCode === 200) {
      
      SuccessToaster(result.message);
      navigate("/all-chat", {
        state: {
          room_id: result?.data?.room_id,
          type: "client_request",
        },
      });
    }
  } catch (error) {
    ErrorToaster(error?.message);
    console.log(error);
    navigate("/all-chat", {
      state: {
        room_id: error?.error?.room_id,
        type: "client_request",
      },
    });
  }
};
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
      <Card sx={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px !important", borderRadius: '20px' }}>
  <CardContent>
    <Grid container spacing={2} >
      <Grid item xs>
        <Typography variant="h4" gutterBottom sx={{ ml: 1, textTransform: "capitalize",fontFamily:"Poppins" }}>
          {state?.title}
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Description"
              secondary={state?.description}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Request Type"
              secondary={state?.request_type == "non_judicial"  ? "Non Judicial" : state?.request_type == "judicial" ? "Judicial" : "-"}
            />
          </ListItem>
        </List>
      </Grid>

      {/* Respond Button on the other end */}
      <Grid item>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ borderRadius: '20px' ,background :Colors.primary ,p:"8px 20px",fontFamily:"Poppins" }} 
          onClick={() => { 
          
            handleSendRespond()
          }}
        >
          Respond
        </Button>
      </Grid>
    </Grid>
  </CardContent>
</Card>


        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="user information tabs"
            sx={{
              ".MuiTabs-scroller": { 
                overflowX: "auto !important",
                scrollbarWidth: "none", 
                "&::-webkit-scrollbar": {
                  display: "none", 
                },
              },
            }}
          >
            <Tab label="Client Info" />
            <Tab label="Service Info" />
            <Tab label="Sub Service Info" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Name"
                secondary={
                  state?.client?.first_name + " " + state?.client?.last_name
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={state?.client?.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary="Phone" secondary={state?.client?.phone} />
            </ListItem>
           
           
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Name" secondary={state?.service?.name} />
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={baseUrl + state?.service?.icon}
                      alt="Client"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                }
              
              />
            </ListItem> */}
      
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Name" secondary={state?.sub_service?.name} />
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={baseUrl + state?.sub_service?.icon}
                      alt="Client"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                }
              
              />
            </ListItem> */}
      
          </List>
        </TabPanel>
      </Box>
    </Container>
  );
}
