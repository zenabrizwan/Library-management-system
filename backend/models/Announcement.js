// backend/models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;