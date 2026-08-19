import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Alert, Box, Button, CardMedia, Chip, Container, IconButton, InputAdornment, Skeleton, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MovieFilters, { movieGenres } from '../Components/MovieFilters';
import { discoverMovies, searchMovies } from '../tmdb';
import { AuthContext } from '../Authcontext';
import API from '../api';
import './Discover.css';

const emptyFilters = { genre: '', sortBy: '', year: '', rating: '' };
const posterUrl = (path) => (path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://placehold.co/500x750/151525/E6E1E5?text=Moodie');

function MovieCard({ movie, onFavorite, onWatchlist, saved, watchlisted }) {
  const genres = movie.genre_ids?.map((id) => movieGenres.find((genre) => genre.id === id)?.name).filter(Boolean).slice(0, 2) || [];
  const releaseYear = movie.release_date?.slice(0, 4) || 'Coming soon';
  return (
    <motion.article className="movie-card" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.32 }} whileHover={{ y: -8 }}>
      <Link to={`/movies/${movie.id}`} className="movie-card__poster-link" aria-label={`View ${movie.title}`}>
        <CardMedia component="img" className="movie-card__poster" image={posterUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
        <Box className="movie-card__scrim" />
        <Box className="movie-card__hover-content"><Typography variant="body2" className="movie-card__overview">{movie.overview || 'A story waiting to be discovered.'}</Typography><Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>{genres.map((genre) => <Chip key={genre} label={genre} size="small" className="movie-card__genre" />)}</Stack><Button component="span" size="small" startIcon={<PlayCircleOutlineRoundedIcon />} className="movie-card__trailer">Trailer & details</Button></Box>
      </Link>
      <Box className="movie-card__body">
        <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start"><Box sx={{ minWidth: 0 }}><Typography className="movie-card__title" noWrap>{movie.title}</Typography><Typography variant="caption" color="text.secondary">{releaseYear}</Typography></Box><Stack className="movie-card__rating" direction="row" alignItems="center" spacing={0.25}><StarRoundedIcon fontSize="inherit" /><span>{Number(movie.vote_average || 0).toFixed(1)}</span></Stack></Stack>
        <Stack direction="row" spacing={0.5} className="movie-card__actions"><Tooltip title={saved ? 'Saved to favorites' : 'Save to favorites'}><IconButton onClick={() => onFavorite(movie)} color={saved ? 'secondary' : 'default'} aria-label="Save to favorites">{saved ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}</IconButton></Tooltip><Tooltip title={watchlisted ? 'In your watchlist' : 'Add to watchlist'}><IconButton onClick={() => onWatchlist(movie)} color={watchlisted ? 'primary' : 'default'} aria-label="Add to watchlist">{watchlisted ? <CheckCircleRoundedIcon /> : <BookmarkAddRoundedIcon />}</IconButton></Tooltip></Stack>
      </Box>
    </motion.article>
  );
}

function CardSkeleton() { return <Box className="movie-card movie-card--skeleton"><Skeleton variant="rectangular" className="movie-card__poster" animation="wave" /><Box className="movie-card__body"><Skeleton width="74%" /><Skeleton width="42%" /></Box></Box>; }

export default function Discover() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [filters, setFilters] = useState({ ...emptyFilters, genre: searchParams.get('genre') || '' });
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [watchlistIds, setWatchlistIds] = useState(() => new Set());
  const [notice, setNotice] = useState('');
  const sentinelRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => { const timer = setTimeout(() => setActiveQuery(query.trim()), 350); return () => clearTimeout(timer); }, [query]);
  useEffect(() => setFilters((current) => ({ ...current, genre: searchParams.get('genre') || '' })), [searchParams]);

  const loadPage = useCallback(async (nextPage = 1, append = false) => {
    const requestId = ++requestRef.current;
    setError('');
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const result = activeQuery ? await searchMovies(activeQuery, nextPage) : await discoverMovies(filters, nextPage);
      if (requestId !== requestRef.current) return;
      const nextMovies = result.results || [];
      setMovies((current) => append ? [...current, ...nextMovies.filter((movie) => !current.some((existing) => existing.id === movie.id))] : nextMovies);
      setPage(nextPage);
      setHasMore(nextPage < (result.total_pages || 1) && nextMovies.length > 0);
    } catch (requestError) {
      if (requestId === requestRef.current) setError(requestError.response?.data?.status_message || 'We could not load movies right now. Please try again.');
    } finally {
      if (requestId === requestRef.current) { if (append) setLoadingMore(false); else setLoading(false); }
    }
  }, [activeQuery, filters]);

  useEffect(() => { loadPage(1); }, [loadPage]);
  useEffect(() => {
    if (!hasMore || loading || loadingMore || !sentinelRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadPage(page + 1, true); }, { rootMargin: '500px' });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadPage, page]);

  const saveMovie = async (movie, endpoint, updateIds, successMessage) => {
    if (!user) { navigate('/login'); return; }
    try { await API.post(endpoint, { movie }); updateIds((current) => new Set(current).add(movie.id)); setNotice(successMessage); } catch { setNotice('That action could not be completed. Please try again.'); }
  };
  const clearFilters = () => setFilters({ ...emptyFilters });

  return (
    <Box className="discover-page"><Container maxWidth="xl" className="discover-container">
      <motion.section className="discover-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><Chip label="YOUR NEXT OBSESSION" className="discover-eyebrow" /><Typography component="h1" className="discover-title">Find a film for <em>every feeling.</em></Typography><Typography className="discover-subtitle">Explore standout stories, then save the ones you cannot stop thinking about.</Typography><TextField className="discover-search" placeholder="Search titles, worlds, and stories..." value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && setActiveQuery(query.trim())} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>, endAdornment: query && <InputAdornment position="end"><IconButton aria-label="Clear search" onClick={() => setQuery('')}><CloseRoundedIcon /></IconButton></InputAdornment> }} /></motion.section>
      <MovieFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mt: 4, mb: 2 }}><Box><Typography variant="h5" fontWeight={800}>{activeQuery ? `Results for “${activeQuery}”` : 'Discover now'}</Typography><Typography variant="body2" color="text.secondary">{loading ? 'Finding great movies...' : `${movies.length} films curated for you`}</Typography></Box>{(activeQuery || Object.values(filters).some(Boolean)) && <Button size="small" onClick={() => { setQuery(''); setActiveQuery(''); clearFilters(); }}>Reset discovery</Button>}</Stack>
      {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => loadPage(1)}>Retry</Button>} sx={{ mb: 3 }}>{error}</Alert>}
      <Box className="movie-grid"><AnimatePresence mode="popLayout">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} saved={savedIds.has(movie.id)} watchlisted={watchlistIds.has(movie.id)} onFavorite={(selected) => saveMovie(selected, '/favorites', setSavedIds, 'Saved to favorites')} onWatchlist={(selected) => saveMovie(selected, '/watchlist', setWatchlistIds, 'Added to your watchlist')} />)}</AnimatePresence>{loading && Array.from({ length: 12 }, (_, index) => <CardSkeleton key={`skeleton-${index}`} />)}</Box>
      {!loading && !error && movies.length === 0 && <Box className="discover-empty"><MovieFilterOutlinedIcon /><Typography variant="h5" fontWeight={800}>Nothing matches that mood yet.</Typography><Typography color="text.secondary">Try removing a filter or searching for another title.</Typography><Button variant="contained" onClick={() => { setQuery(''); setActiveQuery(''); clearFilters(); }}>Browse everything</Button></Box>}
      <Box ref={sentinelRef} sx={{ minHeight: 1 }} />
      {loadingMore && <Box className="movie-grid" sx={{ mt: 2 }}>{Array.from({ length: 6 }, (_, index) => <CardSkeleton key={`more-${index}`} />)}</Box>}
      {!loading && !hasMore && movies.length > 0 && <Typography align="center" color="text.secondary" sx={{ py: 5 }}>You are all caught up. More great picks soon.</Typography>}
    </Container><Snackbar open={Boolean(notice)} autoHideDuration={2600} onClose={() => setNotice('')}><Alert onClose={() => setNotice('')} severity={notice.includes('could not') ? 'error' : 'success'} variant="filled">{notice}</Alert></Snackbar></Box>
  );
}
