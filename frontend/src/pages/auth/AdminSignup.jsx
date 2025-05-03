import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../../services/authService';

const AdminSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = { username, password, role: 'admin' }; // Only username, password, and role
      const response = await adminSignup(userData);
      if (response.success) {
        alert(response.message);
        navigate('/auth/admin/login');
      } else {
        setError(response.message || 'Admin signup failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div>
      <h2>Admin Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default AdminSignup;