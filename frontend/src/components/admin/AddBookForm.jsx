// frontend/src/components/admin/AddBookForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import bookService from '../../services/bookService';
import { addBook } from '../../features/books/booksSlice';
import { useNavigate } from 'react-router-dom';

const AddBookForm = ({ onClose }) => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [quantity, setQuantity] = useState(1); // Initialize quantity with a default value
  const [coverImage, setCoverImage] = useState(null); // State for the selected file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]); // Get the selected file
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) || value < 1 ? 1 : value); // Ensure quantity is at least 1
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('author', author);
      formData.append('isbn', isbn);
      formData.append('genre', genre);
      formData.append('quantity', quantity); // Append the quantity
      if (coverImage) {
        formData.append('coverImage', coverImage); // Append the file
      }

      const response = await bookService.addBook(formData); // Send FormData
      console.log('Book added successfully:', response);
      dispatch(addBook(response));
      setLoading(false);
      onClose();
      // navigate('/admin/books');
    } catch (err) {
      console.error('Failed to add book:', err);
      setError('Failed to add book. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Book</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="isbn">ISBN:</label>
        <input type="text" id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="genre">Genre:</label>
        <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          required
        />
      </div>
      <div>
        <label htmlFor="coverImage">Cover Image:</label>
        <input
          type="file"
          id="coverImage"
          accept="image/*" // Only allow image files
          onChange={handleCoverImageChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Book'}
      </button>
      <button type="button" onClick={onClose} disabled={loading}>
        Cancel
      </button>
    </form>
  );
};

export default AddBookForm;