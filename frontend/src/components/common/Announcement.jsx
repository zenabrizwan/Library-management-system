import React from 'react';

const Announcement = ({ message }) => {
  return (
    <div className="announcement">
      <strong>Announcement:</strong> {message}
    </div>
  );
};

export default Announcement;