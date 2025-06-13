import React, { useState, useContext, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Link } from 'react-router-dom';

import { searchMovies, discoverMovies } from '../tmdb';
import { AuthContext } from '../Authcontext';
import API from '../api';

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' }
];

export default function Discover() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ genre: '', sortBy: '', year: '', rating: '' });
  const { user } = useContext(AuthContext);

  const handleSearch = async () => {
    if (query.trim()) {
      const results = await searchMovies(query);
      setMovies(results);
    } else {
      const results = await discoverMovies(filters);
      setMovies(results);
    }
  };

  useEffect(() => {
    if (!query.trim()) handleSearch();
  }, [filters]);

  const handleFavorite = async (movie) => {
    try {
      await API.post('/api/favorites', { movie });
      alert('Added to favorites!');
    } catch (err) {
      alert('Login required to save favorites.');
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await API.post('/api/watchlist', { movie });
      alert('Added to Watchlist!');
    } catch (err) {
      alert('Login required to save to Watchlist.');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Discover Movies
      </Typography>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Genre</InputLabel>
          <Select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="popularity.desc">Popularity</MenuItem>
            <MenuItem value="vote_average.desc">Rating</MenuItem>
            <MenuItem value="primary_release_date.desc">Release Date</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select name="year" value={filters.year} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            {[...Array(15)].map((_, i) => {
              const year = 2025 - i;
              return <MenuItem key={year} value={year}>{year}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Min Rating</InputLabel>
          <Select name="rating" value={filters.rating} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            {[...Array(9)].map((_, i) => {
              const rating = i + 1;
              return <MenuItem key={rating} value={rating}>{rating}+</MenuItem>;
            })}
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={3}>
        {movies.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              No movies found. Try searching or applying different filters.
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
                    <Button
                      onClick={() => handleAddToWatchlist(movie)}
                      startIcon={<BookmarkIcon />}
                      variant="outlined"
                      fullWidth
                    >
                      Add to Watchlist
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
