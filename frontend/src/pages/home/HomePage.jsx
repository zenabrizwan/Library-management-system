// In your src/pages/home/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage">
      <h1>Welcome to Our Library</h1>
      <p>Explore a world of books...</p>

      <div className="buttons">
        <Link to="/auth/user/login">User Login</Link>
        <Link to="/auth/user/signup">User Sign Up</Link>
        <Link to="/auth/admin/login">Admin Login</Link>
        <Link to="/auth/admin/signup">Admin Sign Up</Link>
      </div>
    </div>
  );
};

export default HomePage;