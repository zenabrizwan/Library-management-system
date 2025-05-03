import React, { useEffect } from 'react';
import Announcement from '../../components/common/Announcement';
import BooksList from '../../components/user/BooksList';
import { useSelector, useDispatch } from 'react-redux';
import { selectAnnouncement, fetchAnnouncement } from '../../features/admin/announcementSlice'; // Import the thunk

const UserDashboard = () => {
  const announcement = useSelector(selectAnnouncement);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAnnouncement()); // Fetch the latest announcement on component mount
  }, [dispatch]);

  return (
    <div className="user-dashboard">
      {announcement && <Announcement message={announcement} />}
      <BooksList /> {/* BooksList now handles its own search and heading */}
    </div>
  );
};

export default UserDashboard;