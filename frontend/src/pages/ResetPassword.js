import { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Link
} from '@mui/material';
import API from '../api';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      setError('Both fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setMsg('');
    setLoading(true);

    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setMsg('✅ Password reset successful. You can now login.');
    } catch {
      setError('❌ Invalid or expired reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Reset Your Password
      </Typography>

      <TextField
        label="New Password"
        type="password"
        fullWidth
        required
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        required
        sx={{ mb: 3 }}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
        </Button>
      </Box>

      {msg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {msg} <Link component={RouterLink} to="/login">Login now</Link>
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Container>
  );
}
