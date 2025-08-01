import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

interface ClientDetails {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  picture?: string;
  address?: string;
}

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await api.get(`/users/profile/${id}`);
        // setClient(response.data);
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClient({
          _id: id || '1',
          first_name: 'Ahmed',
          last_name: 'Khan',
          email: 'ahmed.khan@email.com',
          phone: '+92-300-1234567',
          picture: '',
          address: '456 Client Street, Islamabad',
        });
      } catch (error) {
        console.error('Error fetching client profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumbs items={[
          { label: 'Chat', path: '/chat' },
          { label: 'Client Profile', current: true }
        ]} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width={200} height={40} sx={{ mt: 2 }} />
          <Skeleton variant="text" width={150} height={30} />
        </Box>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Client not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs items={[
        { label: 'Chat', path: '/chat' },
        { label: 'Client Profile', current: true }
      ]} />
      
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Client Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: Colors.primary,
                  fontSize: '3rem',
                }}
              >
                {client.picture ? (
                  <img src={client.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Person sx={{ fontSize: '3rem' }} />
                )}
              </Avatar>
              
              <Box>
                <Typography variant="h4" fontWeight="bold" color={Colors.textPrimary}>
                  {client.first_name} {client.last_name}
                </Typography>
                <Typography variant="body1" color={Colors.textSecondary}>
                  Client
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Email color="action" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary}>
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {client.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Phone color="action" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary}>
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {client.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              {client.address && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LocationOn color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary}>
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {client.address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>

        {/* Note about Privacy */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, bgcolor: Colors.gray50 }}>
            <Typography variant="body2" color={Colors.textSecondary} sx={{ fontStyle: 'italic' }}>
              Note: Client information is limited for privacy reasons. Only essential contact details are displayed to lawyers for case communication purposes.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientProfile; 