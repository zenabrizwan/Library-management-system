import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import routes from './routes';
import AuthLayout from './layouts/AuthLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/home/HomePage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfile from './pages/user/UserProfile';
import AddBook from './pages/admin/AddBook';
import ManageBooks from './pages/admin/ManageBooks';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignup from './pages/auth/AdminSignup';
import BorrowBook from './pages/user/BorrowBook';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import './assets/styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="user/login" element={<UserLogin />} />
            <Route path="user/signup" element={<UserSignup />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/signup" element={<AdminSignup />} />
          </Route>

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="borrow/:bookId" element={<BorrowBook />} />
            {/* Add other user-specific routes here */}
          </Route>


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* ... other admin routes ... */}
         </Route>

          

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="borrow/:bookId" element={<BorrowBook />} />
            {/* Add other user-specific routes here */}
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="analytics" element={<AnalyticsPage />} /> {/* Make sure this route is present */}
            {/* ... other admin routes ... */}
         </Route>

          

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;