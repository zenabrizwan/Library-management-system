// frontend/src/components/admin/BookList.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllBooks } from '../../features/books/booksSlice';
import BookCardAdmin from './BookCardAdmin';
import bookService from '../../services/bookService';
import { setAllBooks } from '../../features/books/booksSlice';
import SearchBar from '../../components/common/SearchBar'; // Import SearchBar

const BookList = () => {
  const books = useSelector(selectAllBooks);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const filteredBooks = books.filter((book) =>
    (book.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.isbn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.genre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await bookService.getAllBooks();
        dispatch(setAllBooks(fetchedBooks));
      } catch (error) {
        console.error('Error fetching books:', error);
        // Optionally display an error message to the user
      }
    };

    fetchBooks();
  }, [dispatch]);

  return (
    <div className="book-list">
      <h3>Manage Books</h3>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <SearchBar onSearchChange={handleSearchChange} style={{ flexGrow: 1, marginRight: '15px' }} />
        <button style={{ marginLeft: '15px', marginTop: '5px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #a8dadc', backgroundColor: '#f8f8ff', cursor: 'pointer', fontSize: '1em', color: '#800080' }}>
          Search Books
        </button>
      </div>
      {filteredBooks.map((book) => (
        <BookCardAdmin key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;