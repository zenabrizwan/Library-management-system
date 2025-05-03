import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/home/HomePage';

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignup from './pages/auth/AdminSignup';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddBook from './pages/admin/AddBook';
import ManageBooks from './pages/admin/ManageBooks';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import BorrowBook from './pages/user/BorrowBook';

// Private Route Component
import PrivateRoute from './components/common/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
      </Route>
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="add-book" element={<AddBook />} />
        <Route path="manage-books" element={<ManageBooks />} />
      </Route>
      
      {/* User Routes */}
      <Route 
        path="/user" 
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="borrow/:bookId" element={<BorrowBook />} />
      </Route>
      
      {/* Catch All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
