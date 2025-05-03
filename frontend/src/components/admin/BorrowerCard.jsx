import React from 'react';

const BorrowerCard = ({ record }) => {
  return (
    <div className="borrower-card">
      {record.bookId && record.bookId.name && (
        <p><strong>Book Name:</strong> {record.bookId.name}</p>
      )}
      <p><strong>Borrower Name:</strong> {record.borrowerName}</p>
      <p><strong>Roll Number:</strong> {record.rollNumber}</p>
      <p><strong>Department:</strong> {record.department}</p>
      <p><strong>Borrowed Date:</strong> {new Date(record.borrowedDate).toLocaleDateString()}</p>
      {record.returnedDate && (
        <p><strong>Returned Date:</strong> {new Date(record.returnedDate).toLocaleDateString()}</p>
      )}
      <p><strong>Status:</strong> {record.returned ? 'Returned' : 'Not Returned'}</p>
    </div>
  );
};

export default BorrowerCard;