import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Backdrop,
  CircularProgress,
  Tooltip,
  Fade,
  Zoom,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

interface MatterCategory {
  _id: string;
  name: string;
  icon: string;
}

interface MatterSubcategory {
  _id: string;
  name: string;
  icon: string;
  parent: string;
}

const PostMatter: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<MatterCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<MatterSubcategory | null>(null);
  const [categories, setCategories] = useState<MatterCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MatterSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDraftSaved, setShowDraftSaved] = useState(false);
  
  // Enhanced UX states
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Enhanced validation states
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // Mock data matching Android app structure exactly
  const mockCategories: MatterCategory[] = [
    { _id: '1', name: 'Family', icon: 'family' },
    { _id: '2', name: 'Civil', icon: 'civil' },
    { _id: '3', name: 'Employment', icon: 'employment' },
    { _id: '4', name: 'Criminal', icon: 'criminal' },
    { _id: '5', name: 'Corporate', icon: 'corporate' },
    { _id: '6', name: 'Banking', icon: 'banking' },
    { _id: '7', name: 'Taxation', icon: 'tax' },
    { _id: '8', name: 'Other', icon: 'other' },
  ];

  const mockSubcategories: MatterSubcategory[] = [
    // Family (1)
    { _id: '1-1', name: 'Divorce', icon: 'divorce', parent: '1' },
    { _id: '1-2', name: 'Child Custody', icon: 'custody', parent: '1' },
    { _id: '1-3', name: 'Child Support', icon: 'support', parent: '1' },
    { _id: '1-4', name: 'Adoption', icon: 'adoption', parent: '1' },
    { _id: '1-5', name: 'Marriage Registration', icon: 'marriage', parent: '1' },
    { _id: '1-6', name: 'Domestic Violence', icon: 'violence', parent: '1' },
    
    // Civil (2)
    { _id: '2-1', name: 'Property Disputes', icon: 'property', parent: '2' },
    { _id: '2-2', name: 'Contract Disputes', icon: 'contract', parent: '2' },
    { _id: '2-3', name: 'Tort Claims', icon: 'tort', parent: '2' },
    { _id: '2-4', name: 'Landlord-Tenant', icon: 'rental', parent: '2' },
    { _id: '2-5', name: 'Personal Injury', icon: 'injury', parent: '2' },
    { _id: '2-6', name: 'Medical Malpractice', icon: 'malpractice', parent: '2' },
    
    // Employment (3)
    { _id: '3-1', name: 'Employment Contracts', icon: 'contract', parent: '3' },
    { _id: '3-2', name: 'Workplace Safety', icon: 'safety', parent: '3' },
    { _id: '3-3', name: 'Industrial Disputes', icon: 'disputes', parent: '3' },
    { _id: '3-4', name: 'Workers Compensation', icon: 'compensation', parent: '3' },
    { _id: '3-5', name: 'Trade Unions', icon: 'unions', parent: '3' },
    { _id: '3-6', name: 'Minimum Wage', icon: 'wage', parent: '3' },
    
    // Criminal (4)
    { _id: '4-1', name: 'Theft', icon: 'theft', parent: '4' },
    { _id: '4-2', name: 'Assault', icon: 'assault', parent: '4' },
    { _id: '4-3', name: 'Drug Offenses', icon: 'drugs', parent: '4' },
    { _id: '4-4', name: 'Fraud', icon: 'fraud', parent: '4' },
    { _id: '4-5', name: 'Cyber Crime', icon: 'cyber', parent: '4' },
    { _id: '4-6', name: 'White Collar Crime', icon: 'white-collar', parent: '4' },
    
    // Corporate (5)
    { _id: '5-1', name: 'Company Formation', icon: 'formation', parent: '5' },
    { _id: '5-2', name: 'Corporate Compliance', icon: 'compliance', parent: '5' },
    { _id: '5-3', name: 'Mergers & Acquisitions', icon: 'mergers', parent: '5' },
    { _id: '5-4', name: 'Intellectual Property', icon: 'ip', parent: '5' },
    { _id: '5-5', name: 'Corporate Governance', icon: 'governance', parent: '5' },
    { _id: '5-6', name: 'Securities Law', icon: 'securities', parent: '5' },
    
    // Banking (6)
    { _id: '6-1', name: 'Banking Regulations', icon: 'regulations', parent: '6' },
    { _id: '6-2', name: 'Securities Law', icon: 'securities', parent: '6' },
    { _id: '6-3', name: 'Insurance Law', icon: 'insurance', parent: '6' },
    { _id: '6-4', name: 'Debt Recovery', icon: 'debt', parent: '6' },
    { _id: '6-5', name: 'Financial Fraud', icon: 'fraud', parent: '6' },
    { _id: '6-6', name: 'Investment Law', icon: 'investment', parent: '6' },
    
    // Taxation (7)
    { _id: '7-1', name: 'Income Tax', icon: 'income', parent: '7' },
    { _id: '7-2', name: 'Corporate Tax', icon: 'corporate', parent: '7' },
    { _id: '7-3', name: 'Sales Tax', icon: 'sales', parent: '7' },
    { _id: '7-4', name: 'Property Tax', icon: 'property', parent: '7' },
    { _id: '7-5', name: 'Tax Disputes', icon: 'disputes', parent: '7' },
    { _id: '7-6', name: 'Tax Planning', icon: 'planning', parent: '7' },
    
    // Other (8)
    { _id: '8-1', name: 'General Legal Advice', icon: 'advice', parent: '8' },
    { _id: '8-2', name: 'Document Review', icon: 'document', parent: '8' },
    { _id: '8-3', name: 'Legal Consultation', icon: 'consultation', parent: '8' },
    { _id: '8-4', name: 'Notary Services', icon: 'notary', parent: '8' },
    { _id: '8-5', name: 'Legal Research', icon: 'research', parent: '8' },
    { _id: '8-6', name: 'Miscellaneous', icon: 'misc', parent: '8' },
  ];

  const steps = ['Select Type', 'Select Services', 'Describe Matter'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setLoadingSubcategories(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockSubcategories.filter(sub => sub.parent === selectedCategory._id);
        setSubcategories(filtered);
        setLoadingSubcategories(false);
      }, 500);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  // Auto-save draft functionality
  const saveDraft = () => {
    const draft = {
      activeStep,
      selectedCategory,
      selectedSubcategory,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('matter-draft', JSON.stringify(draft));
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
            if (activeStep < 2) {
              handleNext();
            } else {
              setShowSubmitDialog(true);
            }
            break;
        }
      }
      
      if (e.key === 'Escape') {
        if (activeStep > 0) {
          handleBack();
        } else {
          setShowExitDialog(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeStep, selectedCategory, selectedSubcategory, title, description]);

  // Auto-save on form changes
  useEffect(() => {
    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [activeStep, selectedCategory, selectedSubcategory, title, description]);

  const handleCategorySelect = (category: MatterCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: MatterSubcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      navigate('/my-matters');
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setTitleError('');
    setDescriptionError('');
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.trim().length < 5) {
      setTitleError('Title must be at least 5 characters long');
      isValid = false;
    }
    
    // Validate description
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else if (description.trim().length < 20) {
      setDescriptionError('Description must be at least 20 characters long');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the validation errors before submitting.',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);
    setShowSubmitDialog(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccessDialog(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit matter. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/my-matters');
  };

  const handleSuccessViewMatter = () => {
    setShowSuccessDialog(false);
    // Navigate to matter detail view (will implement next)
    navigate('/my-matters');
  };

  const getCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      // Main categories
      family: <Home />,
      civil: <Assignment />,
      criminal: <Gavel />,
      corporate: <Business />,
      employment: <Work />,
      property: <Home />,
      tax: <AccountBalance />,
      banking: <AccountBalance />,
      
      // Subcategory icons
      divorce: <Home />,
      custody: <Home />,
      support: <Home />,
      adoption: <Home />,
      marriage: <Home />,
      violence: <Gavel />,
      contract: <Assignment />,
      tort: <Assignment />,
      rental: <Home />,
      injury: <Assignment />,
      malpractice: <Assignment />,
      theft: <Gavel />,
      assault: <Gavel />,
      drugs: <Gavel />,
      fraud: <Gavel />,
      cyber: <Gavel />,
      'white-collar': <Gavel />,
      formation: <Business />,
      compliance: <Business />,
      mergers: <Business />,
      ip: <Business />,
      governance: <Business />,
      securities: <Business />,
      safety: <Work />,
      disputes: <Work />,
      compensation: <Work />,
      unions: <Work />,
      wage: <Work />,
      realestate: <Home />,
      registration: <Home />,
      land: <Home />,
      development: <Home />,
      income: <AccountBalance />,
      sales: <AccountBalance />,
      planning: <AccountBalance />,
      debt: <AccountBalance />,
      investment: <AccountBalance />,
      
      // Additional icons for subcategories
      regulations: <AccountBalance />,
      insurance: <AccountBalance />,
      
      // Other category and subcategory icons
      other: <Description />,
      advice: <Assignment />,
      document: <Description />,
      consultation: <Assignment />,
      notary: <Assignment />,
      research: <Assignment />,
      misc: <Description />,
    };
    return iconMap[iconName] || <Description />;
  };

  const getBreadcrumbItems = () => {
    const items: Array<{ label: string; path?: string; current?: boolean }> = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'My Matters', path: '/my-matters' },
    ];
    
    if (activeStep >= 1) {
      items.push({ label: steps[0] });
    }
    
    if (activeStep >= 2) {
      items.push({ label: steps[1] });
    }
    
    if (activeStep === 2) {
      items.push({ label: steps[2], current: true });
    }
    
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
            Create Matter
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
            Step {activeStep + 1} of 3 • {Math.round((activeStep + 1) * 33.33)}% Complete
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
                value={(activeStep + 1) * 33.33} 
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
                label={`${Math.round((activeStep + 1) * 33.33)}%`}
                color="primary"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            {/* Step Labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              {steps.map((step, index) => (
                <Box key={step} sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: index <= activeStep ? 'bold' : 'normal',
                      color: index <= activeStep ? Colors.primary : Colors.gray500
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
            {activeStep === 0 && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                    Select Type
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid container spacing={isMobile ? 1 : 2}>
                      {categories.map((category, index) => (
                        <Grid item xs={6} sm={4} md={3} key={category._id}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              border: selectedCategory?._id === category._id ? `2px solid ${Colors.secondary}` : '1px solid #D1D3D4',
                              borderRadius: 3,
                              backgroundColor: selectedCategory?._id === category._id ? Colors.secondary : 'white',
                              color: selectedCategory?._id === category._id ? 'white' : 'inherit',
                              '&:hover': { 
                                borderColor: Colors.secondary,
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                              },
                              height: isMobile ? 100 : 120,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onClick={() => handleCategorySelect(category)}
                          >
                            <Box sx={{ 
                              color: selectedCategory?._id === category._id ? 'white' : Colors.primary, 
                              mb: 1,
                              fontSize: isMobile ? '1.5rem' : '2rem',
                              transition: 'all 0.3s ease'
                            }}>
                              {getCategoryIcon(category.icon)}
                            </Box>
                            <Typography 
                              variant={isMobile ? "caption" : "body2"} 
                              textAlign="center" 
                              fontWeight="medium"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              {category.name}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Fade>
            )}

            {activeStep === 1 && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                    Select Services
                  </Typography>
                  
                  {loadingSubcategories ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : subcategories.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ color: Colors.gray400, mb: 2 }}>
                        <Description sx={{ fontSize: 60 }} />
                      </Box>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No Services Available
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        No services are currently available for the selected category.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        startIcon={<ArrowBack />}
                        sx={{
                          borderColor: Colors.primary,
                          color: Colors.primary,
                          '&:hover': {
                            borderColor: Colors.primaryDark,
                            backgroundColor: `${Colors.primary}10`,
                          }
                        }}
                      >
                        Back to Categories
                      </Button>
                    </Box>
                  ) : (
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                      <RadioGroup value={selectedSubcategory?._id || ''}>
                        {subcategories.map((subcategory) => (
                          <Card
                            key={subcategory._id}
                            sx={{
                              mb: 2,
                              cursor: 'pointer',
                              border: selectedSubcategory?._id === subcategory._id ? `2px solid ${Colors.primary}` : '1px solid #D1D3D4',
                              borderRadius: 2,
                              backgroundColor: selectedSubcategory?._id === subcategory._id ? `${Colors.primary}10` : 'white',
                              '&:hover': {
                                borderColor: Colors.primary,
                                backgroundColor: `${Colors.primary}05`,
                                transform: 'translateX(4px)',
                                transition: 'all 0.2s ease-in-out'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <FormControlLabel
                                value={subcategory._id}
                                control={<Radio color="primary" />}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: Colors.primary }}>
                                      {getCategoryIcon(subcategory.icon)}
                                    </Box>
                                    <Typography variant="body1" fontWeight="medium">
                                      {subcategory.name}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ width: '100%', margin: 0 }}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                </Box>
              </Fade>
            )}

            {activeStep === 2 && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                    Describe Your Matter
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (titleError) setTitleError('');
                        }}
                        placeholder="Enter a clear title for your matter"
                        error={!!titleError}
                        helperText={titleError}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: Colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (descriptionError) setDescriptionError('');
                        }}
                        placeholder="Describe your matter in detail (Follow sample case description below)"
                        multiline
                        rows={6}
                        error={!!descriptionError}
                        helperText={descriptionError}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: Colors.primary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Card sx={{ backgroundColor: Colors.gray50, p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Sample Case Description
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          • Case Type<br/>
                          • Who are you? (Petitioner/Applicant/Respondent)<br/>
                          • Court/Judge Name (In progress case)
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

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
                {activeStep === 0 ? 'Back to Matters' : 'Previous'}
              </Button>
              
              <Button
                variant="contained"
                endIcon={activeStep === 2 ? <CheckCircle /> : <ArrowForward />}
                onClick={activeStep === 2 ? () => setShowSubmitDialog(true) : handleNext}
                disabled={
                  (activeStep === 0 && !selectedCategory) ||
                  (activeStep === 1 && !selectedSubcategory) ||
                  (activeStep === 2 && (!title.trim() || !description.trim()))
                }
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
                {activeStep === 2 ? 'Submit Matter' : 'Next'}
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
              navigate('/my-matters');
            }}
            variant="contained"
            color="error"
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Submit Matter
            </Typography>
            <IconButton onClick={() => setShowSubmitDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to submit this matter?
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Matter Details:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Category:</strong> {selectedCategory?.name}<br/>
              <strong>Service:</strong> {selectedSubcategory?.name}<br/>
              <strong>Title:</strong> {title}<br/>
              <strong>Description:</strong> {description.substring(0, 100)}...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setShowSubmitDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              background: `linear-gradient(135deg, ${Colors.secondary} 0%, ${Colors.secondaryDark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${Colors.secondaryDark} 0%, ${Colors.secondary} 100%)`,
              }
            }}
          >
            Submit Matter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleSuccessClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mr: 2 }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Matter Posted Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography gutterBottom>
            Your matter has been posted successfully.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Lawyers will now be able to view and respond to your matter. You can track responses and chat with interested lawyers.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={handleSuccessClose}
            variant="outlined"
            sx={{ borderColor: Colors.primary, color: Colors.primary }}
          >
            Continue Posting
          </Button>
          <Button 
            onClick={handleSuccessViewMatter}
            variant="contained"
            sx={{ 
              background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${Colors.primaryDark} 0%, ${Colors.primary} 100%)`,
              }
            }}
            endIcon={<ArrowForward />}
          >
            View My Matters
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
            Submitting your matter...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default PostMatter; 