import mongoose from 'mongoose';

const gameSchema = mongoose.Schema({
    board: { type: JSON, required: true },
    gameId: { type: String, required: true },
    currentTurn: { type: Number, required: true },
    whitePlayer: { type: String, required: true },
    blackPlayer: { type: String, required: true },
    whiteKing: { type: Array, required: true },
    blackKing: { type: Array, required: true },
    canCastleRightWhite: { type: Boolean, required: true },
    canCastleLeftWhite: { type: Boolean, required: true },
    canCastleRightBlack: { type: Boolean, required: true },
    canCastleLeftBlack: { type: Boolean, required: true },
    gameType: { type: Number, required: true },
    firstMove: { type: Number, required: true },
    completed: { type: Number, required: true }
});

export default mongoose.model('Game', gameSchema);