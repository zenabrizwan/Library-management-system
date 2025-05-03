// frontend/src/components/admin/EditBookForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBook } from '../../features/books/booksSlice';
import adminService from '../../services/adminService';

const EditBookForm = ({ book, onClose }) => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [quantity, setQuantity] = useState(''); // New state for quantity
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (book) {
      setName(book.name || '');
      setAuthor(book.author || '');
      setIsbn(book.isbn || '');
      setGenre(book.genre || '');
      setQuantity(String(book.quantity) || ''); // Initialize quantity from book data
      setPreviewImage(book.coverImageUrl ? `http://localhost:5001/images/${book.coverImageUrl}` : '');
    }
  }, [book]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(book.coverImageUrl ? `http://localhost:5001/images/${book.coverImageUrl}` : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !author || !isbn || quantity === '') { // Quantity is now a required field
      setError('Please fill in all required fields, including quantity.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('isbn', isbn);
    formData.append('genre', genre);
    formData.append('quantity', quantity); // Append quantity to form data
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    formData.append('existingCoverImage', book.coverImageUrl || ''); // Send the existing image name

    try {
      const updatedBookData = await adminService.editBook(book._id, formData);
      dispatch(updateBook(updatedBookData));
      onClose(); // Close the modal after successful edit
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update book.');
      console.error('Error updating book:', err);
    }
  };

  return (
    <div className="edit-book-form">
      <h2>Edit Book</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="coverImage">Cover Image:</label>
          <input type="file" id="coverImage" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img src={previewImage} alt="Cover Preview" style={{ width: '80px', height: 'auto', marginTop: '10px' }} />
          )}
        </div>
        <div className="buttons">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;