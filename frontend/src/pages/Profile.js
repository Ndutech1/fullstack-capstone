import React, { useContext } from 'react';
import { AuthContext } from '../Authcontext';
import { Button, Typography, Container } from '@mui/material';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Typography>Name: {user.name}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Button onClick={logout} variant="outlined" sx={{ mt: 2 }}>Logout</Button>
    </Container>
  );
}
