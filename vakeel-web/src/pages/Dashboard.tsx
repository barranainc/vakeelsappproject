import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Fade,
  Zoom,
  Backdrop,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Add,
  Cases,
  People,
  Assignment,
  Description,
  Chat,
  Notifications,
  Settings,
  Close,
  CheckCircle,
  Warning,
  Info,
  ArrowBack,
  ArrowForward,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  Gavel,
  Business,
  Work,
  AccountBalance,
  School,
  Home,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

interface CaseData {
  title: string;
  category: string;
  description: string;
  client_name: string;
  case_number: string;
  court: string;
  urgency: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showAddCaseDialog, setShowAddCaseDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [caseData, setCaseData] = useState<CaseData>({
    title: '',
    category: '',
    description: '',
    client_name: '',
    case_number: '',
    court: '',
    urgency: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mock statistics data
  const stats = [
    { title: 'Total Cases', value: '24', icon: <Cases />, color: Colors.primary },
    { title: 'Active Cases', value: '18', icon: <Assignment />, color: Colors.success },
    { title: 'Pending Cases', value: '6', icon: <Description />, color: Colors.warning },
    { title: 'Total Clients', value: '42', icon: <People />, color: Colors.secondary },
  ];

  // Mock recent cases
  const recentCases = [
    { id: 1, title: 'Contract Dispute - ABC Corp', client: 'ABC Corporation', status: 'Active', date: '2024-01-15' },
    { id: 2, title: 'Property Litigation - Smith Estate', client: 'John Smith', status: 'Pending', date: '2024-01-14' },
    { id: 3, title: 'Employment Case - Tech Solutions', client: 'Tech Solutions Ltd', status: 'Active', date: '2024-01-13' },
  ];

  // Mock categories
  const categories = [
    'Family Law',
    'Civil Law',
    'Employment Law',
    'Criminal Law',
    'Corporate Law',
    'Banking Law',
    'Taxation Law',
    'Property Law',
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: Colors.success },
    { value: 'medium', label: 'Medium', color: Colors.warning },
    { value: 'high', label: 'High', color: Colors.error },
  ];

  const steps = ['Basic Information', 'Case Details', 'Review & Submit'];

  // Auto-save draft functionality
  const saveDraft = () => {
    const draft = {
      ...caseData,
      activeStep,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('case-draft', JSON.stringify(draft));
    setSnackbar({
      open: true,
      message: 'Draft saved automatically',
      severity: 'success'
    });
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('case-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setCaseData({
          title: draft.title || '',
          category: draft.category || '',
          description: draft.description || '',
          client_name: draft.client_name || '',
          case_number: draft.case_number || '',
          court: draft.court || '',
          urgency: draft.urgency || 'medium'
        });
        setActiveStep(draft.activeStep || 0);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [caseData, activeStep]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveDraft();
            break;
          case 'Enter':
            e.preventDefault();
            if (activeStep < 2) {
              handleNext();
            } else {
              handleSubmit();
            }
            break;
        }
      } else if (e.key === 'Escape') {
        setShowAddCaseDialog(false);
      }
    };

    if (showAddCaseDialog) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [activeStep, caseData, showAddCaseDialog]);

  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Submitting case:', caseData);
      
      // Clear draft after successful submission
      localStorage.removeItem('case-draft');
      
      setSnackbar({
        open: true,
        message: 'Case added successfully!',
        severity: 'success'
      });
      
      setShowAddCaseDialog(false);
      setActiveStep(0);
      setCaseData({
        title: '',
        category: '',
        description: '',
        client_name: '',
        case_number: '',
        court: '',
        urgency: 'medium'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add case. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    if (caseData.title || caseData.description || caseData.client_name) {
      // Show confirmation dialog
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setShowAddCaseDialog(false);
        setActiveStep(0);
        setCaseData({
          title: '',
          category: '',
          description: '',
          client_name: '',
          case_number: '',
          court: '',
          urgency: 'medium'
        });
        localStorage.removeItem('case-draft');
      }
    } else {
      setShowAddCaseDialog(false);
      setActiveStep(0);
    }
  };

  const getBreadcrumbItems = () => {
    return [
      { label: 'Dashboard', current: true }
    ];
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', px: isMobile ? 1 : 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={getBreadcrumbItems()} />

      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h1" 
        gutterBottom 
        fontWeight="bold"
        sx={{ mb: 3 }}
      >
        Welcome back, {user?.first_name}!
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Fade in={true} timeout={500 + index * 100}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <CardContent sx={{ p: isMobile ? 1.5 : 2, textAlign: 'center' }}>
                  <Box sx={{ 
                    color: stat.color, 
                    mb: 1,
                    fontSize: isMobile ? '2rem' : '2.5rem'
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography 
                    variant={isMobile ? "h6" : "h4"} 
                    fontWeight="bold" 
                    gutterBottom
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant={isMobile ? "caption" : "body2"} 
                    color="textSecondary"
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              borderRadius: 3, 
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
                boxShadow: 4,
                backgroundColor: Colors.primaryLight
              },
              transition: 'all 0.3s ease-in-out'
            }}
            onClick={() => setShowAddCaseDialog(true)}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: 'center' }}>
              <Box sx={{ color: Colors.primary, mb: 2, fontSize: isMobile ? '2rem' : '3rem' }}>
                <Add />
              </Box>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
                Add New Case
              </Typography>
              <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">
                Create a new case file
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              borderRadius: 3, 
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
                boxShadow: 4,
                backgroundColor: Colors.secondaryLight
              },
              transition: 'all 0.3s ease-in-out'
            }}
            onClick={() => navigate('/lawyer-matters')}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: 'center' }}>
              <Box sx={{ color: Colors.secondary, mb: 2, fontSize: isMobile ? '2rem' : '3rem' }}>
                <Gavel />
              </Box>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
                Client Matters
              </Typography>
              <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">
                View client posted matters
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              borderRadius: 3, 
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
                boxShadow: 4,
                backgroundColor: Colors.accentLight
              },
              transition: 'all 0.3s ease-in-out'
            }}
            onClick={() => navigate('/client-requests')}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: 'center' }}>
              <Box sx={{ color: Colors.accent, mb: 2, fontSize: isMobile ? '2rem' : '3rem' }}>
                <Assignment />
              </Box>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
                Client Requests
              </Typography>
              <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">
                Respond to client requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              borderRadius: 3, 
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out',
                boxShadow: 4,
                backgroundColor: Colors.info + '20'
              },
              transition: 'all 0.3s ease-in-out'
            }}
            onClick={() => navigate('/chat')}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: 'center' }}>
              <Box sx={{ color: Colors.info, mb: 2, fontSize: isMobile ? '2rem' : '3rem' }}>
                <Chat />
              </Box>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
                Chat
              </Typography>
              <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">
                Message clients and team
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Cases */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
            Recent Cases
          </Typography>
          
          <Grid container spacing={2}>
            {recentCases.map((caseItem, index) => (
              <Grid item xs={12} key={caseItem.id}>
                <Fade in={true} timeout={500 + index * 100}>
                  <Card 
                    sx={{ 
                      p: isMobile ? 1.5 : 2,
                      border: '1px solid #E5E7EB',
                      borderRadius: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                        transform: 'translateX(4px)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => navigate(`/cases/${caseItem.id}`)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant={isMobile ? "body2" : "body1"} fontWeight="medium">
                          {caseItem.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {caseItem.client} • {new Date(caseItem.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={caseItem.status}
                        color={caseItem.status === 'Active' ? 'success' : 'warning'}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Add New Case Dialog */}
      <Dialog
        open={showAddCaseDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Add New Case
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {/* Progress indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant={isMobile ? "body1" : "h6"} sx={{ mr: 2, fontWeight: 'bold' }}>
              Step {activeStep + 1} of 3
            </Typography>
            <LinearProgress 
              value={(activeStep + 1) * 33.33} 
              sx={{ 
                flex: 1, 
                height: isMobile ? 6 : 8, 
                borderRadius: 4,
                minWidth: isMobile ? 150 : 200
              }}
            />
            <Chip 
              label={`${Math.round((activeStep + 1) * 33.33)}%`}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Box>

          {/* Mobile-optimized stepper */}
          {!isMobile && (
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {/* Mobile step indicator */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                {steps[activeStep]}
              </Typography>
            </Box>
          )}

          {activeStep === 0 && (
            <Fade in={true} timeout={500}>
              <Box>
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
                  Basic Information
                </Typography>
                
                <TextField
                  fullWidth
                  label="Case Title"
                  value={caseData.title}
                  onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
                  sx={{ mb: 3 }}
                  helperText="Enter a descriptive title for the case"
                />
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={caseData.category}
                    label="Category"
                    onChange={(e) => setCaseData({ ...caseData, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select the legal category for this case</FormHelperText>
                </FormControl>

                <TextField
                  fullWidth
                  label="Client Name"
                  value={caseData.client_name}
                  onChange={(e) => setCaseData({ ...caseData, client_name: e.target.value })}
                  sx={{ mb: 3 }}
                  helperText="Enter the client's full name"
                />
              </Box>
            </Fade>
          )}

          {activeStep === 1 && (
            <Fade in={true} timeout={500}>
              <Box>
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
                  Case Details
                </Typography>
                
                <TextField
                  fullWidth
                  label="Case Number"
                  value={caseData.case_number}
                  onChange={(e) => setCaseData({ ...caseData, case_number: e.target.value })}
                  sx={{ mb: 3 }}
                  helperText="Enter the official case number if available"
                />
                
                <TextField
                  fullWidth
                  label="Court"
                  value={caseData.court}
                  onChange={(e) => setCaseData({ ...caseData, court: e.target.value })}
                  sx={{ mb: 3 }}
                  helperText="Enter the court where the case is filed"
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select
                    value={caseData.urgency}
                    label="Urgency Level"
                    onChange={(e) => setCaseData({ ...caseData, urgency: e.target.value })}
                  >
                    {urgencyLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: level.color 
                          }} />
                          {level.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select the urgency level for this case</FormHelperText>
                </FormControl>
              </Box>
            </Fade>
          )}

          {activeStep === 2 && (
            <Fade in={true} timeout={500}>
              <Box>
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3 }}>
                  Review & Submit
                </Typography>
                
                <TextField
                  fullWidth
                  label="Case Description"
                  value={caseData.description}
                  onChange={(e) => setCaseData({ ...caseData, description: e.target.value })}
                  multiline
                  rows={isMobile ? 4 : 6}
                  sx={{ mb: 3 }}
                  helperText="Provide a detailed description of the case"
                />

                <Card sx={{ backgroundColor: '#F4F6F8', mb: 3, borderRadius: 2, p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Case Summary:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Title:</strong> {caseData.title || 'Not provided'}<br/>
                    <strong>Category:</strong> {caseData.category || 'Not selected'}<br/>
                    <strong>Client:</strong> {caseData.client_name || 'Not provided'}<br/>
                    <strong>Case Number:</strong> {caseData.case_number || 'Not provided'}<br/>
                    <strong>Court:</strong> {caseData.court || 'Not provided'}<br/>
                    <strong>Urgency:</strong> {caseData.urgency.charAt(0).toUpperCase() + caseData.urgency.slice(1)}
                  </Typography>
                </Card>
              </Box>
            </Fade>
          )}
        </DialogContent>

        <DialogActions sx={{ p: isMobile ? 2 : 3, pt: 0 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          
          <Button
            onClick={activeStep === 2 ? handleSubmit : handleNext}
            variant="contained"
            disabled={submitting || (activeStep === 0 && (!caseData.title || !caseData.category || !caseData.client_name))}
            endIcon={activeStep === 2 ? undefined : <KeyboardArrowRight />}
            sx={{ 
              backgroundColor: '#FFA500', 
              '&:hover': { backgroundColor: '#E69500' },
              '&:disabled': { backgroundColor: '#D3D3D3' }
            }}
          >
            {activeStep === 2 ? 'Submit Case' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={submitting}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2, color: 'white' }}>
            Adding your case...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default Dashboard; 