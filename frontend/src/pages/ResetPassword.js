import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import API from '../api';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleReset = async () => {
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setMsg('Password reset successful, please login.');
    } catch {
      setMsg('Invalid or expired token.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Reset Password</Typography>
      <TextField label="New Password" type="password" fullWidth sx={{ my: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" onClick={handleReset}>Reset Password</Button>
      {msg && <Alert sx={{ mt: 2 }}>{msg}</Alert>}
    </Container>
  );
}
