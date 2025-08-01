import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  School,
  Work,
  LocationOn,
  Star,
  Business,
  Description,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

interface LawyerDetails {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  picture?: string;
  lawyer_details: {
    designation: string;
    qualifications: string;
    station: string;
    years_of_experience: number;
    area_of_expertise: string;
    office_address: string;
    council_id: string;
    cnic_number: string;
  };
  matterCount: number;
  casesCount: number;
}

const LawyerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [lawyer, setLawyer] = useState<LawyerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await api.get(`/users/profile/${id}`);
        // setLawyer(response.data);
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLawyer({
          _id: id || '1',
          first_name: 'Sarah',
          last_name: 'Ahmed',
          email: 'sarah.ahmed@lawfirm.com',
          phone: '+92-300-1234567',
          picture: '',
          lawyer_details: {
            designation: 'Senior Advocate',
            qualifications: 'LLB, LLM, Bar-at-Law',
            station: 'High Court',
            years_of_experience: 15,
            area_of_expertise: 'Criminal Law, Family Law, Corporate Law',
            office_address: '123 Legal Street, Blue Area, Islamabad',
            council_id: 'HC-2023-001',
            cnic_number: '35202-1234567-8',
          },
          matterCount: 45,
          casesCount: 120,
        });
      } catch (error) {
        console.error('Error fetching lawyer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLawyerProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Breadcrumbs items={[
          { label: 'Chat', path: '/chat' },
          { label: 'Lawyer Profile', current: true }
        ]} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width={200} height={40} sx={{ mt: 2 }} />
          <Skeleton variant="text" width={150} height={30} />
          <Skeleton variant="text" width={180} height={30} />
        </Box>
      </Box>
    );
  }

  if (!lawyer) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Lawyer not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs items={[
        { label: 'Chat', path: '/chat' },
        { label: 'Lawyer Profile', current: true }
      ]} />
      
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Lawyer Profile
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
                {lawyer.picture ? (
                  <img src={lawyer.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Person sx={{ fontSize: '3rem' }} />
                )}
              </Avatar>
              
              <Box>
                <Typography variant="h4" fontWeight="bold" color={Colors.textPrimary}>
                  {lawyer.first_name} {lawyer.last_name}
                </Typography>
                <Typography variant="h6" color={Colors.secondary} fontWeight="semibold">
                  {lawyer.lawyer_details.designation}
                </Typography>
                <Typography variant="body1" color={Colors.textSecondary}>
                  {lawyer.lawyer_details.qualifications}
                </Typography>
              </Box>

              {lawyer.lawyer_details.station && (
                <Chip
                  icon={<LocationOn />}
                  label={lawyer.lawyer_details.station}
                  sx={{
                    bgcolor: `${Colors.primary}26`,
                    color: Colors.primary,
                    border: `1px solid ${Colors.primary}`,
                    fontWeight: 'medium',
                  }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: `${Colors.primary}26` }}>
            <Typography variant="h3" fontWeight="bold" color={Colors.primary}>
              {lawyer.matterCount}
            </Typography>
            <Typography variant="body1" color={Colors.textSecondary}>
              Matters Responded
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: `${Colors.secondary}26` }}>
            <Typography variant="h3" fontWeight="bold" color={Colors.secondary}>
              {lawyer.lawyer_details.years_of_experience}+
            </Typography>
            <Typography variant="body1" color={Colors.textSecondary}>
              Years of Experience
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: `${Colors.gray200}` }}>
            <Typography variant="h3" fontWeight="bold" color={Colors.gray700}>
              {lawyer.casesCount}
            </Typography>
            <Typography variant="body1" color={Colors.textSecondary}>
              Cases Covered
            </Typography>
          </Card>
        </Grid>

        {/* Professional Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Work color="primary" />
              Area of Expertise
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color={Colors.textSecondary}>
              {lawyer.lawyer_details.area_of_expertise}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business color="primary" />
              Office Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color={Colors.textSecondary}>
              {lawyer.lawyer_details.office_address}
            </Typography>
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
                  <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary} sx={{ minWidth: 80 }}>
                    Email:
                  </Typography>
                  <Typography variant="body1">
                    {lawyer.email}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary} sx={{ minWidth: 80 }}>
                    Phone:
                  </Typography>
                  <Typography variant="body1">
                    {lawyer.phone}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary} sx={{ minWidth: 80 }}>
                    Council ID:
                  </Typography>
                  <Typography variant="body1">
                    {lawyer.lawyer_details.council_id}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" color={Colors.textSecondary} sx={{ minWidth: 80 }}>
                    CNIC:
                  </Typography>
                  <Typography variant="body1">
                    {lawyer.lawyer_details.cnic_number}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LawyerProfile; 