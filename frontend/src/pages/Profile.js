import { useEffect, useState, useContext } from 'react';
import API from '../api';
import {
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, Avatar, Button,
  TextField, Paper, Divider, Alert, IconButton
} from '@mui/material';
import { AuthContext } from '../Authcontext';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';

export default function Profile() {
  const [data, setData] = useState(null);
  const { user, login } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/me');
        setData(res.data);
        setUpdatedName(res.data.user.name);
        setPreviewURL(res.data.user.image || '');
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
      const formData = new FormData();
      formData.append('name', updatedName);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await API.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={previewURL || `https://ui-avatars.com/api/?name=${userInfo.username}`}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold">{userInfo.username}</Typography>
            <Typography color="textSecondary">{userInfo.email}</Typography>
          </Box>
          <Button
            variant="contained"
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
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ my: 1 }}
            >
              Choose Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {previewURL && (
              <Avatar src={previewURL} sx={{ width: 80, height: 80, my: 1 }} />
            )}
            <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 1 }}>
              Save Changes
            </Button>
          </Box>
        )}

        {msg && <Alert sx={{ mt: 2 }}>{msg}</Alert>}
      </Paper>

      {/* Favorites */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Your Favorites</Typography>
        <Grid container spacing={2}>
          {favorites.length === 0 ? (
            <Typography>No favorite movies yet.</Typography>
          ) : favorites.map((movie, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ m: 1, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  sx={{ height: { xs: 200, md: 300 } }}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">{movie.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Watchlist */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Your Watchlist</Typography>
        <Grid container spacing={2}>
          {watchlist.length === 0 ? (
            <Typography>No movies in your watchlist.</Typography>
          ) : watchlist.map((movie, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ m: 1, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  sx={{ height: { xs: 200, md: 300 } }}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">{movie.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
