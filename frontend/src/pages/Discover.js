import { useState, useContext, useEffect } from 'react';
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
    if (!query.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [filters]);

  const handleSearch = async () => {
    if (query.trim()) {
      const results = await searchMovies(query);
      setMovies(results);
    } else {
      const results = await discoverMovies(filters);
      setMovies(results);
    }
  };

  const handleFavorite = async (movie) => {
    try {
      await API.post('/favorites', { movie });
      alert('Added to favorites!');
    } catch (err) {
      alert('Login required to save favorites.');
      navigate('/login');
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await API.post('/watchlist', { movie });
      alert('Added to Watchlist!');
    } catch (err) {
      alert('Login required to save to Watchlist.');
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem' } }} gutterBottom>
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
        <Button
          variant="contained"
          sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <MovieFilters filters={filters} onChange={setFilters} />

      <Grid container spacing={3}>
        {movies.length === 0 ? (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body1" align="center">
              No movies found. Try searching for something!
            </Typography>
          </Grid>
        ) : (
          movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ m: 1 }}>
                <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: { xs: 200, md: 300 } }}
                    image={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://placehold.co/500x750?text=No+Image'
                    }
                    alt={movie.title}
                  />
                </Link>
                <CardContent>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2">
                    Rating: {movie.vote_average}
                  </Typography>
                  <Typography variant="body2">
                    Release: {movie.release_date}
                  </Typography>
                  <Button
                    sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, mt: 1 }}
                    onClick={() => handleFavorite(movie)}
                    startIcon={<FavoriteIcon />}
                    variant="outlined"
                    fullWidth
                    disabled={!user}
                  >
                    Save to Favorites
                  </Button>
                  <Button
                    sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, mt: 1 }}
                    onClick={() => handleAddToWatchlist(movie)}
                    startIcon={<BookmarkIcon />}
                    variant="outlined"
                  >
                    Add to Watchlist
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}
