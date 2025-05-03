import cron from 'node-cron';
import BorrowedBook from '../models/BorrowedBook.js';
import Notification from '../models/Notification.js';
import moment from 'moment';

async function updateDueSoonNotifications() {
  try {
    const borrowedBooks = await BorrowedBook.find({ returnedDate: null }).populate('bookId borrower');

    for (const borrow of borrowedBooks) {
      // Add checks to ensure borrower and bookId exist
      if (!borrow.borrower || !borrow.bookId) {
        console.warn(`Borrowed book with ID ${borrow._id} is missing borrower or book information. Skipping notification update.`);
        continue;
      }

      const dueDate = moment(borrow.dueDate);
      const now = moment();
      const daysRemaining = dueDate.diff(now, 'days');

      let notificationMessage = '';
      if (daysRemaining > 1) {
        notificationMessage = `Book "${borrow.bookId.name}" is due in ${daysRemaining} days!`;
      } else if (daysRemaining === 1) {
        notificationMessage = `Book "${borrow.bookId.name}" is due in 1 day!`;
      } else if (daysRemaining === 0) {
        notificationMessage = `Book "${borrow.bookId.name}" is due today!`;
      } else if (daysRemaining < 0) {
        notificationMessage = `Book "${borrow.bookId.name}" is overdue by ${Math.abs(daysRemaining)} days!`;
      }

      if (notificationMessage) {
        await Notification.findOneAndUpdate(
          { userId: borrow.borrower._id, 'message': { $regex: new RegExp(`Book "${borrow.bookId.name}" is due`, 'i') }, type: 'due_soon' },
          { message: notificationMessage, createdAt: Date.now() },
          { upsert: true }
        );
        console.log('Updated/created notification:', notificationMessage, borrow.borrower.username);
      } else {
        await Notification.deleteMany({ userId: borrow.borrower._id, 'message': { $regex: new RegExp(`Book "${borrow.bookId.name}" is due`, 'i') }, type: 'due_soon' });
      }
    }
    console.log('Due soon notifications updated successfully.');
  } catch (error) {
    console.error('Error updating due soon notifications:', error);
  }
}

// Schedule to run daily at midnight (adjust time as needed)
cron.schedule('0 0 * * *', updateDueSoonNotifications);

// Run it once on server start (optional)
updateDueSoonNotifications();

export default updateDueSoonNotifications;