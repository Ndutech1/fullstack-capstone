import { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import API from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    try {
      await API.post('/auth/forgot-password', { email });
      setMsg('Check your email for reset link');
    } catch {
      setMsg('Failed to send reset link');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Forgot Password</Typography>
      <TextField label="Email" fullWidth sx={{ my: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button variant="contained" onClick={handleSubmit}>Send Reset Link</Button>
      {msg && <Alert sx={{ mt: 2 }}>{msg}</Alert>}
    </Container>
  );
}
