import React, { useState } from 'react';

const BookBorrowForm = ({ book, onClose, onBorrowSubmit }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [bookName, setBookName] = useState(book.title);
  const [department, setDepartment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onBorrowSubmit({
      name,
      rollNumber,
      issuedDate,
      bookName: book.title,
      bookId: book.id,
      department,
    });
    onClose(); // Close the modal after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Borrow Book</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="rollNumber">Roll Number:</label>
        <input type="text" id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="issuedDate">Issued Date:</label>
        <input type="date" id="issuedDate" value={issuedDate} readOnly />
      </div>
      <div>
        <label htmlFor="bookName">Book Name:</label>
        <input type="text" id="bookName" value={bookName} readOnly />
      </div>
      <div>
        <label htmlFor="department">Department:</label>
        <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default BookBorrowForm;