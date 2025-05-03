import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const AnnouncementForm = () => {
  const [message, setMessage] = useState('');
  const [postSuccess, setPostSuccess] = useState('');
  const [postError, setPostError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPostSuccess('');
    setPostError('');

    try {
      const response = await axios.post('http://localhost:5001/api/admin/announcements', { content: message });
      if (response.status === 201) {
        setPostSuccess('Announcement posted successfully!');
        setMessage(''); // Clear the form after successful submission
        // Optionally, you could dispatch an action here to update the Redux store
        // with the newly posted announcement if needed for immediate display elsewhere.
      } else {
        setPostError('Failed to post announcement.');
        console.error('Failed to post announcement:', response.data);
      }
    } catch (error) {
      setPostError('Failed to post announcement.');
      console.error('Error posting announcement:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="announcement">New Announcement:</label>
        <textarea
          id="announcement"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="3"
          required
        />
      </div>
      <button type="submit">Post Announcement</button>
      {postSuccess && <p style={{ color: 'green' }}>{postSuccess}</p>}
      {postError && <p style={{ color: 'red' }}>{postError}</p>}
    </form>
  );
};

export default AnnouncementForm;