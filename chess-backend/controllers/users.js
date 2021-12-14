import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const secret = 'secretchess';

export const signIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.hashedPassword);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, secret, { expiresIn: "1d" });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
        console.log(error);
    }
}

export const signUp = async (req, res) => {
    const { username, confirmPassword, password } = req.body;

    try {
        if (username == '-----' || username == 'Chess AI') {
            return res.status(400).json({message: "Invalid Username"});
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            if (!isAuth) {
                return res.status(400).json({ message: "User already exists" });
            } else {
                return res.status(200).json({ message: "User exists. Proceeding to Login." });
            }
        }

        if (password != confirmPassword) return res.status(400).json({ message: "Password don't match." })

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({ username, hashedPassword });

        res.status(200).json({ result: newUser.username });
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
        console.log(error);
    }
}

export const fetchUser = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username: username });
        const master = { id: user._id };

        res.status(200).json(master);
    } catch (error) {
        res.status(404).json({ message: 'something went wrong' });
        console.log(error);
    }
}