import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

interface Service {
  _id: string;
  name: string;
  icon: string;
  parent: string;
}

const AddRequest2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state || {};
  
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  // Mock services based on type
  const mockServices: { [key: string]: Service[] } = {
    judicial: [
      { _id: 'j1', name: 'Certified Copies', icon: 'certified', parent: 'judicial' },
      { _id: 'j2', name: 'Court Case Follow-ups', icon: 'followup', parent: 'judicial' },
      { _id: 'j3', name: 'Surety/Bail Bonds', icon: 'bail', parent: 'judicial' },
      { _id: 'j4', name: 'Court Orders', icon: 'orders', parent: 'judicial' },
      { _id: 'j5', name: 'Legal Notices', icon: 'notices', parent: 'judicial' },
    ],
    non_judicial: [
      { _id: 'nj1', name: 'Birth Certificate', icon: 'birth', parent: 'non_judicial' },
      { _id: 'nj2', name: 'Death Certificate', icon: 'death', parent: 'non_judicial' },
      { _id: 'nj3', name: 'Power of Attorney', icon: 'power', parent: 'non_judicial' },
      { _id: 'nj4', name: 'Marriage Certificate', icon: 'marriage', parent: 'non_judicial' },
      { _id: 'nj5', name: 'Property Documents', icon: 'property', parent: 'non_judicial' },
      { _id: 'nj6', name: 'Business Registration', icon: 'business', parent: 'non_judicial' },
    ],
  };

  // Auto-save draft functionality
  const saveDraft = () => {
    const draft = {
      selectedService,
      type,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('request-draft-step2', JSON.stringify(draft));
    setShowDraftSaved(true);
    setTimeout(() => setShowDraftSaved(false), 2000);
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('request-draft-step2');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setSelectedService(draft.selectedService || null);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save when selection changes
  useEffect(() => {
    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [selectedService, type]);

  // Keyboard shortcuts
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
            if (selectedService) {
              handleNext();
            }
            break;
        }
      } else if (e.key === 'Escape') {
        navigate('/dashboard');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedService]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices[type] || []);
      setLoading(false);
    }, 1000);
  }, [type]);

  const handleNext = () => {
    if (selectedService) {
      const service = services.find(s => s._id === selectedService);
      // Clear draft when proceeding
      localStorage.removeItem('request-draft-step2');
      navigate('/add-request-3', { 
        state: { 
          service_id: selectedService,
          serviceName: service?.name,
          type: type 
        } 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Post Your Request', path: '/dashboard' },
        { label: 'Select Type', path: '/add-request-1' },
        { label: 'Select Services', current: true }
      ]} />
      
      {/* Progress indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Step 2 of 3
        </Typography>
        <LinearProgress 
          value={66.66} 
          sx={{ flex: 1, height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Draft saved notification */}
      {showDraftSaved && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setShowDraftSaved(false)}>
              Dismiss
            </Button>
          }
        >
          Draft saved automatically
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Paralegal Assistance
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Services
            </Typography>
          </Box>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup value={selectedService || ''}>
              {services.map((service) => (
                <FormControlLabel
                  key={service._id}
                  value={service._id}
                  control={<Radio />}
                  label={service.name}
                  onClick={() => setSelectedService(service._id)}
                  sx={{
                    border: '1px solid #D1D3D4',
                    borderRadius: 2,
                    margin: '8px 0',
                    padding: '12px 16px',
                    width: '100%',
                    backgroundColor: selectedService === service._id ? '#FFA500' : 'white',
                    color: selectedService === service._id ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: selectedService === service._id ? '#FFA500' : '#f5f5f5',
                    },
                    '& .MuiFormControlLabel-label': {
                      color: selectedService === service._id ? 'white' : 'inherit',
                      fontWeight: selectedService === service._id ? 600 : 400,
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            disabled={!selectedService}
            onClick={handleNext}
            sx={{
              backgroundColor: selectedService ? '#FFA500' : '#D3D3D3',
              mt: 4,
              borderRadius: 2,
              height: 50,
            }}
          >
            Next
          </Button>

          {/* Keyboard shortcuts hint */}
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            💡 Tip: Press Ctrl+S to save draft, Ctrl+Enter to proceed
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRequest2; 