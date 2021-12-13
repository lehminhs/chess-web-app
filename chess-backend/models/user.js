import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    computerWins: { type: Number, required: true },
    computerLosses: { type: Number, required: true },
    playerWins: { type: Number, required: true },
    playerLosses: { type: Number, required: true}
});

export default mongoose.model('User', userSchema);