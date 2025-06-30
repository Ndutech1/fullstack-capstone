import { useEffect, useState } from 'react';
import API from '../api';
import {
  Grid, Card, CardMedia, CardContent, Typography, Button, Box, Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get('/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      await API.delete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff4081 30%, #2196f3 90%)',
        py: 5,
      }}
    >
      <Container>
        <Typography
          variant="h4"
          align="center"
          color="white"
          gutterBottom
        >
          My Favorites
        </Typography>

        {favorites.length === 0 ? (
          <Typography align="center" color="white" sx={{ mt: 4 }}>
            No favorite movies yet. Start exploring!
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {favorites.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    m: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <CardMedia
                      component="img"
                      sx={{ height: { xs: 200, md: 300 } }}
                      image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                      alt={movie.title}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {movie.title}
                      </Typography>
                    </CardContent>
                  </Link>
                  <Button
                    onClick={() => handleRemove(movie.id)}
                    startIcon={<DeleteIcon />}
                    color="error"
                    variant="contained"
                    sx={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      mt: 'auto',
                    }}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
