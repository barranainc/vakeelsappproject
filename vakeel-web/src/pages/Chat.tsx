import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  Grid,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Send,
  Search,
  MoreVert,
  AttachFile,
  EmojiEmotions,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
  userType: 'lawyer' | 'client';
  userId: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Fetch contacts from API
    setContacts([
      {
        id: '1',
        name: 'Sarah Ahmed',
        lastMessage: 'When is the next hearing?',
        timestamp: '2:30 PM',
        unreadCount: 2,
        isOnline: true,
        userType: 'lawyer',
        userId: 'lawyer-1',
      },
      {
        id: '2',
        name: 'Ahmed Khan',
        lastMessage: 'Thank you for the update',
        timestamp: '1:45 PM',
        unreadCount: 0,
        isOnline: false,
        userType: 'client',
        userId: 'client-1',
      },
      {
        id: '3',
        name: 'Fatima Ali',
        lastMessage: 'I need to discuss the case details',
        timestamp: '11:20 AM',
        unreadCount: 1,
        isOnline: true,
        userType: 'lawyer',
        userId: 'lawyer-2',
      },
    ]);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      // TODO: Fetch messages for selected contact
      setMessages([
        {
          id: '1',
          sender: selectedContact.name,
          content: 'Hello, how is the case proceeding?',
          timestamp: '2:30 PM',
          isOwn: false,
        },
        {
          id: '2',
          sender: 'You',
          content: 'The case is progressing well. We have a hearing next week.',
          timestamp: '2:32 PM',
          isOwn: true,
        },
        {
          id: '3',
          sender: selectedContact.name,
          content: 'That\'s great! When exactly is the hearing?',
          timestamp: '2:33 PM',
          isOwn: false,
        },
      ]);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileClick = (contact: ChatContact) => {
    if (contact.userType === 'lawyer' && user?.user_type === 'client') {
      // Client can click on lawyer name to view profile
      navigate(`/lawyer-profile/${contact.userId}`);
    } else if (contact.userType === 'client' && user?.user_type === 'lawyer') {
      // Lawyer can click on client name to view profile (limited info)
      navigate(`/client-profile/${contact.userId}`);
    }
    // If same user type, no profile viewing (privacy)
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)' }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Chat
      </Typography>

      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Contacts List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: `1px solid ${Colors.border}` }}>
                <TextField
                  fullWidth
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                />
              </Box>

              <List sx={{ p: 0, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                {filteredContacts.map((contact, index) => (
                  <React.Fragment key={contact.id}>
                    <ListItem
                      button
                      selected={selectedContact?.id === contact.id}
                      onClick={() => setSelectedContact(contact)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: Colors.primaryLight,
                          color: 'white',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: contact.isOnline ? Colors.success : Colors.gray400,
                                border: '2px solid white',
                              }}
                            />
                          }
                        >
                          <Avatar sx={{ bgcolor: Colors.primary }}>
                            {contact.name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {contact.name}
                            </Typography>
                            {contact.unreadCount > 0 && (
                              <Badge
                                badgeContent={contact.unreadCount}
                                color="error"
                                sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem' } }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary" noWrap>
                              {contact.lastMessage}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {contact.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredContacts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${Colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: selectedContact.isOnline ? Colors.success : Colors.gray400,
                            border: '2px solid white',
                          }}
                        />
                      }
                    >
                      <Avatar sx={{ bgcolor: Colors.primary }}>
                        {selectedContact.name.charAt(0)}
                      </Avatar>
                    </Badge>
                    <Box>
                      {/* Clickable name based on user type */}
                      {((selectedContact.userType === 'lawyer' && user?.user_type === 'client') ||
                        (selectedContact.userType === 'client' && user?.user_type === 'lawyer')) ? (
                        <Tooltip title={`Click to view ${selectedContact.userType} profile`}>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold"
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                color: Colors.primary,
                                textDecoration: 'underline',
                              },
                            }}
                            onClick={() => handleProfileClick(selectedContact)}
                          >
                            {selectedContact.name}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="h6" fontWeight="bold">
                          {selectedContact.name}
                        </Typography>
                      )}
                      <Typography variant="body2" color="textSecondary">
                        {selectedContact.isOnline ? 'Online' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: message.isOwn ? Colors.primary : Colors.gray100,
                          color: message.isOwn ? 'white' : 'inherit',
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.7,
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: `1px solid ${Colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <IconButton>
                    <AttachFile />
                  </IconButton>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                  />
                  <IconButton>
                    <EmojiEmotions />
                  </IconButton>
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      backgroundColor: Colors.primary,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: Colors.primaryDark,
                      },
                      '&.Mui-disabled': {
                        backgroundColor: Colors.gray300,
                        color: Colors.gray500,
                      },
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Select a contact to start chatting
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat; 