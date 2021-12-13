import express from 'express';

import { signIn, signUp, fetchUser } from '../controllers/users.js';
import auth from './../middleware/auth.js';

const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/fetchUser', auth, fetchUser);

export default router;