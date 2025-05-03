import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchAdminData = createAsyncThunk(
  'admin/fetchAdminData',
  async (_, { rejectWithValue }) => {
    try {
      // API call will go here
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Reducers will go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default adminSlice.reducer;
