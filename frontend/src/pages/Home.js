import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent,
  CircularProgress, Alert, Container
} from '@mui/material';
import API from '../api';
import { getPopularMovies, getGenres } from '../tmdb';
import Slider from 'react-slick';
import { motion } from 'framer-motion';

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 900, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [aiMovies, setAiMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    getGenres().then(setGenres);
    getPopularMovies().then(setPopularMovies);
  }, []);

  const handleAIPrompt = async () => {
    if (!prompt) return;
    setLoadingAI(true);
    setAiError('');
    setAiMovies([]);
    try {
      const res = await API.post('/ai/suggest', { prompt });
      setAiMovies(res.data.movies);
    } catch (err) {
      console.error(err);
      setAiError('Failed to get movie suggestions. Try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3f51b5 30%, #f50057 90%)',
        py: 6,
        color: 'white',
      }}
    >
      <Container>
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="h3" align="center" gutterBottom>
            🎬 Welcome to Moodie
          </Typography>
        </motion.div>

        {/* AI Movie Suggestion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
            <Typography variant="h5">🧠 AI Movie Suggestions</Typography>
            <TextField
              fullWidth
              placeholder="Describe what you're in the mood for..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ mt: 2, background: 'white', borderRadius: 1 }}
            />
            <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleAIPrompt}>
              Suggest Movies
            </Button>
            {loadingAI && <CircularProgress sx={{ mt: 2 }} />}
            {aiError && <Alert severity="error" sx={{ mt: 2 }}>{aiError}</Alert>}
          </Box>
        </motion.div>

        {/* Explore by Genre */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>🎯 Explore by Genre</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {genres.map((genre) => (
              <Grid item key={genre.id}>
                <Button
                  variant="outlined"
                  href={`/discover?genre=${genre.id}`}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    textTransform: 'none'
                  }}
                >
                  {genre.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* AI Suggested Movies */}
        {aiMovies.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom>🎯 AI Suggested Movies:</Typography>
            <Grid container spacing={3}>
              {aiMovies.map((movie) => (
                <Grid item xs={12} sm={6} md={3} key={movie.id}>
                  <Card
                    sx={{
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    />
                    <CardContent>
                      <Typography>{movie.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Trending Movies Carousel */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>🔥 Trending Movies</Typography>
          <Slider {...carouselSettings} style={{ marginTop: 20 }}>
            {popularMovies.map((movie) => (
              <Box key={movie.id} sx={{ px: 1 }}>
                <Card
                  sx={{
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  />
                  <CardContent>
                    <Typography>{movie.title}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}
