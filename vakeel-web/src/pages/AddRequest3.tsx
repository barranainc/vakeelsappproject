import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

const AddRequest3: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service_id, serviceName, type } = location.state || {};
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  // Auto-save draft functionality
  const saveDraft = () => {
    const draft = {
      title,
      description,
      service_id,
      serviceName,
      type,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('request-draft-step3', JSON.stringify(draft));
    setShowDraftSaved(true);
    setTimeout(() => setShowDraftSaved(false), 2000);
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('request-draft-step3');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || '');
        setDescription(draft.description || '');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [title, description, service_id, serviceName, type]);

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
            if (title.trim() && description.trim() && description.length <= 1000) {
              handleSubmit();
            }
            break;
        }
      } else if (e.key === 'Escape') {
        navigate('/dashboard');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [title, description]);

  const handleSubmit = () => {
    if (title.trim() && description.trim() && description.length <= 1000) {
      // Submit to API - exact same payload as Android app
      console.log('Submitting request:', {
        service_id,
        title,
        description,
        type,
      });
      
      // Clear draft after successful submission
      localStorage.removeItem('request-draft-step3');
      
      // Navigate back to dashboard
      navigate('/my-requests');
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Post Your Request', path: '/dashboard' },
        { label: 'Select Type', path: '/add-request-1' },
        { label: 'Select Services', path: '/add-request-2' },
        { label: 'Describe Your Need', current: true }
      ]} />
      
      {/* Progress indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Step 3 of 3
        </Typography>
        <LinearProgress 
          value={100} 
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
              Describe Your Need
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
              },
            }}
          />
          
          <TextField
            fullWidth
            placeholder="Describe your need (Follow sample case description below)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={8}
            helperText={`${description.length}/1000 characters`}
            error={description.length > 1000}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'white',
              },
            }}
          />

          <Card sx={{ backgroundColor: '#F4F6F8', mb: 3, borderRadius: 3, p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Sample Case Description
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Case Type<br/>
              • Who are you?<br/>
              &nbsp;&nbsp;&nbsp;Petitioner/Applicant/Respondent<br/>
              • Court/Judge Name (In progress case)
            </Typography>
          </Card>

          <Button
            variant="contained"
            fullWidth
            disabled={!title.trim() || !description.trim() || description.length > 1000}
            onClick={handleSubmit}
            sx={{
              backgroundColor: (title.trim() && description.trim() && description.length <= 1000) ? '#FFA500' : '#D3D3D3',
              borderRadius: 2,
              height: 50,
            }}
          >
            Submit
          </Button>

          {/* Keyboard shortcuts hint */}
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            💡 Tip: Press Ctrl+S to save draft, Ctrl+Enter to submit
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRequest3; 