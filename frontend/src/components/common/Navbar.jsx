import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice'; // Assuming you'll have this action

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/'); // Redirect to the homepage
    // You might want to clear user data from local storage here as well
  };

  return (
    <nav>
      <ul>
        {role === 'user' && (
          <>
            <li><Link to="/user/dashboard">Dashboard</Link></li>
            <li><Link to="/user/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
        {role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/add-book">Add Book</Link></li>
            <li><Link to="/admin/manage-books">Manage Books</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
        {/* You might have some general links here as well */}
      </ul>
    </nav>
  );
};

export default Navbar;