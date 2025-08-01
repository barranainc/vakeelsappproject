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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { Colors } from '../assets/styles/colors';

interface Case {
  id: string;
  title: string;
  caseNumber: string;
  client: string;
  category: string;
  status: string;
  nextHearing: string;
  lawyer: string;
  progress: number;
}

const Cases: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  useEffect(() => {
    // TODO: Fetch cases from API
    setCases([
      {
        id: '1',
        title: 'Criminal Case vs. State',
        caseNumber: 'CR-2024-001',
        client: 'Ahmed Khan',
        category: 'Criminal',
        status: 'Active',
        nextHearing: '2024-02-15',
        lawyer: 'Adv. Sarah Ahmed',
        progress: 75,
      },
      {
        id: '2',
        title: 'Civil Suit - Property Dispute',
        caseNumber: 'CS-2024-002',
        client: 'Fatima Ali',
        category: 'Civil',
        status: 'Pending',
        nextHearing: '2024-02-20',
        lawyer: 'Adv. Muhammad Hassan',
        progress: 45,
      },
      {
        id: '3',
        title: 'Family Law - Divorce',
        caseNumber: 'FL-2024-003',
        client: 'Muhammad Hassan',
        category: 'Family',
        status: 'Active',
        nextHearing: '2024-02-18',
        lawyer: 'Adv. Ayesha Khan',
        progress: 60,
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'closed':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'criminal':
        return Colors.error;
      case 'civil':
        return Colors.primary;
      case 'family':
        return Colors.secondary;
      default:
        return Colors.gray500;
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    setCases(cases.filter(c => c.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Cases Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: Colors.primary }}
        >
          Add New Case
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search cases..."
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
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
              >
                Advanced Filter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: Colors.gray100 }}>
              <TableCell><strong>Case Number</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Next Hearing</strong></TableCell>
              <TableCell><strong>Lawyer</strong></TableCell>
              <TableCell><strong>Progress</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color={Colors.primary}>
                    {caseItem.caseNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {caseItem.title}
                  </Typography>
                </TableCell>
                <TableCell>{caseItem.client}</TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColor(caseItem.category),
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(caseItem.status),
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell>{caseItem.nextHearing}</TableCell>
                <TableCell>{caseItem.lawyer}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          backgroundColor: Colors.gray200,
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${caseItem.progress}%`,
                            height: '100%',
                            backgroundColor: Colors.primary,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {caseItem.progress}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(caseItem)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(caseItem.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Case</DialogTitle>
        <DialogContent>
          {/* TODO: Add edit form */}
          <Typography>Edit form will be implemented here</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: Colors.primary }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cases; 