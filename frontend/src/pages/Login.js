import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import API from '../api';
import { AuthContext } from '../Authcontext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please enter both email and password.");
    }

    try {
      console.log('Login form:', form);
      const res = await API.post('/auth/login', form);
      console.log('Login success:', res.data);

      // ✅ Save token directly here
      localStorage.setItem('token', res.data.token); // important!

      // ✅ Update context (optional, still useful for tracking user info)
      login(res.data.user, res.data.token);

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{fontSize: { xs: '1.5rem', md: '2rem' }}} gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{fontSize: {xs: '1rem', md: '1.25rem'}}}>
          Login
        </Button>
      </form>
    </Container>
  );
}
