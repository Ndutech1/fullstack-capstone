import { useState, useContext } from 'react';
import {
  TextField, Button, Typography, Box, Paper, Link as MuiLink, Alert, InputAdornment, IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
import API from '../api';
import { AuthContext } from '../Authcontext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setErrorMsg("Please enter both email and password.");
    }
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 30%, #ff4081 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Sign in to continue your movie experience
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
          >
            Login
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <MuiLink component={Link} to="/forgot-password" underline="hover">
            Forgot Password?
          </MuiLink>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" underline="hover">
              Register
            </MuiLink>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" color="textSecondary">
            By logging in, you agree to our{' '}
            <MuiLink component={Link} to="/terms" underline="hover">
              Terms of Service
            </MuiLink>{' '}
            and{' '}
            <MuiLink component={Link} to="/privacy" underline="hover">
              Privacy Policy
            </MuiLink>.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
