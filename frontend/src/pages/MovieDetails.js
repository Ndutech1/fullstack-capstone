import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../tmdb';
import { Container, Typography, CircularProgress, Grid, CardMedia } from '@mui/material';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const data = await getMovieDetails(id);
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  if (!movie) {
    return <CircularProgress />;
  }

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
          <Typography variant="subtitle1" gutterBottom>{movie.release_date} • {movie.runtime} mins</Typography>
          <Typography variant="body1" paragraph>{movie.overview}</Typography>
          <Typography variant="body2">Rating: {movie.vote_average}</Typography>
          <Typography variant="body2">Genres: {movie.genres.map(g => g.name).join(', ')}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
