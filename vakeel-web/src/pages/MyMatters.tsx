import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Chat,
  Message,
  Assignment,
  Description,
  Gavel,
  Clear,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';

interface LegalMatter {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  status: string;
  description: string;
  createdAt: string;
  progress: number;
  lawyer?: string;
  lawyerId?: string;
  comments: MatterComment[];
  urgency: 'high' | 'medium' | 'low';
  case_number?: string;
  opposing_party: string;
  court?: string;
}

interface MatterComment {
  id: string;
  author: string;
  authorType: 'lawyer' | 'client' | 'paralegal';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const MyMatters: React.FC = () => {
  const navigate = useNavigate();
  const [matters, setMatters] = useState<LegalMatter[]>([]);
  const [filteredMatters, setFilteredMatters] = useState<LegalMatter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMatter, setSelectedMatter] = useState<LegalMatter | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    const mockMatters: LegalMatter[] = [
      {
        id: '1',
        title: 'Property Dispute with Neighbor',
        category: 'Civil Law',
        subcategory: 'Property Disputes',
        status: 'In Progress',
        description: 'Neighbor is encroaching on my property boundary. Need legal assistance to resolve this dispute.',
        createdAt: '2024-02-10',
        progress: 75,
        urgency: 'medium',
        opposing_party: 'Mr. Ali Hassan',
        court: 'District Court Islamabad',
        lawyer: 'Adv. Sarah Ahmed',
        lawyerId: 'lawyer1',
        comments: [
          {
            id: '1',
            author: 'Adv. Sarah Ahmed',
            authorType: 'lawyer',
            message: 'I have reviewed your case. We need to file a boundary dispute petition. Can you provide the property documents?',
            timestamp: '2024-02-12 10:30 AM',
            isRead: true,
          },
          {
            id: '2',
            author: 'You',
            authorType: 'client',
            message: 'I have all the property documents ready. When can we file the petition?',
            timestamp: '2024-02-12 11:15 AM',
            isRead: true,
          },
        ],
      },
      {
        id: '2',
        title: 'Employment Contract Dispute',
        category: 'Labor Law',
        subcategory: 'Employment Contracts',
        status: 'Pending',
        description: 'Employer is not paying overtime as per contract. Need legal advice on how to proceed.',
        createdAt: '2024-02-08',
        progress: 45,
        urgency: 'high',
        opposing_party: 'ABC Company Ltd.',
        lawyer: 'Adv. Muhammad Hassan',
        lawyerId: 'lawyer2',
        comments: [
          {
            id: '3',
            author: 'Adv. Muhammad Hassan',
            authorType: 'lawyer',
            message: 'This is a clear violation of labor laws. We should file a complaint with the labor court.',
            timestamp: '2024-02-09 02:30 PM',
            isRead: false,
          },
        ],
      },
      {
        id: '3',
        title: 'Divorce Proceedings',
        category: 'Family Law',
        subcategory: 'Divorce',
        status: 'Completed',
        description: 'Mutual consent divorce. All terms have been agreed upon.',
        createdAt: '2024-01-25',
        progress: 100,
        urgency: 'low',
        opposing_party: 'Spouse',
        court: 'Family Court Lahore',
        lawyer: 'Adv. Ayesha Khan',
        lawyerId: 'lawyer3',
        comments: [
          {
            id: '4',
            author: 'Adv. Ayesha Khan',
            authorType: 'lawyer',
            message: 'Divorce decree has been issued. The matter is now closed.',
            timestamp: '2024-01-30 09:45 AM',
            isRead: true,
          },
        ],
      },
    ];

    setMatters(mockMatters);
    setFilteredMatters(mockMatters);
  }, []);

  useEffect(() => {
    let filtered = matters;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(matter =>
        matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(matter => matter.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredMatters(filtered);
  }, [searchTerm, statusFilter, matters]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.success;
      case 'in progress':
        return Colors.warning;
      case 'pending':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.gray500;
    }
  };

  const handleViewDetails = (matter: LegalMatter) => {
    // Navigate to the detailed matter view
    navigate(`/matter-detail/${matter.id}`);
  };

  const handleOpenChat = (matter: LegalMatter) => {
    setSelectedMatter(matter);
    setOpenChatDialog(true);
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedMatter) return;

    const comment: MatterComment = {
      id: Date.now().toString(),
      author: 'You',
      authorType: 'client',
      message: newComment,
      timestamp: new Date().toLocaleString(),
      isRead: false,
    };

    const updatedMatter = {
      ...selectedMatter,
      comments: [...selectedMatter.comments, comment],
    };

    setMatters(prev => prev.map(matter => matter.id === selectedMatter.id ? updatedMatter : matter));
    setSelectedMatter(updatedMatter);
    setNewComment('');
  };

  const getUnreadCount = (matter: LegalMatter) => {
    return matter.comments.filter(comment => !comment.isRead && comment.authorType !== 'client').length;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${Colors.gray50} 0%, ${Colors.background} 100%)` }}>
      {/* Header Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
        color: 'white',
        p: 4,
        borderRadius: '0 0 24px 24px',
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            My Legal Matters
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Track and manage your legal cases
          </Typography>
          
          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ 
              background: 'rgba(255,255,255,0.2)', 
              p: 2, 
              borderRadius: 2,
              minWidth: 120
            }}>
              <Typography variant="h4" fontWeight="bold">
                {matters.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Matters
              </Typography>
            </Box>
            <Box sx={{ 
              background: 'rgba(255,255,255,0.2)', 
              p: 2, 
              borderRadius: 2,
              minWidth: 120
            }}>
              <Typography variant="h4" fontWeight="bold">
                {matters.filter(m => m.lawyer).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Active Cases
              </Typography>
            </Box>
            <Box sx={{ 
              background: 'rgba(255,255,255,0.2)', 
              p: 2, 
              borderRadius: 2,
              minWidth: 120
            }}>
              <Typography variant="h4" fontWeight="bold">
                {matters.reduce((sum, m) => sum + m.comments.length, 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Messages
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Search and Filters Section */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search your matters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: Colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
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
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterList sx={{ color: Colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  background: Colors.gray50,
                  borderRadius: 2
                }}>
                  <Typography variant="body2" color="textSecondary">
                    {filteredMatters.length} of {matters.length}
                  </Typography>
                  <Chip 
                    label={`${Math.round((filteredMatters.length / matters.length) * 100)}%`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    sx={{
                      background: Colors.gray100,
                      '&:hover': {
                        background: Colors.gray200,
                      }
                    }}
                    title="Clear filters"
                  >
                    <Clear sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    onClick={() => navigate('/post-matter')}
                    sx={{
                      background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
                      color: 'white',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${Colors.primaryDark} 0%, ${Colors.primary} 100%)`,
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                    title="Post new matter"
                  >
                    <Add sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Matters Cards - Enhanced Interactive Design */}
      <Box sx={{ px: 3, mb: 4 }}>
        {filteredMatters.length === 0 ? (
          <Card sx={{ 
            textAlign: 'center', 
            p: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ mb: 3 }}>
              <Gavel sx={{ fontSize: 80, color: Colors.gray400, mb: 2 }} />
              <Typography variant="h5" color="textSecondary" gutterBottom>
                No matters found
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by posting your first legal matter'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/post-matter')}
                sx={{
                  background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
                  borderRadius: 2,
                  px: 4,
                  py: 1.5
                }}
              >
                Post Your First Matter
              </Button>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredMatters.map((matter) => (
              <Grid item xs={12} md={6} lg={4} key={matter.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      '& .matter-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                      '& .matter-actions': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      }
                    }
                  }} 
                  onClick={() => handleViewDetails(matter)}
                >
                  <CardContent sx={{ p: 3, position: 'relative' }}>
                    {/* Status Badge */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16, 
                      zIndex: 2 
                    }}>
                      <Chip
                        label={matter.lawyer ? 'Active' : 'Pending'}
                        size="small"
                        sx={{
                          background: matter.lawyer 
                            ? `linear-gradient(135deg, ${Colors.success} 0%, #2E7D32 100%)`
                            : `linear-gradient(135deg, ${Colors.warning} 0%, #F57C00 100%)`,
                          color: 'white',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      />
                    </Box>

                    {/* Card Header - Icon and Title */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      {/* Icon Section */}
                      <Box sx={{ 
                        width: '25%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                      }}>
                        <Avatar 
                          className="matter-icon"
                          sx={{ 
                            background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
                            width: 70, 
                            height: 70,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                        >
                          <Gavel sx={{ fontSize: 35, color: 'white' }} />
                        </Avatar>
                      </Box>
                      
                      {/* Content Section */}
                      <Box sx={{ width: '75%', pl: 2 }}>
                        <Typography 
                          variant="h6" 
                          color={Colors.primary} 
                          fontWeight="bold" 
                          gutterBottom
                          sx={{ 
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {matter.title}
                        </Typography>
                        <Chip
                          label={`${matter.category} / ${matter.subcategory}`}
                          size="small"
                          sx={{
                            background: `linear-gradient(135deg, ${Colors.secondary} 0%, ${Colors.secondaryDark} 100%)`,
                            color: 'white',
                            fontWeight: 'medium',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </Box>
                    
                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      sx={{ 
                        mb: 3,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {matter.description}
                    </Typography>
                    
                    {/* Progress Bar */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Progress
                        </Typography>
                        <Typography variant="caption" color={Colors.primary} fontWeight="bold">
                          {matter.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={matter.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: Colors.gray200,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${Colors.primary} 0%, ${Colors.primaryLight} 100%)`,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                    
                    {/* Footer - Date and Status */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderTop: `2px solid ${Colors.gray100}`,
                      pt: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(matter.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        color={Colors.primary} 
                        fontWeight="bold"
                        sx={{ 
                          background: `${Colors.primary}15`,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        {matter.lawyer ? `${matter.comments.length} Lawyers Responded` : 'In Progress'}
                      </Typography>
                    </Box>

                    {/* Action Buttons - Hidden by default, shown on hover */}
                    <Box 
                      className="matter-actions"
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        opacity: 0,
                        transform: 'translateY(10px)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        gap: 1
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenChat(matter);
                        }}
                        sx={{
                          background: Colors.primary,
                          color: 'white',
                          '&:hover': {
                            background: Colors.primaryDark,
                          }
                        }}
                      >
                        <Badge badgeContent={getUnreadCount(matter)} color="error">
                          <Chat sx={{ fontSize: 16 }} />
                        </Badge>
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(matter);
                        }}
                        sx={{
                          background: Colors.secondary,
                          color: 'white',
                          '&:hover': {
                            background: Colors.secondaryDark,
                          }
                        }}
                      >
                        <Visibility sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Enhanced Floating Action Button */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 24, 
        right: 24, 
        zIndex: 1000 
      }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/post-matter')}
          sx={{
            background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
            borderRadius: '50px',
            px: 4,
            py: 2,
            boxShadow: '0 8px 32px rgba(15, 81, 137, 0.3)',
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            minWidth: 200,
            '&:hover': {
              background: `linear-gradient(135deg, ${Colors.primaryDark} 0%, ${Colors.primary} 100%)`,
              transform: 'translateY(-4px) scale(1.05)',
              boxShadow: '0 12px 40px rgba(15, 81, 137, 0.4)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiButton-startIcon': {
              transition: 'transform 0.3s ease',
            },
            '&:hover .MuiButton-startIcon': {
              transform: 'rotate(90deg)',
            }
          }}
        >
          Post New Matter
        </Button>
      </Box>

      {/* Matter Details Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Matter Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedMatter && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedMatter.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {selectedMatter.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.category} • {selectedMatter.subcategory}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedMatter.status}
                    sx={{
                      backgroundColor: getStatusColor(selectedMatter.status),
                      color: 'white',
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Urgency
                  </Typography>
                  <Chip
                    label={selectedMatter.urgency}
                    sx={{
                      backgroundColor: getUrgencyColor(selectedMatter.urgency),
                      color: 'white',
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Progress
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.progress}%
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Opposing Party
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.opposing_party}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Court
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.court || 'Not specified'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.createdAt}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Assigned Lawyer
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.lawyer || 'Unassigned'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
          {selectedMatter && (
            <Button
              variant="contained"
              onClick={() => {
                setOpenDetailDialog(false);
                handleOpenChat(selectedMatter);
              }}
              sx={{ backgroundColor: Colors.primary }}
            >
              Open Chat
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={openChatDialog} onClose={() => setOpenChatDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Chat - {selectedMatter?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedMatter && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
                <List>
                  {selectedMatter.comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            bgcolor: comment.authorType === 'lawyer' ? Colors.primary : Colors.secondary,
                            width: 40,
                            height: 40,
                          }}>
                            {comment.author.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {comment.author}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {comment.timestamp}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {comment.message}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < selectedMatter.comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  multiline
                  rows={2}
                />
                <Button
                  variant="contained"
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  sx={{ backgroundColor: Colors.primary }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChatDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyMatters; 