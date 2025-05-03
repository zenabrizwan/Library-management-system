import React from 'react';

const AdminDashboardLayout = (props) => {
  return (
    <div className="dashboard-container">
      <div className="admin-content">
        {props.children} {/* This is where your admin page content will be rendered */}
      </div>
    </div>
  );
};

export default Dashboard;