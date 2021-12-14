import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true }
});

export default mongoose.model('User', userSchema);