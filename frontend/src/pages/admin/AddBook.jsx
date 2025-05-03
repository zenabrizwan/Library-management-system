import React, { useState } from 'react';
import BookList from '../../components/admin/BookList';
import Modal from '../../components/common/Modal';
import AddBookForm from '../../components/admin/AddBookForm';

const AdminDashboard = () => {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const handleOpenAddBookModal = () => {
    setIsAddBookModalOpen(true);
  };

  const handleCloseAddBookModal = () => {
    setIsAddBookModalOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={handleOpenAddBookModal}>Add New Book</button>
      <BookList />

      <Modal isOpen={isAddBookModalOpen} onClose={handleCloseAddBookModal}>
        <AddBookForm onClose={handleCloseAddBookModal} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;