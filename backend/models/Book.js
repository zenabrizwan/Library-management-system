// backend/models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    coverImageUrl: { type: String },
    genre: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    borrowedCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'Not Available'],
        default: 'Available',
    },
});

const Book = mongoose.model('Book', BookSchema);
export default Book;