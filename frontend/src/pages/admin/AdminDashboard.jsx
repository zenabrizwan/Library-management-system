import React, { useState } from 'react';
import BookList from '../../components/admin/BookList';
import Modal from '../../components/common/Modal';
import AddBookForm from '../../components/admin/AddBookForm';
import AnnouncementForm from '../../components/admin/AnnouncementForm';
import { useSelector, useDispatch } from 'react-redux';
import { selectAnnouncement } from '../../features/admin/announcementSlice';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { logout } from '../../features/auth/authSlice'; // Import your logout action
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css'; // Import the CSS file (create if it doesn't exist)

const AdminDashboard = () => {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const announcement = useSelector(selectAnnouncement);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenAddBookModal = () => {
    setIsAddBookModalOpen(true);
  };

  const handleCloseAddBookModal = () => {
    setIsAddBookModalOpen(false);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    navigate('/'); // Redirect to home after logout
  };

  return (
    <div className="admin-dashboard">
      <nav className="sticky-header"> {/* Add the sticky-header className */}
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/analytics">
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </Link>
          </li>
          <li>
            <button onClick={handleLogoutClick}>Logout</button> {/* Logout button integrated */}
          </li>
        </ul>
      </nav>

      <h2>Admin Dashboard</h2>
      <button onClick={handleOpenAddBookModal}>Add New Book</button>
      <BookList />

      <div className="announcement-section">
        <h3>Manage Announcement</h3>
        {announcement && <p>Current Announcement: {announcement}</p>}
        <AnnouncementForm />
      </div>

      <Modal isOpen={isAddBookModalOpen} onClose={handleCloseAddBookModal}>
        <AddBookForm onClose={handleCloseAddBookModal} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;