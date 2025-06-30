import { useEffect, useState } from 'react';
import API from '../api';
import {
  Grid, Card, CardMedia, CardContent, Typography, Button, Box, Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/watchlist');
        setWatchlist(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleRemove = async (id) => {
    try {
      await API.delete(`/watchlist/${id}`);
      setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #673ab7 30%, #03a9f4 90%)',
        py: 5,
      }}
    >
      <Container>
        <Typography
          variant="h4"
          align="center"
          color="white"
          gutterBottom
        >
          My Watchlist
        </Typography>

        {watchlist.length === 0 ? (
          <Typography align="center" color="white" sx={{ mt: 4 }}>
            Your watchlist is empty. Add movies to track them!
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {watchlist.map((movie) => (
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
                      image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                      alt={movie.title}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {movie.title}
                      </Typography>
                    </CardContent>
                  </Link>
                  <Button
                    onClick={() => handleRemove(movie.id)}
                    startIcon={<DeleteIcon />}
                    color="error"
                    variant="contained"
                    sx={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      mt: 'auto',
                    }}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
