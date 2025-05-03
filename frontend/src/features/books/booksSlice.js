import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  books: [], // Initialize as an empty array
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    updateBookStatus: (state, action) => {
      const { bookId, status } = action.payload;
      const bookIndex = state.books.findIndex((book) => book._id === bookId); // Assuming backend uses _id
      if (bookIndex !== -1) {
        state.books[bookIndex].status = status;
      }
    },
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    setAllBooks: (state, action) => {
      state.books = action.payload;
    },
    updateBook: (state, action) => {
      const { _id, name, author, genre, isbn, coverImageUrl } = action.payload; // Assuming backend uses _id
      const bookIndex = state.books.findIndex((book) => book._id === _id); // Assuming backend uses _id
      if (bookIndex !== -1) {
        state.books[bookIndex] = { ...state.books[bookIndex], name, author, genre, isbn, coverImageUrl };
      }
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((book) => book._id !== action.payload); // Assuming backend uses _id
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { updateBookStatus, addBook, setAllBooks, updateBook, deleteBook, setSearchTerm } = booksSlice.actions;

export const selectSearchTerm = (state) => state.books.searchTerm;
export const selectAllBooks = (state) => state.books.books;

export default booksSlice.reducer;