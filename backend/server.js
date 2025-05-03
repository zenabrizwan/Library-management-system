import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import Announcement from './models/Announcement.js'; // Import the Announcement model
import calculateAndUpdateFines from './utils/fineCalculator.js';
import Notification from './models/Notification.js';
import updateDueSoonNotifications from './utils/scheduleNotifications.js';
import './utils/scheduleNotifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const SALT_ROUNDS = 10;

// Apply very permissive CORS to all routes (TEMPORARY FOR TESTING)
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

import User from './models/User.js';
import Book from './models/Book.js';
import BorrowedBook from './models/BorrowedBook.js';

// --- Multer Configuration for Image Upload ---
const storage = multer.diskStorage({
  destination: join(__dirname, 'public', 'images'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// --- Serve Static Files ---
app.use('/images', express.static(join(__dirname, 'public', 'images')));

// --- Authentication Routes ---
app.post('/api/auth/signup/:role', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
      username,
      password: hashedPassword,
      email: email || null,
      role: req.params.role,
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: { _id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

app.post('/api/auth/login/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password.' });
    }
    const user = await User.findOne({ username: username, role: 'admin' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.status(200).json({ message: 'Admin login successful', user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials.' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed.' });
  }
});

app.post('/api/auth/login/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password.' });
    }
    const user = await User.findOne({ username: username, role: 'user' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid user credentials.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.status(200).json({ message: 'User login successful', user: { _id: user._id, username: user.username, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid user credentials.' });
    }
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'User login failed.' });
  }
});

app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'CORS test successful!' });
});

// --- Announcement APIs ---
app.post('/api/admin/announcements', /* isAdminMiddleware, */ async (req, res) => {
  try {
    const { content } = req.body;
    const newAnnouncement = new Announcement({ content });
    await newAnnouncement.save();
    res.status(201).json({ message: 'Announcement posted successfully', announcement: newAnnouncement });
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ message: 'Failed to post announcement' });
  }
});

app.get('/api/announcements/latest', async (req, res) => {
  try {
    const latestAnnouncement = await Announcement.findOne().sort({ createdAt: 'desc' }).limit(1);
    res.status(200).json({ announcement: latestAnnouncement ? latestAnnouncement.content : null });
  } catch (error) {
    console.error('Error fetching latest announcement:', error);
    res.status(500).json({ message: 'Failed to fetch announcement' });
  }
});

// --- Book Management APIs (Admin) ---

// Add a new book (with image upload)
app.post('/api/admin/books', upload.single('coverImage'), async (req, res) => {
  try {
    console.log('Add book route hit!', req.body, req.file);
    const { name, author, isbn, genre, quantity } = req.body;
    if (!name || !author || !isbn || !quantity) {
      return res.status(400).json({ error: 'Please provide name, author, ISBN, and quantity.' });
    }
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(409).json({ error: 'Book with this ISBN already exists.' });
    }

    const coverImageUrl = req.file ? req.file.filename : null; // Store filename

    const newBook = new Book({ name, author, isbn, coverImageUrl, genre, quantity: parseInt(quantity) });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book.' });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error getting all books:', error);
    res.status(500).json({ error: 'Failed to retrieve books.' });
  }
});

// Search books
app.get('/api/books/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const results = await Book.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { isbn: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } },
        ],
      });
      res.status(200).json(results);
    } else {
      const books = await Book.find();
      res.status(200).json(books);
    }
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books.' });
  }
});

// Delete a book by ID
app.delete('/api/admin/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book.' });
  }
});

// Edit a book by ID (handling image update)
app.put('/api/admin/books/:bookId', upload.single('coverImage'), async (req, res) => {
  try {
    const { bookId } = req.params;
    const { name, author, isbn, genre, existingCoverImage, quantity } = req.body;
    const newCoverImage = req.file;

    if (!name || !author || !isbn || quantity === undefined) {
      return res.status(400).json({ error: 'Please provide name, author, ISBN, and quantity.' });
    }

    const existingBookWithISBN = await Book.findOne({ isbn, _id: { $ne: bookId } });
    if (existingBookWithISBN) {
      return res.status(409).json({ error: 'Book with this ISBN already exists.' });
    }

    const updateData = { name, author, isbn, genre, quantity: parseInt(quantity) };

    if (newCoverImage) {
      updateData.coverImageUrl = newCoverImage.filename;
      if (existingCoverImage && existingCoverImage !== newCoverImage.filename) {
        const oldImagePath = join(__dirname, 'public', 'images', existingCoverImage);
        try {
          await fs.unlink(oldImagePath);
          console.log(`Deleted old image: ${existingCoverImage}`);
        } catch (error) {
          console.error(`Error deleting old image ${existingCoverImage}:`, error);
        }
      }
    } else {
      updateData.coverImageUrl = existingCoverImage;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book.' });
  }
});

// Get borrowing history for a specific book
app.get('/api/admin/books/:bookId/history', async (req, res) => {
  try {
    const { bookId } = req.params;
    const history = await BorrowedBook.find({ bookId: bookId })
      .populate('bookId', 'name author isbn');
    console.log('Borrowing History:', history);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching borrowing history:', error);
    res.status(500).json({ error: 'Failed to retrieve borrowing history.' });
  }
});

// --- User Borrowed Books API (using username) ---
app.get('/api/user/borrowed', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const borrowedBooks = await BorrowedBook.find({
      borrowerUsername: username,
      returnedDate: { $eq: null }, // Only fetch books where returnedDate is null
    })
      .populate('bookId', 'name title _id')
      .select('_id bookId title borrowedDate rollNumber department dueDate') // Include dueDate
      .lean();

    console.log('Fetched currently borrowed books for user:', username, borrowedBooks);

    res.status(200).json(borrowedBooks);
  } catch (error) {
    console.error('Error fetching user\'s borrowed books:', error);
    res.status(500).json({ error: 'Failed to retrieve borrowed books.' });
  }
});

// --- Borrow Book API (User - using username and associating with User ID) ---
// --- Borrow Book API (User - using username and associating with User ID) ---
app.post('/api/user/borrow/:bookId', async (req, res) => {
  try {
    console.log('req.body received:', req.body);
    const { bookId } = req.params;
    const { borrowerName, rollNumber, department, username } = req.body; // Expect username

    if (!username) {
      return res.status(400).json({ error: 'Username is required to borrow a book.' });
    }

    if (!borrowerName || borrowerName.trim() === "" || !rollNumber || rollNumber.trim() === "" || !department || department.trim() === "") {
      return res.status(400).json({ error: 'Please provide your name, roll number, and department.' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const user = await User.findOne({ username: username, role: 'user' });
    if (!user) {
      return res.status(404).json({ error: 'User not found with the provided username.' });
    }

    if (book.quantity > book.borrowedCount) {
      const borrowedDate = new Date(); // Get the current date
      const dueDate = new Date();
      dueDate.setDate(borrowedDate.getDate() + 7); // Explicitly set the date

      const newBorrow = new BorrowedBook({
        bookId,
        borrower: user._id,
        borrowerName,
        rollNumber,
        department,
        borrowerUsername: username,
        borrowedDate: borrowedDate,
        dueDate: dueDate, // Ensure dueDate is being saved
      });
      const savedBorrow = await newBorrow.save(); // Save and get the saved record
      console.log('Saved Borrow Record:', savedBorrow); // Log the saved record

      book.borrowedCount++;
      book.status = 'Not Available';
      await book.save();

      // Create initial "due in 7 days" notification
      const newNotification = new Notification({
        userId: user._id,
        message: `Book "${book.name}" is due in 7 days!`,
        type: 'due_soon',
      });
      await newNotification.save();
      console.log('Notification created:', newNotification.message);

      res.status(201).json({ message: 'Book borrowed successfully.', borrow: savedBorrow });
    } else {
      return res.status(400).json({ error: 'This book is currently unavailable.' });
    }
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ error: 'Failed to borrow book.' });
  }
});

// --- Return Book API (User) ---
// --- Return Book API (User) ---
app.put('/api/user/return/:borrowedBookId', async (req, res) => {
  try {
    const { borrowedBookId } = req.params;
    const borrowedBook = await BorrowedBook.findById(borrowedBookId).populate('bookId borrower');

    if (!borrowedBook) {
      return res.status(404).json({ error: 'Borrow record not found.' });
    }

    if (borrowedBook.returnedDate) {
      return res.status(400).json({ error: 'This book has already been returned.' });
    }

    borrowedBook.returnedDate = new Date();
    await borrowedBook.save();

    // Delete any "due soon" notifications for this book and user
    const deletedNotifications = await Notification.deleteMany({
      userId: borrowedBook.borrower._id,
      message: { $regex: new RegExp(`Book "${borrowedBook.bookId?.name}" is due`, 'i') },
      type: 'due_soon',
    });
    console.log(`Deleted ${deletedNotifications.deletedCount} due soon notifications for returned book: ${borrowedBook.bookId?.name}`);

    const book = await Book.findById(borrowedBook.bookId);
    if (book && book.borrowedCount > 0) {
      book.borrowedCount--;
      if (book.borrowedCount < book.quantity) {
        book.status = 'Available';
      }
      await book.save();
    }

    res.status(200).json({ message: 'Book returned successfully.' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Failed to return book.' });
  }
});

import axios from 'axios';

// --- Trending Books API (Open Library) ---
app.get('/api/trending-books', async (req, res) => {
  try {
    const response = await axios.get('https://openlibrary.org/trending/weekly.json');
    const trendingWorks = response.data.works.slice(0, 10);

    const enrichedBooks = await Promise.all(
      trendingWorks.map(async (work) => {
        try {
          const detailsResponse = await axios.get(`https://openlibrary.org${work.key}.json`);
          const details = detailsResponse.data;

          const coverId = details.covers && details.covers[0];
          const coverUrl = coverId ? `http://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
          const genre = details.subjects && details.subjects[0];
          const editionCount = details.edition_count;
          const firstPublishDate = details.first_publish_date;
          let description = null;
          if (details.description) {
            description = typeof details.description === 'string' ? details.description : details.description.value;
          }

          return {
            key: work.key,
            title: work.title || 'Unknown Title',
            author: work.author_name ? work.author_name.join(', ') : 'Unknown Author',
            coverUrl: coverUrl,
            genre: genre,
            editionCount: editionCount,
            firstPublishDate: firstPublishDate,
            description: description,
          };
        } catch (error) {
          console.error(`Error fetching details for ${work.key}:`, error);
          return { // Return basic info even if details fetch fails
            key: work.key,
            title: work.title || 'Unknown Title',
            author: work.author_name ? work.author_name.join(', ') : 'Unknown Author',
            coverUrl: null,
            genre: null,
            editionCount: null,
            firstPublishDate: null,
            description: null,
          };
        }
      })
    );

    console.log('Enriched Trending Books:', enrichedBooks); // Keep this for debugging
    res.status(200).json(enrichedBooks);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    res.status(500).json({ error: 'Failed to retrieve trending books.' });
  }
});

// --- User Notifications API ---
app.get('/api/user/notifications', async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: 'desc' });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// --- Schedule Fine Calculation ---
setInterval(calculateAndUpdateFines, 24 * 60 * 60 * 1000);
calculateAndUpdateFines()

// --- User Return History API ---
app.get('/api/user/returned', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }
  try {
    const returnHistory = await BorrowedBook.find({ borrowerUsername: username, returnedDate: { $ne: null } })
      .populate('bookId', 'name title _id') // Populate book details if needed
      .sort({ returnedDate: 'desc' });
    res.status(200).json(returnHistory);
  } catch (error) {
    console.error('Error fetching return history:', error);
    res.status(500).json({ error: 'Failed to fetch return history.' });
  }
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});