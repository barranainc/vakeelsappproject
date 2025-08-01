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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Visibility,
  FilterList,
  Chat,
  Message,
  Assignment,
  Description,
  Gavel,
  Person,
  Schedule,
  CheckCircle,
  Pending,
  Reply,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';

interface ClientMatter {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  status: string;
  description: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  urgency: 'high' | 'medium' | 'low';
  case_number?: string;
  opposing_party: string;
  court?: string;
  comments: MatterComment[];
  isAssigned: boolean;
  assignedLawyer?: string;
}

interface MatterComment {
  id: string;
  author: string;
  authorType: 'lawyer' | 'client' | 'paralegal';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const LawyerMatters: React.FC = () => {
  const navigate = useNavigate();
  const [matters, setMatters] = useState<ClientMatter[]>([]);
  const [filteredMatters, setFilteredMatters] = useState<ClientMatter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [selectedMatter, setSelectedMatter] = useState<ClientMatter | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    const mockMatters: ClientMatter[] = [
      {
        id: '1',
        title: 'Property Dispute with Neighbor',
        category: 'Civil Law',
        subcategory: 'Property Disputes',
        status: 'Pending Response',
        description: 'Neighbor is encroaching on my property boundary. Need legal assistance to resolve this dispute. I have all the property documents and survey reports ready.',
        createdAt: '2024-02-10',
        client: {
          id: 'client1',
          name: 'Ahmed Khan',
          email: 'ahmed.khan@email.com',
          phone: '+92-300-1234567',
        },
        urgency: 'medium',
        opposing_party: 'Mr. Ali Hassan',
        court: 'District Court Islamabad',
        isAssigned: false,
        comments: [],
      },
      {
        id: '2',
        title: 'Employment Contract Dispute',
        category: 'Labor Law',
        subcategory: 'Employment Contracts',
        status: 'Assigned',
        description: 'Employer is not paying overtime as per contract. Need legal advice on how to proceed. I have the employment contract and salary slips.',
        createdAt: '2024-02-08',
        client: {
          id: 'client2',
          name: 'Fatima Ali',
          email: 'fatima.ali@email.com',
          phone: '+92-300-2345678',
        },
        urgency: 'high',
        opposing_party: 'ABC Company Ltd.',
        isAssigned: true,
        assignedLawyer: 'Adv. Muhammad Hassan',
        comments: [
          {
            id: '1',
            author: 'Adv. Muhammad Hassan',
            authorType: 'lawyer',
            message: 'This is a clear violation of labor laws. We should file a complaint with the labor court. Can you provide the employment contract and salary slips?',
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
        status: 'In Progress',
        description: 'Mutual consent divorce. All terms have been agreed upon. Need assistance with the legal process.',
        createdAt: '2024-01-25',
        client: {
          id: 'client3',
          name: 'Sara Ahmed',
          email: 'sara.ahmed@email.com',
          phone: '+92-300-3456789',
        },
        urgency: 'low',
        opposing_party: 'Spouse',
        court: 'Family Court Lahore',
        isAssigned: true,
        assignedLawyer: 'Adv. Ayesha Khan',
        comments: [
          {
            id: '2',
            author: 'Adv. Ayesha Khan',
            authorType: 'lawyer',
            message: 'I have prepared the divorce petition. We need to file it in the family court. Are you both available for the court hearing?',
            timestamp: '2024-01-28 10:15 AM',
            isRead: true,
          },
          {
            id: '3',
            author: 'Sara Ahmed',
            authorType: 'client',
            message: 'Yes, we are both available. When is the hearing scheduled?',
            timestamp: '2024-01-28 11:30 AM',
            isRead: true,
          },
        ],
      },
      {
        id: '4',
        title: 'Business Contract Breach',
        category: 'Corporate Law',
        subcategory: 'Contract Disputes',
        status: 'Pending Response',
        description: 'Business partner has breached the partnership agreement. Need legal advice on termination and compensation.',
        createdAt: '2024-02-12',
        client: {
          id: 'client4',
          name: 'Omar Hassan',
          email: 'omar.hassan@email.com',
          phone: '+92-300-4567890',
        },
        urgency: 'high',
        opposing_party: 'Business Partner',
        isAssigned: false,
        comments: [],
      },
    ];

    setMatters(mockMatters);
    setFilteredMatters(mockMatters);
  }, []);

  useEffect(() => {
    let filtered = matters;

    // Apply tab filter
    if (tabValue === 0) {
      // All Matters
      filtered = matters;
    } else if (tabValue === 1) {
      // Pending Response
      filtered = matters.filter(matter => matter.status === 'Pending Response');
    } else if (tabValue === 2) {
      // Assigned
      filtered = matters.filter(matter => matter.status === 'Assigned');
    } else if (tabValue === 3) {
      // In Progress
      filtered = matters.filter(matter => matter.status === 'In Progress');
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(matter =>
        matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matter.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(matter => matter.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredMatters(filtered);
  }, [searchTerm, statusFilter, tabValue, matters]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.success;
      case 'in progress':
        return Colors.warning;
      case 'assigned':
        return Colors.info;
      case 'pending response':
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

  const handleViewDetails = (matter: ClientMatter) => {
    setSelectedMatter(matter);
    setOpenDetailDialog(true);
  };

  const handleOpenChat = (matter: ClientMatter) => {
    setSelectedMatter(matter);
    setOpenChatDialog(true);
  };

  const handleRespond = (matter: ClientMatter) => {
    setSelectedMatter(matter);
    setOpenResponseDialog(true);
  };

  const handleSendResponse = () => {
    if (!responseMessage.trim() || !selectedMatter) return;

    const comment: MatterComment = {
      id: Date.now().toString(),
      author: 'Adv. Sarah Ahmed', // Current lawyer
      authorType: 'lawyer',
      message: responseMessage,
      timestamp: new Date().toLocaleString(),
      isRead: false,
    };

    const updatedMatter = {
      ...selectedMatter,
      status: 'Assigned',
      isAssigned: true,
      assignedLawyer: 'Adv. Sarah Ahmed',
      comments: [...selectedMatter.comments, comment],
    };

    setMatters(prev => prev.map(matter => matter.id === selectedMatter.id ? updatedMatter : matter));
    setSelectedMatter(updatedMatter);
    setResponseMessage('');
    setOpenResponseDialog(false);
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedMatter) return;

    const comment: MatterComment = {
      id: Date.now().toString(),
      author: 'Adv. Sarah Ahmed', // Current lawyer
      authorType: 'lawyer',
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

  const getUnreadCount = (matter: ClientMatter) => {
    return matter.comments.filter(comment => !comment.isRead && comment.authorType === 'client').length;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Client Matters
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Respond to client-posted legal matters
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: Colors.primary, color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {matters.filter(m => m.status === 'Pending Response').length}
              </Typography>
              <Typography variant="body2">Pending Response</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: Colors.warning, color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {matters.filter(m => m.status === 'Assigned').length}
              </Typography>
              <Typography variant="body2">Assigned</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: Colors.info, color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {matters.filter(m => m.status === 'In Progress').length}
              </Typography>
              <Typography variant="body2">In Progress</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: Colors.success, color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold">
                {matters.filter(m => m.status === 'Completed').length}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`All Matters (${matters.length})`} />
            <Tab label={`Pending Response (${matters.filter(m => m.status === 'Pending Response').length})`} />
            <Tab label={`Assigned (${matters.filter(m => m.status === 'Assigned').length})`} />
            <Tab label={`In Progress (${matters.filter(m => m.status === 'In Progress').length})`} />
          </Tabs>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search matters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              >
                <option value="all">All Status</option>
                <option value="pending response">Pending Response</option>
                <option value="assigned">Assigned</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                {filteredMatters.length} of {matters.length} matters
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Matters Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matter</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Urgency</TableCell>
                  <TableCell>Messages</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMatters.map((matter) => (
                  <TableRow key={matter.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {matter.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {matter.category} • {matter.subcategory}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Posted: {matter.createdAt}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {matter.client.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {matter.client.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {matter.client.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={matter.category}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={matter.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(matter.status),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={matter.urgency}
                        size="small"
                        sx={{
                          backgroundColor: getUrgencyColor(matter.urgency),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={getUnreadCount(matter)} color="error">
                        <Typography variant="body2">
                          {matter.comments.length} messages
                        </Typography>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(matter)}
                          sx={{ color: Colors.primary }}
                        >
                          <Visibility />
                        </IconButton>
                        {matter.isAssigned ? (
                          <IconButton
                            size="small"
                            onClick={() => handleOpenChat(matter)}
                            sx={{ color: Colors.primary }}
                          >
                            <Chat />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => handleRespond(matter)}
                            sx={{ color: Colors.success }}
                          >
                            <Reply />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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
                    Client
                  </Typography>
                  <Typography variant="body1">
                    {selectedMatter.client.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedMatter.client.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedMatter.client.phone}
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
                    Posted
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
                    {selectedMatter.assignedLawyer || 'Unassigned'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
          {selectedMatter && !selectedMatter.isAssigned && (
            <Button
              variant="contained"
              onClick={() => {
                setOpenDetailDialog(false);
                handleRespond(selectedMatter);
              }}
              sx={{ backgroundColor: Colors.success }}
            >
              Respond to Matter
            </Button>
          )}
          {selectedMatter && selectedMatter.isAssigned && (
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

      {/* Response Dialog */}
      <Dialog open={openResponseDialog} onClose={() => setOpenResponseDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Respond to Matter
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedMatter && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedMatter.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {selectedMatter.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Your Response
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Provide your legal advice and next steps..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponseDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendResponse}
            disabled={!responseMessage.trim()}
            sx={{ backgroundColor: Colors.success }}
          >
            Send Response
          </Button>
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

export default LawyerMatters; 