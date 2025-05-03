import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSignup } from '../../services/authService';

const UserSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = { username, password, role: 'user' }; // Only username, password, and role
      const response = await userSignup(userData);
      if (response.success) {
        alert(response.message);
        navigate('/auth/user/login');
      } else {
        setError(response.message || 'User signup failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div>
      <h2>User Sign Up</h2>
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

export default UserSignup;