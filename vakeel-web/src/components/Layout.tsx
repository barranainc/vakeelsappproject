import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Cases,
  People,
  Chat,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  Assignment,
  Description,
  CalendarToday,
  Gavel,
  PostAdd,
  ListAlt,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../assets/styles/colors';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    // Mock unread chat count - replace with actual API call
    const unreadChatCount = 3; // This should come from API

    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Cases', icon: <Cases />, path: '/cases' },
      { 
        text: 'Chat', 
        icon: unreadChatCount > 0 ? (
          <Badge badgeContent={unreadChatCount} color="error">
            <Chat />
          </Badge>
        ) : <Chat />, 
        path: '/chat' 
      },
      { text: 'Settings', icon: <Settings />, path: '/settings' },
    ];

    if (user?.user_type === 'client') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Post Matter', icon: <Gavel />, path: '/post-matter' },
        { text: 'My Matters', icon: <Assignment />, path: '/my-matters' },
        { text: 'Post Request', icon: <PostAdd />, path: '/add-request-1' },
        { text: 'My Requests', icon: <ListAlt />, path: '/my-requests' },
        { text: 'My Lawyers', icon: <People />, path: '/my-lawyers', alert: 'My Lawyers page is coming soon!' },
        { 
          text: 'Chat', 
          icon: unreadChatCount > 0 ? (
            <Badge badgeContent={unreadChatCount} color="error">
              <Chat />
            </Badge>
          ) : <Chat />, 
          path: '/chat' 
        },
        { text: 'Documents', icon: <Description />, path: '/documents', alert: 'Documents page is coming soon!' },
        { text: 'Notifications', icon: <Notifications />, path: '/notifications', alert: 'Notifications page is coming soon!' },
        { text: 'Settings', icon: <Settings />, path: '/settings', alert: 'Settings page is coming soon!' },
      ];
    }

    if (user?.user_type === 'lawyer') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Client Matters', icon: <Gavel />, path: '/lawyer-matters' },
        { text: 'Client Requests', icon: <Assignment />, path: '/client-requests' },
        { text: 'Cases', icon: <Cases />, path: '/cases' },
        { text: 'Clients', icon: <People />, path: '/clients', alert: 'Clients page is coming soon!' },
        { 
          text: 'Chat', 
          icon: unreadChatCount > 0 ? (
            <Badge badgeContent={unreadChatCount} color="error">
              <Chat />
            </Badge>
          ) : <Chat />, 
          path: '/chat' 
        },
        { text: 'Documents', icon: <Description />, path: '/documents', alert: 'Documents page is coming soon!' },
        { text: 'Calendar', icon: <CalendarToday />, path: '/calendar', alert: 'Calendar page is coming soon!' },
        { text: 'Team Management', icon: <People />, path: '/team', alert: 'Team Management page is coming soon!' },
        { text: 'Settings', icon: <Settings />, path: '/settings', alert: 'Settings page is coming soon!' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.primaryDark} 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px !important',
        }}
      >
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          Vakeel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                if (item.alert) {
                  alert(item.alert);
                } else {
                  navigate(item.path);
                }
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: Colors.primaryLight,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: Colors.primaryLight,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: Colors.textPrimary,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Chat Button with Notification Badge */}
            <IconButton 
              color="inherit"
              onClick={() => navigate('/chat')}
              sx={{ 
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Badge badgeContent={3} color="error">
                <Chat />
              </Badge>
            </IconButton>
            
            {/* Notifications Button */}
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: Colors.primary }}>
                {user?.first_name?.charAt(0) || <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 