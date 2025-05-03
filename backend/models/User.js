// backend/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // WARNING: In a real app, hash passwords!
    role: { type: String, enum: ['admin', 'user'], required: true },
    name: { type: String },
    roll_number: { type: String },
    discipline: { type: String },
});

const User = mongoose.model('User', UserSchema);
export default User;