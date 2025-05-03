import BorrowedBook from '../models/BorrowedBook.js';
import moment from 'moment';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

async function calculateAndUpdateFines() {
  try {
    const now = moment();
    const borrowedBooks = await BorrowedBook.find({ returnedDate: null }).populate('bookId', 'name').populate('borrower');

    for (const borrowedBook of borrowedBooks) {
      const dueDate = moment(borrowedBook.dueDate);

      if (now.isAfter(dueDate)) {
        const overdueDays = now.diff(dueDate, 'days');
        const fineAmount = overdueDays * 100;

        borrowedBook.fineAmount = fineAmount;
        await borrowedBook.save();
        console.log(`Fine updated for book ID ${borrowedBook.bookId?.name} (${borrowedBook._id}): ${fineAmount} for ${overdueDays} days.`); // Added optional chaining
      }

      // Notification one day before due date
      if (borrowedBook.borrower && borrowedBook.bookId) { // Added check for borrowedBook.bookId
        if (now.isSame(moment(borrowedBook.dueDate).subtract(1, 'day'), 'day')) {
          const userId = borrowedBook.borrower._id;
          const bookTitle = borrowedBook.bookId.name;
          const message = `Book "${bookTitle}" is due tomorrow!`;
          const existingNotification = await Notification.findOne({ userId, message });
          if (!existingNotification) {
            const newNotification = new Notification({ userId, message });
            await newNotification.save();
            console.log(`Notification created: ${message} for user ${userId}`);
          }
        }
      } else if (!borrowedBook.borrower) {
        console.warn(
          `Borrowed book with ID ${borrowedBook._id} (Borrower Name: ${borrowedBook.borrowerName || 'N/A'}) has no borrower information.`
        );
      } else if (!borrowedBook.bookId) {
        console.warn(`Borrowed book with ID ${borrowedBook._id} has no book information.`);
      }

      // Notification on the due date
      if (borrowedBook.borrower && borrowedBook.bookId) { // Added check for borrowedBook.bookId
        if (now.isSame(dueDate, 'day')) {
          const userId = borrowedBook.borrower._id;
          const bookTitle = borrowedBook.bookId.name;
          const message = `Book "${bookTitle}" is due today!`;
          const existingNotification = await Notification.findOne({ userId, message });
          if (!existingNotification) {
            const newNotification = new Notification({ userId, message });
            await newNotification.save();
            console.log(`Notification created: ${message} for user ${userId}`);
          }
        }
      } else if (!borrowedBook.borrower) {
        console.warn(
          `Borrowed book with ID ${borrowedBook._id} (Borrower Name: ${borrowedBook.borrowerName || 'N/A'}) has no borrower information.`
        );
      } else if (!borrowedBook.bookId) {
        console.warn(`Borrowed book with ID ${borrowedBook._id} has no book information.`);
      }
    }
    console.log('Fine calculation and notification check completed.');
  } catch (error) {
    console.error('Error calculating and updating fines/notifications:', error);
  }
}

export default calculateAndUpdateFines;