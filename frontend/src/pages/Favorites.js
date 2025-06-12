import React, { useEffect, useState } from 'react';
import API from '../api';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await API.get('/api/favorites');    
                setFavorites(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (id) => {
        try {
            await API.delete(`/api/favorites/${id}`);
            setFavorites((prev) => prev.filter((movie) => movie.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                My Favorites
            </Typography>
            <Grid container spacing={3}>
                {favorites.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                                    alt={movie.title}
                                />
                                <CardContent>
                                    <Typography variant="h6">{movie.title}</Typography>
                                </CardContent>
                            </Link>
                            <Button
                                onClick={() => handleRemove(movie.id)}
                                startIcon={<DeleteIcon />}
                                color="error"
                                variant="outlined"
                                fullWidth
                                sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
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
