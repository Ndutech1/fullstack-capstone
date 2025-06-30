import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getTrailers } from '../tmdb';
import API from '../api';
import { AuthContext } from '../Authcontext';
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  CardMedia,
  TextField,
  Rating,
  Button,
  Box,
  Paper,
} from '@mui/material';
import ReactPlayer from 'react-player';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
      const trailerData = await getTrailers(id);
      setTrailers(trailerData);
      const reviewRes = await API.get(`/api/reviews/${id}`);
      setReviews(reviewRes.data);
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async () => {
    if (rating === 0 || text.trim() === '') {
      return alert('Please provide a rating and review text.');
    }
    try {
      const res = await API.post('/api/reviews', {
        movieId: id,
        movieTitle: movie.title,
        rating,
        text,
      });
      setReviews((prev) => [...prev.filter(r => r.userId !== user.id), res.data]);
      setText('');
      setRating(0);
    } catch {
      alert('Login required to leave a review.');
    }
  };

  if (!movie) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={5}>
          <CardMedia
            component="img"
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography variant="h4" gutterBottom>{movie.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>
            {movie.release_date} • {movie.runtime} mins
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{movie.overview}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Average Rating: {movie.vote_average}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Genres: {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => document.getElementById('trailer-section').scrollIntoView({ behavior: 'smooth' })}
          >
            Watch Trailer
          </Button>
        </Grid>
      </Grid>

      {/* Trailer Section */}
      <Box id="trailer-section" sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Official Trailers</Typography>
        {trailers.length === 0 ? (
          <Typography>No trailers available.</Typography>
        ) : (
          trailers.map((t) => (
            <Paper key={t.key} sx={{ my: 2, p: 2, boxShadow: 2 }}>
              <Typography variant="subtitle2">{t.name}</Typography>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${t.key}`}
                width="100%"
                height="360px"
                controls
              />
            </Paper>
          ))
        )}
      </Box>

      {/* Review Form */}
      {user && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>Leave a Review</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Box>
      )}

      {/* Reviews */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>User Reviews</Typography>
        {reviews.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          reviews.map((rev) => (
            <Paper key={rev._id} sx={{ p: 2, mb: 2, boxShadow: 1 }}>
              <Typography variant="subtitle2">{rev.username}</Typography>
              <Rating value={rev.rating} readOnly sx={{ mb: 1 }} />
              <Typography variant="body2">{rev.text}</Typography>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
}
