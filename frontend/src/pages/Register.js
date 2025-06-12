import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import API from '../api';
import { AuthContext } from '../Authcontext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required
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
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
}
