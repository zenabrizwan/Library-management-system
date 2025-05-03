import mongoose from 'mongoose';
const { Schema } = mongoose;

const borrowedBookSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  borrower: { type: Schema.Types.ObjectId, ref: 'User' },
  borrowerUsername: { type: String, required: true },
  borrowerName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  department: { type: String, required: true },
  borrowedDate: { type: Date, default: Date.now },
  dueDate: { type: Date }, // Added due date field
  returnedDate: { type: Date },
  fineAmount: { type: Number, default: 0 }, // Added fine amount field
}, { timestamps: true });

const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema);
export default BorrowedBook;