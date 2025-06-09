import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/login';
import { AuthProvider } from './Authcontext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Home (Public)</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
