import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import BookReturnForm from './BookReturnForm';
import { useSelector, useDispatch } from 'react-redux';
import { selectBorrowedBooks, bookReturned } from '../../features/user/userSlice';
import { updateBookStatus } from '../../features/books/booksSlice';

const BorrowHistory = () => {
  const borrowedBooks = useSelector(selectBorrowedBooks);
  const dispatch = useDispatch();
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedBookToReturn, setSelectedBookToReturn] = useState(null);

  const handleReturnClick = (book) => {
    setSelectedBookToReturn(book);
    setIsReturnModalOpen(true);
  };

  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setSelectedBookToReturn(null);
  };

  const handleReturnSubmit = (returnDetails) => {
    console.log('Return details submitted:', returnDetails);
    dispatch(bookReturned({ bookId: selectedBookToReturn.bookId }));
    dispatch(updateBookStatus({ bookId: selectedBookToReturn.bookId, status: 'Available' }));
    alert(`"${selectedBookToReturn.title}" returned successfully by Roll Number: ${returnDetails.rollNumber}`);
    handleCloseReturnModal();
  };

  return (
    <div className="borrow-history">
      <h3>Borrow History</h3>
      {borrowedBooks.length === 0 ? (
        <p>No books borrowed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Borrowed Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((item) => (
              <tr key={item.bookId}>
                <td>{item.title}</td>
                <td>{item.borrowedDate}</td>
                <td>
                  <button onClick={() => handleReturnClick(item)}>Return Book</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedBookToReturn && (
        <Modal isOpen={isReturnModalOpen} onClose={handleCloseReturnModal}>
          <BookReturnForm book={selectedBookToReturn} onClose={handleCloseReturnModal} onReturnSubmit={handleReturnSubmit} />
        </Modal>
      )}
    </div>
  );
};

export default BorrowHistory;