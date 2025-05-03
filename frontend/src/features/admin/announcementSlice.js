import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const fetchAnnouncement = createAsyncThunk(
  'announcements/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/announcements/latest`); // Backend route to get latest announcement
      return response.data.announcement; // Adjust based on your backend response structure
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  announcement: null,
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncement: (state, action) => {
      state.announcement = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearAnnouncement: (state) => {
      state.announcement = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcement = action.payload;
      })
      .addCase(fetchAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAnnouncement, clearAnnouncement } = announcementSlice.actions;
export const selectAnnouncement = (state) => state.announcement.announcement;

export default announcementSlice.reducer;