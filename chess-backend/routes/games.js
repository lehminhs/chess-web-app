import express from 'express';

import { createGame, updateGame, fetchGames, fetchGame } from '../controllers/games.js';
import auth from './../middleware/auth.js';

const router = express.Router();

router.post('/createGame', auth, createGame);
router.patch('/updateGame/:id', auth, updateGame);
router.get('/fetchGame/:id', auth, fetchGame);
router.get('/fetchGames', auth, fetchGames);


export default router;