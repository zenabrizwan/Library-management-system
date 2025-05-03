import React from 'react';

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <h3>User Information</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Roll Number:</strong> {user.rollNumber}</p>
      <p><strong>Department:</strong> {user.department}</p>
      {/* You can add more user details here */}
    </div>
  );
};

export default ProfileCard;