import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AuthLayout = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <Outlet /> {/* This is where the nested auth routes (login/signup) will render */}
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;