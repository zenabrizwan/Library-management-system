// frontend/src/pages/user/BorrowBook.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBorrowedBooks, selectBorrowedBooks, selectUserLoading, selectUserError } from '../../features/user/userSlice'; // Updated imports
import { selectUser } from '../../features/auth/authSlice'; // Import selectUser from authSlice

import BorrowHistory from '../../components/user/BorrowHistory';
import Loading from '../../components/common/Loader';

const BorrowBook = () => {
  const dispatch = useDispatch();
  const borrowedBooks = useSelector(selectBorrowedBooks);
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  useEffect(() => {
    if (user?.username) {
      dispatch(fetchUserBorrowedBooks(user.username));
    }
  }, [dispatch, user?.username]);

  if (loading) {
    return <Loading message="Fetching borrowed books..." />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error loading borrowed books: {error}</div>;
  }

  return (
    <div>
      <h2>Your Borrowed Books</h2>
      <BorrowHistory borrowedBooks={borrowedBooks} />
    </div>
  );
};

export default BorrowBook;