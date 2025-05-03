import React, { useState } from 'react';
import Modal from './Modal';
import BookBorrowForm from '../user/BookBorrowForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateBookStatus } from '../../features/books/booksSlice';
import { bookBorrowed } from '../../features/user/userSlice';
import { selectUser } from '../../features/auth/authSlice'; // Assuming you have user info in authSlice

const BookCard = ({ book }) => {
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUser); // Get logged-in user info (if available)

  const handleBorrowClick = () => {
    setIsBorrowModalOpen(true);
  };

  const handleBorrowSubmit = (borrowDetails) => {
    console.log('Borrow details submitted:', borrowDetails);
    dispatch(updateBookStatus({ bookId: book.id, status: 'Not Available' }));
    dispatch(
      bookBorrowed({
        bookId: book.id,
        title: book.title,
        borrowedDate: new Date().toISOString().slice(0, 10),
        rollNumber: borrowDetails.rollNumber, // You might want to get this from loggedInUser
        department: borrowDetails.department, // You might want to get this from loggedInUser
      })
    );
    setIsBorrowModalOpen(false);
    alert(`"${book.title}" borrowed successfully by Roll Number: ${borrowDetails.rollNumber}`);
  };

  const handleCloseBorrowModal = () => {
    setIsBorrowModalOpen(false);
  };

  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Category: {book.category}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Status: <span className={book.status === 'Available' ? 'available' : 'not-available'}>{book.status}</span></p>
      {book.status === 'Available' && (
        <button onClick={handleBorrowClick}>Borrow</button>
      )}
      <Modal isOpen={isBorrowModalOpen} onClose={handleCloseBorrowModal}>
        <BookBorrowForm book={book} onClose={handleCloseBorrowModal} onBorrowSubmit={handleBorrowSubmit} />
      </Modal>
    </div>
  );
};

export default BookCard;