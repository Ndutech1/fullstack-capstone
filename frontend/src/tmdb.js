import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

// 🔍 Search movies by title
export const searchMovies = async (query) => {
  const res = await tmdb.get('/search/movie', {
    params: { api_key: API_KEY, query },
  });
  return res.data.results;
};

// 🔥 Get popular movies
export const getPopularMovies = async () => {
  const res = await tmdb.get('/movie/popular', {
    params: { api_key: API_KEY },
  });
  return res.data.results;
};

// 🎬 Get detailed information for a single movie
export const getMovieDetails = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};

// 🧠 Get TMDB’s recommendations for a movie
export const getRecommendations = async (movieId) => {
  const res = await tmdb.get(`/movie/${movieId}/recommendations`, {
    params: { api_key: API_KEY },
  });
  return res.data.results;
};

// 🎥 Get trailers for a movie (YouTube trailers filtered)
export const getTrailers = async (movieId) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/videos`, {
      params: { api_key: API_KEY },
    });

    const filtered = res.data.results.filter(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );

    return filtered;
  } catch (error) {
    console.error('Error fetching trailers:', error);
    return [];
  }
};

// 🌐 Discover movies with filters (genre, year, rating)
export const discoverMovies = async (filters) => {
  const res = await tmdb.get('/discover/movie', {
    params: {
      api_key: API_KEY,
      sort_by: filters.sortBy || 'popularity.desc',
      with_genres: filters.genre || '',
      primary_release_year: filters.year || '',
      'vote_average.gte': filters.rating || '',
    },
  });
  return res.data.results;
};
