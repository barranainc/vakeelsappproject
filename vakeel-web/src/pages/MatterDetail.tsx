import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Chat,
  Gavel,
  Business,
  Home,
  Work,
  AccountBalance,
  Description,
  CheckCircle,
  Schedule,
  Person,
  Message,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../assets/styles/colors';
import Breadcrumbs from '../components/Breadcrumbs';

interface MatterDetail {
  _id: string;
  title: string;
  description: string;
  category: {
    _id: string;
    name: string;
    icon: string;
  };
  subcategory: {
    _id: string;
    name: string;
    icon: string;
  };
  status: 'active' | 'pending' | 'completed';
  created_at: string;
  responded_lawyer: number;
  client: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  lawyer_responses?: LawyerResponse[];
}

interface LawyerResponse {
  _id: string;
  lawyer: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    picture?: string;
    experience: number;
    specialization: string;
    rating: number;
  };
  message: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const MatterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matter, setMatter] = useState<MatterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerResponse | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  // Mock data for demonstration
  const mockMatter: MatterDetail = {
    _id: '1',
    title: 'Divorce Case - Property Division Dispute',
    description: 'I need legal assistance for my divorce case. There is a dispute over property division. We have been married for 8 years and have two children. The main issues are: 1) Division of marital home 2) Child custody arrangement 3) Alimony calculation. I am the petitioner and the case is currently in the Family Court. Looking for an experienced family law attorney.',
    category: {
      _id: '1',
      name: 'Family',
      icon: 'family'
    },
    subcategory: {
      _id: '1-1',
      name: 'Divorce',
      icon: 'divorce'
    },
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    responded_lawyer: 3,
    client: {
      _id: 'client1',
      first_name: 'Ahmed',
      last_name: 'Khan',
      email: 'ahmed.khan@email.com',
      phone: '+92-300-1234567'
    },
    lawyer_responses: [
      {
        _id: 'resp1',
        lawyer: {
          _id: 'lawyer1',
          first_name: 'Sarah',
          last_name: 'Ahmed',
          email: 'sarah.ahmed@lawfirm.com',
          phone: '+92-300-9876543',
          picture: '',
          experience: 12,
          specialization: 'Family Law, Divorce, Child Custody',
          rating: 4.8
        },
        message: 'I have extensive experience in family law cases, particularly divorce and property division. I can help you navigate this complex situation and ensure your rights are protected. Let\'s discuss your case in detail.',
        created_at: '2024-01-16T09:15:00Z',
        status: 'pending'
      },
      {
        _id: 'resp2',
        lawyer: {
          _id: 'lawyer2',
          first_name: 'Muhammad',
          last_name: 'Ali',
          email: 'muhammad.ali@legal.com',
          phone: '+92-300-5555555',
          picture: '',
          experience: 8,
          specialization: 'Family Law, Civil Litigation',
          rating: 4.6
        },
        message: 'I specialize in family law and have successfully handled many divorce cases with property disputes. I can provide you with a comprehensive legal strategy tailored to your specific situation.',
        created_at: '2024-01-16T14:30:00Z',
        status: 'pending'
      },
      {
        _id: 'resp3',
        lawyer: {
          _id: 'lawyer3',
          first_name: 'Fatima',
          last_name: 'Hassan',
          email: 'fatima.hassan@law.com',
          phone: '+92-300-7777777',
          picture: '',
          experience: 15,
          specialization: 'Family Law, Child Custody, Property Law',
          rating: 4.9
        },
        message: 'With 15 years of experience in family law, I can help you achieve a fair settlement. I have particular expertise in complex property division cases and child custody matters.',
        created_at: '2024-01-17T11:45:00Z',
        status: 'pending'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMatter(mockMatter);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      family: <Home />,
      civil: <Business />,
      employment: <Work />,
      criminal: <Gavel />,
      corporate: <Business />,
      banking: <AccountBalance />,
      taxation: <AccountBalance />,
      other: <Description />,
      divorce: <Home />,
    };
    return iconMap[iconName] || <Description />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChatWithLawyer = (lawyerResponse: LawyerResponse) => {
    setSelectedLawyer(lawyerResponse);
    setShowChatDialog(true);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Simulate sending message
      console.log('Sending message to lawyer:', chatMessage);
      setChatMessage('');
      setShowChatDialog(false);
      // Navigate to chat
      navigate('/chat');
    }
  };

  const handleAcceptLawyer = (lawyerResponse: LawyerResponse) => {
    // Simulate accepting lawyer
    console.log('Accepting lawyer:', lawyerResponse.lawyer.first_name);
    // Update status and navigate to chat
    navigate('/chat');
  };

  const getBreadcrumbItems = () => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Matters', path: '/my-matters' },
    { label: 'Matter Details', current: true }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumbs items={getBreadcrumbItems()} />
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        </Box>
      </Box>
    );
  }

  if (!matter) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumbs items={getBreadcrumbItems()} />
        <Alert severity="error" sx={{ mt: 3 }}>
          Matter not found. Please check the URL and try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: Colors.gray50 }}>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs items={getBreadcrumbItems()} />
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={() => navigate('/my-matters')} sx={{ color: Colors.primary }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: Colors.primary }}>
            Matter Details
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Matter Details Card */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Matter Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: Colors.primary, 
                    width: 60, 
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getCategoryIcon(matter.category.icon)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {matter.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Chip 
                        label={matter.category.name} 
                        size="small" 
                        sx={{ bgcolor: Colors.primary, color: 'white' }}
                      />
                      <Chip 
                        label={matter.subcategory.name} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderColor: Colors.primary, color: Colors.primary }}
                      />
                      <Chip 
                        label={matter.status.toUpperCase()} 
                        size="small" 
                        color={matter.status === 'active' ? 'success' : 'warning'}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Posted on {formatDate(matter.created_at)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Matter Description */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {matter.description}
                </Typography>

                {/* Client Information */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Client Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: Colors.secondary }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {matter.client.first_name} {matter.client.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {matter.client.email}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Lawyer Responses Card */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Lawyer Responses
                  </Typography>
                  <Badge badgeContent={matter.responded_lawyer} color="primary">
                    <Gavel />
                  </Badge>
                </Box>

                {matter.lawyer_responses && matter.lawyer_responses.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {matter.lawyer_responses.map((response, index) => (
                      <React.Fragment key={response._id}>
                        <ListItem sx={{ 
                          p: 2, 
                          mb: 2, 
                          border: '1px solid',
                          borderColor: Colors.gray200,
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: Colors.primary }}>
                              {response.lawyer.picture ? (
                                <img src={response.lawyer.picture} alt="Lawyer" />
                              ) : (
                                <Person />
                              )}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {response.lawyer.first_name} {response.lawyer.last_name}
                                </Typography>
                                <Chip 
                                  label={`${response.lawyer.rating}★`} 
                                  size="small" 
                                  sx={{ bgcolor: Colors.secondary, color: 'white' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                  {response.lawyer.specialization}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                  {response.message.substring(0, 100)}...
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {formatDate(response.created_at)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Message />}
                            onClick={() => handleChatWithLawyer(response)}
                            sx={{ 
                              borderColor: Colors.primary, 
                              color: Colors.primary,
                              flex: 1
                            }}
                          >
                            Chat
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleAcceptLawyer(response)}
                            sx={{ 
                              bgcolor: Colors.secondary,
                              flex: 1,
                              '&:hover': { bgcolor: Colors.secondaryDark }
                            }}
                          >
                            Accept
                          </Button>
                        </Box>
                        
                        {index < matter.lawyer_responses.length - 1 && <Divider sx={{ my: 2 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Gavel sx={{ fontSize: 60, color: Colors.gray400, mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No Responses Yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Lawyers will respond to your matter soon.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Chat Dialog */}
      <Dialog 
        open={showChatDialog} 
        onClose={() => setShowChatDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: Colors.primary }}>
              {selectedLawyer?.lawyer.picture ? (
                <img src={selectedLawyer.lawyer.picture} alt="Lawyer" />
              ) : (
                <Person />
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedLawyer?.lawyer.first_name} {selectedLawyer?.lawyer.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedLawyer?.lawyer.specialization}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedLawyer?.message}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type your message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChatDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            disabled={!chatMessage.trim()}
            sx={{ bgcolor: Colors.primary }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatterDetail; 