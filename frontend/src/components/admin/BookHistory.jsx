import React from 'react';
import BorrowerCard from './BorrowerCard'; // We'll create this

const BookHistory = ({ bookTitle, history, onClose }) => {
  return (
    <div className="book-history">
      <h3>Borrower History for "{bookTitle}"</h3>
      {history.length === 0 ? (
        <p>No borrowing history for this book.</p>
      ) : (
        history.map((record) => (
          <BorrowerCard key={record.rollNumber} record={record} />
        ))
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default BookHistory;