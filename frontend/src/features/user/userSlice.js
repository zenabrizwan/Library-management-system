// frontend/src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookService from '../../services/bookService';

// Async thunk for fetching borrowed books
export const fetchUserBorrowedBooks = createAsyncThunk(
  'user/fetchBorrowedBooks',
  async (username, { rejectWithValue }) => {
    try {
      const response = await bookService.getUserBorrowedBooks(username);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  borrowedBooks: [],
  fines: [],
  returnHistory: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    bookBorrowed: (state, action) => {
      state.borrowedBooks.push(action.payload);
    },
    bookReturned: (state, action) => {
      if (state.borrowedBooks) {
        state.borrowedBooks = state.borrowedBooks.filter(
          (borrowedBook) => borrowedBook.bookId?._id?.toString() !== action.payload.bookId
        );
      } else {
        console.error('Error: state.borrowedBooks is undefined during bookReturned!');
        state.borrowedBooks = []; // Initialize it as an empty array if it's undefined
      }
      state.returnHistory.push({ bookId: action.payload.bookId, returnedDate: new Date().toISOString().slice(0, 10) });
    },
    setBorrowedBooks: (state, action) => {
      state.borrowedBooks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBorrowedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBorrowedBooks.fulfilled, (state, action) => {
        state.loading = false;
        console.log('--- fetchUserBorrowedBooks fulfilled payload: ---', action.payload);
        state.borrowedBooks = action.payload;
      })
      .addCase(fetchUserBorrowedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { bookBorrowed, bookReturned, setBorrowedBooks } = userSlice.actions;
export const selectBorrowedBooks = (state) => state.user.borrowedBooks;
export const selectFines = (state) => state.user.fines;
export const selectReturnHistory = (state) => state.user.returnHistory;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;