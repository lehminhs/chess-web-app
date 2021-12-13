import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import Cors from "cors";
import  dotenv  from "dotenv";

import userRoutes from './routes/users.js';
import gameRoutes from './routes/games.js';

//App Config
const app = express();

//Middlewares
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(Cors());
dotenv.config()

const PORT = process.env.PORT|| 8001;

app.use('/user', userRoutes);
app.use('/game', gameRoutes);

app.get('/', (req, res) => {
    res.send('Hello! Welcome to Chess.');
})

//DB config
mongoose.connect(process.env.CONNECT_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

//Listener
app.listen(PORT, () => console.log(`listening on localhost: ${PORT}`));