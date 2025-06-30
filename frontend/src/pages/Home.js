import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import API from '../api'; // your axios instance for backend calls
import { getPopularMovies, getGenres } from '../tmdb';
import Slider from 'react-slick';

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
    const fetchGenres = async () => {
      const results = await getGenres();
      setGenres(results);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchPopular = async () => {
      const results = await getPopularMovies();
      setPopularMovies(results);
    };
    fetchPopular();
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        <link rel="icon" href="%PUBLIC_URL%/logo.ico" /> Welcome to Moodie
      </Typography>

      {/* AI Movie Suggestion */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5">🧠 AI Movie Suggestion</Typography>
        <TextField
          fullWidth
          placeholder="Describe the movie you want (e.g., romantic comedy with a twist)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAIPrompt}>
          Suggest Movies
        </Button>
        {loadingAI && <CircularProgress sx={{ mt: 2 }} />}
        {aiError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {aiError}
          </Alert>
        )}
      </Box>

      {/* Explore by Genre */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">🎯 Explore by Genre</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {genres.map((genre) => (
            <Grid item key={genre.id}>
              <Button
                variant="outlined"
                href={`/discover?genre=${genre.id}`}
                sx={{ textTransform: 'none' }}
              >
                {genre.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AI Suggested Movies */}
      {aiMovies.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">🎯 AI Suggested Movies:</Typography>
          <Grid container spacing={2}>
            {aiMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={3} key={movie.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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

      {/* Trending Movies (Carousel) */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">🔥 Trending Movies</Typography>
        <Slider {...carouselSettings} style={{ marginTop: 20 }}>
          {popularMovies.map((movie) => (
            <Box key={movie.id} sx={{ p: 1 }}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                />
                <CardContent>
                  <Typography>{movie.title}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
