import React, { useState } from 'react';
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
  ListItemIcon
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  CreditCard as IdCardIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { baseUrl } from '../../../config/axios';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import GiteIcon from '@mui/icons-material/Gite';

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
  const [activeImage, setActiveImage] = useState('front');
  const {state } = useLocation()
  console.log(state)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Card sx={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px !important",borderRadius:'20px'}}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  alt={`${state?.first_name} ${state?.last_name}`}
                  src={baseUrl  + state?.picture}
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom sx={{fontFamily:"Poppins"}}>
                  {state?.first_name} {state?.last_name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{fontFamily:"Poppins"}}>
                  {state?.lawyer_details?.designation}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={state?.is_active ? "Active" : "Inactive"} 
                    color={state?.is_active ? "success" : "error"} 
                    size="small" 
                    sx={{ mr: 1 ,fontFamily:"Poppins"  }}
                  />
                  <Chip label={state?.user_type} size="small" sx={{ mr: 1 ,fontFamily:"Poppins" }} />
                 
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="user information tabs"
          sx={{
            ".MuiTabs-scroller": { 
              overflowX: "auto !important",
              scrollbarWidth: "none", 
              "&::-webkit-scrollbar": {
                display: "none", 
              },
            },
          }}>
            <Tab label="Personal Info" />
            <Tab label="lawyer Detail" />
            <Tab label="Documents" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={state?.email}  />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary="Phone" secondary={state?.phone} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <IdCardIcon />
              </ListItemIcon>
              <ListItemText primary="CNIC" secondary={state?.cnic_number} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Council ID" secondary={state?.council_id} />
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            <ListItem>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="Area of Expertise" secondary={state?.lawyer_details?.area_of_expertise} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText primary="City" secondary={state?.lawyer_details?.city} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonPinIcon />
              </ListItemIcon>
              <ListItemText primary="Designation" secondary={state?.lawyer_details?.designation} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Years of Experience" secondary={state?.lawyer_details?.years_of_experience} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Qualifications" secondary={state?.lawyer_details?.qualifications} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GiteIcon/>
              </ListItemIcon>
              <ListItemText primary="Station" secondary={state?.lawyer_details?.station} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationIcon />
              </ListItemIcon>
              <ListItemText primary="Office Address" secondary={state?.lawyer_details?.office_address} />
            </ListItem>
            {state?.lawyer_details?.council_documents?.map((doc, index) => (
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
                  primary={doc?.name || `Council Document ${index + 1}`}
                />
              </ListItem>
            ))}
            {state?.lawyer_details?.professional_documents?.map((doc, index) => (
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
                  primary={doc?.name || `Professional Document ${index + 1}`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label="CNIC Front" 
              onClick={() => setActiveImage('front')} 
              color={activeImage === 'front' ? 'primary' : 'default'}
              sx={{ mr: 1 }}
            />
            <Chip 
              label="CNIIC Back" 
              onClick={() => setActiveImage('back')} 
              color={activeImage === 'back' ? 'primary' : 'default'}
            />
          </Box>
          <Box 
            component="img"
            sx={{
              width: '100%',
              height: '400px',
              objectFit:"contain",
              borderRadius: 1,
            }}
            alt={`CNIC ${activeImage}`}
            src={activeImage === 'front' ? baseUrl  + state?.cnic_front : baseUrl  + state?.cnic_back}
          />
        </TabPanel>
      </Box>
    </Container>
  );
}

