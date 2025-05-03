import React, { useEffect, useState } from 'react';
import BorrowHistory from '../../components/user/BorrowHistory';
import FinesList from '../../components/user/FinesList';
import ReturnHistory from '../../components/user/ReturnHistory';
import ProfileCard from '../../components/common/ProfileCard';
import { useSelector, shallowEqual } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import DueSoonNotification from '../../components/user/DueSoonNotification';
import bookService from '../../services/bookService';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const UserProfile = () => {
  const user = useSelector(selectUser, shallowEqual);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [returnHistoryData, setReturnHistoryData] = useState([]); // State for return history

  const fetchBorrowedBooks = async () => {
    if (user?.username) {
      try {
        const data = await bookService.getUserBorrowedBooks(user.username);
        setBorrowedBooks(data);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    }
  };

  const fetchNotifications = async () => {
    if (user?.username) {
      try {
        const response = await axios.get(`${API_URL}/user/notifications?username=${user?.username}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  const fetchReturnHistory = async () => {
    if (user?.username) {
      try {
        const response = await axios.get(`${API_URL}/user/returned?username=${user?.username}`);
        setReturnHistoryData(response.data);
      } catch (error) {
        console.error('Error fetching return history:', error);
      }
    }
  };

  const handleBookReturnedFrontend = (returnedBookId) => {
    console.log('handleBookReturnedFrontend called with ID:', returnedBookId);
    // Remove from borrowedBooks state
    setBorrowedBooks(prevBooks => {
      const updatedBooks = prevBooks.filter(book => book._id !== returnedBookId);
      console.log('Updated borrowedBooks:', updatedBooks);
      return [...updatedBooks]; // Create a new array to trigger re-render
    });

    // Fetch updated return history
    fetchReturnHistory();
  };

  useEffect(() => {
    if (user?.username) {
      console.log('Fetching borrowed books for user:', user.username);
      fetchBorrowedBooks();
      fetchNotifications();
      fetchReturnHistory();
    }
  }, [user?.username]);

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {console.log('Borrowed Books in UserProfile render:', borrowedBooks)} {/* Add this line */}
      {notifications.map(notification => (
        <DueSoonNotification key={notification._id} message={notification.message} />
      ))}
      {user && <ProfileCard user={user} />}
      <BorrowHistory borrowedBooks={borrowedBooks} onBookReturned={handleBookReturnedFrontend} /> {/* Pass setter function */}
      <FinesList borrowedBooks={borrowedBooks} />
      <ReturnHistory history={returnHistoryData} />
    </div>
  );
};

export default UserProfile;