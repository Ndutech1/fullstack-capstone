import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const tmdb = axios.create({ baseURL: 'https://api.themoviedb.org/3' });

export const searchMovies = async (query, page = 1) => {
  const res = await tmdb.get('/search/movie', { params: { api_key: API_KEY, query, page } });
  return res.data;
};

export const getPopularMovies = async (page = 1) => {
  const res = await tmdb.get('/movie/popular', { params: { api_key: API_KEY, page } });
  return res.data;
};

export const getMovieDetails = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}`, { params: { api_key: API_KEY } });
  return res.data;
};

export const getRecommendations = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}/recommendations`, { params: { api_key: API_KEY } });
  return res.data.results;
};

export const getTrailers = async (movieId) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/videos`, { params: { api_key: API_KEY } });
    return res.data.results.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return [];
  }
};

export const discoverMovies = async (filters, page = 1) => {
  const res = await tmdb.get('/discover/movie', {
    params: { api_key: API_KEY, page, sort_by: filters.sortBy || 'popularity.desc', with_genres: filters.genre || '', primary_release_year: filters.year || '', 'vote_average.gte': filters.rating || '' },
  });
  return res.data;
};

export const getGenres = async () => {
  const res = await tmdb.get('/genre/movie/list', { params: { api_key: API_KEY } });
  return res.data.genres;
};
