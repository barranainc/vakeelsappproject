import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Colors } from '../assets/styles/colors';

interface BreadcrumbItem {
  label: string;
  path?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <MuiBreadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          component="button"
          variant="body2"
          onClick={() => handleClick('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: Colors.primary,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: 16 }} />
          Dashboard
        </Link>
        {items.map((item, index) => (
          <Box key={index}>
            {item.current ? (
              <Typography 
                variant="body2" 
                color="text.primary"
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            ) : (
              <Link
                component="button"
                variant="body2"
                onClick={() => handleClick(item.path)}
                sx={{
                  color: Colors.primary,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {item.label}
              </Link>
            )}
          </Box>
        ))}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs; 