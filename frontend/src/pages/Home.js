import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent } from '@mui/material';
import API from '../api'; // your axios instance for backend calls
import { getPopularMovies, getGenres } from '../tmdb';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [aiMovies, setAiMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);

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
    try {
      const res = await API.post('/ai/suggest', { prompt });
      setAiMovies(res.data.movies);
    } catch (err) {
      console.error(err);
      alert('Failed to get AI suggestion');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>🎬 Welcome to MovieApp</Typography>

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
      </Box>

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

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">🔥 Trending Movies</Typography>
        <Grid container spacing={2}>
          {popularMovies.map((movie) => (
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
    </Box>
  );
}
