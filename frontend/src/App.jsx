// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Updated to point to Layout.jsx
import Login from './pages/Auth/Login';
import Home from './pages/Home';
import StorePage from './pages/Store';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/community" element={<Community />} />
          {/* Add other routes that need navigation */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;