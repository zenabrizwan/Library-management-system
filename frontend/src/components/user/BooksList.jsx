import React from 'react';
import BookCard from '../common/BookCard';

const BooksList = ({ books }) => {
  return (
    <div className="books-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BooksList;