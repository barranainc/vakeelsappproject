import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';

const onboardingSteps = [
  {
    title: 'Welcome to Vakeel',
    description: 'Your comprehensive legal practice management platform',
    content: 'Connect with legal professionals, manage cases efficiently, and streamline your legal practice with our advanced platform.',
  },
  {
    title: 'Multi-User Platform',
    description: 'Designed for all legal stakeholders',
    content: 'Whether you\'re a lawyer, client, or paralegal assistant, Vakeel provides the tools you need to succeed.',
  },
  {
    title: 'Get Started',
    description: 'Choose your role and begin your journey',
    content: 'Select your role below to access the features tailored specifically for your needs.',
  },
];

const Onboarding: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === onboardingSteps.length - 1) {
      navigate('/continue-as');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRoleSelect = (role: string) => {
    navigate('/login', { state: { userType: role } });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'white',
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Vakeel
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Legal Practice Management Platform
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {onboardingSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.title}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Card sx={{ mb: 4, textAlign: 'center' }}>
              <CardContent sx={{ py: 6 }}>
                <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="bold">
                  {onboardingSteps[activeStep].title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {onboardingSteps[activeStep].description}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  {onboardingSteps[activeStep].content}
                </Typography>
              </CardContent>
            </Card>

            {activeStep === onboardingSteps.length - 1 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Continue as
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    backgroundColor: Colors.clientButton,
                    '&:hover': { backgroundColor: Colors.primaryDark },
                    py: 2,
                    fontSize: '1.1rem',
                  }}
                  onClick={() => handleRoleSelect('client')}
                >
                  Client
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    backgroundColor: Colors.assistantButton,
                    '&:hover': { backgroundColor: Colors.primaryDark },
                    py: 2,
                    fontSize: '1.1rem',
                  }}
                  onClick={() => handleRoleSelect('paralegal')}
                >
                  Paralegal Assistant
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    backgroundColor: Colors.lawyerButton,
                    '&:hover': { backgroundColor: Colors.secondaryDark },
                    py: 2,
                    fontSize: '1.1rem',
                  }}
                  onClick={() => handleRoleSelect('lawyer')}
                >
                  Lawyer
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  size="large"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  size="large"
                  sx={{ backgroundColor: Colors.primary }}
                >
                  {activeStep === onboardingSteps.length - 2 ? 'Get Started' : 'Next'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Onboarding; 