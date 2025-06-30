import { useState, useContext } from 'react';
import {
  TextField, Button, Container, Typography, Box, Paper, InputAdornment,
  IconButton, Alert, Link as MuiLink,
} from '@mui/material';
import { AccountCircle, Email, Lock, Person } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../Authcontext';

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      return setErrorMsg('Please fill in all fields.');
    }

    try {
      const res = await API.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
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
      <Paper elevation={6} sx={{ p: 4, maxWidth: 450, width: '100%', borderRadius: 3 }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Create Your Account
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Join us and start your movie journey!
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
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
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Lock /> : <Lock />}
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
            Register
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" underline="hover">
              Login here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
