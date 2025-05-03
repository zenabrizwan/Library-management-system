import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bookReturned } from '../../features/user/userSlice';
import { updateBookStatus } from '../../features/books/booksSlice';

const BookReturnForm = ({ book, onClose, onReturnSubmit }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(bookReturned({ bookId: book.bookId }));
    dispatch(updateBookStatus({ bookId: book.bookId, status: 'Available' }));
    onReturnSubmit({
      name,
      rollNumber,
      bookName: book.title,
      bookId: book.bookId,
      department,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Return Book</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="rollNumber">Roll Number:</label>
        <input type="text" id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="bookName">Book Name:</label>
        <input type="text" id="bookName" value={book.title} readOnly />
      </div>
      <div>
        <label htmlFor="department">Department:</label>
        <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
      </div>
      <button type="submit">Submit Return</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default BookReturnForm;