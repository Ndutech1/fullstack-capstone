import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../Authcontext';

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
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        gutterBottom
      >
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Login
        </Button>
      </form>

      <Button component={Link} to="/forgot-password" sx={{ mt: 2 }}>
        Forgot Password?
      </Button>
      <Button component={Link} to="/register" sx={{ mt: 2 }}>
        Don't have an account? Register
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        By logging in, you agree to our{' '}
        <Link to="/terms">Terms of Service</Link> and{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        If you encounter any issues, please contact our{' '}
        <Link to="/support">Support Team</Link>.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Need help? Visit our <Link to="/help">Help Center</Link> for FAQs and guides.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        For security tips, check out our{' '}
        <Link to="/security">Security Best Practices</Link>.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Want to stay updated? Subscribe to our{' '}
        <Link to="/newsletter">Newsletter</Link> for the latest news and updates.
      </Typography>
    </Container>
  );
}
