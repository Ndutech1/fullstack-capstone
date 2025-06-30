import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import API from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setError('');
    setMsg('');
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setMsg('✅ Check your email for the password reset link.');
    } catch (err) {
      setError('❌ Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Forgot Password
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Enter your registered email. We'll send you a secure link to reset your password.
      </Typography>

      <TextField
        label="Email Address"
        type="email"
        fullWidth
        required
        variant="outlined"
        sx={{ mb: 3 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
        </Button>
      </Box>

      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Container>
  );
}
