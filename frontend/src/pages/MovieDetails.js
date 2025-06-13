import React, { useEffect, useState, useContext } from 'react';
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
  Box
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
    async function fetchMovie() {
      const data = await getMovieDetails(id);
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchTrailers = async () => {
      const vids = await getTrailers(id);
      console.log('fetched trailers:', vids);
      setTrailers(vids);
    };
    fetchTrailers();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await API.get(`/api/reviews/${id}`);
      setReviews(res.data);
    };
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    try {
      const res = await API.post('/api/reviews', {
        movieId: id,
        movieTitle: movie.title,
        rating,
        text,
      });
      setReviews([...reviews.filter(r => r.userId !== user.id), res.data]);
      setText('');
      setRating(0);
    } catch (err) {
      alert('Login required to leave a review.');
    }
  };

  if (!movie) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <CardMedia
            component="img"
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h4" gutterBottom>{movie.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>
            {movie.release_date} • {movie.runtime} mins
          </Typography>
          <Typography variant="body1" paragraph>{movie.overview}</Typography>
          <Typography variant="body2">Rating: {movie.vote_average}</Typography>
          <Typography variant="body2">
            Genres: {movie.genres.map(g => g.name).join(', ')}
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => {
              const el = document.getElementById('trailer-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Watch Trailer
          </Button>
        </Grid>
      </Grid>

      {/* Trailer Section */}
      <Box id="trailer-section" sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>Watch Trailer</Typography>
        {trailers.length === 0 ? (
          <Typography color="textSecondary">No trailer available.</Typography>
        ) : (
          trailers.map((t) => (
            <Box key={t.key} sx={{ my: 2 }}>
              <Typography variant="subtitle2">{t.name}</Typography>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${t.key}`}
                width="100%"
                height="360px"
                controls
              />
            </Box>
          ))
        )}
      </Box>

      {/* Review Form */}
      {user && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Leave a Review</Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts..."
            sx={{ mt: 1 }}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Box>
      )}

      {/* Reviews */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>User Reviews</Typography>
        {reviews.length === 0 && <Typography>No reviews yet.</Typography>}
        {reviews.map((rev) => (
          <Box key={rev._id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="subtitle2">{rev.username}</Typography>
            <Rating value={rev.rating} readOnly />
            <Typography variant="body2">{rev.text}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
