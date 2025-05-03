import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar'; // You'll create this
import Footer from '../components/common/Footer';

const UserLayout = () => {
  return (
    <div>
      <Navbar role="user" /> {/* Pass the role for conditional rendering */}
      <div className="container">
        <Outlet /> {/* This is where the user dashboard and other user pages will render */}
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;