import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
  Fade,
  Zoom,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  Gavel,
  Description,
  Assignment,
  Business,
  Home,
  Work,
  AccountBalance,
  School,
  Save,
  Close,
  CheckCircle,
  Warning,
  Info,
  ArrowBack,
  ArrowForward,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  Balance,
  DocumentScanner,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

interface RequestType {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const AddRequest1: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mock data matching Android app structure exactly
  const options: RequestType[] = [
    {
      id: 'judicial',
      label: 'Judicial',
      description: 'e.g. Certified Copies, Court Case Follow-ups, Surety/Bail Bonds etc.',
      icon: 'gavel',
    },
    {
      id: 'non_judicial',
      label: 'Non-Judicial',
      description: 'e.g. Birth Certificate, Death Certificate, Power of Attorney etc.',
      icon: 'document',
    },
  ];

  // Auto-save draft functionality
  const saveDraft = () => {
    const draft = {
      selectedType: selectedOption,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('request-draft-step1', JSON.stringify(draft));
    setSnackbar({
      open: true,
      message: 'Draft saved automatically',
      severity: 'success'
    });
  };

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
            if (selectedOption) {
              handleNext();
            }
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setShowExitDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption]);

  // Auto-save on form changes
  useEffect(() => {
    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [selectedOption]);

  const handleNext = () => {
    if (selectedOption) {
      navigate('/add-request-2', { state: { type: selectedOption } });
    }
  };

  const handleBack = () => {
    navigate('/my-requests');
  };

  const getTypeIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      gavel: <Gavel />,
      document: <DocumentScanner />,
    };
    return iconMap[iconName] || <Description />;
  };

  const getBreadcrumbItems = () => {
    const items: Array<{ label: string; path?: string; current?: boolean }> = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'My Requests', path: '/my-requests' },
    ];
    
    items.push({ label: 'Select Type', current: true });
    
    return items;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${Colors.gray50} 0%, ${Colors.background} 100%)`,
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '300px',
        height: '300px',
        background: `linear-gradient(135deg, ${Colors.primary}15 0%, ${Colors.secondary}15 100%)`,
        borderRadius: '50%',
        transform: 'translate(50%, -50%)',
        zIndex: 0
      }} />
      
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '100%', mx: 'auto', px: isMobile ? 2 : 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs items={getBreadcrumbItems()} />
        
        {/* Enhanced Header */}
        <Box sx={{ 
          textAlign: 'center',
          mb: 4,
          pt: 2
        }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Add Request
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
            Step 1 of 3 • 33% Complete
          </Typography>
        </Box>

        {/* Enhanced Progress Bar */}
        <Card sx={{ 
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                Progress
              </Typography>
              <LinearProgress 
                value={33.33} 
                sx={{ 
                  flex: 1, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: Colors.gray200,
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${Colors.primary} 0%, ${Colors.primaryLight} 100%)`,
                    borderRadius: 4,
                  }
                }}
              />
              <Chip 
                label="33%"
                color="primary"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            {/* Step Labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              {['Select Type', 'Select Services', 'Describe Request'].map((step, index) => (
                <Box key={step} sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: index === 0 ? 'bold' : 'normal',
                      color: index === 0 ? Colors.primary : Colors.gray500
                    }}
                  >
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Main Content Card */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: isMobile ? 2 : 3 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              Select Type
            </Typography>

            <Grid container spacing={isMobile ? 2 : 3}>
              {options.map((option) => (
                <Grid item xs={12} sm={6} key={option.id}>
                  <Fade in={true} timeout={500}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedOption === option.id ? `2px solid ${Colors.secondary}` : '1px solid #D1D3D4',
                        borderRadius: 3,
                        backgroundColor: selectedOption === option.id ? Colors.secondary : 'white',
                        color: selectedOption === option.id ? 'white' : 'inherit',
                        '&:hover': { 
                          borderColor: Colors.secondary,
                          transform: 'translateY(-8px)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                        },
                        height: isMobile ? 200 : 250,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        p: isMobile ? 2 : 3,
                      }}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <Box sx={{ 
                        color: selectedOption === option.id ? 'white' : Colors.primary, 
                        mb: 2,
                        fontSize: isMobile ? '3rem' : '4rem',
                        transition: 'all 0.3s ease'
                      }}>
                        {getTypeIcon(option.icon)}
                      </Box>
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        textAlign="center" 
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
                        {option.label}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "body2" : "body1"} 
                        textAlign="center"
                        sx={{ 
                          color: selectedOption === option.id ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                          lineHeight: 1.5
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{
                  borderColor: Colors.primary,
                  color: Colors.primary,
                  '&:hover': {
                    borderColor: Colors.primaryDark,
                    backgroundColor: `${Colors.primary}10`,
                  }
                }}
              >
                Back to Requests
              </Button>
              
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                disabled={!selectedOption}
                onClick={handleNext}
                sx={{
                  background: `linear-gradient(135deg, ${Colors.secondary} 0%, ${Colors.secondaryDark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${Colors.secondaryDark} 0%, ${Colors.secondary} 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  },
                  '&:disabled': {
                    background: Colors.gray300,
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Next
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Exit Without Saving?
            </Typography>
            <IconButton onClick={() => setShowExitDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You have unsaved changes. Are you sure you want to exit? Your draft will be saved automatically.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setShowExitDialog(false)}>
            Continue Editing
          </Button>
          <Button 
            onClick={() => {
              setShowExitDialog(false);
              navigate('/my-requests');
            }}
            variant="contained"
            color="error"
          >
            Exit
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
    </Box>
  );
};

export default AddRequest1; 