import Game from '../models/game.js';
import mongoose from 'mongoose';

const secret = 'secretchess';

export const createGame = async (req, res) => {
    const { whitePlayer, blackPlayer, gameType } = req.body;

    try {
        const existingGame = await Game.findOne({ whitePlayer, blackPlayer, gameType, completed: 0 });
        if (existingGame) {
            return res.status(400).json({ message: "Open game already exists" });
        }

        const board = [
            [{ icon: 'black-rook', type: 'rook', color: -1 }, { icon: 'black-knight', type: 'knight', color: -1 }, { icon: 'black-bishop', type: 'bishop', color: -1 }, { icon: 'black-queen', type: 'queen', color: -1 }, { icon: 'black-king', type: 'king', color: -1 }, { icon: 'black-bishop', type: 'bishop', color: -1 }, { icon: 'black-knight', type: 'knight', color: -1 }, { icon: 'black-rook', type: 'rook', color: -1 }],
            [{ icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }, { icon: 'black-pawn', type: 'pawn', color: -1 }],
            [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
            [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
            [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
            [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
            [{ icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }, { icon: 'white-pawn', type: 'pawn', color: 1 }],
            [{ icon: 'white-rook', type: 'rook', color: 1 }, { icon: 'white-knight', type: 'knight', color: 1 }, { icon: 'white-bishop', type: 'bishop', color: 1 }, { icon: 'white-queen', type: 'queen', color: 1 }, { icon: 'white-king', type: 'king', color: 1 }, { icon: 'white-bishop', type: 'bishop', color: 1 }, { icon: 'white-knight', type: 'knight', color: 1 }, { icon: 'white-rook', type: 'rook', color: 1 }]
        ]

        const currentTurn = 1;

        const whiteKing = [7, 4];
        const blackKing = [0, 4];

        const canCastleRightWhite = true;
        const canCastleLeftWhite = true;
        const canCastleRightBlack = true;
        const canCastleLeftBlack = true;

        const firstMove = 0;

        while (true) {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var gameId = '';
            for (var i = 0; i < 7; i++) {
                gameId += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            var dupId = await Game.findOne({ gameId });
            if (!dupId) {
                break;
            }
        }

        const completed = 0;

        const newGame = await Game.create({ board, gameId, currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, gameType, firstMove, completed });

        res.status(201).json({ result: newGame, message: "Created Game Successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Unable to create game.' });
        console.log(error);
    }
}

export const updateGame = async (req, res) => {
    const { id } = req.params;
    const { board, gameId, currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, gameType, firstMove, completed, _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No game with id: ${id}`);

    if (whitePlayer == '' || blackPlayer == '') {
        res.status(406).json({ message: 'Invalid player names. Try again.' })
    }

    const updatedGame = { board, gameId, currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, gameType, firstMove, completed, _id: _id };

    await Game.findByIdAndUpdate(_id, updatedGame, { new: true });

    res.status(200).json(updatedGame);
}

export const fetchGame = async (req, res) => {
    const { id } = req.params;

    try {
        const existingGame = await Game.findOne({ gameId: id });
        if (!existingGame) {
            return res.status(404).json({ message: 'No game found with game id: ' + id });
        }

        return res.status(200).json(existingGame);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch game information.' });
        console.log(error);
    }
}

export const fetchGames = async (req, res) => {
    const { username } = req.query;
    try {
        const whiteGames = await Game.find({ whitePlayer: username, completed: 0 });
        const blackGames = await Game.find({ blackPlayer: username, completed: 0 });

        res.status(200).json({ whiteGames: whiteGames, blackGames: blackGames });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
