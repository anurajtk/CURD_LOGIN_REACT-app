import React from 'react';
import { AppBar, Box, Toolbar, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook for routing
import UserTable from '../componets/UserTable';
import * as Labels from '../utils/constants';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    // Remove the authToken from sessionStorage or localStorage
    sessionStorage.removeItem('authToken');  // or localStorage.removeItem('authToken');

    // Redirect the user to the Login page
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#024dad' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {Labels.DASHBOARD}
          </Typography>
          {/* Logout Button */}
          <Button color="inherit" onClick={handleLogout}>
            {Labels.LOGOUT}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, paddingTop: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={0}>
            {/* Example Content */}
            <Grid item xs={12}>
              <Paper sx={{ padding: 0 }}>
                <UserTable />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#024dad', padding: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {Labels.FOOTER_TEXT}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
