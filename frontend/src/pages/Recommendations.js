import React, { useEffect, useState } from 'react';
import API from '../api';
import { getRecommendations } from '../tmdb';
import { Grid, Card, CardMedia, CardContent, Typography, Container } from '@mui/material';

export default function Recommendations() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/favorites');
      if (res.data.length > 0) {
        const lastLiked = res.data[res.data.length - 1];
        const recs = await getRecommendations(lastLiked.id);
        setMovies(recs.slice(0, 12)); // limit to 12
      }
    };
    fetch();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Recommended for You</Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                height="300"
              />
              <CardContent>
                <Typography>{movie.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
