// frontend/src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import booksReducer from '../features/books/booksSlice';
import userReducer from '../features/user/userSlice';
import adminReducer from '../features/admin/adminSlice';
import announcementReducer from '../features/admin/announcementSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'books'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
  user: userReducer,
  admin: adminReducer,
  announcement: announcementReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: false,
  // }),
});

export const persistor = persistStore(store);
export default store;