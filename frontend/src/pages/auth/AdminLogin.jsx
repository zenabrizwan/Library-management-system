import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/authService';
import { loginSuccess } from '../../features/auth/authSlice'; // Import loginSuccess action

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const credentials = { username, password };
      const response = await adminLogin(credentials);
      if (response && response.user) { // Check for response and user data
        dispatch(loginSuccess({ user: response.user, token: 'dummy_admin_token', role: response.user.role })); // Dispatch loginSuccess
        navigate('/admin/dashboard');
      } else {
        setError(response?.message || 'Admin login failed'); // Use optional chaining for message
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid credentials'); // More specific error message
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;