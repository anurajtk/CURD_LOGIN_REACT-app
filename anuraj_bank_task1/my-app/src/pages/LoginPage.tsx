import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Checkbox
} from '@mui/material';
import { validateUsername, validatePassword } from '../utils/helper';
import { loginApiCall } from '../services/loginApiCall';
import { useNavigate } from 'react-router-dom';
import * as Labels from '../utils/constants';

const LoginPage: React.FC = () => {
  // State declarations
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate the username and password
    const usernameError = validateUsername(email);
    const passwordError = validatePassword(password);

    // If there are validation errors, display them
    if (usernameError && passwordError) {
      setError(`${usernameError} ${passwordError}`);
      return;
    }

    // If only one validation fails, set the respective error
    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (passwordError) {
      setError(passwordError);
      return;
    }

    // If validation passes, proceed with form submission (API call)
    try {
      const response = await loginApiCall(email, password);  // Use the loginApiCall function
      // Store the JWT token in localStorage or sessionStorage
      if(response.status=='200'){
        sessionStorage.setItem('authToken', response.authToken);
        setError('');

        // Redirect to the dashboard after successful login
        navigate('/dashboard');

      }else if(response.status=='401'){
        setError(Labels.ERROR_INVALID_CREDENTIAL);

      }

      
    } catch (err:any) {
      setError(Labels.ERROR_INVALID_CREDENTIAL);
    }
  };

  return (
    <div style={{ backgroundColor: '#024dad', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container component="main" maxWidth="md">
        <Grid container spacing={0} justifyContent="center">
          <Grid item xs={6} sx={{
            display: 'flex',
            width: '100%' // Example background
          }}>
            <Paper elevation={6} sx={{ padding: 3, width: '100%', backgroundColor: '#368ef7',borderRadius:0 }}>
              <Typography variant="h5" align="center" color="common.white" gutterBottom>
                {Labels.WELCOME}
              </Typography>
              <Typography variant="body2" color="common.white">
                {Labels.ONLINE_HELP}
              </Typography>
              <Grid container justifyContent="left" sx={{ marginTop: 2, marginLeft: 2 }}>
                <Grid item>
                  <Typography variant="body2" color="common.white">
                    <Checkbox disabled checked />{Labels.SECURE_RELIABLE}
                  </Typography>
                  <Typography variant="body2" color="common.white">
                    <Checkbox disabled checked />{Labels.YOUR_GRAMA}
                  </Typography>
                  <Typography variant="body2" color="common.white">
                    <Checkbox disabled checked />{Labels.FASTER_OTHERS}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={6} sx={{ padding: 3, borderRadius:0 }}>
              <Typography variant="h5" align="center" gutterBottom>
              {Labels.LOGIN}
              </Typography>
              <form onSubmit={handleSubmit}>
                {error && (
                  <Typography color="error" variant="body2" align="center" gutterBottom>
                    {error}
                  </Typography>
                )}
                <TextField
                  label="User"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  type="text"
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  {Labels.LOGIN}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default LoginPage;
