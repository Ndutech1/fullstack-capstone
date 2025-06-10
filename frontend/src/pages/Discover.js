import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { searchMovies } from '../tmdb';
import { AuthContext } from '../Authcontext'; // ✅ Correct casing
import API from '../api';
import { Link } from 'react-router-dom';

export default function Discover() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const { user } = useContext(AuthContext); // ✅ Safe now that AuthProvider is in index.js

  const handleSearch = async () => {
    if (!query.trim()) return;
    const results = await searchMovies(query);
    setMovies(results);
  };

  const handleFavorite = async (movie) => {
    try {
      await API.post('/favorites', { movie });
      alert('Added to favorites!');
    } catch (err) {
      alert('Login required to save favorites.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Discover Movies
      </Typography>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <TextField
          label="Search by title"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <Grid container spacing={3}>
        {movies.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              No movies found. Try searching for something!
            </Typography>
          </Grid>
        ) : (
          movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography variant="h6">{movie.title}</Typography>
                    <Typography variant="body2">
                      Rating: {movie.vote_average}
                    </Typography>
                    <Typography variant="body2">
                      Release: {movie.release_date}
                    </Typography>

                    <Button
                      onClick={() => handleFavorite(movie)}
                      startIcon={<FavoriteIcon />}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 1 }}
                      disabled={!user}
                    >
                      Save to Favorites
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}
