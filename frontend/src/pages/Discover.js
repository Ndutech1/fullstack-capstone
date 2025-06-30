import { useState, useContext, useEffect } from 'react';
import {
  TextField, Button, Grid, Typography, Card, CardMedia, CardContent, Container, Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MovieFilters from '../Components/MovieFilters';
import { discoverMovies, searchMovies } from '../tmdb';
import { AuthContext } from '../Authcontext';
import API from '../api';

export default function Discover() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genreFromURL = searchParams.get('genre');
  const [filters, setFilters] = useState({
    genre: genreFromURL || '',
    sortBy: '',
    year: '',
    rating: '',
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, genre: genreFromURL || '' }));
  }, [genreFromURL]);

  useEffect(() => {
    if (!query.trim()) handleSearch();
    // eslint-disable-next-line
  }, [filters]);

  const handleSearch = async () => {
    const results = query.trim() ? await searchMovies(query) : await discoverMovies(filters);
    setMovies(results);
  };

  const handleFavorite = async (movie) => {
    try {
      await API.post('/favorites', { movie });
      alert('Added to favorites!');
    } catch {
      alert('Login required to save favorites.');
      navigate('/login');
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await API.post('/watchlist', { movie });
      alert('Added to Watchlist!');
    } catch {
      alert('Login required to save to Watchlist.');
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00bcd4 30%, #ff4081 90%)',
        py: 5,
      }}
    >
      <Container>
        <Typography variant="h4" align="center" color="white" gutterBottom>
          Discover Movies
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Search by title"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        <MovieFilters filters={filters} onChange={setFilters} />

        {movies.length === 0 ? (
          <Typography align="center" color="white" sx={{ mt: 4 }}>
            No movies found. Try searching for something!
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {movies.map((movie) => (
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
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={movie.title}
                    />
                  </Link>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {movie.title}
                    </Typography>
                    <Typography variant="body2">Rating: {movie.vote_average}</Typography>
                    <Typography variant="body2">Release: {movie.release_date}</Typography>
                    <Button
                      sx={{ mt: 1 }}
                      onClick={() => handleFavorite(movie)}
                      startIcon={<FavoriteIcon />}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      disabled={!user}
                    >
                      Save to Favorites
                    </Button>
                    <Button
                      sx={{ mt: 1 }}
                      onClick={() => handleAddToWatchlist(movie)}
                      startIcon={<BookmarkIcon />}
                      variant="outlined"
                      color="primary"
                      fullWidth
                    >
                      Add to Watchlist
                    </Button>
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
