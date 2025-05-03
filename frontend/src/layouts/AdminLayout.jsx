import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const AdminLayout = () => {
  return (
    <div>
      <Navbar role="admin" />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;