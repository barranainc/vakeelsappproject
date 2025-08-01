import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Assignment,
  CalendarToday,
  Chat,
  Description,
  PersonAdd,
  People,
  Gavel,
  PostAdd,
  ListAlt,
  TrendingUp,
  Notifications,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

interface DashboardStats {
  totalMatters: number;
  activeMatters: number;
  totalRequests: number;
  activeRequests: number;
  totalLawyers: number;
  recentActivity: number;
}

interface RecentMatter {
  _id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  lawyer?: string;
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalMatters: 0,
    activeMatters: 0,
    totalRequests: 0,
    activeRequests: 0,
    totalLawyers: 0,
    recentActivity: 0,
  });
  const [recentMatters, setRecentMatters] = useState<RecentMatter[]>([]);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState({ title: '', description: '' });

  // Mock data
  useEffect(() => {
    setStats({
      totalMatters: 5,
      activeMatters: 3,
      totalRequests: 8,
      activeRequests: 2,
      totalLawyers: 3,
      recentActivity: 12,
    });

    setRecentMatters([
      {
        _id: '1',
        title: 'Property Dispute Case',
        category: 'Civil Law',
        status: 'In Progress',
        date: '2024-01-15',
        lawyer: 'Sarah Ahmed',
      },
      {
        _id: '2',
        title: 'Employment Contract Review',
        category: 'Employment Law',
        status: 'Completed',
        date: '2024-01-10',
        lawyer: 'Ahmed Khan',
      },
      {
        _id: '3',
        title: 'Business Registration',
        category: 'Corporate Law',
        status: 'Pending',
        date: '2024-01-08',
      },
    ]);
  }, []);

  const handlePostRequest = () => {
    setOpenRequestDialog(true);
    setActiveStep(0);
    setSelectedType(null);
    setSelectedService(null);
    setNewRequest({ title: '', description: '' });
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
    setActiveStep(0);
    setSelectedType(null);
    setSelectedService(null);
    setNewRequest({ title: '', description: '' });
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setActiveStep(1);
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setActiveStep(2);
  };

  const handleSubmitRequest = () => {
    console.log('Submitting request:', {
      type: selectedType,
      service: selectedService,
      title: newRequest.title,
      description: newRequest.description,
    });
    handleCloseRequestDialog();
    navigate('/my-requests');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'postMatter':
        navigate('/post-matter');
        break;
      case 'postRequest':
        navigate('/add-request-1');
        break;
      case 'myMatters':
        navigate('/my-matters');
        break;
      case 'myRequests':
        navigate('/my-requests');
        break;
      case 'myLawyers':
        // This page doesn't exist yet, so I'll show an alert
        alert('My Lawyers page is coming soon!');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'documents':
        // This page doesn't exist yet, so I'll show an alert
        alert('Documents page is coming soon!');
        break;
      case 'notifications':
        // This page doesn't exist yet, so I'll show an alert
        alert('Notifications page is coming soon!');
        break;
      default:
        break;
    }
  };

  const steps = ['Select Type', 'Select Service', 'Describe Your Need'];

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Dashboard', current: true }
      ]} />

      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Welcome back, {user?.first_name}!
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: Colors.primary, color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{stats.totalMatters}</Typography>
              <Typography variant="body2">Total Matters</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#EAA141', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{stats.activeMatters}</Typography>
              <Typography variant="body2">Active Matters</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#5491C9', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{stats.totalRequests}</Typography>
              <Typography variant="body2">Total Requests</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">{stats.totalLawyers}</Typography>
              <Typography variant="body2">My Lawyers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card onClick={() => handleQuickAction('postMatter')} sx={{ cursor: 'pointer', backgroundColor: Colors.primary, color: 'white', '&:hover': { backgroundColor: Colors.primaryDark } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Gavel sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold">Post Your Matter</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card onClick={() => handleQuickAction('postRequest')} sx={{ cursor: 'pointer', backgroundColor: '#EAA141', color: 'white', '&:hover': { backgroundColor: '#D8943A' } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <PostAdd sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold">Post Your Request</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card onClick={() => handleQuickAction('myMatters')} sx={{ cursor: 'pointer', backgroundColor: '#5491C9', color: 'white', '&:hover': { backgroundColor: '#4A7FB8' } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Assignment sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold">My Matters</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card onClick={() => handleQuickAction('myRequests')} sx={{ cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45A049' } }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <ListAlt sx={{ fontSize: 48, color: 'white', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold">My Requests</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Matters</Typography>
              <List>
                {recentMatters.map((matter, index) => (
                  <React.Fragment key={matter._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: Colors.primary }}>
                          <Gavel />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={matter.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {matter.category} • {matter.date}
                            </Typography>
                            {matter.lawyer && (
                              <Typography variant="body2" color="textSecondary">
                                Lawyer: {matter.lawyer}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Chip
                        label={matter.status}
                        color={
                          matter.status === 'Completed' ? 'success' :
                          matter.status === 'In Progress' ? 'primary' : 'default'
                        }
                        size="small"
                      />
                    </ListItem>
                    {index < recentMatters.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Additional Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" fullWidth color="primary" startIcon={<People />} onClick={() => handleQuickAction('myLawyers')}>My Lawyers</Button>
                <Button variant="outlined" fullWidth color="primary" startIcon={<Chat />} onClick={() => handleQuickAction('chat')}>Chat</Button>
                <Button variant="outlined" fullWidth color="primary" startIcon={<Description />} onClick={() => handleQuickAction('documents')}>Documents</Button>
                <Button variant="outlined" fullWidth color="primary" startIcon={<Notifications />} onClick={() => handleQuickAction('notifications')}>Notifications</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Post Request Dialog */}
      <Dialog open={openRequestDialog} onClose={handleCloseRequestDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Post Your Request</Typography>
            <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogTitle>
        <DialogContent>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Select Type</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedType === 'judicial' ? `2px solid #FFA500` : '1px solid #D1D3D4',
                      borderRadius: 3,
                      backgroundColor: selectedType === 'judicial' ? '#FFA500' : 'white',
                      color: selectedType === 'judicial' ? 'white' : 'inherit',
                      '&:hover': { borderColor: '#FFA500' },
                      height: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => handleTypeSelect('judicial')}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Gavel sx={{ fontSize: 48, color: selectedType === 'judicial' ? 'white' : Colors.primary, mb: 1 }} />
                      <Typography variant="body2" fontWeight="medium">Judicial</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedType === 'non_judicial' ? `2px solid #FFA500` : '1px solid #D1D3D4',
                      borderRadius: 3,
                      backgroundColor: selectedType === 'non_judicial' ? '#FFA500' : 'white',
                      color: selectedType === 'non_judicial' ? 'white' : 'inherit',
                      '&:hover': { borderColor: '#FFA500' },
                      height: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => handleTypeSelect('non_judicial')}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Description sx={{ fontSize: 48, color: selectedType === 'non_judicial' ? 'white' : Colors.primary, mb: 1 }} />
                      <Typography variant="body2" fontWeight="medium">Non-Judicial</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Select Service</Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup value={selectedService || ''}>
                  {selectedType === 'judicial' ? (
                    <>
                      <FormControlLabel value="certified_copies" control={<Radio />} label="Certified Copies" onClick={() => handleServiceSelect('certified_copies')} />
                      <FormControlLabel value="court_followup" control={<Radio />} label="Court Case Follow-ups" onClick={() => handleServiceSelect('court_followup')} />
                      <FormControlLabel value="bail_bonds" control={<Radio />} label="Surety/Bail Bonds" onClick={() => handleServiceSelect('bail_bonds')} />
                    </>
                  ) : (
                    <>
                      <FormControlLabel value="birth_certificate" control={<Radio />} label="Birth Certificate" onClick={() => handleServiceSelect('birth_certificate')} />
                      <FormControlLabel value="death_certificate" control={<Radio />} label="Death Certificate" onClick={() => handleServiceSelect('death_certificate')} />
                      <FormControlLabel value="power_attorney" control={<Radio />} label="Power of Attorney" onClick={() => handleServiceSelect('power_attorney')} />
                    </>
                  )}
                </RadioGroup>
              </FormControl>
            </Box>
          )}
          {activeStep === 2 && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>Describe Your Need</Typography>
              <TextField
                fullWidth
                label="Title"
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                multiline
                rows={4}
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
          )}
          {activeStep < 2 && selectedType && (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)} sx={{ backgroundColor: Colors.primary }}>
              Next
            </Button>
          )}
          {activeStep === 2 && (
            <Button
              variant="contained"
              onClick={handleSubmitRequest}
              disabled={!newRequest.title || !newRequest.description}
              sx={{ backgroundColor: Colors.primary }}
            >
              Submit Request
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDashboard; 