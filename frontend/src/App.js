import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Favorites from './pages/Favorites';
import { AuthProvider } from './Authcontext';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './Components/Navbar';
import MovieDetails from './pages/MovieDetails';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1>Home (Public)</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
