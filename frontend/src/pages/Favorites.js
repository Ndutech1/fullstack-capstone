import React, { useEffect, useState } from 'react';
import API from '../api';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await API.get('/favorites');
      setFavorites(res.data);
    };
    fetchFavorites();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>My Favorites</Typography>
      <Grid container spacing={3}>
        {favorites.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
