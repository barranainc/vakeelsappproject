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

  // In a real application, you'd fetch this data from an API


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
                    sx={{ mr: 1 ,fontFamily:"Poppins" }}
                  />
                  <Chip label={state?.user_type} size="small" sx={{ mr: 1 ,fontFamily:"Poppins"}} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="user information tabs">
            <Tab label="Personal Info" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={state?.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary="Phone" secondary={state?.phone} />
            </ListItem>
            {/* <ListItem>
              <ListItemIcon>
                <IdCardIcon />
              </ListItemIcon>
              <ListItemText primary="CNIC" secondary={state.cnic_number} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Council ID" secondary={state.council_id} />
            </ListItem> */}
          </List>
        </TabPanel>

      

    
      </Box>
    </Container>
  );
}

