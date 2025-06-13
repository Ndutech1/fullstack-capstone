import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

// Search movies by title
export const searchMovies = async (query) => {
  const res = await tmdb.get('/search/movie', {
    params: { api_key: API_KEY, query },
  });
  return res.data.results;
};

// Get detailed information for a single movie
export const getMovieDetails = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};

// Get TMDB’s recommendations for a movie
export const getRecommendations = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}/recommendations`, {
    params: { api_key: API_KEY },
  });
  return res.data.results;
};

export const getTrailers = async (movieId) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/videos`, {
      params: { api_key: API_KEY },
    });

    console.log('Raw trailer response:', res.data); // 🔍 Log raw result

    const filtered = res.data.results.filter(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );

    console.log('Filtered trailers:', filtered); // 🔍 Confirm filtered output

    return filtered;
  } catch (error) {
    console.error('Error fetching trailers:', error); // 🔥 Catch and log error
    return [];
  }
};
