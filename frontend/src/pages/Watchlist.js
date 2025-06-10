import React, { useEffect, useState } from 'react';
import API from '../api';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await API.get('/watchlist');
      setWatchlist(res.data);
    }
    fetchData();
  }, []);

const handleRemove = async (id) => {
  try {
    const res = await API.delete(`/watchlist/${id}`);
    setWatchlist(res.data);
  } catch (err) {
    console.error(err);
  }
};

return (
    <div style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>My Watchlist</Typography>
        {watchlist.length === 0 ? (
            <Typography variant="subtitle1">Your watchlist is empty.</Typography>
        ) : (
            <Grid container spacing={3}>
                {watchlist.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
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
                            <Button
                                onClick={() => handleRemove(movie.id)}
                                startIcon={<DeleteIcon />}
                                color="error"
                                variant="outlined"
                                fullWidth
                            >
                                Remove
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )}
    </div>
);
}
