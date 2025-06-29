import { useEffect, useState } from 'react';
import API from '../api';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await API.get('/favorites');    
                setFavorites(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (id) => {
        try {
            await API.delete(`/favorites/${id}`);
            setFavorites((prev) => prev.filter((movie) => movie.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }} gutterBottom>
                My Favorites
            </Typography>
            <Grid container spacing={3}>
                {favorites.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{m:1 }}>
                            <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: { xs: '200px', md: '300px' } }}
                                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                                    alt={movie.title}
                                />
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>{movie.title}</Typography>
                                </CardContent>
                            </Link>
                            <Button
                                onClick={() => handleRemove(movie.id)}
                                startIcon={<DeleteIcon />}
                                color="error"
                                variant="outlined"
                                sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                                fullWidth
                            >
                                Remove
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
