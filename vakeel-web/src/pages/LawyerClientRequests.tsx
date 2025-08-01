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
  Tabs,
  Tab,
  LinearProgress,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';

interface ClientRequest {
  id: string;
  title: string;
  type: string;
  service: string;
  status: string;
  description: string;
  createdAt: string;
  progress: number;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  comments: RequestComment[];
  documents?: string[];
  priority: 'high' | 'medium' | 'low';
}

interface RequestComment {
  id: string;
  author: string;
  authorType: 'lawyer' | 'client' | 'paralegal';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const LawyerClientRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ClientRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Mock data - replace with API call
    const mockRequests: ClientRequest[] = [
      {
        id: '1',
        title: 'Birth Certificate Application',
        type: 'Non-Judicial',
        service: 'Birth Certificate',
        status: 'In Progress',
        description: 'Need assistance with birth certificate application for my child. All documents are ready.',
        createdAt: '2024-02-10',
        progress: 75,
        priority: 'medium',
        client: {
          name: 'Ahmed Khan',
          email: 'ahmed@example.com',
          phone: '+92-300-1234567',
        },
        comments: [
          {
            id: '1',
            author: 'You',
            authorType: 'lawyer',
            message: 'I have reviewed your documents. Everything looks good. I will submit the application tomorrow.',
            timestamp: '2024-02-12 10:30 AM',
            isRead: true,
          },
          {
            id: '2',
            author: 'Ahmed Khan',
            authorType: 'client',
            message: 'Thank you! Please let me know if you need any additional documents.',
            timestamp: '2024-02-12 11:15 AM',
            isRead: true,
          },
        ],
      },
      {
        id: '2',
        title: 'Property Registration',
        type: 'Non-Judicial',
        service: 'Property Documents',
        status: 'Pending',
        description: 'Need help with property registration documents. Property is in Islamabad.',
        createdAt: '2024-02-08',
        progress: 45,
        priority: 'high',
        client: {
          name: 'Fatima Ali',
          email: 'fatima@example.com',
          phone: '+92-300-9876543',
        },
        comments: [
          {
            id: '3',
            author: 'You',
            authorType: 'lawyer',
            message: 'I need to see the property documents first. Can you upload them?',
            timestamp: '2024-02-09 02:30 PM',
            isRead: false,
          },
        ],
      },
      {
        id: '3',
        title: 'Legal Notice for Rent Dispute',
        type: 'Judicial',
        service: 'Legal Notices',
        status: 'Completed',
        description: 'Landlord is not returning security deposit. Need legal notice.',
        createdAt: '2024-01-25',
        progress: 100,
        priority: 'low',
        client: {
          name: 'Muhammad Hassan',
          email: 'hassan@example.com',
          phone: '+92-300-5555555',
        },
        comments: [
          {
            id: '4',
            author: 'You',
            authorType: 'lawyer',
            message: 'Legal notice has been served. Landlord has 15 days to respond.',
            timestamp: '2024-01-30 09:45 AM',
            isRead: true,
          },
          {
            id: '5',
            author: 'You',
            authorType: 'lawyer',
            message: 'Great news! Landlord has agreed to return the deposit. Case closed.',
            timestamp: '2024-02-05 03:20 PM',
            isRead: true,
          },
        ],
      },
      {
        id: '4',
        title: 'Divorce Proceedings',
        type: 'Judicial',
        service: 'Family Law',
        status: 'Pending',
        description: 'Need to file for divorce. Mutual consent. Need guidance on process.',
        createdAt: '2024-02-15',
        progress: 20,
        priority: 'high',
        client: {
          name: 'Ayesha Khan',
          email: 'ayesha@example.com',
          phone: '+92-300-1111111',
        },
        comments: [],
      },
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const handleViewDetails = (request: ClientRequest) => {
    setSelectedRequest(request);
    setOpenDetailDialog(true);
  };

  const handleOpenChat = (request: ClientRequest) => {
    setSelectedRequest(request);
    setOpenChatDialog(true);
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedRequest) return;

    const comment: RequestComment = {
      id: Date.now().toString(),
      author: 'You',
      authorType: 'lawyer',
      message: newComment,
      timestamp: new Date().toLocaleString(),
      isRead: false,
    };

    const updatedRequest = {
      ...selectedRequest,
      comments: [...selectedRequest.comments, comment],
    };

    setRequests(prev => prev.map(req => req.id === selectedRequest.id ? updatedRequest : req));
    setSelectedRequest(updatedRequest);
    setNewComment('');
  };

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: newStatus, progress: newStatus === 'completed' ? 100 : req.progress }
        : req
    ));
  };

  const getUnreadCount = (request: ClientRequest) => {
    return request.comments.filter(comment => !comment.isRead && comment.authorType === 'client').length;
  };

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const inProgress = requests.filter(r => r.status === 'In Progress').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const unread = requests.reduce((sum, r) => sum + getUnreadCount(r), 0);

    return { total, pending, inProgress, completed, unread };
  };

  const stats = getStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Client Requests
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Requests
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color={Colors.primary}>
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: Colors.primary, width: 56, height: 56 }}>
                  <Assignment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color={Colors.error}>
                    {stats.pending}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: Colors.error, width: 56, height: 56 }}>
                  <Pending />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    In Progress
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color={Colors.warning}>
                    {stats.inProgress}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: Colors.warning, width: 56, height: 56 }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Unread Messages
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color={Colors.info}>
                    {stats.unread}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: Colors.info, width: 56, height: 56 }}>
                  <Message />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search requests, clients..."
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
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">
                {filteredRequests.length} of {requests.length} requests
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Messages</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {request.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {request.service}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Created: {request.createdAt}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {request.client.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {request.client.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.client.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.type}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(request.status),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(request.priority),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={request.progress}
                          sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: Colors.gray200,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: Colors.primary,
                            },
                          }}
                        />
                        <Typography variant="body2">
                          {request.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={getUnreadCount(request)} color="error">
                        <Typography variant="body2">
                          {request.comments.length} messages
                        </Typography>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(request)}
                          sx={{ color: Colors.primary }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenChat(request)}
                          sx={{ color: Colors.primary }}
                        >
                          <Chat />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Request Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedRequest.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {selectedRequest.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Client
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.client.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedRequest.client.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedRequest.client.phone}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Type & Service
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.type} • {selectedRequest.service}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedRequest.status}
                    sx={{
                      backgroundColor: getStatusColor(selectedRequest.status),
                      color: 'white',
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Priority
                  </Typography>
                  <Chip
                    label={selectedRequest.priority}
                    sx={{
                      backgroundColor: getPriorityColor(selectedRequest.priority),
                      color: 'white',
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.createdAt}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Progress
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.progress}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
          {selectedRequest && (
            <Button
              variant="contained"
              onClick={() => {
                setOpenDetailDialog(false);
                handleOpenChat(selectedRequest);
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
            Chat - {selectedRequest?.title}
          </Typography>
          {selectedRequest && (
            <Typography variant="body2" color="textSecondary">
              Client: {selectedRequest.client.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
                <List>
                  {selectedRequest.comments.map((comment, index) => (
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
                      {index < selectedRequest.comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type your response..."
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

export default LawyerClientRequests; 