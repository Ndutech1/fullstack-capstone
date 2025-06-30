import { useEffect, useState, useContext } from 'react';
import API from '../api';
import {
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, Avatar, Button,
  TextField, Paper, Divider, Alert
} from '@mui/material';
import { AuthContext } from '../Authcontext';
import EditIcon from '@mui/icons-material/Edit';

export default function Profile() {
  const [data, setData] = useState(null);
  const { user, login } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedImage, setUpdatedImage] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/me');
        setData(res.data);
        setUpdatedName(res.data.user.name);
        setUpdatedImage(res.data.user.image || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  const { user: userInfo, favorites = [], watchlist = [], reviews = [] } = data;

  const handleUpdate = async () => {
    try {
      const res = await API.put('/users/me', {
        name: updatedName,
        image: updatedImage,
      });
      setData({ ...data, user: res.data });
      login(res.data, localStorage.getItem('token'));
      setEditMode(false);
      setMsg('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMsg('Failed to update profile');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={userInfo.image || `https://ui-avatars.com/api/?name=${userInfo.username}`}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5">{userInfo.username}</Typography>
            <Typography color="textSecondary">{userInfo.email}</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ ml: 'auto' }}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit'}
          </Button>
        </Box>

        {editMode && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={updatedName}
              sx={{ my: 1 }}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Profile Image URL"
              value={updatedImage}
              sx={{ my: 1 }}
              onChange={(e) => setUpdatedImage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 1 }}>
              Save Changes
            </Button>
          </Box>
        )}

        {msg && <Alert sx={{ mt: 2 }}>{msg}</Alert>}
      </Paper>

      {/* Favorites Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Your Favorites</Typography>
        {favorites.length === 0 ? (
          <Typography>No favorite movies yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {favorites.map((movie, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ m: 1 }}>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    sx={{ height: { xs: 200, md: 300 } }}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography>{movie.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Watchlist Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Your Watchlist</Typography>
        {watchlist.length === 0 ? (
          <Typography>No movies in your watchlist.</Typography>
        ) : (
          <Grid container spacing={2}>
            {watchlist.map((movie, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ m: 1 }}>
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    sx={{ height: { xs: 200, md: 300 } }}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography>{movie.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Your Reviews</Typography>
        {reviews.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          reviews.map((rev) => (
            <Box
              key={rev._id}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2">{rev.movieTitle}</Typography>
              <Typography variant="body2">
                ⭐ {rev.rating} — {rev.text}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
}
