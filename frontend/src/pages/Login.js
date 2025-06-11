import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import API from '../api';
import { AuthContext } from '../Authcontext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext); // make sure it's named `login` in AuthContext
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
      console.log('Login form:', form); // debug
      const res = await API.post('/auth/login', form);
      console.log('Login success:', res.data); // debug
      login(res.data.user, res.data.token); // function from context
      navigate('/');
    } catch (err) {
      console.error('Login error:', err); // debug
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
}
