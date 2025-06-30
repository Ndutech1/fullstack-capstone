import { useEffect, useState } from 'react';
import API from '../api';
import { getRecommendations } from '../tmdb';
import {
  Grid, Card, CardMedia, CardContent, Typography, Container, Box, Button, CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Recommendations() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await API.get('/favorites');
      if (res.data.length > 0) {
        const lastLiked = res.data[res.data.length - 1];
        const recs = await getRecommendations(lastLiked.id);
        setMovies(recs.slice(0, 12));
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e88e5 30%, #ff4081 90%)',
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
          Recommended for You
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={fetchRecommendations}
          >
            Refresh Recommendations
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : movies.length === 0 ? (
          <Typography align="center" color="white" sx={{ mt: 4 }}>
            No recommendations yet. Like a movie to get suggestions!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    m: 1,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ height: { xs: 200, md: 300 } }}
                  />
                  <CardContent>
                    <Typography fontWeight="bold">{movie.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
