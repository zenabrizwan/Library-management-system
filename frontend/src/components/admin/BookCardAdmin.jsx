// frontend/src/components/admin/BookCardAdmin.jsx
import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import BookHistory from './BookHistory';
import EditBookForm from './EditBookForm';
import { useDispatch } from 'react-redux';
import { deleteBook } from '../../features/books/booksSlice';
import adminService from '../../services/adminService';

const BookCardAdmin = ({ book }) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState('');
  const dispatch = useDispatch();

  const handleShowHistoryClick = async () => {
    setLoadingHistory(true);
    setErrorHistory('');
    try {
      const data = await adminService.getBorrowHistory(book._id); // Use _id
      setBorrowHistory(data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      setErrorHistory('Failed to load borrow history.');
      console.error(error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setBorrowHistory([]);
    setErrorHistory('');
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${book.name}"?`)) {
      adminService.deleteBook(book._id)
        .then(response => {
          dispatch(deleteBook(book._id)); // Use the correctly imported name
          alert(`"${book.name}" deleted successfully!`);
        })
        .catch(error => {
          console.error('Error deleting book:', error);
          alert(`Failed to delete "${book.name}". Please try again.`);
        });
    }
  };

  return (
    <div className="book-card-admin">
      {book.coverImageUrl && (
        <img
          src={`http://localhost:5001/images/${book.coverImageUrl}`}
          alt={book.name}
          style={{ width: '80px', height: 'auto', marginBottom: '10px' }}
        />
      )}
      <h4>{book.name}</h4>
      <p>Author: {book.author}</p>
      <p>ISBN: {book.isbn}</p>
      <button onClick={handleShowHistoryClick} disabled={loadingHistory}>
        {loadingHistory ? 'Loading History...' : 'Show History of Borrowers'}
      </button>
      <button onClick={handleOpenEditModal}>Edit</button>
      <button className="delete-button" onClick={handleDeleteClick}>Delete</button>

      <Modal isOpen={isHistoryModalOpen} onClose={handleCloseHistoryModal}>
        {loadingHistory && <p>Loading borrow history...</p>}
        {errorHistory && <p style={{ color: 'red' }}>{errorHistory}</p>}
        {!loadingHistory && !errorHistory && (
          <BookHistory bookTitle={book.name} history={borrowHistory} onClose={handleCloseHistoryModal} />
        )}
        {/* Use book.name */}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <EditBookForm book={book} onClose={handleCloseEditModal} />
      </Modal>
    </div>
  );
};

export default BookCardAdmin;