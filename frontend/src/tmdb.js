import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export const searchMovies = async (query) => {
  const res = await tmdb.get(`/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
    },
  });
  return res.data.results;
};
