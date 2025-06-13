import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import {
  Container, Typography, Box, Grid, Card, CardMedia, CardContent,
} from '@mui/material';
import { AuthContext } from '../AuthContext';

export default function Profile() {
  const [data, setData] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get('/users/me');
      setData(res.data);
    };
    fetchProfile();
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  const { user: userInfo, favorites, watchlist, reviews } = data;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Welcome, {userInfo.username}</Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Favorites</Typography>
        <Grid container spacing={2}>
          {favorites.map((movie) => (
            <Grid item key={movie.id} xs={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  height="300"
                />
                <CardContent>
                  <Typography>{movie.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Watchlist</Typography>
        <Grid container spacing={2}>
          {watchlist.map((movie) => (
            <Grid item key={movie.id} xs={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  height="300"
                />
                <CardContent>
                  <Typography>{movie.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Your Reviews</Typography>
        {reviews.length === 0 && <Typography>No reviews yet.</Typography>}
        {reviews.map((rev) => (
          <Box key={rev._id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="subtitle2">{rev.movieTitle}</Typography>
            <Typography variant="body2">⭐ {rev.rating} — {rev.text}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
