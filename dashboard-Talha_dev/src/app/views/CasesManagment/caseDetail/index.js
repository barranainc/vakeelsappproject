import React, { useState } from "react";
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
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../../../config/axios";
import moment from "moment";
import PersonIcon from "@mui/icons-material/Person";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { CalendarIcon } from "../../../assets/icons";

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
  const { state } = useLocation();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px !important",
            borderRadius: "20px",
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item md={12} sm={12} xs={12}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontFamily: "Poppins" }}
                >
                  {state?.title}
                </Typography>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <List>
                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText
                      primary="Client Name"
                      secondary={state?.client_name}
                    />
                  </ListItem>
                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText
                      primary="Hearing Date"
                      secondary={moment(state?.hearing_date).format(
                        "DD-MM-YYYY"
                      )}
                    />
                  </ListItem>
                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText
                      primary="Next Hearing Date"
                      secondary={moment(state?.next_hearing).format(
                        "DD-MM-YYYY"
                      )}
                    />
                  </ListItem>
                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText
                      primary="Party Representative"
                      secondary={state?.party_represented}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <List>
                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText primary="Party" secondary={state?.party_1} />
                  </ListItem>
                  {state?.category?.name == "Criminal" &&(
                    <>
                  
                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText
                      primary="Offense"
                      secondary={state?.offense}
                    />
                  </ListItem>
                

                  <ListItem sx={{paddingLeft:"0px !important"}}>
                    <ListItemText
                      primary="Police Station"
                      secondary={state?.police_station}
                    />
                  </ListItem>
                  </>
                  )}
                </List>
              </Grid>
              {state?.category?.name == "Criminal" &&(
              <Grid item md={6} sm={12} xs={12}>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={"FIR No  :" + state?.FIR_number}
                    size="small"
                    sx={{ mr: 1, fontFamily: "Poppins" }}
                  />
                  <Chip
                    label={"FIR Year  :" + state?.FIR_year}
                    size="small"
                    sx={{ mr: 1, fontFamily: "Poppins" }}
                  />
                </Box>
              </Grid>
              )}
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
            <Tab label="Case Detail" />
            <Tab label="Category Info" />
            <Tab label="SubCategory Info" />
            <Tab label="Lawyer Detail" />
            <Tab label="Proceedings" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <ListItemIcon>
                <ConfirmationNumberIcon />
              </ListItemIcon>
              <ListItemText
                primary="Case Number"
                secondary={state?.case_number}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText
                primary="Institution Of Case Date"
                secondary={moment(state?.institution_case_date).format("DD-MM-YYYY")}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="Case Description"
                secondary={state?.case_description}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Case Status"
                secondary={state?.case_status}
              />
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary="Case Documents" />
            </ListItem> */}

            {state?.case_documents?.map((doc, index) => (
              <ListItem
                key={index}
                button
                onClick={() => window.open(baseUrl + doc, "_blank")}
                sx={{cursor:"pointer"}}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary={doc?.name || `Case Document ${index + 1}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Name" secondary={state?.category?.name} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={baseUrl + state?.category?.icon}
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
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Name"
                secondary={state?.subcategory?.name}
              />
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={baseUrl + state?.subcategory?.icon}
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

        <TabPanel value={tabValue} index={3}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Name"
                  secondary={
                    state?.lawyer?.first_name + " " + state?.lawyer?.last_name
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={state?.lawyer?.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <IdCardIcon />
                </ListItemIcon>
                <ListItemText
                  primary="CNIC Number"
                  secondary={state?.lawyer?.cnic_number}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Council Id"
                  secondary={state?.lawyer?.council_id}
                />
              </ListItem>
              <ListItem
                button
                sx={{
                  ":hover": {
                    background: "none",
                  },
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open(baseUrl + state?.lawyer?.cnic_front, "_blank")
                }
              >
                <ListItemIcon>
                  <ImageIcon />
                </ListItemIcon>
                <ListItemText primary="CNIC Front" secondary={"click to see"} />
              </ListItem>
              <ListItem
                button
                sx={{
                  ":hover": {
                    background: "none",
                  },
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open(baseUrl + state?.lawyer?.cnic_back, "_blank")
                }
              >
                <ListItemIcon>
                  <ImageIcon />
                </ListItemIcon>
                <ListItemText primary="CNIC Back" secondary={"click to see"} />
              </ListItem>
            </List>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {state?.proceedings?.map((item, index) => (
            <List>
              <ListItem>
                <ListItemIcon>
                  <ConfirmationNumberIcon />
                </ListItemIcon>
                <ListItemText primary="Order" secondary={item?.order} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Date"
                  secondary={moment(item?.date).format("DD-MM-YYYY")}
                />
              </ListItem>

              {item?.attachments?.map((doc, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => window.open(baseUrl + doc, "_blank")}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc?.name || `Attachment ${index + 1}`}
                  />
                </ListItem>
              ))}
            </List>
          ))}
        </TabPanel>
      </Box>
    </Container>
  );
}
