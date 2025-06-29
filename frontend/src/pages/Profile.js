import { useEffect, useState, useContext } from 'react';
import API from '../api';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { AuthContext } from '../Authcontext';

export default function Profile() {
  const [data, setData] = useState(null);
  useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/me');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  const { user: userInfo, favorites = [], watchlist = [], reviews = [] } = data;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} gutterBottom>
        Welcome, {userInfo.username}
      </Typography>

      {/* Favorites Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Your Favorites</Typography>
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
                    sx={{height: {xs:200, md:300 }} }
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
        <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }} >Your Watchlist</Typography>
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
                    sx={{height: {xs:200, md: 300 } }}
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
        <Typography variant="h6" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Your Reviews</Typography>
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
              <Typography variant="subtitle2" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{rev.movieTitle}</Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                ⭐ {rev.rating} — {rev.text}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
}
