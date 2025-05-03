import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';

const UserProfile = () => {
  const user = useSelector(selectUser);

  return (
    <div className="user-profile">
      <h3>User Profile</h3>
      <div className="user-info">
        <p><strong>User Information</strong></p>
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Roll Number:</strong> {user?.rollNumber || 'N/A'}</p>
        <p><strong>Department:</strong> {user?.department || 'N/A'}</p>
      </div>
    </div>
  );
};

export default UserProfile;