import axios from 'axios';

const API = axios.create({
  baseURL: 'https://fullstack-capstone-1w3v.onrender.com',
  withCredentials: true, // optional, for cookies
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
